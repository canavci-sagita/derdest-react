import {
  getRoleOrAssignmentsAction,
  getUserProfileSummaryAction,
} from "@/actions/users.actions";
import {
  RoleAssignmentDto,
  UserProfileSummaryDto,
} from "@/services/users/users.types";
import { useTranslation } from "@/stores/TranslationContext";
import { App, Spin } from "antd";
import { useEffect, useState } from "react";
import AppIcon from "../common/ui/AppIcon";
import { ACCOUNT_TYPE_CONSTANTS } from "@/lib/constants/account-type.constants";
import { formatDate } from "@/lib/utils/date.utils";

type UserProfileSummaryProps = {
  appUserId: number;
};
const UserProfileSummary: React.FC<UserProfileSummaryProps> = ({
  appUserId,
}) => {
  const { t, currentLang } = useTranslation();
  const { message } = App.useApp();

  const [isLoadingSettings, setIsLoadingSettings] = useState(false);
  const [isLoadingRoles, setIsLoadingRoles] = useState(false);
  const [profileSummary, setProfileSummary] = useState<UserProfileSummaryDto>();
  const [roleAssignments, setRoleAssignments] = useState<RoleAssignmentDto>();

  useEffect(() => {
    setIsLoadingSettings(true);
    getUserProfileSummaryAction(appUserId).then((response) => {
      setIsLoadingSettings(false);
      if (response.isSuccess) {
        setProfileSummary(response.result!);
      } else {
        message.error(response.messages);
      }
    });

    setIsLoadingRoles(true);
    getRoleOrAssignmentsAction(appUserId).then((response) => {
      setIsLoadingRoles(false);
      if (response.isSuccess) {
        setRoleAssignments(response.result!);
      } else {
        message.error(response.messages);
      }
    });
  }, [appUserId, message]);

  return (
    <div className="p-6 bg-slate-50 border-t border-slate-200">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
          <h4 className="flex items-center gap-2 text-sm font-semibold text-slate-900 mb-3 border-b border-slate-200 pb-3">
            <AppIcon
              icon="User"
              className="w-5 h-5 text-slate-500 stroke-[1.5]"
            />
            {t("profileDetails")}
          </h4>
          {isLoadingSettings ? (
            <div className="min-h-[68px] flex align-center justify-center">
              <Spin size="default" className="self-center" />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-6">
              <div>
                <dl className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <dt className="text-slate-500">{t("language")}</dt>
                    <dd>
                      <span className="py-0.5 px-2 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {profileSummary?.language}
                      </span>
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-slate-500">
                      {t("jurisdictionCountry")}
                    </dt>
                    <dd>
                      <span className="py-0.5 px-2 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                        {profileSummary?.jurisdictionCountry}
                      </span>
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-slate-500">{t("petitionLanguage")}</dt>
                    <dd>
                      <span className="py-0.5 px-2 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {profileSummary?.petitionLanguage}
                      </span>
                    </dd>
                  </div>
                </dl>
              </div>
              <div className="border-l border-slate-200 pl-6">
                <address className="text-xs not-italic text-slate-700 space-y-1 leading-snug">
                  {profileSummary?.address1 && (
                    <p className="font-medium">{profileSummary.address1}</p>
                  )}
                  {profileSummary?.address2 && <p>{profileSummary.address2}</p>}
                  {profileSummary?.address3 && <p>{profileSummary.address3}</p>}
                </address>
              </div>
            </div>
          )}
        </div>
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
          <h4 className="flex items-center gap-2 text-sm font-semibold text-slate-900 mb-3 border-b border-slate-200 pb-3">
            <AppIcon
              icon="Users"
              className="w-5 h-5 text-slate-500 stroke-[1.5]"
            />
            {t("roleOrAssignments")}
          </h4>
          {isLoadingRoles ? (
            <div className="min-h-[68px] flex align-center justify-center">
              <Spin size="default" className="self-center" />
            </div>
          ) : (
            <div className="space-y-3">
              <div className="text-xs flex justify-between">
                <dt className="text-slate-500">{t("accountType")}</dt>
                <dd>
                  <span className="py-0.5 px-2 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                    {roleAssignments?.assignments
                      ? t(ACCOUNT_TYPE_CONSTANTS.LAW_FIRM_USER)
                      : t(ACCOUNT_TYPE_CONSTANTS.SINGLE_USER)}
                  </span>
                </dd>
              </div>
              {roleAssignments?.role && (
                <div className="text-xs flex justify-between">
                  <dt className="text-slate-500">{t("role")}</dt>
                  <dd>
                    <span className="py-0.5 px-2 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {t(roleAssignments.role)}
                    </span>
                  </dd>
                </div>
              )}
              {roleAssignments?.assignments && (
                <ul className="space-y-2">
                  {roleAssignments.assignments.map((a, i) => (
                    <li key={i} className="border-b border-slate-100 pb-1">
                      <p className="font-semibold text-sm text-slate-800">
                        {" "}
                        {a.title}
                      </p>
                      <div className="grid grid-cols-3">
                        <div className="text-xs font-medium text-slate-500">
                          {t(a.role)}
                        </div>
                        <div className="text-xs font-medium text-slate-500">
                          {formatDate(currentLang, a.startDate, false, false)}
                        </div>
                        <div className="text-xs font-medium text-slate-500">
                          {formatDate(currentLang, a.endDate, false, false)}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              <ul className="space-y-2"></ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfileSummary;
