import { useState, useMemo } from "react";

export function usePagination<T>(
  items: T[],
  itemsPerPage: number,
  initialPage = 1
) {
  const [currentPage, setCurrentPage] = useState(initialPage);

  const totalPages = useMemo(
    () => Math.ceil(items.length / itemsPerPage),
    [items.length, itemsPerPage]
  );

  const currentItems = useMemo(() => {
    const end = currentPage * itemsPerPage;
    const start = end - itemsPerPage;
    return items.slice(start, end);
  }, [items, currentPage, itemsPerPage]);

  const paginate = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return { currentPage, totalPages, currentItems, paginate };
}