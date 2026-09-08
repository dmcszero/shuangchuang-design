/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Strips numbering (e.g., "1. ", "3.1 ", "3.2 ") and redundant version tags from session titles.
 */
export function cleanSessionTitle(title?: string): string {
  if (!title) return '';
  return title
    .replace(/^\s*\d+(\.\d+)*\.\s*/, '')
    .replace(/【深度调用\s*\d+(\.\d+)*】/g, '【深度调用】')
    .replace(/【浅度调用\s*\d+(\.\d+)*】/g, '【浅度调用】')
    .trim();
}
