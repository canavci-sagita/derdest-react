import * as lucideIcons from "lucide-react";
import { twMerge } from "tailwind-merge";

export const { icons } = lucideIcons;

interface AppIconProps extends React.ComponentPropsWithoutRef<"svg"> {
  icon: keyof typeof icons;
  title?: string;
}

const AppIcon = (props: AppIconProps) => {
  const { icon, className, ...computedProps } = props;
  const Component = icons[icon];
  return (
    <Component
      {...computedProps}
      className={twMerge(["stroke-[1] w-5 h-5", className])}
    />
  );
};

export default AppIcon;
