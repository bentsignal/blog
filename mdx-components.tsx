import type { MDXComponents } from "mdx/types";
import Image from "next/image";
import Link from "next/link";
import * as Code from "@/atoms/code";

const components: MDXComponents = {
  code: Code.Provider,
  pre: ({ children }) => <>{children}</>,
  a: ({ href, children, ...props }) => {
    const isExternalLink = /^https?:\/\//.test(href);
    if (isExternalLink) {
      return (
        // eslint-disable-next-line
        <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href} {...props}>
        {children}
      </Link>
    );
  },
  img: ({ src, alt, ...props }) => {
    return (
      <Image
        src={src}
        alt={alt}
        width={800}
        height={600}
        className="rounded-xl"
        {...props}
      />
    );
  },
};

export function useMDXComponents(): MDXComponents {
  return components;
}
