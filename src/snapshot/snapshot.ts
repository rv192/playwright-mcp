import type { Page } from 'playwright-core';
import type { RefData } from '../types.js';
import { encodeRef } from './ref.js';

interface SnapshotNode {
  role: string;
  name?: string;
  ref: string;
  children?: SnapshotNode[];
}

interface AccessibilityNode {
  role?: string;
  name?: string;
  children?: AccessibilityNode[];
}

const INTERACTIVE_ROLES = new Set([
  'button', 'link', 'textbox', 'checkbox', 'radio', 'combobox',
  'listbox', 'option', 'menuitem', 'menuitemcheckbox', 'menuitemradio',
  'tab', 'switch', 'slider', 'spinbutton', 'searchbox', 'treeitem',
]);

export async function captureSnapshot(page: Page): Promise<string> {
  const snapshot = await (page as unknown as { accessibility: { snapshot: (opts: { interestingOnly: boolean }) => Promise<AccessibilityNode | null> } }).accessibility.snapshot({ interestingOnly: false });
  if (!snapshot) {
    return `# Page Snapshot\n\nURL: ${page.url()}\n\nNo accessibility tree available.`;
  }

  const roleCounters = new Map<string, number>();
  const nodes = processNode(snapshot, roleCounters);

  const lines: string[] = [
    `# Page Snapshot`,
    ``,
    `**URL:** ${page.url()}`,
    ``,
    `## Interactive Elements`,
    ``,
  ];

  const interactiveNodes = flattenInteractive(nodes);
  
  if (interactiveNodes.length === 0) {
    lines.push('No interactive elements found.');
  } else {
    for (const node of interactiveNodes) {
      const nameDisplay = node.name ? ` "${node.name}"` : '';
      lines.push(`- [${node.ref}] **${node.role}**${nameDisplay}`);
    }
  }

  return lines.join('\n');
}

function processNode(
  node: AccessibilityNode,
  roleCounters: Map<string, number>,
  frameIndex?: number
): SnapshotNode | null {
  const role = node.role || 'generic';
  const name = node.name || null;

  const key = `${role}:${name || ''}`;
  const nth = roleCounters.get(key) || 0;
  roleCounters.set(key, nth + 1);

  const refData: RefData = {
    v: 1,
    role,
    name,
    nth,
  };

  if (frameIndex !== undefined) {
    refData.frameIndex = frameIndex;
  }

  const ref = encodeRef(refData);

  const children: SnapshotNode[] = [];
  if (node.children) {
    for (const child of node.children) {
      const processed = processNode(child, roleCounters, frameIndex);
      if (processed) {
        children.push(processed);
      }
    }
  }

  return {
    role,
    name: name || undefined,
    ref,
    children: children.length > 0 ? children : undefined,
  };
}

function flattenInteractive(node: SnapshotNode | null): SnapshotNode[] {
  if (!node) return [];

  const result: SnapshotNode[] = [];

  if (INTERACTIVE_ROLES.has(node.role)) {
    result.push(node);
  }

  if (node.children) {
    for (const child of node.children) {
      result.push(...flattenInteractive(child));
    }
  }

  return result;
}
