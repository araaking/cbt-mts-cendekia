import { NextResponse } from "next/server";
import { prisma } from "@/shared/lib/prisma";
import { auth } from "@/shared/lib/auth";
import { headers } from "next/headers";
import { uploadToR2 } from "@/shared/lib/storage";

type BulkQuestion = {
  question: string;
  options: string[];
  correctAnswer?: string | null;
};

// Helper to extract Base64 images from HTML, upload to R2, and replace with URL
async function processHtmlImages(html: string): Promise<string> {
  const imgRegex = /<img[^>]+src="data:image\/([^;]+);base64,([^"]+)"[^>]*>/g;
  let match;
  let newHtml = html;
  
  // Find all base64 images
  // Note: matchAll or loop is needed. String.replace with async callback is tricky.
  // We'll collect all matches first.
  const matches = [];
  while ((match = imgRegex.exec(html)) !== null) {
    matches.push({
      fullMatch: match[0],
      ext: match[1],
      data: match[2],
    });
  }

  // Process uploads concurrently
  const uploadPromises = matches.map(async (m, idx) => {
    try {
      const buffer = Buffer.from(m.data, "base64");
      const filename = `q-img-${Date.now()}-${idx}.${m.ext}`;
      const url = await uploadToR2(buffer, filename, `image/${m.ext}`);
      return { ...m, url };
    } catch (e) {
      console.error("Failed to upload image:", e);
      return null;
    }
  });

  const uploaded = await Promise.all(uploadPromises);

  // Replace in HTML
  for (const item of uploaded) {
    if (item && item.url) {
       // Replace exact base64 src with URL
       // Construct simple img tag or just replace src content?
       // The regex matched the whole tag, but replacing whole tag might lose other attributes (style, width).
       // Let's replace the src attribute content only.
       
       // Safer approach: replace the specific base64 string
       // "data:image/png;base64,..." -> "https://..."
       const base64Src = `data:image/${item.ext};base64,${item.data}`;
       newHtml = newHtml.replace(base64Src, item.url);
    }
  }

  return newHtml;
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ testId: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { testId } = await params;
    const body = (await req.json()) as { questions?: BulkQuestion[] };
    const { questions } = body;

    if (!Array.isArray(questions)) {
      return NextResponse.json(
        { error: "Invalid data format" },
        { status: 400 }
      );
    }

    // Get current max order
    const maxOrder = await prisma.question.aggregate({
      where: { testId },
      _max: { order: true },
    });
    
    const startOrder = (maxOrder._max.order || 0) + 1;

    // Process questions concurrently to upload images
    const processedQuestions = await Promise.all(questions.map(async (q, idx: number) => {
        // Process Question HTML
        const cleanQuestion = await processHtmlImages(q.question);
        
        // Process Options HTML (if they contain images too)
        const cleanOptions = await Promise.all(q.options.map(async (opt: string) => {
             return await processHtmlImages(opt);
        }));

        return {
            testId,
            question: cleanQuestion,
            options: cleanOptions,
            correctAnswer: q.correctAnswer || "A",
            order: startOrder + idx,
        };
    }));

    // Interactive transaction for bulk create with extended timeout
    await prisma.$transaction(
      async (tx) => {
        for (const q of processedQuestions) {
          await tx.question.create({ data: q });
        }
      },
      { timeout: 60000 }
    );

    return NextResponse.json({ success: true, count: questions.length });
  } catch (error) {
    console.error("Bulk Create Error:", error);
    return NextResponse.json(
      { error: "Failed to save questions" },
      { status: 500 }
    );
  }
}
