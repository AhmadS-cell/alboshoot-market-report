export const PAGE_SIZE = 8;
export function paginate(items, requestedPage = 1, pageSize = PAGE_SIZE) {
  const pageCount = Math.max(1, Math.ceil(items.length / pageSize));
  const page = Math.min(pageCount, Math.max(1, Number.isInteger(requestedPage) ? requestedPage : 1));
  return {items:items.slice((page - 1) * pageSize, page * pageSize), page, pageCount, total:items.length};
}
