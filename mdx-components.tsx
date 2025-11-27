import type { MDXComponents } from "mdx/types";
import Image from "next/image";
import * as Code from "@/atoms/code";

const components: MDXComponents = {
  code: Code.Provider,
  pre: ({ children }) => <>{children}</>,
  a: ({ href, children, ...props }) => (
    // eslint-disable-next-line
    <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
      {children}
    </a>
  ),
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
