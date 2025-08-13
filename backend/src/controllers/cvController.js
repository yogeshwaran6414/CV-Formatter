const parser = require('../services/parserService');
const ai = require('../services/aiService');
const formatter = require('../services/formatService');

const fs = require('fs');
const path = require('path');

const fontkit = require('@pdf-lib/fontkit'); 

const CvJob = require('../models/CvJob');

const { PDFDocument, StandardFonts } = require('pdf-lib');
const { Document, Packer, Paragraph, TextRun } = require('docx');
/**
 * Step 1 - Upload and Extract Text
 */
console.log(StandardFonts)

exports.uploadCv = async (req, res, next) => {
  try {
    const { buffer, mimetype } = req.file;
    // Parse raw text from PDF/DOCX/XLSX
    const rawText = await parser.parse(buffer, mimetype);
    // Return raw extracted text only
    res.json({ extractedText: rawText });
  } catch (err) {
    next(err);
  }
};

/**
 * Step 2 - Process Extracted Text with AI
 */
exports.processCv = async (req, res, next) => {
  try {
    const { extractedText } = req.body;
    if (!extractedText) {
      return res.status(400).json({ error: "Missing extractedText in request body" });
    }

    // AI parses structure
    const structured = await ai.parseStructure(extractedText);
    // AI enhances content
    const enhanced = await ai.enhanceContent(structured);
    // Apply formatting rules
    const formatted = await formatter.applyRules(enhanced);

    // Save job to DB for later export
    const job = await CvJob.create({ original: extractedText, structured, formatted });

    res.json({ id: job._id, formattedCV: formatted });
  } catch (err) {
    next(err);
  }
};

/**
 * Step 3 - Export CV as PDF or DOCX
 */


exports.exportCv = async (req, res, next) => {
  try {
    const { id, format } = req.params;
    const job = await CvJob.findById(id);
    if (!job) return res.status(404).send('Not found');

    const { formatted } = job;

    if (format === 'pdf') {
      const pdfDoc = await PDFDocument.create();

      // Safe font getter to avoid undefined issues
      const safeFont = async (name) => {
        if (Object.values(StandardFonts).includes(name)) {
          return await pdfDoc.embedFont(name);
        }
        return await pdfDoc.embedFont(StandardFonts.Helvetica);
      };

      const font = await safeFont(StandardFonts.TimesRoman);
      const fontBold = await safeFont(StandardFonts.TimesBold);

      let page = pdfDoc.addPage();
      const { width, height } = page.getSize();
      const marginX = 50;
      let y = height - 50;

      const addPageIfNeeded = () => {
        if (y < 50) {
          page = pdfDoc.addPage();
          y = height - 50;
        }
      };

      const drawHeading = (text) => {
        addPageIfNeeded();
        page.drawText(text, { x: marginX, y, size: 14, font: fontBold });
        y -= 18;
      };

      const drawLine = (text, size = 12, indent = 0, bold = false) => {
        const maxWidth = width - marginX * 2 - indent;
        const words = String(text).split(' ');
        let currentLine = '';

        words.forEach(word => {
          const testLine = currentLine ? `${currentLine} ${word}` : word;
          const textWidth = (bold ? fontBold : font).widthOfTextAtSize(testLine, size);

          if (textWidth > maxWidth) {
            addPageIfNeeded();
            page.drawText(currentLine, {
              x: marginX + indent,
              y,
              size,
              font: bold ? fontBold : font,
            });
            y -= size + 4;
            currentLine = word;
          } else {
            currentLine = testLine;
          }
        });

        if (currentLine) {
          addPageIfNeeded();
          page.drawText(currentLine, {
            x: marginX + indent,
            y,
            size,
            font: bold ? fontBold : font,
          });
          y -= size + 4;
        }
      };

      // HEADER
      drawLine(formatted.header?.name || '', 20, 0, true);
      if (formatted.header?.title) drawLine(formatted.header.title, 14);
      if (formatted.header?.email || formatted.header?.phone) {
        drawLine(`${formatted.header?.email || ''} | ${formatted.header?.phone || ''}`, 10);
      }
      y -= 10;

      // PROFILE
      if (formatted.profile) {
        drawHeading('Profile');
        String(formatted.profile).split('\n').forEach(line => drawLine(line));
        y -= 10;
      }

      // SKILLS
      if (formatted.skills?.length) {
        drawHeading('Skills');
        formatted.skills.forEach(skill => drawLine(`• ${skill}`, 12, 10));
        y -= 10;
      }

      // EXPERIENCE
      if (formatted.professional_experience?.length) {
        drawHeading('Professional Experience');
        formatted.professional_experience.forEach(exp => {
          drawLine(`${exp.position} — ${exp.company} (${exp.dates})`, 12, 5, true);
          exp.responsibilities?.forEach(r => drawLine(`• ${r}`, 11, 15));
          y -= 6;
        });
        y -= 10;
      }

      // EDUCATION
      if (formatted.education) {
        drawHeading('Education');
        drawLine(
          `${formatted.education.degree} — ${formatted.education.institution} (${formatted.education.date}), ${formatted.education.location}`,
          12,
          10
        );
        y -= 10;
      }

      // INTERESTS
      if (formatted.interests) {
        drawHeading('Interests');
        const interestsArray = Array.isArray(formatted.interests)
          ? formatted.interests
          : String(formatted.interests).split('\n');
        interestsArray.forEach(line => drawLine(line, 12, 10));
      }

      const pdfBytes = await pdfDoc.save();
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="cv.pdf"');
      return res.send(Buffer.from(pdfBytes));

    } else if (format === 'docx') {
      const paragraphs = [];
      if (formatted.header?.name)
        paragraphs.push(new Paragraph({ children: [new TextRun({ text: formatted.header.name, bold: true, size: 32 })] }));
      if (formatted.profile)
        paragraphs.push(new Paragraph(formatted.profile));
      if (formatted.skills?.length) {
        paragraphs.push(new Paragraph({ children: [new TextRun({ text: 'Skills', bold: true })] }));
        formatted.skills.forEach(s => paragraphs.push(new Paragraph(`• ${s}`)));
      }
      const doc = new Document({ sections: [{ children: paragraphs }] });
      const buf = await Packer.toBuffer(doc);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
      res.setHeader('Content-Disposition', 'attachment; filename="cv.docx"');
      return res.send(buf);
    }

    res.status(400).send('Invalid format');
  } catch (err) {
    next(err);
  }
};