const pdf = require('pdf-parse');

/**
 * Extracts raw text from a PDF buffer in memory.
 * @param {Buffer} dataBuffer - The uploaded PDF file buffer.
 * @returns {Promise<string>} The extracted text.
 */
async function extractTextFromPDF(dataBuffer) {
  let data;
  try {
    data = await pdf(dataBuffer);
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    const err = new Error("This file couldn't be read.");
    err.name = 'CorruptedPDFError';
    throw err;
  }

  const text = data.text ? data.text.trim() : '';
  if (!text) {
    const err = new Error("This PDF appears to be a scanned image with no readable text. Please upload a text-based PDF.");
    err.name = 'NoTextError';
    throw err;
  }

  return text;
}

module.exports = { extractTextFromPDF };
