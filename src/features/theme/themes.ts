/*

  To add a new theme: 
  
  1. Add the theme name to the themeNames array
  2. Add the theme object to the themes object
  3. Add the theme class to the globals.css file

*/

const themeNames = ["space", "afternoon"] as const;

type ThemeName = (typeof themeNames)[number];

type Theme = {
  mode: "dark" | "light";
  name: ThemeName;
  className: string;
};

const themes = {
  space: {
    name: "space",
    className: "theme-space",
    mode: "dark",
  },
  afternoon: {
    name: "afternoon",
    className: "theme-afternoon",
    mode: "dark",
  },
} as const satisfies Record<ThemeName, Theme>;

const defaultTheme = themes.space;

export { themes, defaultTheme, themeNames };
export type { ThemeName, Theme };
