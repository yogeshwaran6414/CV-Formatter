import formidable from 'formidable';
import fs from 'fs';
import fetch from 'node-fetch';

export const config = { api: { bodyParser: false } };

export default function handler(req, res) {
  const form = new formidable.IncomingForm();
  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: 'Form parse error' });
    const data = fs.readFileSync(files.file.filepath);
    const r = await fetch(`http://localhost:4000/api/cv/upload`, {
      method: 'POST',
      body: data,
    });
    const json = await r.json();
    res.status(r.status).json(json);
  });
}
