export interface PaginationConfig {
  total: number;
  current: number;
  pageSize?: number;
}

export interface TableListQueryParams {
  current: number; // 当前页码
  pageSize?: number; // 每页多少条
  refresh?: string | number;
}

export interface Category {
  name: string;
  alias: string;
}

export interface TableListItem {
  id: number;
  title: string;
  description: string;
  addtime: string;
  category: Category;
  thumb: string[];
}

export interface ResponseDataType {
  list: TableListItem[];
  total: number;
  currentPage: number;
}
