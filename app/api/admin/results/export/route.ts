import { resultService } from "@/features/result/services/result.service";
import * as XLSX from "xlsx";

export async function GET() {
  try {
    const results = await resultService.getAllResults();

    const data = results.map((r: any, i: number) => {
      const minutes = Math.floor(r.timeSpent / 60);
      const seconds = r.timeSpent % 60;

      return {
        "#": i + 1,
        Nama: r.studentName,
        NISN: r.studentNISN || "-",
        Skor: r.score,
        Benar: `${r.correctAnswers}/${r.totalQuestions}`,
        Waktu: `${minutes}m ${seconds}s`,
        Tanggal: new Date(r.startedAt).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
    });

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Hasil Tes");

    const colWidths = Object.keys(data[0] || {}).map((key) => ({
      wch: Math.max(
        key.length,
        ...data.map((row: any) => String(row[key]).length)
      ),
    }));
    worksheet["!cols"] = colWidths;

    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

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
