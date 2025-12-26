"use client";

import React, { useEffect, useRef, useState } from "react";
import AppIcon from "@/components/common/ui/AppIcon";
import FormInput from "@/components/common/forms/FormInput";
import { useTranslation } from "@/stores/TranslationContext";
import { twMerge } from "tailwind-merge";
import { LookupResponse } from "@/services/common/LookupResponse";
import { getCategoryStyle, getColorClasses } from "./template-style.utils";
import { PetitionTypeLookupResponse } from "@/services/lookups/lookups.types";
import { Spin } from "antd";
import SimpleBar from "simplebar";

interface TemplatesSidebarProps {
  caseTypes: LookupResponse[];
  isLoadingCaseTypes: boolean;
  petitionTypes: PetitionTypeLookupResponse[];
  isLoadingPetitionTypes: boolean;
  selectedCaseTypeId: number | null;
  selectedPetitionTypeId: number | null;
  onSelectCaseType: (id: number) => void;
  onSelectPetitionType: (id: number) => void;
}

const TemplatesSidebar: React.FC<TemplatesSidebarProps> = ({
  caseTypes,
  isLoadingCaseTypes,
  petitionTypes,
  isLoadingPetitionTypes,
  selectedCaseTypeId,
  selectedPetitionTypeId,
  onSelectCaseType,
  onSelectPetitionType,
}) => {
  const { t } = useTranslation();

  const scrollableNodeRef = useRef<HTMLDivElement>(null);

  const [searchText, setSearchText] = useState("");

  const filteredCaseTypes = caseTypes.filter((c) =>
    c.label.toLowerCase().includes(searchText.toLowerCase())
  );

  useEffect(() => {
    let simpleBarInstance: SimpleBar | null = null;

    if (scrollableNodeRef.current) {
      simpleBarInstance = new SimpleBar(scrollableNodeRef.current);
    }

    return () => {
      simpleBarInstance = null;
    };
  }, []);

  return (
    <aside className="w-80 bg-white border-r border-slate-200 flex flex-col z-10 shadow-[4px_0_24px_rgba(0,0,0,0.02)] h-full md:min-h-[640px]">
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-theme-2 rounded-lg flex items-center justify-center text-white shadow-lg shadow-indigo-200">
            <AppIcon icon="FileArchive" className="w-5 h-5" />
          </div>
          <h1 className="font-bold text-lg tracking-tight text-slate-900">
            {t("petitionTemplates")}
          </h1>
        </div>
        <FormInput
          icon="Search"
          placeholder={t("searchCaseTypes")}
          className="w-full"
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>
      {isLoadingCaseTypes && (
        <div className="absolute inset-0 z-20 bg-white/60 backdrop-blur-[2px] flex items-center justify-center rounded-xl transition-all duration-300">
          <Spin size="large" />
        </div>
      )}
      {!isLoadingCaseTypes && (
        <div ref={scrollableNodeRef} className="flex-1 min-h-0">
          <div className="p-4 space-y-1">
            <p className="px-3 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 mt-2">
              {t("caseTypes")}
            </p>

            {filteredCaseTypes.map((c) => {
              const isExpanded = selectedCaseTypeId === c.value;
              const style = getCategoryStyle(c.value, c.label);

              return (
                <div
                  key={c.value}
                  className={twMerge(
                    "rounded-xl transition-all duration-200",
                    isExpanded
                      ? "bg-slate-50 border border-slate-100 overflow-hidden mb-2"
                      : "hover:bg-white border border-transparent"
                  )}
                >
                  <button
                    onClick={() => onSelectCaseType(c.value)}
                    className="w-full flex items-center justify-between p-3 text-left hover:bg-slate-100 transition-colors rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={twMerge(
                          "w-8 h-8 rounded-full flex items-center justify-center transition-transform",
                          getColorClasses(style.color, isExpanded),
                          !isExpanded && "group-hover:scale-110"
                        )}
                      >
                        <AppIcon icon={style.icon} className="w-4 h-4" />
                      </div>
                      <span
                        className={twMerge(
                          "font-semibold text-sm",
                          isExpanded ? "text-slate-800" : "text-slate-600"
                        )}
                      >
                        {c.label}
                      </span>
                    </div>
                    <AppIcon
                      icon={isExpanded ? "ChevronDown" : "ChevronRight"}
                      className="w-4 h-4 text-slate-400"
                    />
                  </button>

                  {isExpanded && (
                    <div className="bg-white border-t border-slate-100 py-2 animate-in slide-in-from-top-2 duration-200">
                      {isLoadingPetitionTypes ? (
                        <div className="flex justify-center py-4">
                          <Spin size="small" />
                        </div>
                      ) : petitionTypes.length > 0 ? (
                        petitionTypes.map((pt) => {
                          const isActive = selectedPetitionTypeId === pt.value;
                          return (
                            <button
                              key={pt.value}
                              onClick={() => onSelectPetitionType(pt.value)}
                              className={twMerge(
                                "w-full text-left px-4 py-2 pl-14 text-xs font-medium border-r-2 flex justify-between group transition-all",
                                isActive
                                  ? "text-indigo-700 bg-indigo-50/50 border-indigo-600"
                                  : "text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 border-transparent hover:border-indigo-600"
                              )}
                            >
                              {pt.label}
                              <span className="bg-slate-100 text-slate-500 group-hover:bg-indigo-100 group-hover:text-indigo-600 text-[10px] px-1.5 py-0.5 rounded-md transition-colors">
                                {pt.templateCount}
                              </span>
                            </button>
                          );
                        })
                      ) : (
                        <p className="px-4 py-2 pl-14 text-xs text-slate-400 italic">
                          {t("noPetitionTypesFound")}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </aside>
  );
};

export default TemplatesSidebar;
