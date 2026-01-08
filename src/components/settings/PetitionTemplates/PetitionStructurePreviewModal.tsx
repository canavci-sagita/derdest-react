"use client";

import React from "react";
import {
  Modal,
  Tabs,
  Spin,
  Descriptions,
  Tag,
  Timeline,
  Progress,
  Tooltip,
} from "antd";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "@/stores/TranslationContext";
import AppIcon from "@/components/common/ui/AppIcon";
import { getPetitionTemplateAction } from "@/actions/users.actions";
import {
  PetitionTemplateStructure,
  TextAlignment,
} from "@/services/users/users.types";
import { twMerge } from "tailwind-merge";

interface PetitionStructurePreviewModalProps {
  isOpen: boolean;
  templateId: number | null;
  onClose: () => void;
}

const PetitionStructurePreviewModal: React.FC<
  PetitionStructurePreviewModalProps
> = ({ isOpen, templateId, onClose }) => {
  const { t } = useTranslation();

  const { data: structure, isLoading } =
    useQuery<PetitionTemplateStructure | null>({
      queryKey: ["petition-template-detail", templateId],
      queryFn: async () => {
        if (!templateId) return null;
        const response = await getPetitionTemplateAction(templateId);
        if (response.isSuccess) {
          return response.result as PetitionTemplateStructure;
        }
        return null;
      },
      enabled: !!templateId && isOpen,
    });

  const StyleTab = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
      <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
        <h4 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
          <AppIcon icon="PenTool" className="w-4 h-4 text-indigo-500" />
          {t("writingStyle")}
        </h4>
        <div className="space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-200/60 last:border-0 last:pb-0">
            <span className="text-xs text-slate-500 font-medium">
              {t("tone")}
            </span>
            <Tag
              color="blue"
              className="capitalize m-0 border-0 font-semibold px-3"
            >
              {t(structure?.writing.tone || "")}
            </Tag>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-slate-200/60 last:border-0 last:pb-0">
            <span className="text-xs text-slate-500 font-medium">
              {t("complexity")}
            </span>
            <Tag
              color="orange"
              className="capitalize m-0 border-0 font-semibold px-3"
            >
              {t(structure?.writing.complexity || "")}
            </Tag>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-slate-200/60 last:border-0 last:pb-0">
            <span className="text-xs text-slate-500 font-medium">
              {t("demandStyle")}
            </span>
            <Tag
              color="purple"
              className="capitalize m-0 border-0 font-semibold px-3"
            >
              {t(structure?.writing.demandStyle || "")}
            </Tag>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-slate-200/60 last:border-0 last:pb-0">
            <span className="text-xs text-slate-500 font-medium">
              {t("perspective")}
            </span>
            <span className="text-xs font-semibold text-slate-700 capitalize">
              {t(structure?.writing.perspective || "")}
            </span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-slate-200/60 last:border-0 last:pb-0">
            <span className="text-xs text-slate-500 font-medium">
              {t("narrativeFlow")}
            </span>
            <span className="text-xs font-semibold text-slate-700 capitalize">
              {t(structure?.writing.narrativeFlow || "")}
            </span>
          </div>
        </div>
      </div>
      <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
        <h4 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
          <AppIcon icon="Type" className="w-4 h-4 text-emerald-500" />
          {t("formatting")}
        </h4>
        <div className="space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-200/60 last:border-0 last:pb-0">
            <span className="text-xs text-slate-500 font-medium">
              {t("font")}
            </span>
            <span className="text-xs font-semibold text-slate-700">
              {structure?.formatting.fontFamily}
            </span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-slate-200/60 last:border-0 last:pb-0">
            <span className="text-xs text-slate-500 font-medium">
              {t("fontSize")}
            </span>
            <span className="text-xs font-semibold text-slate-700">
              {structure?.formatting.baseFontSize} pt
            </span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-slate-200/60 last:border-0 last:pb-0">
            <span className="text-xs text-slate-500 font-medium">
              {t("lineSpacing")}
            </span>
            <span className="text-xs font-semibold text-slate-700">
              {structure?.formatting.lineSpacing}
            </span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-slate-200/60 last:border-0 last:pb-0">
            <span className="text-xs text-slate-500 font-medium">
              {t("alignment")}
            </span>
            <span className="text-xs font-semibold text-slate-700 capitalize">
              {t(
                TextAlignment[
                  structure?.formatting.alignment || TextAlignment.left
                ]
              )}
            </span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-slate-200/60 last:border-0 last:pb-0">
            <span className="text-xs text-slate-500 font-medium">
              {t("margins")} (cm)
            </span>
            <span className="text-[10px] font-mono text-slate-600 bg-slate-200 px-2 py-0.5 rounded">
              {t("alignment_t")}:{structure?.formatting.pageMargins.top} |{" "}
              {t("alignment_b")}:{structure?.formatting.pageMargins.bottom} |{" "}
              {t("alignment_l")}:{structure?.formatting.pageMargins.left} |{" "}
              {t("alignment_r")}:{structure?.formatting.pageMargins.right}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const LayoutTab = () => (
    <div className="space-y-4 pt-2">
      <div className="border border-slate-200 rounded-xl p-6 bg-slate-50/50 flex flex-col gap-4 items-center">
        <div
          className={twMerge([
            "w-full p-3 border-2 border-dashed border-indigo-200 rounded-lg bg-indigo-50 flex flex-col justify-center",
            structure?.layout.header.alignment === TextAlignment.center
              ? "items-center"
              : structure?.layout.header.alignment === TextAlignment.right
              ? "items-end"
              : "items-start",
          ])}
        >
          <span
            className={twMerge([
              "text-xs text-indigo-600",
              structure?.layout.header.isBold ? "font-bold" : "font-medium",
            ])}
          >
            {t("headerArea")} ({t("sampleText")})
          </span>
          <div className="mt-1 flex gap-2">
            <Tag className="m-0 text-[10px] border-0 bg-white/50 text-indigo-500 capitalize">
              {t(
                TextAlignment[
                  structure?.layout.header.alignment || TextAlignment.left
                ]
              )}
            </Tag>
            {structure?.layout.header.isBold && (
              <Tag className="m-0 text-[10px] border-0 bg-white/50 text-indigo-500">
                {t("bold")}
              </Tag>
            )}
          </div>
        </div>
        <div className="w-full flex flex-col gap-1">
          <div
            className={twMerge([
              "w-full p-2 border border-slate-200 rounded bg-white flex items-center gap-2",
              structure?.layout.subjectLine.indentation && "pl-8",
            ])}
          >
            <span
              className={twMerge([
                "text-xs text-slate-700",
                structure?.layout.subjectLine.isBold && "font-bold",
              ])}
            >
              {structure?.layout.subjectLine.prefix} ...
            </span>
            <Tag className="m-0 text-[10px] border-slate-100 bg-slate-50 text-slate-400">
              {t("subjectLine")}
            </Tag>
          </div>
          <div className="flex gap-2 justify-end px-1">
            <span className="text-[10px] text-slate-400">
              {structure?.layout.subjectLine.indentation
                ? t("indented")
                : t("noIndent")}
            </span>
          </div>
        </div>
        <div className="w-full p-3 border border-slate-200 rounded-lg bg-white">
          <div
            className={twMerge([
              "flex flex-col gap-2",
              structure?.layout.partiesBlock.alignment === TextAlignment.center
                ? "items-center"
                : "items-start",
            ])}
          >
            <div className="flex items-center gap-2 w-full">
              <div
                className="h-2 bg-slate-200 rounded"
                style={{
                  width: `${structure?.layout.partiesBlock.labelWidth}cm`,
                }}
              ></div>
              <div className="h-2 w-32 bg-slate-100 rounded"></div>
            </div>
            <div className="flex items-center gap-2 w-full">
              <div
                className="h-2 bg-slate-200 rounded"
                style={{
                  width: `${structure?.layout.partiesBlock.labelWidth}cm`,
                }}
              ></div>
              <div className="h-2 w-24 bg-slate-100 rounded"></div>
            </div>
          </div>
          <p className="text-[10px] text-slate-400 mt-2 text-center">
            {t("partiesBlock")} ({t("labelWidth")}:
            {structure?.layout.partiesBlock.labelWidth}cm)
          </p>
        </div>
      </div>
    </div>
  );

  const SectionsTab = () => (
    <div className="pt-2 px-2 h-[450px] flex flex-col">
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <h4 className="text-sm font-bold text-slate-700">
          {t("documentStructure")}
        </h4>
        <div className="flex gap-3">
          <Tag
            className="flex items-center"
            color={structure?.sections.hasFootnotes ? "success" : "default"}
          >
            <AppIcon
              icon={structure?.sections.hasFootnotes ? "Check" : "X"}
              className="w-3 h-3 mr-1"
            />
            {t("footnotes")}
          </Tag>
        </div>
      </div>

      <div className="bg-slate-50 rounded-xl p-6 border border-slate-100 overflow-y-auto flex-grow custom-scrollbar">
        <Timeline
          className="mt-2"
          items={structure?.sections.sections.map((section, index) => ({
            children: (
              <div className="flex flex-col gap-1 -mt-1 pb-4">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-slate-700">
                    {section.displayName || t(section.key)}
                  </span>
                  {section.isMandatory ? (
                    <Tag
                      color="red"
                      className="text-[10px] m-0 leading-tight py-0.5"
                    >
                      {t("required")}
                    </Tag>
                  ) : (
                    <Tag className="text-[10px] m-0 leading-tight py-0.5 text-slate-400">
                      {t("optional")}
                    </Tag>
                  )}
                  {section.isRepeatable && (
                    <Tooltip title="This section can appear multiple times">
                      <Tag
                        color="purple"
                        className="text-[10px] m-0 leading-tight py-0.5 cursor-help"
                      >
                        {t("repeatable")}
                      </Tag>
                    </Tooltip>
                  )}
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span className="bg-white px-2 py-0.5 rounded border border-slate-200 text-[10px] uppercase tracking-wider">
                    {t(section.contentType)}
                  </span>
                  {section.detectedFromSample && (
                    <div className="flex items-center gap-1">
                      <span className="text-[10px]">
                        {t("confidenceScore")}:
                      </span>
                      <div className="w-16">
                        <Progress
                          percent={section.confidenceScore * 100}
                          size="small"
                          showInfo={false}
                          strokeColor={
                            section.confidenceScore * 100 > 80
                              ? "#52c41a"
                              : "#faad14"
                          }
                        />
                      </div>
                      <span className="text-[10px] font-mono">
                        {section.confidenceScore * 100}%
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ),
            color: index === 0 ? "green" : "blue",
          }))}
        />
      </div>
    </div>
  );

  const ReportTab = () => {
    const ReportSection = ({
      title,
      color,
      children,
    }: {
      title: string;
      color: string;
      children: React.ReactNode;
    }) => (
      <div className="bg-slate-50 rounded-xl border border-slate-100 p-4">
        <h5
          className={twMerge([
            "text-xs font-bold uppercase tracking-wide mb-3",
            color,
          ])}
        >
          {title}
        </h5>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
          {children}
        </div>
      </div>
    );

    const ReportItem = ({
      label,
      value,
    }: {
      label: string;
      value: React.ReactNode;
      fullWidth?: boolean;
    }) => (
      <div className="flex flex-col">
        <span className="text-[0.60rem] uppercase text-slate-400 font-semibold tracking-wider mb-0.5">
          {label}
        </span>
        <span className="text-xs text-slate-700 font-medium">{value}</span>
      </div>
    );

    return (
      <div className="text-xs pt-2 space-y-4 h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        <ReportSection title={t("formattingDetails")} color="text-indigo-700">
          <ReportItem
            label={t("font")}
            value={structure?.formatting.fontFamily}
          />
          <ReportItem
            label={t("fontSize")}
            value={`${structure?.formatting.baseFontSize} pt`}
          />
          <ReportItem
            label={t("lineSpacing")}
            value={structure?.formatting.lineSpacing}
          />
          <ReportItem
            label={t("indentation")}
            value={`${structure?.formatting.paragraphIndentation} cm`}
          />
          <ReportItem
            label={t("alignment")}
            value={
              <span className="capitalize">
                {structure?.formatting.alignment}
              </span>
            }
          />
          <ReportItem
            label={t("margins")}
            fullWidth
            value={
              <div className="flex gap-4 text-xs font-mono bg-white border border-slate-200 rounded px-2 py-1 w-fit">
                <span>
                  {t("alignment_t")}: {structure?.formatting.pageMargins.top}
                </span>
                <span>
                  {t("alignment_b")}: {structure?.formatting.pageMargins.bottom}
                </span>
                <span>
                  {t("alignment_l")}: {structure?.formatting.pageMargins.left}
                </span>
                <span>
                  {t("alignment_r")}: {structure?.formatting.pageMargins.right}
                </span>
              </div>
            }
          />
        </ReportSection>

        <ReportSection title={t("layoutStructure")} color="text-indigo-700">
          <ReportItem
            label={t("headerAlign")}
            value={t(
              TextAlignment[
                structure?.layout.header.alignment || TextAlignment.left
              ]
            )}
          />
          <ReportItem
            label={t("headerStyle")}
            value={structure?.layout.header.isBold ? t("bold") : t("normal")}
          />
          <ReportItem
            label={t("subjectPrefix")}
            value={structure?.layout.subjectLine.prefix}
          />
          <ReportItem
            label={t("partiesAlign")}
            value={t(
              TextAlignment[
                structure?.layout.partiesBlock.alignment || TextAlignment.left
              ]
            )}
          />
        </ReportSection>

        <ReportSection title={t("toneAndStyle")} color="text-indigo-700">
          <ReportItem
            label={t("tone")}
            value={t(structure?.writing.tone || "")}
          />
          <ReportItem
            label={t("complexity")}
            value={t(structure?.writing.complexity || "")}
          />
          <ReportItem
            label={t("demandStyle")}
            value={t(structure?.writing.demandStyle || "")}
          />
          <ReportItem
            label={t("perspective")}
            value={t(structure?.writing.perspective || "")}
          />
        </ReportSection>

        <div className="p-3 bg-blue-50 text-blue-700 text-xs rounded-lg flex items-start gap-2 border border-blue-100">
          <AppIcon icon="Info" className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <p>
            {t("aiAnalysisDisclaimer") ||
              "This analysis was generated by AI based on the visual layout and text content of your uploaded template."}
          </p>
        </div>
      </div>
    );
  };

  const items = [
    {
      key: "1",
      label: (
        <div className="flex items-center space-x-2">
          <AppIcon icon="PenTool" className="w-4 h-4" />
          <span>{t("styleAndTone")}</span>
        </div>
      ),
      children: <StyleTab />,
    },
    {
      key: "2",
      label: (
        <div className="flex items-center space-x-2">
          <AppIcon icon="LayoutTemplate" className="w-4 h-4" />
          <span>{t("layout")}</span>
        </div>
      ),
      children: <LayoutTab />,
    },
    {
      key: "3",
      label: (
        <div className="flex items-center space-x-2">
          <AppIcon icon="List" className="w-4 h-4" />
          <span>{t("sections")}</span>
        </div>
      ),
      children: <SectionsTab />,
    },
    {
      key: "4",
      label: (
        <div className="flex items-center space-x-2">
          <AppIcon icon="FileText" className="w-4 h-4" />
          <span>{t("report")}</span>
        </div>
      ),
      children: <ReportTab />,
    },
  ];

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-50 rounded-lg">
            <AppIcon icon="ScanEye" className="w-5 h-5 text-indigo-600" />
          </div>
          <span className="font-bold text-slate-800">
            {t("templateAnalysisResult")}
          </span>
        </div>
      }
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={750}
      centered
      destroyOnHidden
      className="[&_.ant-modal-content]:rounded-2xl [&_.ant-modal-header]:border-b [&_.ant-modal-header]:pb-4 [&_.ant-modal-body]:pt-4"
    >
      {isLoading ? (
        <div className="flex flex-col justify-center items-center h-64 gap-4">
          <Spin size="large" />
          <p className="text-sm font-medium text-slate-500 animate-pulse">
            {t("analyzingTemplate")}...
          </p>
        </div>
      ) : structure ? (
        <Tabs defaultActiveKey="1" items={items} />
      ) : (
        <div className="p-12 text-center text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
          <AppIcon icon="FileX" className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="font-medium">{t("noStructureDataFound")}</p>
        </div>
      )}
    </Modal>
  );
};

export default PetitionStructurePreviewModal;
