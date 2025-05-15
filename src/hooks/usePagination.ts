/**
 * Custom hook for paginating an array of items.
 *
 * Features:
 * - Calculates total pages based on items and items per page.
 * - Returns the current page, total pages, current items, and a paginate function.
 * - Efficiently slices the items array for the current page.
 *
 * @template T - Type of the items in the array.
 * @param {T[]} items - The array of items to paginate.
 * @param {number} itemsPerPage - Number of items per page.
 * @param {number} [initialPage=1] - The initial page to display.
 * @returns {object} Pagination state and controls:
 *   - currentPage: The current page number.
 *   - totalPages: Total number of pages.
 *   - currentItems: Items for the current page.
 *   - paginate: Function to change the current page.
 */
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