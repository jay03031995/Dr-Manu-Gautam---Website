interface JsonLdProps {
  data: Record<string, unknown> | Record<string, unknown>[];
}

/** Injects one or more schema.org JSON-LD blocks into the page <head>/body. */
export function JsonLd({ data }: JsonLdProps) {
  const items = Array.isArray(data) ? data : [data];

  return (
    <>
      {items.map((item, i) => (
        <script
          key={i}
          type="application/ld+json"
          // "<" is escaped so content containing "</script>" can't break out of the tag.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item).replace(/</g, "\\u003c") }}
        />
      ))}
    </>
  );
}
