import type { CheckList } from "../types";

/**
 * WebSQL utility functions for storing and retrieving checklist data.
 *
 * - Uses a single table `lists` with columns: `id` (unique) and `data` (serialized JSON).
 * - Only one row is used (id = 1) to store all checklists.
 */

const DB_NAME = "CheckLists";
const DB_VERSION = "1.0";
const DB_DISPLAY = "CheckLists DB";
const DB_SIZE = 2 * 1024 * 1024;

/**
 * Opens (or creates) the WebSQL database.
 * @returns {Database | null} The opened database instance, or null if not supported.
 */
export function openDB(): Database | null {
  if (window.openDatabase) {
    return window.openDatabase(DB_NAME, DB_VERSION, DB_DISPLAY, DB_SIZE);
  }
  return null;
}

/**
 * Loads the checklist array from WebSQL storage.
 * @returns {Promise<CheckList[] | null>} Resolves with the checklist array, or null if not found or on error.
 */
export function loadListsFromWebSQL(): Promise<CheckList[] | null> {
  return new Promise((resolve) => {
    const db = openDB();
    if (!db) return resolve(null);

    db.transaction((tx: SQLTransaction) => {
      // Ensure the table exists
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS lists (id unique, data TEXT)",
        [],
        undefined,
        () => {
          resolve(null);
          return false;
        }
      );

      // Retrieve the checklist data
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

/**
 * Saves the checklist array to WebSQL storage.
 * Overwrites any existing data.
 * @param {CheckList[]} lists - The checklist array to store.
 */
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