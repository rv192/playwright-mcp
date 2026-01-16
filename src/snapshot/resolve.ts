import type { Page, Locator, FrameLocator } from 'playwright-core';
import type { RefData } from '../types.js';
import { decodeRef, formatRefForError } from './ref.js';

export async function resolveRef(page: Page, refString: string): Promise<Locator> {
  const ref = decodeRef(refString);
  return resolveRefData(page, ref);
}

export async function resolveRefData(page: Page, ref: RefData): Promise<Locator> {
  let context: Page | FrameLocator = page;

  if (ref.frameIndex !== undefined && ref.frameIndex >= 0) {
    const frames = page.frames();
    if (ref.frameIndex >= frames.length) {
      throw new Error(
        `Frame index ${ref.frameIndex} out of range (${frames.length} frames available). ` +
        `Ref: ${formatRefForError(ref)}`
      );
    }
    context = page.frameLocator(`iframe >> nth=${ref.frameIndex}`);
  }

  const locatorOptions: { name?: string | RegExp } = {};
  if (ref.name) {
    locatorOptions.name = ref.name;
  }

  let locator = context.getByRole(ref.role as Parameters<typeof page.getByRole>[0], locatorOptions);

  if (ref.nth > 0) {
    locator = locator.nth(ref.nth);
  }

  const count = await locator.count();
  if (count === 0) {
    if (ref.fallback?.css) {
      const fallbackLocator = page.locator(ref.fallback.css);
      const fallbackCount = await fallbackLocator.count();
      if (fallbackCount > 0) {
        return fallbackLocator.first();
      }
    }

    if (ref.fallback?.testId) {
      const testIdLocator = page.getByTestId(ref.fallback.testId);
      const testIdCount = await testIdLocator.count();
      if (testIdCount > 0) {
        return testIdLocator.first();
      }
    }

    throw new Error(
      `Element not found. Ref: ${formatRefForError(ref)}. ` +
      `Page URL: ${page.url()}`
    );
  }

  return locator.first();
}
