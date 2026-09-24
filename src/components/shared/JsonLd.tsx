/**
 * Renders a JSON-LD <script> tag for structured data (SEO).
 * Usage: <JsonLd data={{ '@context': 'https://schema.org', '@type': 'Product', ... }} />
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
