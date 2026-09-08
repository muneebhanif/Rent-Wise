export const chatMediaUrl = (url) => {
  if (!url) return undefined;
  return /^https?:\/\//i.test(url)
    ? url
    : `${import.meta.env.VITE_BACK_END_URL}${url.startsWith("/") ? "" : "/"}${url}`;
};
