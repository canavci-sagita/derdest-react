import AppIcon from "@/components/common/ui/AppIcon";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

import type { NavigationLink } from "@/types/navigation-menu.types";
import Link from "next/link";
import { useTranslation } from "@/stores/TranslationContext";
import { usePathname } from "next/navigation";
import { slideUpDownVariants } from "@/lib/animations/slide-up-down.variants";

type NavigationMenuItemProps = {
  item: NavigationLink;
};

const NavigationMenuItem: React.FC<NavigationMenuItemProps> = ({ item }) => {
  const { t } = useTranslation();

  const pathname = usePathname();
  const subItems = item.subItems?.filter((i) => !i.routeOnly);
  const isParentActive = !!subItems && pathname.startsWith(item.path);
  const isLinkActive = pathname === item.path;

  const [activeDropdown, setActiveDropdown] = useState(isParentActive);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (subItems) {
      e.preventDefault();
      setActiveDropdown((prev) => !prev);
    }
  };

  const linkClassName = clsx([
    "cursor-pointer side-menu__link",
    {
      "side-menu__link--active": isLinkActive || isParentActive,
      "side-menu__link--active-dropdown": isParentActive,
    },
  ]);

  useEffect(() => {
    setActiveDropdown(isParentActive);
  }, [isParentActive]);

  return (
    <li>
      {subItems && subItems.length > 0 ? (
        <a className={linkClassName} onClick={handleClick}>
          <AppIcon className="side-menu__link__icon" icon={item.icon} />
          <div className="side-menu__link__title">{t(item.title)}</div>
          {item.badge && (
            <div className="side-menu__link__badge">{item.badge}</div>
          )}
          <AppIcon
            className="side-menu__link__chevron"
            icon={activeDropdown ? "ChevronUp" : "ChevronDown"}
          />
        </a>
      ) : (
        <Link href={item.path} className={linkClassName}>
          <AppIcon className="side-menu__link__icon" icon={item.icon} />
          <div className="side-menu__link__title">{t(item.title)}</div>
          {item.badge && (
            <div className="side-menu__link__badge">{item.badge}</div>
          )}
        </Link>
      )}
      {subItems && subItems.length > 0 && (
        <AnimatePresence>
          {activeDropdown && (
            <motion.ul
              key={item.path}
              className="overflow-hidden"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={slideUpDownVariants}
            >
              <div className="side-menu__sub-menu-wrapper">
                {subItems.map((subItem) => (
                  <NavigationMenuItem key={subItem.path} item={subItem} />
                ))}
              </div>
            </motion.ul>
          )}
        </AnimatePresence>
      )}
    </li>
  );
};

export default NavigationMenuItem;
