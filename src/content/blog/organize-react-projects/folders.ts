import type { FileType, FolderType } from "@/features/directory/types";

const shadcnComponents = [
  {
    name: "button",
    extension: "tsx",
    link: "https://ui.shadcn.com/docs/components/button",
  },
  {
    name: "input",
    extension: "tsx",
    link: "https://ui.shadcn.com/docs/components/input",
  },
  {
    name: "sidebar",
    extension: "tsx",
    link: "https://ui.shadcn.com/docs/components/sidebar",
  },
  {
    name: "card",
    extension: "tsx",
    link: "https://ui.shadcn.com/docs/components/card",
  },
] as const satisfies FileType[];

const basicProject = {
  name: "src",
  contents: [
    {
      name: "components",
      isOpen: true,
      contents: [
        { name: "ui", contents: shadcnComponents, isOpen: true },
        { name: "nav", extension: "tsx" },
        { name: "footer", extension: "tsx" },
      ],
    },
    {
      name: "hooks",
      isOpen: true,
      contents: [
        { name: "use-mobile", extension: "ts" },
        { name: "use-is-client", extension: "ts" },
      ],
    },
    {
      name: "types",
      isOpen: true,
      contents: [{ name: "index", extension: "ts" }],
    },
    {
      name: "lib",
      isOpen: true,
      contents: [{ name: "util", extension: "ts" }],
    },
  ],
} as const satisfies FolderType;

const messagingAppFirstIteration = {
  name: "src",
  contents: [
    {
      name: "components",
      isOpen: true,
      contents: [
        { name: "ui", contents: shadcnComponents },
        {
          name: "auth",
          contents: [
            { name: "sign-in-form", extension: "tsx" },
            { name: "sign-up-form", extension: "tsx" },
            { name: "sign-in-button", extension: "tsx" },
            { name: "sign-up-button", extension: "tsx" },
            { name: "sign-out-button", extension: "tsx" },
          ],
        },
        {
          name: "messages",
          contents: [
            { name: "user-message", extension: "tsx" },
            { name: "assistant-message", extension: "tsx" },
            { name: "system-message", extension: "tsx" },
          ],
        },
        {
          name: "composer",
          contents: [
            { name: "channel-composer", extension: "tsx" },
            { name: "edit-composer", extension: "tsx" },
            { name: "reply-composer", extension: "tsx" },
          ],
        },
        { name: "search-bar", extension: "tsx" },
        { name: "message-list", extension: "tsx" },
        { name: "header", extension: "tsx" },
        { name: "footer", extension: "tsx" },
        { name: "nav", extension: "tsx" },
      ],
    },
    {
      name: "hooks",
      contents: [
        { name: "use-mobile", extension: "ts" },
        { name: "use-message-actions", extension: "ts" },
        { name: "use-debounced-input", extension: "ts" },
        { name: "use-theme", extension: "ts" },
        { name: "use-is-client", extension: "ts" },
      ],
    },
    {
      name: "context",
      contents: [
        { name: "auth-context", extension: "tsx" },
        { name: "message-context", extension: "tsx" },
        { name: "search-context", extension: "tsx" },
        { name: "channel-context", extension: "tsx" },
        { name: "composer-context", extension: "tsx" },
      ],
    },
    {
      name: "types",
      contents: [
        { name: "index", extension: "ts" },
        { name: "composer-types", extension: "ts" },
        { name: "message-types", extension: "ts" },
      ],
    },
    {
      name: "lib",
      contents: [
        { name: "auth-client", extension: "ts" },
        { name: "util", extension: "ts" },
      ],
    },
  ],
} as const satisfies FolderType;

const messagingAppSecondIteration = {
  name: "src",
  contents: [
    {
      name: "features",
      isOpen: true,
      contents: [
        {
          name: "messages",
          isOpen: true,
          contents: [
            {
              name: "components",
              contents: [
                { name: "user-message", extension: "tsx" },
                { name: "assistant-message", extension: "tsx" },
                { name: "system-message", extension: "tsx" },
                { name: "message-list", extension: "tsx" },
              ],
            },
            {
              name: "hooks",
              contents: [{ name: "use-message-actions", extension: "ts" }],
            },
            { name: "context", extension: "ts" },
            { name: "types", extension: "ts" },
          ],
        },
        {
          name: "auth",
          contents: [
            {
              name: "components",
              contents: [
                { name: "sign-in-form", extension: "tsx" },
                { name: "sign-up-form", extension: "tsx" },
                { name: "sign-in-button", extension: "tsx" },
                { name: "sign-up-button", extension: "tsx" },
                { name: "sign-out-button", extension: "tsx" },
              ],
            },
            {
              name: "lib",
              contents: [{ name: "auth-client", extension: "ts" }],
            },
            { name: "context", extension: "ts" },
            { name: "types", extension: "ts" },
          ],
        },
        {
          name: "composer",
          contents: [
            {
              name: "components",
              contents: [
                { name: "channel-composer", extension: "tsx" },
                { name: "edit-composer", extension: "tsx" },
                { name: "reply-composer", extension: "tsx" },
              ],
            },
            { name: "context", extension: "ts" },
            { name: "types", extension: "ts" },
          ],
        },
      ],
    },
    {
      name: "components",
      contents: [
        { name: "ui", contents: shadcnComponents },
        { name: "search-bar", extension: "tsx" },
        { name: "header", extension: "tsx" },
        { name: "footer", extension: "tsx" },
        { name: "nav", extension: "tsx" },
      ],
    },
    {
      name: "hooks",
      contents: [
        { name: "use-mobile", extension: "ts" },
        { name: "use-debounced-input", extension: "ts" },
        { name: "use-theme", extension: "ts" },
        { name: "use-is-client", extension: "ts" },
      ],
    },
    {
      name: "context",
      contents: [
        { name: "search-context", extension: "tsx" },
        { name: "channel-context", extension: "tsx" },
      ],
    },
    {
      name: "types",
      contents: [{ name: "index", extension: "ts" }],
    },
    {
      name: "lib",
      contents: [{ name: "util", extension: "ts" }],
    },
  ],
} as const satisfies FolderType;

const closerLookAtComponents = {
  name: "components",
  isOpen: true,
  contents: [
    { name: "ui", contents: shadcnComponents, isOpen: true },
    { name: "search-bar", extension: "tsx" },
    { name: "header", extension: "tsx" },
    { name: "footer", extension: "tsx" },
    { name: "nav", extension: "tsx" },
  ],
} as const satisfies FolderType;

const moveShadcnComponentsToAtoms = {
  name: "src",
  contents: [
    {
      name: "components",
      isOpen: true,
      contents: [
        { name: "search-bar", extension: "tsx" },
        { name: "header", extension: "tsx" },
        { name: "footer", extension: "tsx" },
        { name: "nav", extension: "tsx" },
      ],
    },
    {
      name: "atoms",
      isOpen: true,
      contents: shadcnComponents,
    },
  ],
} as const satisfies FolderType;

export const sidebarAtomSplitUp = {
  name: "atoms",
  isOpen: true,
  contents: [
    {
      name: "sidebar",
      isOpen: true,
      contents: [
        {
          name: "index",
          extension: "tsx",
        },
        {
          name: "sidebar-components",
          extension: "tsx",
        },
        {
          name: "sidebar-context",
          extension: "tsx",
        },
        {
          name: "sidebar-constants",
          extension: "ts",
        },
      ],
    },
    {
      name: "button",
      extension: "tsx",
      link: "https://ui.shadcn.com/docs/components/button",
    },
    {
      name: "input",
      extension: "tsx",
      link: "https://ui.shadcn.com/docs/components/input",
    },
    {
      name: "card",
      extension: "tsx",
      link: "https://ui.shadcn.com/docs/components/card",
    },
  ],
} as const satisfies FolderType;

const closerLookAtMessagesFeature = {
  name: "features",
  isOpen: true,
  contents: [
    {
      name: "messages",
      isOpen: true,
      contents: [
        {
          name: "components",
          isOpen: true,
          contents: [
            { name: "user-message", extension: "tsx" },
            { name: "assistant-message", extension: "tsx" },
            { name: "system-message", extension: "tsx" },
            { name: "message-list", extension: "tsx" },
          ],
        },
        {
          name: "hooks",
          contents: [{ name: "use-message-actions", extension: "ts" }],
        },
        { name: "context", extension: "ts" },
        { name: "types", extension: "ts" },
      ],
    },
    {
      name: "auth",
      contents: [
        {
          name: "components",
          contents: [
            { name: "sign-in-form", extension: "tsx" },
            { name: "sign-up-form", extension: "tsx" },
            { name: "sign-in-button", extension: "tsx" },
            { name: "sign-up-button", extension: "tsx" },
            { name: "sign-out-button", extension: "tsx" },
          ],
        },
        {
          name: "lib",
          contents: [{ name: "auth-client", extension: "ts" }],
        },
        { name: "context", extension: "ts" },
        { name: "types", extension: "ts" },
      ],
    },
    {
      name: "composer",
      contents: [
        {
          name: "components",
          contents: [
            { name: "channel-composer", extension: "tsx" },
            { name: "edit-composer", extension: "tsx" },
            { name: "reply-composer", extension: "tsx" },
          ],
        },
        { name: "context", extension: "ts" },
        { name: "types", extension: "ts" },
      ],
    },
  ],
} as const satisfies FolderType;

const messagesFeatureAfterAtomicDesign = {
  name: "features",
  isOpen: true,
  contents: [
    {
      name: "messages",
      isOpen: true,
      contents: [
        {
          name: "atom",
          isOpen: true,
          contents: [
            { name: "message-components", extension: "tsx" },
            { name: "message-context", extension: "tsx" },
            { name: "index", extension: "tsx" },
          ],
        },
        {
          name: "molecules",
          isOpen: true,
          contents: [
            { name: "user-message", extension: "tsx" },
            { name: "assistant-message", extension: "tsx" },
            { name: "system-message", extension: "tsx" },
            { name: "message-list", extension: "tsx" },
          ],
        },
        {
          name: "hooks",
          contents: [{ name: "use-message-actions", extension: "ts" }],
        },
        { name: "types", extension: "ts" },
      ],
    },
    {
      name: "auth",
      contents: [
        {
          name: "components",
          contents: [
            { name: "sign-in-form", extension: "tsx" },
            { name: "sign-up-form", extension: "tsx" },
            { name: "sign-in-button", extension: "tsx" },
            { name: "sign-up-button", extension: "tsx" },
            { name: "sign-out-button", extension: "tsx" },
          ],
        },
        {
          name: "lib",
          contents: [{ name: "auth-client", extension: "ts" }],
        },
        { name: "context", extension: "ts" },
        { name: "types", extension: "ts" },
      ],
    },
    {
      name: "composer",
      contents: [
        {
          name: "components",
          contents: [
            { name: "channel-composer", extension: "tsx" },
            { name: "edit-composer", extension: "tsx" },
            { name: "reply-composer", extension: "tsx" },
          ],
        },
        { name: "context", extension: "ts" },
        { name: "types", extension: "ts" },
      ],
    },
  ],
} as const satisfies FolderType;

const messagingAppThirdIteration = {
  name: "src",
  contents: [
    {
      name: "atoms",
      contents: [
        {
          name: "sidebar",
          contents: [
            {
              name: "sidebar-components",
              extension: "tsx",
            },
            {
              name: "sidebar-constants",
              extension: "ts",
            },
            {
              name: "sidebar-context",
              extension: "tsx",
            },
          ],
        },
        {
          name: "button",
          extension: "tsx",
          link: "https://ui.shadcn.com/docs/components/button",
        },
        {
          name: "input",
          extension: "tsx",
          link: "https://ui.shadcn.com/docs/components/input",
        },
        {
          name: "card",
          extension: "tsx",
          link: "https://ui.shadcn.com/docs/components/card",
        },
      ],
    },
    {
      name: "molecules",
      contents: [
        { name: "search-bar", extension: "tsx" },
        { name: "header", extension: "tsx" },
        { name: "footer", extension: "tsx" },
        { name: "nav", extension: "tsx" },
      ],
    },
    {
      name: "features",
      contents: [
        {
          name: "messages",
          contents: [
            {
              name: "atom",
              contents: [
                { name: "message-components", extension: "tsx" },
                { name: "message-context", extension: "tsx" },
                { name: "index", extension: "tsx" },
              ],
            },
            {
              name: "molecules",
              contents: [
                { name: "user-message", extension: "tsx" },
                { name: "assistant-message", extension: "tsx" },
                { name: "system-message", extension: "tsx" },
                { name: "message-list", extension: "tsx" },
              ],
            },
            {
              name: "hooks",
              contents: [{ name: "use-message-actions", extension: "ts" }],
            },
            { name: "types", extension: "ts" },
          ],
        },
        {
          name: "auth",
          contents: [
            {
              name: "atom",
              contents: [
                { name: "auth-components", extension: "tsx" },
                { name: "auth-context", extension: "tsx" },
                { name: "index", extension: "tsx" },
              ],
            },
            {
              name: "molecules",
              contents: [
                { name: "sign-in-form", extension: "tsx" },
                { name: "sign-up-form", extension: "tsx" },
                { name: "sign-in-button", extension: "tsx" },
                { name: "sign-up-button", extension: "tsx" },
                { name: "sign-out-button", extension: "tsx" },
              ],
            },
            {
              name: "lib",
              contents: [{ name: "auth-client", extension: "ts" }],
            },
            { name: "types", extension: "ts" },
          ],
        },
        {
          name: "composer",
          contents: [
            {
              name: "atom",
              contents: [
                { name: "composer-components", extension: "tsx" },
                { name: "composer-context", extension: "tsx" },
                { name: "index", extension: "tsx" },
              ],
            },
            {
              name: "molecules",
              contents: [
                { name: "channel-composer", extension: "tsx" },
                { name: "edit-composer", extension: "tsx" },
                { name: "reply-composer", extension: "tsx" },
              ],
            },
            { name: "types", extension: "ts" },
          ],
        },
      ],
    },
    {
      name: "hooks",
      contents: [
        { name: "use-mobile", extension: "ts" },
        { name: "use-debounced-input", extension: "ts" },
        { name: "use-theme", extension: "ts" },
        { name: "use-is-client", extension: "ts" },
      ],
    },
    {
      name: "context",
      contents: [
        { name: "search-context", extension: "tsx" },
        { name: "channel-context", extension: "tsx" },
      ],
    },
    {
      name: "types",
      contents: [{ name: "index", extension: "ts" }],
    },
    {
      name: "lib",
      contents: [{ name: "util", extension: "ts" }],
    },
  ],
} as const satisfies FolderType;

export {
  basicProject,
  messagingAppFirstIteration,
  messagingAppSecondIteration,
  closerLookAtComponents,
  moveShadcnComponentsToAtoms,
  closerLookAtMessagesFeature,
  messagesFeatureAfterAtomicDesign,
  messagingAppThirdIteration,
};
