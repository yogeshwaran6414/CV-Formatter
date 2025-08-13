const pdf = require('pdf-parse');
const mammoth = require('mammoth');
const xlsx = require('xlsx');

exports.parse = async (buffer, mimetype) => {
  if (mimetype === 'application/pdf') {
    return (await pdf(buffer)).text;
  } else if (mimetype.includes('wordprocessingml.document')) {
    return (await mammoth.extractRawText({ buffer })).value;
  } else if (mimetype.includes('spreadsheetml.sheet')) {
    const wb = xlsx.read(buffer, { type: 'buffer' });
    const sheet = wb.Sheets[wb.SheetNames[0]];
    return xlsx.utils.sheet_to_txt(sheet);
  }
  throw new Error('Unsupported file type');
};
