import fs from "fs";
import path from "path";

const loadGoogleFont = async (font: string, weight: number, text: string) => {
  const url = `https://fonts.googleapis.com/css2?family=${font}:wght@${weight}&text=${encodeURIComponent(text)}`;

  const data = await fetch(url);
  const css = await data.text();
  const resource = css.match(
    /src: url\((.+)\) format\('(opentype|truetype)'\)/,
  );

  if (resource) {
    const response = await fetch(resource[1]);
    if (response.status === 200) {
      const buffer = await response.arrayBuffer();
      return buffer;
    }
  }

  throw new Error(`Failed to load font: ${font} ${weight}`);
};

const loadAvatar = async () => {
  const avatarPath = path.join(process.cwd(), "src/assets/pfp.jpg");
  const avatarBuffer = fs.readFileSync(avatarPath);
  const base64 = avatarBuffer.toString("base64");
  return `data:image/jpeg;base64,${base64}`;
};

export { loadGoogleFont, loadAvatar };
