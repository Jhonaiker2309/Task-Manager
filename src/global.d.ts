interface Window {
  openDatabase?: (
    name: string,
    version: string,
    displayName: string,
    estimatedSize: number
  ) => Database;
}

interface Database {
  transaction(
    callback: (tx: SQLTransaction) => void,
    errorCallback?: (err: any) => void,
    successCallback?: () => void
  ): void;
}

interface SQLTransaction {
  executeSql(
    sqlStatement: string,
    args?: any[],
    callback?: (tx: SQLTransaction, result: SQLResultSet) => void,
    errorCallback?: (tx: SQLTransaction, error: any) => boolean | void
  ): void;
}

interface SQLResultSet {
  rows: {
    length: number;
    item(index: number): any;
  };
}