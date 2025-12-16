import { twMerge } from "tailwind-merge";
import {
  Description as HeadlessDialogDescription,
  Dialog as HeadlessDialog,
  DialogTitle as HeadlessDialogTitle,
  DialogPanel as HeadlessDialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { Fragment, createContext, useContext, useRef, useState } from "react";

type Size = "sm" | "md" | "lg" | "xl";

const dialogContext = createContext<{
  open: boolean;
  zoom: boolean;
  size: Size;
}>({
  open: false,
  zoom: false,
  size: "md",
});

function Dialog({
  children,
  className,
  as = "div",
  open = false,
  onClose,
  staticBackdrop,
  size = "md",
  ...props
}: ExtractProps<typeof HeadlessDialog> & {
  size?: Size;
  staticBackdrop?: boolean;
}) {
  const focusElement = useRef<HTMLElement | null>(null);
  const [zoom, setZoom] = useState(false);

  return (
    <dialogContext.Provider value={{ open, zoom, size }}>
      <Transition appear as={Fragment} show={open}>
        <HeadlessDialog
          as={as}
          onClose={(value) => {
            if (!staticBackdrop) {
              return onClose(value);
            } else {
              setZoom(true);
              setTimeout(() => setZoom(false), 300);
            }
          }}
          initialFocus={focusElement}
          className={twMerge(["relative z-[60]", className])}
          {...props}
        >
          {children}
        </HeadlessDialog>
      </Transition>
    </dialogContext.Provider>
  );
}

// --- Panel ---
const DialogPanel: React.FC<
  ExtractProps<typeof HeadlessDialogPanel> & { size?: Size }
> = ({ children, className, as = "div", ...props }) => {
  const dialog = useContext(dialogContext);

  return (
    <>
      <TransitionChild
        as="div"
        enter="ease-in-out duration-500"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in-out duration-[400ms]"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        className="fixed inset-0 bg-gradient-to-b from-theme-1/50 via-theme-2/50 to-black/50 backdrop-blur-sm"
        aria-hidden="true"
      />
      <TransitionChild
        as="div"
        enter="ease-in-out duration-500"
        enterFrom="opacity-0 -mt-16"
        enterTo="opacity-100 mt-0 pt-16"
        leave="ease-in-out duration-[400ms]"
        leaveFrom="opacity-100 pt-16"
        leaveTo="opacity-0 -mt-16 pt-0"
        className="fixed inset-0 py-16 overflow-y-auto"
      >
        <HeadlessDialogPanel
          as={as}
          className={twMerge([
            "w-[90%] mx-auto bg-white relative rounded-lg shadow-md transition-transform dark:bg-darkmode-600",
            dialog.size === "md" && "sm:w-[460px]",
            dialog.size === "sm" && "sm:w-[300px]",
            dialog.size === "lg" && "sm:w-[600px]",
            dialog.size === "xl" && "sm:w-[600px] lg:w-[900px]",
            dialog.zoom && "scale-105",
            className,
          ])}
          {...props}
        >
          {children}
        </HeadlessDialogPanel>
      </TransitionChild>
    </>
  );
};
DialogPanel.displayName = "Dialog.Panel";
Dialog.Panel = DialogPanel;

// --- Title ---
const DialogTitle: React.FC<ExtractProps<typeof HeadlessDialogTitle>> = ({
  children,
  className,
  as = "div",
  ...props
}) => {
  return (
    <HeadlessDialogTitle
      as={as}
      className={twMerge([
        "flex items-center px-5 py-3 border-b border-slate-200/60 dark:border-darkmode-400",
        className,
      ])}
      {...props}
    >
      {children}
    </HeadlessDialogTitle>
  );
};
DialogTitle.displayName = "Dialog.Title";
Dialog.Title = DialogTitle;

// --- Description ---
const DialogDescription: React.FC<
  ExtractProps<typeof HeadlessDialogDescription>
> = ({ children, className, as = "div", ...props }) => {
  return (
    <HeadlessDialogDescription
      as={as}
      className={twMerge(["p-5", className])}
      {...props}
    >
      {children}
    </HeadlessDialogDescription>
  );
};
DialogDescription.displayName = "Dialog.Description";
Dialog.Description = DialogDescription;

// --- Footer ---
const DialogFooter = <C extends React.ElementType = "div">({
  children,
  className,
  as,
  ...props
}: {
  as?: C;
} & React.PropsWithChildren &
  React.ComponentPropsWithoutRef<C>) => {
  const Component = as || "div";

  return (
    <Component
      className={twMerge([
        "px-5 py-3 text-right border-t border-slate-200/60 dark:border-darkmode-400",
        className,
      ])}
      {...props}
    >
      {children}
    </Component>
  );
};
DialogFooter.displayName = "Dialog.Footer";
Dialog.Footer = DialogFooter;

export default Dialog;
