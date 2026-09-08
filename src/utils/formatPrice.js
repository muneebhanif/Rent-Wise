export const formatPrice = (value) => {
  const amount = Number(value) || 0;
  if (amount >= 1000000) return `${(amount / 1000000).toFixed(amount % 1000000 ? 1 : 0).replace(/\.0$/, "")}m`;
  if (amount >= 1000) return `${(amount / 1000).toFixed(amount % 1000 ? 1 : 0).replace(/\.0$/, "")}k`;
  return amount.toLocaleString();
};
