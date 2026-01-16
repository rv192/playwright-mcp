import type { BrowserManager } from '../../browser/BrowserManager.js';
import type { ServerConfig, ToolResult } from '../../types.js';
import { textResult } from '../index.js';
import { execSync } from 'child_process';

export async function handleInstall(
  _args: Record<string, unknown>,
  _browser: BrowserManager,
  _config: ServerConfig
): Promise<ToolResult> {
  try {
    execSync('npx camoufox-js fetch', { 
      stdio: 'pipe',
      timeout: 300000,
    });
    return textResult('Camoufox browser installed successfully');
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to install Camoufox browser: ${message}`);
  }
}
