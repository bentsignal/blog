import Image from "next/image";
import Link from "next/link";
import type { MDXComponents } from "mdx/types";
import { CodeSnippet } from "@/features/code/molecules/code-snippet";
import { Callout, extractCalloutInfo } from "@/atoms/callout";
import { VideoPlayer } from "@/atoms/video-player";
import HashLink from "@/molecules/hash-link";

const VIDEO_EXTENSIONS = [".mp4", ".webm", ".mov"];

const components: MDXComponents = {
  code: CodeSnippet,
  pre: ({ children }) => <>{children}</>,
  blockquote: ({ children, ...props }) => {
    const calloutInfo = extractCalloutInfo(children);
    if (calloutInfo) {
      return <Callout type={calloutInfo.type}>{calloutInfo.content}</Callout>;
    }
    return <blockquote {...props}>{children}</blockquote>;
  },
  a: ({ href, children, ...props }) => {
    const isHashLink = href?.startsWith("#");
    if (isHashLink) {
      return (
        <HashLink href={href} {...props}>
          {children}
        </HashLink>
      );
    }

    const isProtocolRelative = href?.startsWith("//");
    const hasProtocol = href?.includes("://");
    const isExternalLink = isProtocolRelative || hasProtocol;
    if (isExternalLink) {
      return (
        // eslint-disable-next-line next/no-html-link-for-pages
        <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
          {children}
        </a>
      );
    }

    return (
      <Link prefetch={true} href={href} {...props}>
        {children}
      </Link>
    );
  },
  img: ({ src, alt, ...props }) => {
    if (src && VIDEO_EXTENSIONS.some((ext) => src.endsWith(ext))) {
      return <VideoPlayer src={src} alt={alt ?? ""} />;
    }
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
