
export const splitTextIntoLines = (text: string, maxLineLength: number) => {
  const words = text.split(" ");
  const lines = [];
  let currentLine = "";

  for (const word of words) {
    if (currentLine.length + word.length + 1 <= maxLineLength) {
      currentLine += `${word} `;
    } else {
      lines.push(currentLine.trim());
      currentLine = `${word} `;
    }
  }

  if (currentLine.length > 0) {
    lines.push(currentLine.trim());
  }

  return lines;
};

export const renderTextLines = (text: string, maxLineLength: number) => {
  const lines = splitTextIntoLines(text, maxLineLength);
  return lines.map((line) => line)
};
