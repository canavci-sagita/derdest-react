import { useEffect, useState } from "react";
import { App, Spin } from "antd";
import { useMutation } from "@tanstack/react-query";
import AppIcon from "@/components/common/ui/AppIcon";
import ContractFileItem from "./ContractFileItem";
import { useTranslation } from "@/stores/TranslationContext";
import {
  deleteContractFileAction,
  getAllContractFilesAction,
} from "@/actions/clients.actions";
import { ContractFileDto } from "@/services/clients/clients.types";
import { FileStatus } from "@/services/common/enums";
import { LookupResponse } from "@/services/common/LookupResponse";
import { useContractTypes } from "@/lib/hooks/tanstack/useContractTypes";

interface ContractFilesSectionProps {
  clientId?: number | null;
  initEmpty: boolean;
}

const ContractFilesSection: React.FC<ContractFilesSectionProps> = ({
  clientId,
  initEmpty,
}) => {
  const { t } = useTranslation();
  const { message } = App.useApp();

  const [displayedContracts, setDisplayedContracts] = useState<
    ContractFileDto[]
  >([]);
  const [isLoadingExisting, setIsLoadingExisting] = useState(false);

  const { data: emptyContracts, isLoading: isLoadingEmpty } = useContractTypes({
    enabled: !!initEmpty,
    select: (response: LookupResponse[]) => {
      if (!response) return [];
      return response.map((r) => ({
        description: r.label,
        contractTypeId: r.value,
        createdOn: null,
        fileName: null,
        fileSize: 0,
        fileType: null,
        status: FileStatus.NotUploaded,
        summary: null,
        verificationResult: null,
      }));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: ({ clientId, typeId }: { clientId: number; typeId: number }) =>
      deleteContractFileAction(clientId, typeId),
    onSuccess: (response, variables) => {
      if (response.isSuccess) {
        message.success(response.messages);
        setDisplayedContracts((prev) =>
          prev.map((p) =>
            p.contractTypeId == variables.typeId
              ? {
                  contractTypeId: variables.typeId,
                  description: p.description,
                  fileName: null,
                  fileSize: 0,
                  fileType: null,
                  status: FileStatus.NotUploaded,
                  summary: null,
                  verificationResult: null,
                }
              : p
          )
        );
      } else {
        message.error(response.messages);
      }
    },
  });

  const handleDeleteFile = (contractFile: ContractFileDto) => {
    if (clientId) {
      deleteMutation.mutate({
        clientId,
        typeId: contractFile.contractTypeId,
      });
    }
  };

  useEffect(() => {
    if (initEmpty && emptyContracts) {
      setDisplayedContracts(emptyContracts);
    }
  }, [emptyContracts, initEmpty]);

  useEffect(() => {
    if (clientId && !initEmpty) {
      setIsLoadingExisting(true);
      getAllContractFilesAction(clientId).then((response) => {
        setIsLoadingExisting(false);
        if (response && response.result) {
          setDisplayedContracts(response.result);
        }
      });
    }
  }, [clientId, initEmpty]);

  const isLoading = isLoadingEmpty || isLoadingExisting;

  return (
    <aside className="lg:col-span-2 space-y-10 sticky top-[6rem] h-fit">
      <section className="relative p-6 bg-white border border-slate-200 rounded-lg shadow-sm before:content-[''] before:absolute before:w-full before:h-full before:bg-white before:rounded-lg before:border before:border-slate-200 before:shadow-sm before:inset-0 before:transform before:-translate-y-2 before:rotate-[-1.5deg] before:z-[-1]">
        <h2 className="text-md font-semibold border-b border-slate-200">
          {t("contracts")}
        </h2>
        <div className="relative p-2 min-h-[34.5rem] flex items-center justify-center">
          {isLoading ? (
            <Spin size="large" />
          ) : (
            <>
              {initEmpty && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-4 text-center bg-white/50 backdrop-blur-sm rounded-md">
                  <AppIcon
                    icon="FileLock2"
                    className="h-12 w-12 text-theme-1 stroke-1"
                  />
                  <h3 className="mt-2 text-sm font-bold text-theme-1">
                    {t("contractsAvailableAfterCreation.title")}
                  </h3>
                  <p className="mt-1 text-sm">
                    {t("contractsAvailableAfterCreation.text")}
                  </p>
                </div>
              )}
              <div className="w-full space-y-4">
                {displayedContracts.map((contractFile) => {
                  return (
                    <ContractFileItem
                      key={contractFile.contractTypeId}
                      clientId={clientId}
                      description={contractFile.description}
                      contractFile={contractFile}
                      onDelete={handleDeleteFile}
                    />
                  );
                })}
              </div>
            </>
          )}
        </div>
      </section>
    </aside>
  );
};

export default ContractFilesSection;
