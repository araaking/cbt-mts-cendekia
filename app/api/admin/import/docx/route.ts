import { NextResponse } from "next/server";
import mammoth from "mammoth";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Convert DOCX to HTML with embedded images
    const result = await mammoth.convertToHtml(
      { buffer },
      {
        convertImage: mammoth.images.imgElement((image) => {
          return image.read("base64").then((imageBuffer) => {
            return {
              src: "data:" + image.contentType + ";base64," + imageBuffer,
            };
          });
        }),
      }
    );

    const html = result.value;
    const messages = result.messages; // Any warnings

    return NextResponse.json({ html, messages });
  } catch (error) {
    console.error("DOCX Import Error:", error);
    return NextResponse.json(
      { error: "Failed to process file" },
      { status: 500 }
    );
  }
}
