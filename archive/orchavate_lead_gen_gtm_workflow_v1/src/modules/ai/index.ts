export const summarizeReport = async (markdown: string): Promise<string> => {
  return `Summary: ${markdown.split('\n').slice(0, 4).join(' ')}`;
};
