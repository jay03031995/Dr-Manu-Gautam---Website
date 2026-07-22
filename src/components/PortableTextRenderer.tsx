import Image from "next/image";
import Link from "next/link";
import { PortableText, type PortableTextComponents, type PortableTextBlock } from "@portabletext/react";
import { urlForImage } from "@/sanity/lib/image";

const components: PortableTextComponents = {
  types: {
    image: ({ value }) => (
      <span className="relative my-6 block aspect-video overflow-hidden rounded-md">
        <Image
          src={urlForImage(value).width(1200).fit("max").url()}
          alt={value.alt ?? ""}
          fill
          sizes="(min-width: 1024px) 800px, 100vw"
          className="object-cover"
        />
      </span>
    ),
  },
  // h2/h3 get an id matching the block's _key so extractToc()'s anchors resolve.
  block: {
    h2: ({ children, value }) => (
      <h2 id={value._key} className="scroll-mt-28">
        {children}
      </h2>
    ),
    h3: ({ children, value }) => (
      <h3 id={value._key} className="scroll-mt-28">
        {children}
      </h3>
    ),
  },
  marks: {
    link: ({ value, children }) => {
      const href = value?.href ?? "#";
      const isExternal = /^https?:\/\//.test(href) && !href.includes(process.env.NEXT_PUBLIC_SITE_URL ?? "");
      return (
        <Link
          href={href}
          className="text-medical-blue underline underline-offset-2 hover:no-underline"
          {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {children}
        </Link>
      );
    },
  },
};

export function PortableTextRenderer({ value }: { value: PortableTextBlock[] }) {
  return (
    <div className="prose prose-neutral max-w-none prose-headings:font-heading prose-headings:text-dark-navy prose-p:text-charcoal prose-a:text-medical-blue">
      <PortableText value={value} components={components} />
    </div>
  );
}
