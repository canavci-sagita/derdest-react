import SettingsTab from "@/components/settings/SettingsTab";

const SettingsLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="col-span-12">
      <div className="mt-3.5 grid grid-cols-12 gap-x-6 gap-y-10">
        <div className="relative col-span-12 xl:col-span-3">
          <SettingsTab />
        </div>
        <div className="col-span-12 flex flex-col gap-y-7 xl:col-span-9">
          <div className="flex flex-col p-5 pt-0">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default SettingsLayout;
