import * as Icons from "lucide-react";
import { twMerge } from "tailwind-merge";
import React from "react";

export type AppIconName = keyof typeof Icons.icons;
type IconName = keyof typeof Icons.icons;

interface AppIconProps extends React.ComponentPropsWithoutRef<"svg"> {
  icon: IconName;
  title?: string;
}

interface AppIconProps extends React.ComponentPropsWithoutRef<"svg"> {
  icon: AppIconName;
  title?: string;
}

const AppIcon = ({ icon, className, ...props }: AppIconProps) => {
  const IconComponent = Icons.icons[icon];
  if (!IconComponent) return null;

  return (
    <IconComponent
      {...props}
      className={twMerge("stroke-[1] w-5 h-5", className)}
    />
  );
};

export default AppIcon;
