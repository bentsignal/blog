import * as Directory from "@/atoms/directory";

const basicProject = {
  name: "src",
  contents: [
    {
      name: "components",
      isOpen: true,
      contents: [
        {
          name: "ui",
          contents: [
            { name: "button", type: "tsx" },
            { name: "card", type: "tsx" },
            { name: "input", type: "tsx" },
          ],
          isOpen: true,
        },
        { name: "nav", type: "tsx" },
        { name: "footer", type: "tsx" },
      ],
    },
    { name: "hooks", contents: [{ name: "use-button", type: "ts" }] },
    { name: "types", contents: [{ name: "button-types", type: "ts" }] },
    { name: "lib", contents: [{ name: "auth-client", type: "ts" }] },
  ],
} as const satisfies Directory.FolderType;

export { basicProject };
