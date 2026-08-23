export const summarizeReport = async (markdown) => {
    return `Summary: ${markdown.split('\n').slice(0, 4).join(' ')}`;
};
//# sourceMappingURL=index.js.map