import type { CheckList } from "../types";

const DB_NAME = "CheckLists";
const DB_VERSION = "1.0";
const DB_DISPLAY = "CheckLists DB";
const DB_SIZE = 2 * 1024 * 1024;

export function openDB(): Database | null {
  if (window.openDatabase) {
    return window.openDatabase(DB_NAME, DB_VERSION, DB_DISPLAY, DB_SIZE);
  }
  return null;
}

export function loadListsFromWebSQL(): Promise<CheckList[] | null> {
  return new Promise((resolve) => {
    const db = openDB();
    if (!db) return resolve(null);

    db.transaction((tx: SQLTransaction) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS lists (id unique, data TEXT)",
        [],
        undefined,
        () => {
          resolve(null);
          return false;
        }
      );

      tx.executeSql(
        "SELECT data FROM lists WHERE id = 1",
        [],
        (_tx, results: SQLResultSet) => {
          if (results.rows.length > 0) {
            try {
              const data = JSON.parse(results.rows.item(0).data);
              resolve(data);
            } catch {
              resolve(null);
            }
          } else {
            resolve(null);
          }
        },
        () => {
          resolve(null);
          return false;
        }
      );
    });
  });
}

export function saveListsToWebSQL(lists: CheckList[]): void {
  const db = openDB();
  if (!db) return;

  db.transaction((tx: SQLTransaction) => {
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS lists (id unique, data TEXT)",
      []
    );
    tx.executeSql("DELETE FROM lists", []);
    tx.executeSql(
      "INSERT INTO lists (id, data) VALUES (?, ?)",
      [1, JSON.stringify(lists)]
    );
  });
}