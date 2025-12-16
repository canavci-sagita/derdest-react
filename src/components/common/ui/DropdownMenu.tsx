import { Dropdown, Popconfirm } from "antd";
import type { MenuProps } from "antd";
import AppIcon from "./AppIcon";
import type {
  DropdownMenuEntry,
  DropdownMenuItem,
} from "@/types/dropdown-menu.types";
import { twMerge } from "tailwind-merge";
import { useTranslation } from "@/stores/TranslationContext";
import { useEffect, useState } from "react";
import { getAuthenticatedUser } from "@/lib/session";
import { ROLE_CONSTANTS } from "@/lib/constants/role.constants";

type DropdownMenuProps = {
  items: DropdownMenuEntry[];
  children: React.ReactNode;
  trigger?: ("click" | "hover" | "contextMenu")[];
  overlayClassName?: string;
  placement?:
    | "bottom"
    | "bottomLeft"
    | "bottomRight"
    | "top"
    | "topLeft"
    | "topRight";
  onItemClick?: (item: DropdownMenuItem) => void;
};

const DropdownMenu: React.FC<DropdownMenuProps> = ({
  items,
  children,
  trigger = ["click"],
  overlayClassName,
  placement,
  onItemClick,
}) => {
  const { t } = useTranslation();

  const [role, setRole] = useState<string>(ROLE_CONSTANTS.USER);

  const antdItems: MenuProps["items"] = items.map((item, index) => {
    if (item.type === "divider") {
      return { type: "divider", key: `divider-${index}` };
    }

    if (item.roles && item.roles.indexOf(role) === -1) {
      return null;
    }

    const colorClass = item.variant
      ? `text-${item.variant}`
      : item.labelClassName
      ? item.labelClassName
      : "text-slate-700";

    const defaultItem = <p className={colorClass}>{item.label}</p>;
    const { popconfirm } = item;

    return {
      key: item.key,
      icon: (
        <AppIcon
          icon={item.icon}
          className={twMerge(["w-4 h-4", colorClass, item.iconClassName])}
        />
      ),
      extra: item.extra && (
        <AppIcon
          icon={item.extra}
          className="w-4 h-4 stroke-[1.5] text-slate-600"
        />
      ),
      label: popconfirm ? (
        <Popconfirm
          title={popconfirm?.title}
          description={popconfirm?.description}
          onConfirm={popconfirm?.onConfirm}
          okText={t("yes")}
          cancelText={t("no")}
          okButtonProps={{ danger: true }}
        >
          {defaultItem}
        </Popconfirm>
      ) : (
        defaultItem
      ),
      children:
        item.children &&
        item.children.map((c) => ({
          icon: c.icon && (
            <AppIcon
              icon={c.icon}
              className="w-4 h-4 stroke-[1.5] text-slate-800"
            />
          ),
          key: c.key,
          label: c.label,
        })),
    };
  });

  const handleMenuClick: MenuProps["onClick"] = (menuInfo) => {
    const clickedItem = items.find(
      (item): item is DropdownMenuItem =>
        item.type === "item" && item.key === menuInfo.key
    );

    if (clickedItem && onItemClick) {
      onItemClick(clickedItem);
    }
  };

  const menuProps: MenuProps = {
    items: antdItems,
    onClick: handleMenuClick,
  };

  useEffect(() => {
    getAuthenticatedUser().then((res) => {
      if (res && res.role) {
        setRole(res.role);
      }
    });
  }, []);
  return (
    <Dropdown
      menu={menuProps}
      trigger={trigger}
      overlayClassName={overlayClassName}
      placement={placement || "bottomLeft"}
    >
      {children}
    </Dropdown>
  );
};

export default DropdownMenu;
