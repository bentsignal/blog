import * as Directory from "@/features/directory";

const basicProject = {
  name: "src",
  contents: [
    {
      name: "pages",
      isOpen: true,
      contents: [
        { name: "home-page", type: "tsx" },
        { name: "settings-page", type: "tsx" },
      ],
    },
    {
      name: "components",
      isOpen: true,
      contents: [
        {
          name: "ui",
          contents: [
            { name: "button", type: "tsx" },
            { name: "input", type: "tsx" },
            { name: "card", type: "tsx" },
          ],
        },
        { name: "nav", type: "tsx" },
        { name: "footer", type: "tsx" },
      ],
    },
    {
      name: "hooks",
      contents: [
        { name: "use-mobile", type: "ts" },
        { name: "use-is-client", type: "ts" },
      ],
    },
    { name: "types", contents: [{ name: "index", type: "ts" }] },
    {
      name: "lib",
      contents: [
        { name: "auth-client", type: "ts" },
        { name: "util", type: "ts" },
      ],
    },
  ],
} as const satisfies Directory.FolderType;

const messagingAppFirstIteration = {
  name: "src",
  contents: [
    {
      name: "pages",
      isOpen: true,
      contents: [
        { name: "home-page", type: "tsx" },
        { name: "settings-page", type: "tsx" },
        { name: "channel-page", type: "tsx" },
        { name: "login-page", type: "tsx" },
        { name: "thread-page", type: "tsx" },
      ],
    },
    {
      name: "components",
      isOpen: true,
      contents: [
        {
          name: "ui",
          contents: [
            { name: "button", type: "tsx" },
            { name: "input", type: "tsx" },
            { name: "sidebar", type: "tsx" },
            { name: "card", type: "tsx" },
          ],
        },
        {
          name: "auth",
          contents: [
            { name: "sign-in-form", type: "tsx" },
            { name: "sign-up-form", type: "tsx" },
            { name: "sign-in-button", type: "tsx" },
            { name: "sign-up-button", type: "tsx" },
            { name: "sign-out-button", type: "tsx" },
          ],
        },
        {
          name: "messages",
          contents: [
            { name: "user-message", type: "tsx" },
            { name: "assistant-message", type: "tsx" },
            { name: "system-message", type: "tsx" },
          ],
        },
        {
          name: "composer",
          contents: [
            { name: "channel-composer", type: "tsx" },
            { name: "edit-composer", type: "tsx" },
            { name: "reply-composer", type: "tsx" },
          ],
        },
        { name: "search-bar", type: "tsx" },
        { name: "message-list", type: "tsx" },
        { name: "header", type: "tsx" },
        { name: "footer", type: "tsx" },
        { name: "nav", type: "tsx" },
      ],
    },
    {
      name: "hooks",
      contents: [
        { name: "use-mobile", type: "ts" },
        { name: "use-message-actions", type: "ts" },
        { name: "use-debounced-input", type: "ts" },
        { name: "use-auth", type: "ts" },
        { name: "use-composer", type: "ts" },
        { name: "use-theme", type: "ts" },
        { name: "use-is-client", type: "ts" },
      ],
    },
    {
      name: "context",
      contents: [
        { name: "auth-context", type: "tsx" },
        { name: "message-context", type: "tsx" },
        { name: "search-context", type: "tsx" },
        { name: "channel-context", type: "tsx" },
        { name: "composer-context", type: "tsx" },
      ],
    },
    {
      name: "types",
      contents: [
        { name: "index", type: "ts" },
        { name: "composer-types", type: "ts" },
        { name: "message-types", type: "ts" },
      ],
    },
    {
      name: "lib",
      contents: [
        { name: "auth-client", type: "ts" },
        { name: "util", type: "ts" },
      ],
    },
  ],
} as const satisfies Directory.FolderType;

const messagingAppSecondIteration = {
  name: "src",
  contents: [
    {
      name: "pages",
      isOpen: true,
      contents: [
        { name: "home-page", type: "tsx" },
        { name: "settings-page", type: "tsx" },
        { name: "channel-page", type: "tsx" },
        { name: "login-page", type: "tsx" },
        { name: "thread-page", type: "tsx" },
      ],
    },
    {
      name: "features",
      isOpen: true,
      contents: [
        {
          name: "message",
          isOpen: true,
          contents: [
            {
              name: "components",
              contents: [
                { name: "user-message", type: "tsx" },
                { name: "assistant-message", type: "tsx" },
                { name: "system-message", type: "tsx" },
                { name: "message-list", type: "tsx" },
              ],
            },
            {
              name: "hooks",
              contents: [{ name: "use-message-actions", type: "ts" }],
            },
            {
              name: "context",
              contents: [{ name: "message-context", type: "ts" }],
            },
            {
              name: "types",
              contents: [{ name: "message-types", type: "ts" }],
            },
          ],
        },
        {
          name: "auth",
          contents: [
            {
              name: "components",
              contents: [
                { name: "sign-in-form", type: "tsx" },
                { name: "sign-up-form", type: "tsx" },
                { name: "sign-in-button", type: "tsx" },
                { name: "sign-up-button", type: "tsx" },
                { name: "sign-out-button", type: "tsx" },
              ],
            },
            {
              name: "hooks",
              contents: [{ name: "use-auth", type: "ts" }],
            },
            {
              name: "context",
              contents: [{ name: "auth-context", type: "ts" }],
            },
            {
              name: "lib",
              contents: [{ name: "auth-client", type: "ts" }],
            },
            {
              name: "types",
              contents: [{ name: "message-types", type: "ts" }],
            },
          ],
        },
        {
          name: "composer",
          contents: [
            {
              name: "components",
              contents: [
                { name: "channel-composer", type: "tsx" },
                { name: "edit-composer", type: "tsx" },
                { name: "reply-composer", type: "tsx" },
              ],
            },
            {
              name: "hooks",
              contents: [{ name: "use-composer", type: "ts" }],
            },
            {
              name: "context",
              contents: [{ name: "composer-context", type: "ts" }],
            },
            {
              name: "types",
              contents: [{ name: "composer-types", type: "ts" }],
            },
          ],
        },
      ],
    },
    {
      name: "components",
      isOpen: true,
      contents: [
        {
          name: "ui",
          contents: [
            { name: "button", type: "tsx" },
            { name: "input", type: "tsx" },
            { name: "sidebar", type: "tsx" },
            { name: "card", type: "tsx" },
          ],
        },
        { name: "search-bar", type: "tsx" },
        { name: "header", type: "tsx" },
        { name: "footer", type: "tsx" },
        { name: "nav", type: "tsx" },
      ],
    },
    {
      name: "hooks",
      contents: [
        { name: "use-mobile", type: "ts" },
        { name: "use-debounced-input", type: "ts" },
        { name: "use-theme", type: "ts" },
        { name: "use-is-client", type: "ts" },
      ],
    },
    {
      name: "context",
      contents: [
        { name: "search-context", type: "tsx" },
        { name: "channel-context", type: "tsx" },
      ],
    },
    {
      name: "types",
      contents: [{ name: "index", type: "ts" }],
    },
    {
      name: "lib",
      contents: [{ name: "util", type: "ts" }],
    },
  ],
} as const satisfies Directory.FolderType;

const closerLookAtComponents = {
  name: "components",
  isOpen: true,
  contents: [
    {
      name: "ui",
      isOpen: true,
      contents: [
        { name: "button", type: "tsx" },
        { name: "input", type: "tsx" },
        { name: "sidebar", type: "tsx" },
        { name: "card", type: "tsx" },
      ],
    },
    { name: "search-bar", type: "tsx" },
    { name: "header", type: "tsx" },
    { name: "footer", type: "tsx" },
    { name: "nav", type: "tsx" },
  ],
} as const satisfies Directory.FolderType;

export {
  basicProject,
  messagingAppFirstIteration,
  messagingAppSecondIteration,
  closerLookAtComponents,
};
