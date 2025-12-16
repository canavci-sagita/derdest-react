import Dialog from "@/components/common/headless/Dialog";
import { useLayoutPanels } from "@/stores/LayoutPanelsContext";

const SwitchAccountPanel = () => {
  const { switchAccountPanel, setSwitchAccountPanel } = useLayoutPanels();

  return (
    <Dialog
      open={switchAccountPanel}
      onClose={() => {
        setSwitchAccountPanel(false);
      }}
    >
      <Dialog.Panel>
        <Dialog.Title className="justify-center h-14">
          <h2 className="text-base font-medium">Switch Account</h2>
        </Dialog.Title>
        <Dialog.Description className="px-2.5 pt-3.5 pb-4">
          <div className="flex flex-col gap-1.5">
            {/* <FormCheck.Label
              htmlFor={"switch-account-" + 1}
              className="flex items-center px-2.5 py-1 rounded-lg hover:bg-slate-100 cursor-pointer dark:hover:bg-darkmode-400"
              key={1}
            >
              <div className="overflow-hidden rounded-full w-11 h-11 image-fit border-[3px] border-slate-200/70">
                <Image
                  alt="User Image"
                  src={imgDefaultUser}
                  width={38}
                  height={38}
                />
              </div>
              <div className="ml-3.5">
                <div className="font-medium">{"Law Firm 1"}</div>
                <div className="text-xs text-slate-500 mt-0.5">{"Role 1"}</div>
              </div>
              <div className="relative ml-auto w-7 h-7">
                <FormCheck.Input
                  id={"switch-account-" + 1}
                  type="checkbox"
                  value="switch-account"
                  checked={switchAccount === 1}
                  onChange={() => {
                    setSwitchAccount(1);
                  }}
                  className="absolute z-10 w-full h-full opacity-0 peer"
                />
                <div className="absolute inset-0 flex items-center justify-center w-6 h-6 m-auto text-white transition-all border rounded-full opacity-0 bg-theme-1/80 border-theme-1 peer-checked:opacity-100">
                  <AppIcon icon="Check" className="stroke-[1.5] w-3 h-3" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center w-6 h-6 m-auto transition-all border rounded-full text-primary border-theme-1/20 bg-theme-1/5 peer-checked:opacity-0 peer-hover:bg-theme-1/10"></div>
              </div>
            </FormCheck.Label>
            <hr className="border-dashed" />
            <FormCheck.Label
              htmlFor={"switch-account-" + 2}
              className="flex items-center px-2.5 py-1 rounded-lg hover:bg-slate-100 cursor-pointer dark:hover:bg-darkmode-400"
              key={2}
            >
              <div className="overflow-hidden rounded-full w-11 h-11 image-fit border-[3px] border-slate-200/70">
                <Image
                  alt="User Image"
                  src={imgDefaultUser}
                  width={38}
                  height={38}
                />
              </div>
              <div className="ml-3.5">
                <div className="font-medium">{"Law Firm 2"}</div>
                <div className="text-xs text-slate-500 mt-0.5">{"Role 2"}</div>
              </div>
              <div className="relative ml-auto w-7 h-7">
                <FormCheck.Input
                  id={"switch-account-" + 2}
                  type="checkbox"
                  value="switch-account"
                  checked={switchAccount === 2}
                  onChange={() => {
                    setSwitchAccount(2);
                  }}
                  className="absolute z-10 w-full h-full opacity-0 peer"
                />
                <div className="absolute inset-0 flex items-center justify-center w-6 h-6 m-auto text-white transition-all border rounded-full opacity-0 bg-theme-1/80 border-theme-1 peer-checked:opacity-100">
                  <AppIcon icon="Check" className="stroke-[1.5] w-3 h-3" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center w-6 h-6 m-auto transition-all border rounded-full text-primary border-theme-1/20 bg-theme-1/5 peer-checked:opacity-0 peer-hover:bg-theme-1/10"></div>
              </div>
            </FormCheck.Label> */}
          </div>
        </Dialog.Description>
        <Dialog.Footer className="flex items-center justify-center text-center h-14">
          <a href="" className="block -mt-1 text-primary">
            Login into an Existing Account
          </a>
        </Dialog.Footer>
      </Dialog.Panel>
    </Dialog>
  );
};

export default SwitchAccountPanel;
