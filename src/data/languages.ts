export const languages = {
  typescript: {
    label: "TypeScript",
    color: "#3178C6",
  },
  javascript: {
    label: "JavaScript",
    color: "#F7DF1E",
  },
  java: {
    label: "Java",
    color: null,
  },
  tsx: {
    label: "React",
    color: "#61DAFB",
  },
  jsx: {
    label: "React",
    color: "#61DAFB",
  },
  bash: {
    label: "Bash",
    color: "#4EAA25",
  },
  python: {
    label: "Python",
    color: "#3776AB",
  },
  rust: {
    label: "Rust",
    color: "#000000",
  },
  html: {
    label: "HTML",
    color: "#E34F26",
  },
  css: {
    label: "CSS",
    color: "#8A4FC4",
  },
  json: {
    label: "JSON",
    color: "#000000",
  },
  yaml: {
    label: "YAML",
    color: "#CB171E",
  },
  markdown: {
    label: "Markdown",
    color: "#000000",
  },
  sql: {
    label: "SQL",
    color: "#4479A1",
  },
  c: {
    label: "C",
    color: "#A8B9CC",
  },
  cpp: {
    label: "C++",
    color: "#00599C",
  },
  csharp: {
    label: "C#",
    color: null,
  },
  go: {
    label: "Go",
    color: "#00ADD8",
  },
  swift: {
    label: "Swift",
    color: "#F05138",
  },
  kotlin: {
    label: "Kotlin",
    color: "#7F52FF",
  },
  php: {
    label: "PHP",
    color: "#777BB4",
  },
  ruby: {
    label: "Ruby",
    color: "#CC342D",
  },
  scala: {
    label: "Scala",
    color: "#DC322F",
  },
  haskell: {
    label: "Haskell",
    color: "#5D4F85",
  },
  erlang: {
    label: "Erlang",
    color: "#A90533",
  },
  elixir: {
    label: "Elixir",
    color: "#4B275F",
  },
  dart: {
    label: "Dart",
    color: "#0175C2",
  },
  svelte: {
    label: "Svelte",
    color: "#FF3E00",
  },
  vue: {
    label: "Vue",
    color: "#4FC08D",
  },
  solid: {
    label: "Solid",
    color: "#2C4F7C",
  },
  graphql: {
    label: "GraphQL",
    color: "#E10098",
  },
  xml: {
    label: "XML",
    color: null,
  },
  sass: {
    label: "Sass",
    color: "#CC6699",
  },
  scss: {
    label: "SCSS",
    color: "#CC6699",
  },
  angular: {
    label: "Angular",
    color: "#0F0F11",
  },
  R: {
    label: "R",
    color: "#276DC3",
  },
  lua: {
    label: "Lua",
    color: "#2C2D72",
  },
  perl: {
    label: "Perl",
    color: "#0073A1",
  },
  objectivec: {
    label: "Objective-C",
    color: null,
  },
  assembly: {
    label: "Assembly",
    color: null,
  },
  wat: {
    label: "Web Assembly",
    color: "#654FF0",
  },
  watson: {
    label: "Web Assembly",
    color: "#654FF0",
  },
  zig: {
    label: "Zig",
    color: "#F7A41D",
  },
  solidity: {
    label: "Solidity",
    color: "#000000",
  },
} as const satisfies Record<string, { label: string; color: string | null }>;
