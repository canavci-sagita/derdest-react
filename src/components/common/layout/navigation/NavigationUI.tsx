"use client";

import { useEffect, useRef } from "react";
import SimpleBar from "simplebar";
import "simplebar-core/dist/simplebar.css";
import NavigationMenuItem from "./NavigationMenuItem";
import NavigationDivider from "./NavigationDivider";
import { NavigationEntry } from "@/types/navigation-menu.types";
import clsx from "clsx";
import cssClasses from "./NavigationUI.module.css";

interface NavigationUIProps {
  authorizedMenu: NavigationEntry[];
}

const NavigationUI: React.FC<NavigationUIProps> = ({ authorizedMenu }) => {
  const scrollableNode = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollableNode.current) {
      new SimpleBar(scrollableNode.current);
    }
  }, []);

  return (
    <div
      ref={scrollableNode}
      className={clsx([
        "w-full h-full z-20 px-5 overflow-y-auto",
        cssClasses.hideScrollbar,
      ])}
    >
      <ul className="scrollable">
        {authorizedMenu.map((item, idx) => {
          switch (item.type) {
            case "header":
              return <NavigationDivider key={item.title + idx} item={item} />;
            case "link":
              return !item.routeOnly ? (
                <NavigationMenuItem key={item.path} item={item} />
              ) : null;
            default:
              return null;
          }
        })}
      </ul>
    </div>
  );
};

export default NavigationUI;
