import type { PortableTextBlock } from "@portabletext/react";

const WORDS_PER_MINUTE = 200;

function blockText(block: PortableTextBlock): string {
  if (block._type !== "block" || !Array.isArray(block.children)) return "";
  return block.children
    .map((child) => ("text" in child && typeof child.text === "string" ? child.text : ""))
    .join(" ");
}

/** Rough estimated reading time from a portable text body, e.g. "4 min read". */
export function estimateReadingTime(body?: PortableTextBlock[]): string {
  if (!body?.length) return "1 min read";
  const wordCount = body.reduce((sum, block) => sum + blockText(block).split(/\s+/).filter(Boolean).length, 0);
  const minutes = Math.max(1, Math.round(wordCount / WORDS_PER_MINUTE));
  return `${minutes} min read`;
}

export interface TocItem {
  id: string;
  text: string;
  level: 2 | 3;
}

/** Extracts an H2/H3 table of contents from a portable text body. Anchor IDs
 *  use the block's own Sanity `_key`, which PortableTextRenderer attaches to
 *  the rendered heading element — guaranteed unique, no slug-collision logic
 *  needed. */
export function extractToc(body?: PortableTextBlock[]): TocItem[] {
  if (!body?.length) return [];
  return body
    .filter((block) => block._type === "block" && (block.style === "h2" || block.style === "h3") && block._key)
    .map((block) => ({
      id: block._key as string,
      text: blockText(block),
      level: block.style === "h3" ? 3 : 2,
    }));
}
