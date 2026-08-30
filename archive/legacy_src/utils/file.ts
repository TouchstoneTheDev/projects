export const createSafeFilename = (value: string): string => {
  const cleaned = value
    .trim()
    .replace(/\s+/g, '_')
    .replace(/[^a-zA-Z0-9-_./]/g, '')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '');

  return cleaned.length > 0 ? cleaned : 'item';
};
