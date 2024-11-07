const fs = require('fs');
const pdfParse = require('pdf-parse');

async function pdfToJson(pdfPath, outputPath) {
  try {
    const dataBuffer = fs.readFileSync(pdfPath);
    const pdfData = await pdfParse(dataBuffer);
    const content = pdfData.text;
    const lines = content.split('\n');
    
    let jsonData = {
      headings: [],
      paragraphs: [],
      bulletPoints: [],
    };

    lines.forEach(line => {
      line = line.trim(); 
      if (line.length > 3 && line === line.toUpperCase()) {
        jsonData.headings.push(line);
      } 
      else if (line.startsWith('- ') || line.startsWith('* ') || line.startsWith('+ ')) {
        jsonData.bulletPoints.push(line.replace(/^- |^\* |^\+ /, '').trim());
      } 
      else if (line.length > 0) {
        jsonData.paragraphs.push(line);
      }
    });

    fs.writeFileSync(outputPath, JSON.stringify(jsonData, null, 2));
    console.log(`JSON output: ${outputPath}`);
  } catch (error) {
    console.error('Error:', error);
  }
}
pdfToJson('D:/MERN/pdf-to-json/chapter_14.pdf', 'output.json');
