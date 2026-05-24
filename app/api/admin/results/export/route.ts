import { resultService } from "@/features/result/services/result.service";
import ExcelJS from "exceljs";

export async function GET() {
  try {
    const results = await resultService.getAllResults();

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Hasil Tes");

    worksheet.columns = [
      { header: "#", key: "no", width: 5 },
      { header: "Nama", key: "nama", width: 28 },
      { header: "NISN", key: "nisn", width: 16 },
      { header: "Skor", key: "skor", width: 8 },
      { header: "Benar", key: "benar", width: 10 },
      { header: "Waktu", key: "waktu", width: 12 },
      { header: "Tanggal", key: "tanggal", width: 22 },
    ];

    results.forEach((r: any, i: number) => {
      const minutes = Math.floor(r.timeSpent / 60);
      const seconds = r.timeSpent % 60;

      worksheet.addRow({
        no: i + 1,
        nama: r.studentName,
        nisn: r.studentNISN || "-",
        skor: r.score,
        benar: `${r.correctAnswers}/${r.totalQuestions}`,
        waktu: `${minutes}m ${seconds}s`,
        tanggal: new Date(r.startedAt).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      });
    });

    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true };
    headerRow.alignment = { horizontal: "center" };

    const buffer = (await workbook.xlsx.writeBuffer()) as Buffer;

    return new Response(buffer, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="hasil-tes.xlsx"`,
      },
    });
  } catch {
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
