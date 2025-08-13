const express = require('express');
const multer = require('multer');
const { uploadCv, processCv, exportCv } = require('../controllers/cvController');

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

// Receive CV file upload and extract text
router.post('/upload', upload.single('file'), uploadCv);

// Process extracted text with AI to get formatted CV JSON
router.post('/process', processCv);

// Export CV as PDF/DOCX
router.get('/export/:id/:format', exportCv);
router.post('/export', exportCv);


module.exports = router;
