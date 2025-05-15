/**
 * Extends the Window interface to include the WebSQL openDatabase method.
 */
interface Window {
  /**
   * Opens (or creates) a WebSQL database.
   * @param name Name of the database.
   * @param version Version of the database.
   * @param displayName Display name for the database.
   * @param estimatedSize Estimated size in bytes.
   * @returns A Database instance.
   */
  openDatabase?: (
    name: string,
    version: string,
    displayName: string,
    estimatedSize: number
  ) => Database;
}

/**
 * Represents a WebSQL database.
 */
interface Database {
  /**
   * Executes a transaction on the database.
   * @param callback Function that receives the transaction object.
   * @param errorCallback (Optional) Called if an error occurs.
   * @param successCallback (Optional) Called when the transaction succeeds.
   */
  transaction(
    callback: (tx: SQLTransaction) => void,
    errorCallback?: (err: any) => void,
    successCallback?: () => void
  ): void;
}

/**
 * Represents a SQL transaction in WebSQL.
 */
interface SQLTransaction {
  /**
   * Executes a SQL statement within the transaction.
   * @param sqlStatement The SQL query to execute.
   * @param args (Optional) Arguments for the SQL query.
   * @param callback (Optional) Called with the result set.
   * @param errorCallback (Optional) Called if an error occurs.
   */
  executeSql(
    sqlStatement: string,
    args?: any[],
    callback?: (tx: SQLTransaction, result: SQLResultSet) => void,
    errorCallback?: (tx: SQLTransaction, error: any) => boolean | void
  ): void;
}

/**
 * Represents the result set of a SQL query in WebSQL.
 */
interface SQLResultSet {
  rows: {
    /** Number of rows returned by the query */
    length: number;
    /**
     * Returns the row at the specified index.
     * @param index Index of the row.
     */
    item(index: number): any;
  };
}