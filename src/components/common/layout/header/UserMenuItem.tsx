"use client";

import { useTranslation } from "@/stores/TranslationContext";
import {
  DropdownMenuDivider,
  DropdownMenuItem,
} from "@/types/dropdown-menu.types";
import { Menu } from "antd";

const UserMenuItem: React.FC<DropdownMenuItem | DropdownMenuDivider> = (
  props: DropdownMenuItem | DropdownMenuDivider
) => {
  const { t } = useTranslation();
  const { type } = props;

  return (
    <>
      {type === "divider" && (
        <Menu.Divider className="h-px my-2 -mx-2 bg-slate-200/60 dark:bg-darkmode-400"></Menu.Divider>
      )}
      {type === "item" && (
        <Menu.Item
          key={props.key}
          className="cursor-pointer flex items-center p-2 transition duration-300 ease-in-out rounded-lg hover:bg-slate-100"
        >
          {t(props.label)}
        </Menu.Item>
      )}
    </>
  );
};

export default UserMenuItem;
