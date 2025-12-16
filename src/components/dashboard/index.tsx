"use client";

import CalendarWidget from "./CalendarWidget";
import CaseTypesWidget from "./CaseTypesWidget";
import ClientsWidget from "./ClientsWidget";
import DocumentsWidget from "./DocumentsWidget";
import IncomingHearingsWidget from "./IncomingHearingsWidget";
import LatestCasesWidget from "./LatestCasesWidget";

const Dashboard: React.FC = () => {
  return (
    <div className="grid grid-cols-3 grid-rows-2 gap-3">
      <CalendarWidget />
      <CaseTypesWidget />
      <IncomingHearingsWidget />
      <LatestCasesWidget />
      <DocumentsWidget />
      <ClientsWidget />
    </div>
  );
};

export default Dashboard;
