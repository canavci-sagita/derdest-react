import { useTranslation } from "@/stores/TranslationContext";
import type { NavigationHeader } from "@/types/navigation-menu.types";

export type NavigationDividerProps = {
  item: NavigationHeader;
};

const NavigationDivider: React.FC<NavigationDividerProps> = ({ item }) => {
  const { t } = useTranslation();
  return <li className="uppercase side-menu__divider">{t(item.title)}</li>;
};

export default NavigationDivider;
