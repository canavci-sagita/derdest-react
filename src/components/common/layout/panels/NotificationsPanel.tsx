import AppIcon from "@/components/common/ui/AppIcon";
import Button from "@/components/common/ui/Button";
import { Drawer } from "antd";
import { useEffect, useState } from "react";
import Image from "next/image";

import imgDefaultUser from "@/assets/images/default-user.png";
import { useLayoutPanels } from "@/stores/LayoutPanelsContext";

const DEFAULT_DRAWER_WIDTH = 460;

const NotificationsPanel = () => {
  const [drawerWidth, setDrawerWidth] = useState(DEFAULT_DRAWER_WIDTH);
  const { notificationsPanel, setNotificationsPanel } = useLayoutPanels();

  useEffect(() => {
    const changeDrawerWidth = () => {
      if (window.innerWidth <= 640) {
        setDrawerWidth(288);
      } else {
        setDrawerWidth(DEFAULT_DRAWER_WIDTH);
      }
    };

    changeDrawerWidth();

    window.onresize = () => {
      changeDrawerWidth();
    };
  });

  return (
    <Drawer
      maskClassName="fixed inset-0 !bg-transparent !bg-gradient-to-b !from-theme-1/50 !via-theme-2/50 !to-black/50 backdrop-blur-sm"
      open={notificationsPanel}
      title="Notifications"
      closable={false}
      onClose={() => setNotificationsPanel(false)}
      className="rounded-[0.75rem_0_0_0.75rem/1.1rem_0_0_1.1rem]"
      width={drawerWidth}
      extra={
        <Button variant="outline-secondary" className="hidden sm:flex">
          <AppIcon icon="ShieldCheck" className="w-4 h-4 mr-2" /> Mark all as
          read
        </Button>
      }
    >
      <a
        className="cursor-pointer focus:outline-none hover:bg-white/10 hover:text-white bg-white/5 transition-all hover:rotate-180 absolute inset-y-0 left-0 right-auto flex items-center justify-center my-auto -ml-[60px] sm:-ml-[105px] border rounded-full text-white/90 w-8 h-8 sm:w-14 sm:h-14 border-white/90 hover:scale-105 dark:bg-darkmode-800/40 dark:border-darkmode-800/20"
        onClick={(e) => {
          e.preventDefault();
          setNotificationsPanel(false);
        }}
      >
        <AppIcon className="w-8 h-8 stroke-[1]" icon="X" />
      </a>
      <div className="flex flex-col items-center justify-center py-10">
        <AppIcon
          icon="BellOff"
          className="w-20 h-20 text-theme-1/20 fill-theme-1/5 stroke-[0.5]"
        />
        <div className="mt-5 text-xl font-medium">No notifications</div>
      </div>
      <a className="cursor-pointer flex items-center px-3 py-2.5 rounded-xl hover:bg-slate-100/80 dark:hover:bg-darkmode-400">
        <div>
          <div className="overflow-hidden border-2 rounded-full w-11 h-11 image-fit border-slate-200/70">
            <Image src={imgDefaultUser} alt="User Image" />
          </div>
        </div>
        <div className="sm:ml-5">
          <div className="font-medium">Uploaded presentations</div>
          <div className="text-slate-500 mt-0.5">
            Added slides for the team meeting
          </div>
          <div className="mt-1.5 text-xs text-slate-500">18 February 2021</div>
        </div>
        <div className="flex-none w-2 h-2 ml-auto border rounded-full bg-primary/40 border-primary/40"></div>
      </a>
      <hr className="my-1" />
      <a className="cursor-pointer flex items-center px-3 py-2.5 rounded-xl hover:bg-slate-100/80 dark:hover:bg-darkmode-400">
        <div>
          <div className="overflow-hidden border-2 rounded-full w-11 h-11 image-fit border-slate-200/70">
            <Image src={imgDefaultUser} alt="User Image" />
          </div>
        </div>
        <div className="sm:ml-5">
          <div className="font-medium">Posted a status update</div>
          <div className="text-slate-500 mt-0.5">
            Shared thoughts on the project
          </div>
          <div className="mt-1.5 text-xs text-slate-500">19 December 2021</div>
        </div>
        <div className="flex-none w-2 h-2 ml-auto border rounded-full bg-primary/40 border-primary/40"></div>
      </a>
    </Drawer>
  );
};

export default NotificationsPanel;
