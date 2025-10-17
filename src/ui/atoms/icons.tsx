import { SVGProps } from "react";
import * as simpleIcons from "simple-icons";
import type { SimpleIcon as SimpleIconType } from "simple-icons";

interface SimpleIconsProps extends SVGProps<SVGSVGElement> {
  icon: keyof typeof simpleIcons;
  color?: string;
  size?: number | string;
}

export const SimpleIcons = ({
  icon,
  color,
  size = "1em",
  ...rest
}: SimpleIconsProps) => {
  const iconData = simpleIcons[icon] as SimpleIconType;

  if (!iconData) {
    console.warn(`Icon "${icon}" not found in simple-icons.`);
    return null;
  }

  const iconColor = color || `#${iconData.hex}`;

  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      fill={iconColor}
      width={size}
      height={size}
      {...rest}
    >
      <title>{iconData.title}</title>
      <path d={iconData.path} />
    </svg>
  );
};
