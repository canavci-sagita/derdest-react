import set from "set-value";

/**
 * Converts a nested object into a flat object with dot notation keys.
 * e.g., { address: { city: "..." } } => { "address.city": "..." }
 */
export const flattenObject = (
  obj: unknown,
  prefix = ""
): Record<string, unknown> => {
  if (typeof obj !== "object" || obj === null) return {};

  return Object.keys(obj).reduce<Record<string, unknown>>((acc, key) => {
    const value = (obj as Record<string, unknown>)[key];
    const pre = prefix ? `${prefix}.` : "";

    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      Object.assign(acc, flattenObject(value, pre + key));
    } else {
      acc[pre + key] = value;
    }

    return acc;
  }, {});
};

export const unflattenObject = (
  obj: Record<string, unknown>
): Record<string, unknown> => {
  const result: Record<string, unknown> = {};

  Object.entries(obj).forEach(([key, value]) => {
    if (key.includes(".")) {
      set(result, key, value);
    } else {
      result[key] = value;
    }
  });

  // Deep clone to remove prototype refs from set-value
  return JSON.parse(JSON.stringify(result)) as Record<string, unknown>;
};
