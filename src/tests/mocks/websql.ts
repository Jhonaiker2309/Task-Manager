import { vi } from 'vitest';
import type { CheckList } from '../../types';

const mockWebSQL = () => {
  let storedData: CheckList[] | null = null;

  const loadListsFromWebSQL = vi.fn(async () => {
    return storedData;
  });

  const saveListsToWebSQL = vi.fn((lists: CheckList[]) => {
    storedData = [...lists];
  });

  return {
    loadListsFromWebSQL,
    saveListsToWebSQL,
    _setMockData: (data: CheckList[] | null) => { storedData = data; }
  };
};

export const setupWebSQLMocks = () => {
  const mocks = mockWebSQL();
  
  vi.mock('../../utils/websql', () => ({
    loadListsFromWebSQL: mocks.loadListsFromWebSQL,
    saveListsToWebSQL: mocks.saveListsToWebSQL,
    openDB: vi.fn()
  }));

  return mocks;
};

export type WebSQLMocks = ReturnType<typeof mockWebSQL>;