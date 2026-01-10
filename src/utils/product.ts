export const getSizeIndex = (size: string) => {
  const SIZE_ORDER = ["No Size", "Size S", "Size M", "Size L", "Size XL"];
  return SIZE_ORDER.indexOf(size);
};
