import { useSidebarMenu } from "@/stores/SidebarMenuContext";
import clsx from "clsx";
import AppIcon from "@/components/common/ui/AppIcon";
import Cookies from "js-cookie";
import { COOKIE_CONSTANTS } from "@/lib/constants/cookie.constants";

const LeftSideBar = ({ children }: { children: React.ReactNode }) => {
  const {
    compactMenu,
    setCompactMenu,
    setCompactMenuOnHover,
    activeMobileMenu,
    setActiveMobileMenu,
  } = useSidebarMenu();

  const toggleCompactMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    setCompactMenu(!compactMenu);
    Cookies.set(COOKIE_CONSTANTS.COMPACT_MENU, String(!compactMenu), {
      expires: 365,
    });
  };

  return (
    <>
      <div
        className={clsx([
          "fixed ml-[275px] w-10 h-10 items-center justify-center xl:hidden z-50",
          { flex: activeMobileMenu },
          { hidden: !activeMobileMenu },
        ])}
      >
        <a
          onClick={(event) => {
            event.preventDefault();
            setActiveMobileMenu(false);
          }}
          className="cursor-pointer mt-5 ml-5"
        >
          <AppIcon icon="X" className="w-8 h-8 text-white" />
        </a>
      </div>
      <div
        className={clsx([
          "h-full box border-transparent rounded-none xl:rounded-xl bg-gradient-to-b from-theme-1 to-theme-2 z-20 relative w-[275px] duration-300 transition-[width] group-[.side-menu--collapsed]:xl:w-[91px] group-[.side-menu--collapsed.side-menu--on-hover]:xl:shadow-[6px_0_12px_-4px_#0000000f] group-[.side-menu--collapsed.side-menu--on-hover]:xl:w-[275px] overflow-hidden flex flex-col",
          "after:content-[''] after:absolute after:inset-0 after:-mr-4 after:bg-texture-white after:bg-contain after:bg-fixed after:bg-[center_-20rem] after:bg-no-repeat",
        ])}
        onMouseOver={(event) => {
          event.preventDefault();
          setCompactMenuOnHover(true);
        }}
        onMouseLeave={(event) => {
          event.preventDefault();
          setCompactMenuOnHover(false);
        }}
      >
        <div
          className={clsx([
            "flex-none hidden xl:flex items-center z-10 px-5 h-[65px] xl:w-[275px] overflow-hidden relative duration-300 group-[.side-menu--collapsed]:xl:w-[91px] group-[.side-menu--collapsed.side-menu--on-hover]:xl:w-[275px]",
            "before:content-[''] before:absolute before:right-0 before:border-r before:border-dashed before:border-white/[0.15] before:h-4/6 before:group-[.side-menu--collapsed.side-menu--on-hover]:xl:hidden",
          ])}
        >
          <a className="cursor-pointer flex items-center transition-[margin] duration-300 group-[.side-menu--collapsed]:xl:ml-4 group-[.side-menu--collapsed.side-menu--on-hover]:xl:ml-0">
            <div className="transition-transform ease-in-out group-[.side-menu--collapsed.side-menu--on-hover]:xl:-rotate-180">
              <div className="w-[18px] h-[18px] relative -rotate-45 [&_div]:bg-white">
                <div className="absolute w-[21%] left-0 inset-y-0 my-auto rounded-full opacity-50 h-[75%]"></div>
                <div className="absolute w-[21%] inset-0 m-auto h-[120%] rounded-full"></div>
                <div className="absolute w-[21%] right-0 inset-y-0 my-auto rounded-full opacity-50 h-[75%]"></div>
              </div>
            </div>
            <div className="ml-3.5 group-[.side-menu--collapsed.side-menu--on-hover]:xl:opacity-100 group-[.side-menu--collapsed]:xl:opacity-0 transition-opacity font-medium text-white">
              DERDEST
            </div>
          </a>
          <a
            className="cursor-pointer group-[.side-menu--collapsed.side-menu--on-hover]:xl:opacity-100 group-[.side-menu--collapsed]:xl:rotate-180 group-[.side-menu--collapsed]:xl:opacity-0 transition-[opacity,transform] hidden 3xl:flex items-center justify-center w-[20px] h-[20px] ml-auto border rounded-full border-white/40 text-white hover:bg-white/5"
            onClick={toggleCompactMenu}
          >
            <AppIcon icon="ArrowLeft" className="w-3.5 h-3.5 stroke-[1.3]" />
          </a>
        </div>
        {children}
      </div>
    </>
  );
};

export default LeftSideBar;
