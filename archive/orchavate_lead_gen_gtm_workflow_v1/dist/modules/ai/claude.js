const ANTHROPIC_URL = 'https://api.anthropic.com/v1/complete';
export const summarizeWithClaude = async (text) => {
    const apiKey = process.env.ANTHROPIC_API_KEY ?? process.env.CLAUDE_API_KEY;
    if (!apiKey) {
        return 'No Anthropic API key configured; summary unavailable.';
    }
    const prompt = `Write a concise executive summary of the following accessibility assessment. Be factual and do not hallucinate.\n\n${text}`;
    const body = {
        model: 'claude-2.1',
        prompt,
        max_tokens_to_sample: 300,
        temperature: 0.0,
    };
    try {
        const resp = await fetch(ANTHROPIC_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify(body),
        });
        if (!resp.ok) {
            return `Claude API error: ${resp.status} ${resp.statusText}`;
        }
        const data = await resp.json();
        // The response shape may vary; attempt to extract text
        const output = data?.completion ??
            data?.output ??
            data?.completion?.[0]?.text ??
            data?.output_text ??
            JSON.stringify(data);
        return String(output);
    }
    catch (err) {
        return `Claude request failed: ${err.message}`;
    }
};
export default summarizeWithClaude;
//# sourceMappingURL=claude.js.map