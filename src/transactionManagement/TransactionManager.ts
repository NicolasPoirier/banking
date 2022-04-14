export interface TransactionManager {
  withTransaction<T>(runnable: () => Promise<T>): Promise<T>;
}
