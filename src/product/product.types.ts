export interface ISearchParams {
  page: number;
  cat_id: number;
  limit: number;
  [key: string]: number | string;
}
