export const fileSizeCal = (size) => {
  if (size !== null) {
    size = Number(size);
    if (size > 1024 * 1024) {
      return Math.round(size / 1024 / 1024).toString() + " MB";
    } else {
      return Math.round(size / 1024).toString() + " KB";
    }
  }
};
