import { BotBlockResult } from '../types.js';

export function checkBotBlock(html: string, title: string): BotBlockResult {
  const combined = `${title} ${html}`.toLowerCase();

  const botSignatures = [
    'cloudflare',
    'attention required! | cloudflare',
    'just a moment...',
    'enable javascript and cookies to continue',
    'access denied',
    'security check',
    'imperva',
    'incapsula',
    'akamai',
    'datadome',
    'perimeterx',
    'bot detection',
    'block script',
    'please verify you are a human',
  ];

  for (const sig of botSignatures) {
    if (combined.includes(sig)) {
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
