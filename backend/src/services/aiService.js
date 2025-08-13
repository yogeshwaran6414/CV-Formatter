const OpenAI = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function callModel(messages) {
  try {
    return (await openai.chat.completions.create({
      model: 'gpt-4o',
      messages,
      temperature: 0,
    })).choices[0].message.content;
  } catch (e) {
    throw e;
  }
}

exports.parseStructure = async text => {
  const prompt = [
    {
      role: 'system',
      content:
        'You are a CV parser. Extract the CV into a JSON object with keys: header, profile, languages, interests, professional_experience, skills, education. ' +
        'Do not include any extra text, explanation, markdown, or numbering. ' +
        'Return only valid JSON. Example format: {"header": {...}, "profile": "..."}'
    },
    { role: 'user', content: text }
  ];
  const res = await callModel(prompt);

  try {
    return JSON.parse(res);
  } catch (err) {
    console.error('Invalid JSON from parseStructure:', res);
    throw new Error('Model did not return valid JSON');
  }
};

exports.enhanceContent = async structured => {
  const prompt = [
    {
      role: 'system',
      content:
        'Enhance the given CV JSON: improve grammar, clarity, and formatting for professional presentation, but keep the same structure. ' +
        'Return only valid JSON, no explanations or markdown.'
    },
    { role: 'user', content: JSON.stringify(structured) }
  ];
  const res = await callModel(prompt);

  try {
    return JSON.parse(res);
  } catch (err) {
    console.error('Invalid JSON from enhanceContent:', res);
    throw new Error('Model did not return valid JSON');
  }
};
