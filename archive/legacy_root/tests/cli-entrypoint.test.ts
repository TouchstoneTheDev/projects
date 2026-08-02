import { existsSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

describe('CLI entrypoint', () => {
  it('creates a runnable cli entry file in src', () => {
    const cliEntry = path.resolve(__dirname, '../src/cli.ts');
    expect(existsSync(cliEntry)).toBe(true);
  });
});
