import { BotBlockResult } from './types.js';

export const BOT_BLOCK_SIGNATURES: string[] = [
  "anomaly detected",
  "are you human",
  "i am human",
  "access denied",
  "checking your browser",
  "cloudflare ray id",
  "attention required",
  "request unblock",
  "bot detection",
  "unusual traffic",
  "verify you are human",
  "cf-challenge",
  "you reached this page when trying to access",
  "incident id",
  "we apologize for the inconvenience",
  "malicious behavior which originated"
];

export function checkBotBlock(htmlContent: string, titleStr: string): BotBlockResult {
  const contentLower = (htmlContent || '').toLowerCase();
  const titleLower = (titleStr || '').toLowerCase();

  for (const sig of BOT_BLOCK_SIGNATURES) {
    if (contentLower.includes(sig) || titleLower.includes(sig)) {
      return {
        isBlocked: true,
        signatureMatched: sig,
      };
    }
  }

  return {
    isBlocked: false,
  };
}
