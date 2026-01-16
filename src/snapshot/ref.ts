import type { RefData } from '../types.js';
import { base64UrlEncode, base64UrlDecode } from '../utils.js';

export function encodeRef(data: RefData): string {
  return base64UrlEncode(JSON.stringify(data));
}

export function decodeRef(ref: string): RefData {
  try {
    const json = base64UrlDecode(ref);
    const data = JSON.parse(json) as RefData;
    
    if (data.v !== 1) {
      throw new Error(`Unsupported ref version: ${data.v}`);
    }
    
    return data;
  } catch (error) {
    throw new Error(`Invalid ref format: ${ref.substring(0, 20)}...`);
  }
}

export function formatRefForError(ref: RefData): string {
  const parts = [`role="${ref.role}"`];
  if (ref.name) parts.push(`name="${ref.name}"`);
  parts.push(`nth=${ref.nth}`);
  if (ref.frameIndex !== undefined) parts.push(`frame=${ref.frameIndex}`);
  return parts.join(', ');
}
