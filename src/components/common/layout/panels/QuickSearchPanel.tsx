"use client";

import "@ant-design/v5-patch-for-react-19";
import { useState, useEffect, Fragment, FC } from "react";
import Image from "next/image";
import clsx from "clsx";
import {
  DialogPanel,
  Dialog as HeadlessDialog,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import AppIcon from "@/components/common/ui/AppIcon";
import DropdownMenu from "@/components/common/ui/DropdownMenu";
import { useLayoutPanels } from "@/stores/LayoutPanelsContext";
import imgDefaultUser from "@/assets/images/default-user.png";
import { quickSearchDropdownMenu } from "@/config/quick-search-menu.config";

const QuickSearchPanel: FC = () => {
  const { quickSearchPanel, setQuickSearchPanel } = useLayoutPanels();
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    const handleKeyDown = (evt: KeyboardEvent) => {
      if (evt.key === "Escape") {
        setQuickSearchPanel(false);
      } else if ((evt.ctrlKey || evt.metaKey) && evt.key === "k") {
        evt.preventDefault();
        setQuickSearchPanel(true);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [setQuickSearchPanel]);

  return (
    <Transition appear show={quickSearchPanel} as={Fragment}>
      <HeadlessDialog
        as="div"
        className="relative z-[60]"
        onClose={() => setQuickSearchPanel(false)}
      >
        <TransitionChild
          as={Fragment}
          enter="ease-in-out duration-50"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gradient-to-b from-theme-1/50 via-theme-2/50 to-black/50 backdrop-blur-sm" />
        </TransitionChild>
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex justify-center my-2 sm:mt-40">
            <TransitionChild
              as={Fragment}
              enter="ease-in-out duration-50"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in-out duration-100"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="sm:w-[600px] lg:w-[700px] w-[95%] relative mx-auto transition-transform">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center justify-center w-12">
                    <AppIcon
                      icon="Search"
                      className="w-5 h-5 -mr-1.5 text-slate-500 stroke-[1]"
                    />
                  </div>
                  <input
                    type="text"
                    className={clsx([
                      "disabled:bg-slate-100 disabled:cursor-not-allowed dark:disabled:bg-darkmode-700/50 [&[readonly]]:bg-slate-100 [&[readonly]]:cursor-not-allowed [&[readonly]]:dark:bg-darkmode-700/50 transition duration-200 ease-in-out w-full border-slate-300/60 placeholder:text-slate-400/90 focus:ring-primary focus:ring-opacity-20 focus:border-primary focus:border-opacity-40 dark:bg-darkmode-700 dark:focus:ring-slate-700 dark:focus:ring-opacity-50 dark:placeholder:text-slate-500/80",
                      "pl-12 pr-14 py-3.5 text-base rounded-lg focus:ring-0 border-0 shadow-lg",
                    ])}
                    placeholder="Quick search..."
                    value={searchText}
                    onChange={(e) => {
                      setSearchText(e.target.value);
                    }}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center w-14">
                    <div className="px-2 py-1 mr-auto text-xs border rounded-[0.4rem] bg-slate-100 text-slate-500/80 dark:bg-darkmode-500">
                      ESC
                    </div>
                  </div>
                </div>
                <div className="z-[101] relative pb-1 mt-1 bg-white rounded-lg shadow-lg max-h-[468px] sm:max-h-[615px] overflow-y-auto dark:bg-darkmode-800">
                  <div className="px-5 py-4">
                    <div className="flex items-center">
                      <div className="text-xs uppercase text-slate-500">
                        Start your search here...
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3.5">
                      <a className="cursor-pointer flex items-center gap-x-1.5 border rounded-full px-3 py-0.5 border-slate-300/70 hover:bg-slate-50 dark:hover:bg-darkmode-500">
                        <AppIcon
                          icon="UsersRound"
                          className="w-4 h-4 stroke-[1.3]"
                        />
                        Users
                      </a>
                      <a className="cursor-pointer flex items-center gap-x-1.5 border rounded-full px-3 py-0.5 border-slate-300/70 hover:bg-slate-50 dark:hover:bg-darkmode-500">
                        <AppIcon
                          icon="BriefcaseBusiness"
                          className="w-4 h-4 stroke-[1.3]"
                        />
                        Cases
                      </a>
                      <a className="cursor-pointer flex items-center gap-x-1.5 border rounded-full px-3 py-0.5 border-slate-300/70 hover:bg-slate-50 dark:hover:bg-darkmode-500">
                        <AppIcon
                          icon="UsersRound"
                          className="w-4 h-4 stroke-[1.3]"
                        />
                        Clients
                      </a>
                      <a className=" cursor-pointer flex items-center gap-x-1.5 border rounded-full px-3 py-0.5 border-slate-300/70 hover:bg-slate-50 dark:hover:bg-darkmode-500">
                        <AppIcon
                          icon="SquareChartGantt"
                          className="w-4 h-4 stroke-[1.3]"
                        />
                        Reports
                      </a>
                      <DropdownMenu
                        trigger={["hover"]}
                        items={quickSearchDropdownMenu}
                      >
                        <a className="cursor-pointer flex items-center gap-x-1.5 border rounded-full px-3 py-0.5 border-slate-300/70 hover:bg-slate-50 dark:hover:bg-darkmode-500">
                          More
                          <AppIcon
                            icon="ChevronDown"
                            className="w-4 h-4 stroke-[1.3] -ml-0.5"
                          />
                        </a>
                      </DropdownMenu>
                    </div>
                  </div>
                  <div className="flex flex-col items-center justify-center py-10">
                    <AppIcon
                      icon="SearchX"
                      className="w-20 h-20 text-theme-1/20 fill-theme-1/5 stroke-[0.5]"
                    />
                    <div className="mt-5 text-xl font-medium">
                      No results found
                    </div>
                    <div className="w-2/3 mt-3 leading-relaxed text-center text-slate-500">
                      No results found for{" "}
                      <span className="italic font-medium">
                        {`"${searchText}"`}
                      </span>
                      . Please try a different search term or check your
                      spelling.
                    </div>
                  </div>
                  <div className="px-5 py-4 border-t border-dashed">
                    <div className="flex items-center">
                      <div className="text-xs uppercase text-slate-500">
                        Users
                      </div>
                      <a className="ml-auto text-xs text-slate-500" href="">
                        See All
                      </a>
                    </div>
                    <div className="flex flex-col gap-1 mt-3.5">
                      <a
                        href=""
                        className="flex items-center gap-2.5 hover:bg-slate-50/80 border border-transparent hover:border-slate-100 p-1 rounded-md dark:border-transparent dark:hover:bg-darkmode-500"
                      >
                        <div className="w-6 h-6 overflow-hidden border-2 rounded-full image-fit zoom-in border-slate-200/70 box">
                          <Image src={imgDefaultUser} alt="User Image" />
                        </div>
                        <div className="font-medium truncate">
                          Cate Blanchett
                        </div>
                        <div className="hidden text-slate-500 sm:block">
                          Houston, USA
                        </div>
                      </a>
                    </div>
                  </div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </HeadlessDialog>
    </Transition>
  );
};

export default QuickSearchPanel;
