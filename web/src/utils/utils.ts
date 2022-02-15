export const removeArrayDuplicates = <T, U extends keyof T>(
  B: T[],
  A: T[],
  key: U
): T[] => {
  const ids = new Set(A.map((d) => d[key]));
  return [...B.filter((d) => !ids.has(d[key])), ...A];
};

const isNumeric = (value: unknown): value is number => {
  return typeof value === 'number';
};

const isString = (value: unknown): value is string => {
  return typeof value === 'string';
};

export const sortByKey = <T, U extends keyof T>(
  A: T[],
  key: U,
  order: 'ASC' | 'DESC' = 'ASC'
): T[] => {
  const sorting = order === 'ASC' ? 1 : -1;
  return A.sort((a1: any, a2: any) => {
    if (!a1) return 1;
    if (!a1[key]) return 1;
    if (!a2) return -1;
    if (!a2[key]) return 1;
    if (isNumeric(a1[key]) && isNumeric(a2[key])) {
      return a1[key] - a2[key] * sorting;
    }
    if (isString(a1[key]) && isString(a2[key])) {
      return (
        a1[key].toLowerCase().localeCompare(a2[key].toLowerCase()) * sorting
      );
    }
    return 0;
  });
};
