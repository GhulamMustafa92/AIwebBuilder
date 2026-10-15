const extractJson = (text) => {
  if (!text) return null;

  text = text.trim();

  // 1) Naya delimiter format — koi JSON escaping issue nahi, isliye zyada reliable
  const msgMatch = text.match(/###MESSAGE_START###([\s\S]*?)###MESSAGE_END###/);
  const codeMatch = text.match(/###CODE_START###([\s\S]*?)###CODE_END###/);

  if (msgMatch && codeMatch) {
    return {
      message: msgMatch[1].trim(),
      code: codeMatch[1].trim(),
    };
  }

  // 2) Fallback — purana JSON-based format (backward compatibility ke liye)
  let cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();

  try {
    return JSON.parse(cleaned);
  } catch {}

  const start = cleaned.indexOf("{");
  if (start === -1) return null;

  let depth = 0;

  for (let i = start; i < cleaned.length; i++) {
    if (cleaned[i] === "{") depth++;
    if (cleaned[i] === "}") depth--;

    if (depth === 0) {
      try {
        return JSON.parse(cleaned.substring(start, i + 1));
      } catch {}
    }
  }

  return null;
};

export default extractJson;