"use client";

import { useEffect, useState } from "react";
import { App, Modal, Tabs } from "antd";
import type { TabsProps } from "antd";
import { useTranslation } from "@/stores/TranslationContext";
import { scanDocumentAction } from "@/actions/cases.actions";
import { ScanDocumentResponse } from "@/services/cases/cases.types";
import AppIcon from "@/components/common/ui/AppIcon";
import PartiesResult from "./PartiesResult";
import EvidencesResult from "./EvidencesResult";
import TimelinesResult from "./TimelinesResult";
import Button from "@/components/common/ui/Button";
import ActivitiesResult from "./ActivitiesResult";
import LoadingIcon from "@/components/common/ui/LoadingIcon";

interface ScanResultModalProps {
  isOpen: boolean;
  caseId: number;
  documentId: number | null;
  documentName: string;
  onClose: () => void;
}

const ScanResultModal: React.FC<ScanResultModalProps> = ({
  isOpen,
  caseId,
  documentId,
  documentName,
  onClose,
}) => {
  const { t } = useTranslation();
  const { message } = App.useApp();
  const [scanResult, setScanResult] = useState<ScanDocumentResponse | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && documentId) {
      setIsLoading(true);
      setScanResult(null);
      scanDocumentAction(caseId, documentId).then((response) => {
        if (response.isSuccess && response.result) {
          setScanResult(response.result);
        } else {
          message.error(response.messages);
        }
        setIsLoading(false);
      });
    }
  }, [isOpen, caseId, documentId, message]);

  const tabItems: TabsProps["items"] = scanResult
    ? [
        {
          key: "timelines",
          label: t("timelines"),
          children: <TimelinesResult data={scanResult.timelines} />,
        },
        {
          key: "evidences",
          label: t("evidences"),
          children: <EvidencesResult data={scanResult.evidences} />,
        },
        {
          key: "parties",
          label: t("parties"),
          children: <PartiesResult data={scanResult.parties} />,
        },
        {
          key: "calendar",
          label: t("calendar"),
          children: <ActivitiesResult data={scanResult.activities} />,
        },
      ]
    : [];

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <AppIcon icon="ScanSearch" className="w-5 h-5 text-primary" />
          <span>{t("scanResultsFor", { fileName: documentName })}</span>
        </div>
      }
      open={isOpen}
      width={1000}
      closable={false}
      footer={
        isLoading ? null : (
          <div className="flex justify-end">
            <Button localizedLabel="close" onClick={onClose} />
          </div>
        )
      }
      destroyOnHidden
    >
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <LoadingIcon icon="rings" color="rgb(var(--color-theme-2))" />
          <p className="ml-2 font-semibold text-theme-1">
            {t("scanningDocument")}
          </p>
        </div>
      ) : scanResult ? (
        <Tabs defaultActiveKey="timelines" items={tabItems} />
      ) : null}
    </Modal>
  );
};

export default ScanResultModal;
