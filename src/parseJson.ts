export const parseJson = <T>(data: string): T | undefined => {
  try {
    const parsed = JSON.parse(data);
    return parsed;
  } catch (error) {}
  return undefined;
};
