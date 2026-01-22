import { Document, Packer, Paragraph, TextRun, HeadingLevel } from "docx";
import { NextResponse } from "next/server";

export async function GET() {
    const doc = new Document({
        sections: [
            {
                properties: {},
                children: [
                    new Paragraph({
                        text: "FORMAT IMPORT SOAL CBT",
                        heading: HeadingLevel.HEADING_1,
                        spacing: { after: 200 },
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "Panduan Penggunaan:",
                                bold: true,
                            }),
                        ],
                        spacing: { after: 100 },
                    }),
                    new Paragraph({
                        text: "1. Gunakan format penomoran manual (ketik '1.', '2.', dst) untuk setiap soal.",
                        spacing: { after: 50 },
                    }),
                    new Paragraph({
                        text: "2. Gunakan format huruf manual (ketik 'A.', 'B.', dst) untuk setiap opsi jawaban.",
                        spacing: { after: 50 },
                    }),
                    new Paragraph({
                        text: "3. Jangan gunakan fitur 'Numbering' atau 'Bullets' otomatis dari Word, ketik manual saja agar terbaca sistem.",
                        spacing: { after: 200 },
                    }),
                    new Paragraph({
                        text: "--------------------------------------------------------------------------------",
                        spacing: { after: 200 },
                    }),
                    
                    // Soal 1
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "1. Siapakah presiden pertama Republik Indonesia?",
                                bold: true,
                            }),
                        ],
                        spacing: { after: 100 },
                    }),
                    new Paragraph({ text: "A. Soeharto" }),
                    new Paragraph({ text: "B. B.J. Habibie" }),
                    new Paragraph({ text: "C. Ir. Soekarno" }),
                    new Paragraph({ text: "D. Megawati Soekarnoputri" }),
                    new Paragraph({ text: "" }), // Spacer

                    // Soal 2
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "2. Hewan yang memakan daging disebut...",
                                bold: true,
                            }),
                        ],
                        spacing: { after: 100 },
                    }),
                    new Paragraph({ text: "A. Herbivora" }),
                    new Paragraph({ text: "B. Karnivora" }),
                    new Paragraph({ text: "C. Omnivora" }),
                    new Paragraph({ text: "D. Insectivora" }),
                    new Paragraph({ text: "" }), // Spacer

                    // Soal 3
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "3. Berapakah hasil dari 5 x 5 + 5?",
                                bold: true,
                            }),
                        ],
                        spacing: { after: 100 },
                    }),
                    new Paragraph({ text: "A. 25" }),
                    new Paragraph({ text: "B. 30" }),
                    new Paragraph({ text: "C. 35" }),
                    new Paragraph({ text: "D. 55" }),
                    new Paragraph({ text: "" }), // Spacer
                    
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "Catatan: Anda dapat menyisipkan gambar di antara teks soal jika diperlukan.",
                                italics: true,
                                color: "808080",
                            }),
                        ],
                        spacing: { before: 200 },
                    }),
                ],
            },
        ],
    });

    const buffer = await Packer.toBuffer(doc);

    return new NextResponse(buffer as unknown as BodyInit, {
        headers: {
            "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "Content-Disposition": 'attachment; filename="template-soal-cbt.docx"',
        },
    });
}
