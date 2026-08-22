require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { extractTextFromPDF } = require('./services/pdfService');
const { analyzeResume } = require('./services/aiService');

const app = express();
const port = process.env.PORT || 3001;

// Use memory storage for multer to avoid writing files to disk
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed.'));
    }
  }
});

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Main analysis endpoint
app.post('/api/analyze', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No resume PDF provided.' });
    }

    let jobDescription = req.body.jobDescription || '';
    if (typeof jobDescription === 'string') {
      jobDescription = jobDescription.trim();
    }
    
    // 1. Extract text from the PDF buffer in memory
    const resumeText = await extractTextFromPDF(req.file.buffer);

    // 2. Analyze the resume using AI Service
    const analysis = await analyzeResume(resumeText, jobDescription);

    // 3. Return the JSON response
    res.json(analysis);
  } catch (error) {
    console.error('Error during analysis:', error.message);
    if (error.name === 'NoTextError') {
      return res.status(422).json({ error: error.message });
    } else if (error.name === 'CorruptedPDFError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'An unexpected error occurred during processing.' });
  }
});

// Error handling middleware for multer
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: `Upload error: ${err.message}` });
  } else if (err) {
    return res.status(400).json({ error: err.message });
  }
  next();
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
