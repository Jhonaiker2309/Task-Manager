import '@testing-library/jest-dom/vitest';
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

class MockDatabase {
  private store: Record<number, string> = {};

  transaction(callback: (tx: any) => void) {
    const tx = {
      executeSql: (sql: string, args: any[], success?: (tx: any, results: any) => void) => {
        if (sql.startsWith('INSERT')) {
          this.store[args[0]] = args[1];
          success?.(null, {
            rows: {
              length: 1,
              item: (index: number) => ({ data: args[1] })
            }
          });
        }
        if (sql.startsWith('SELECT')) {
          success?.(null, {
            rows: {
              length: 1,
              item: (index: number) => ({ data: this.store[1] || '[]' })
            }
          });
        }
      }
    };
    callback(tx);
  }
}

// @ts-ignore
window.openDatabase = () => new MockDatabase();

afterEach(() => {
  cleanup();
  localStorage.clear();
});