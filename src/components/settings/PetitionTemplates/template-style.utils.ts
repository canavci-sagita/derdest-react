import { icons } from "lucide-react";

const PALETTE = [
  "indigo",
  "emerald",
  "amber",
  "rose",
  "blue",
  "violet",
  "cyan",
  "orange",
];

// ID-based mapping for consistent styling across languages
// NOTE: Ensure these IDs match your actual CaseType IDs in the database
const STATIC_STYLES: Record<
  number,
  { icon: keyof typeof icons; color: string }
> = {
  // 1: Ceza Davaları (Criminal) -> Siren (Rose)
  1: { icon: "Siren", color: "rose" },

  // 2: Hukuk Davaları (Civil) -> Scale (Indigo)
  2: { icon: "Scale", color: "indigo" },

  // 3: İdari Davalar (Administrative) -> Landmark (Slate)
  3: { icon: "Landmark", color: "slate" },

  // 4: Ticaret Davaları (Commercial) -> Briefcase (Blue)
  4: { icon: "Briefcase", color: "blue" },

  // 5: İş Davaları (Labor) -> HardHat (Orange)
  5: { icon: "HardHat", color: "orange" },

  // 6: Aile Davaları (Family) -> HeartHandshake (Pink)
  6: { icon: "HeartHandshake", color: "pink" },

  // 7: Miras Davaları (Inheritance) -> Scroll (Amber)
  7: { icon: "Scroll", color: "amber" },

  // 8: Vergi Davaları (Tax) -> Receipt (Emerald)
  8: { icon: "Receipt", color: "emerald" },

  // 9: İcra ve İflas Davaları (Enforcement) -> Hammer (Red)
  9: { icon: "Hammer", color: "red" },
};

export const getCategoryStyle = (id: number, _label?: string) => {
  if (STATIC_STYLES[id]) {
    return STATIC_STYLES[id];
  }

  const colorIndex = id % PALETTE.length;

  return {
    icon: "Folder" as keyof typeof icons,
    color: PALETTE[colorIndex],
  };
};

export const getColorClasses = (color: string, isExpanded: boolean) => {
  const map: Record<string, string> = {
    indigo: "bg-indigo-100 text-indigo-600",
    emerald: "bg-emerald-100 text-emerald-600",
    amber: "bg-amber-100 text-amber-600",
    rose: "bg-rose-100 text-rose-600",
    blue: "bg-blue-100 text-blue-600",
    violet: "bg-violet-100 text-violet-600",
    cyan: "bg-cyan-100 text-cyan-600",
    orange: "bg-orange-100 text-orange-600",
    pink: "bg-pink-100 text-pink-600",
    slate: "bg-slate-100 text-slate-600",
    red: "bg-red-100 text-red-600",
  };

  return map[color] || map.indigo;
};
