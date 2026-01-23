import mammoth from "mammoth";
import AdmZip from "adm-zip";

const filePath = "/Users/alfian/Code/cbt-mts-cendekia/docs/SOAL-TES-PPDB.docx";

async function analyze() {
  console.log("Analyzing DOCX...");

  // 1. Extract Text using Mammoth
  const result = await mammoth.extractRawText({ path: filePath });
  const text = result.value;
  
  console.log("--- RAW TEXT START ---");
  console.log(text.slice(0, 2000)); // Print first 2000 chars
  console.log("--- RAW TEXT END ---");

  // 2. Check for Images
  const zip = new AdmZip(filePath);
  const zipEntries = zip.getEntries();
  
  const images = zipEntries.filter(entry => entry.entryName.startsWith("word/media/"));
  console.log(`Found ${images.length} images:`);
  images.forEach(img => console.log("- " + img.entryName));
}

analyze().catch(console.error);
