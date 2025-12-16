import { Segmented } from "antd";
import { useCaseView } from "@/stores/CaseViewContext";
import { AppstoreOutlined, BarsOutlined } from "@ant-design/icons";

type ViewMode = "list" | "table";

const CaseViewSwitcher: React.FC = () => {
  const { viewMode, setViewMode } = useCaseView();

  return (
    <Segmented<ViewMode>
      value={viewMode}
      onChange={(value) => setViewMode(value)}
      options={[
        { value: "list", icon: <AppstoreOutlined /> },
        { value: "table", icon: <BarsOutlined /> },
      ]}
    />
  );
};

export default CaseViewSwitcher;
