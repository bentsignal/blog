import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import tsx from "react-syntax-highlighter/dist/esm/languages/prism/tsx";

export const registerLanguages = () => {};

SyntaxHighlighter.registerLanguage("tsx", tsx);
