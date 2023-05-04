export const useGetTablePage = <T>(page: number, contentList?: T[]) => {
  const PAGE_SIZE = 10;
  const from = contentList ? (page - 1) * PAGE_SIZE : 0;
  const to = contentList?.length ? from + PAGE_SIZE : 0;
  const records = contentList ? contentList.slice(from, to) : [];
  return { records, PAGE_SIZE };
};
