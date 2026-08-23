export const verifyWebsiteUrl = async (record) => {
    const reasons = [];
    let statusCode;
    let title;
    try {
        const response = await fetch(record.websiteUrl, { redirect: 'follow' });
        statusCode = response.status;
        const body = await response.text();
        const titleMatch = body.match(/<title>(.*?)<\/title>/i);
        title = titleMatch ? titleMatch[1].trim() : undefined;
        if (statusCode >= 400) {
            reasons.push(`HTTP status ${statusCode}`);
        }
        if (!title) {
            reasons.push('Missing title');
        }
    }
    catch (error) {
        reasons.push(`Fetch failed: ${error.message}`);
    }
    return {
        companyName: record.companyName,
        websiteUrl: record.websiteUrl,
        verified: reasons.length === 0,
        statusCode,
        title,
        reasons: reasons.length > 0 ? reasons : undefined,
    };
};
//# sourceMappingURL=verify.js.map