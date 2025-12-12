"use client";

import { Language } from "../languages/types";
import * as Code from "@/features/code/atom";
import * as Frame from "@/atoms/frame";

const FramedCodeBlock = ({
  code,
  language,
}: {
  code: string;
  language: Language;
}) => {
  return (
    <Code.Provider code={code} language={language}>
      <Frame.Container>
        <Frame.Header>
          <div className="flex items-center gap-2">
            <Code.LanguageIdentifier />
          </div>
          <div className="flex items-center gap-2">
            <Code.LineWrappingButton />
            <Code.LineNumbersButton />
            <Code.CopyButton />
          </div>
        </Frame.Header>
        <Frame.Body>
          <Code.Block />
        </Frame.Body>
      </Frame.Container>
    </Code.Provider>
  );
};

export { FramedCodeBlock };
