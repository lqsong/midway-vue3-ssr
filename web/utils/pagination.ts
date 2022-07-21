export interface PaginationConfig {
  total: number; // 总数 （必填）
  currentPage: number; // 当前页码 （必填）
  pageSize?: number; // 每页显示多少条
  rollPage?: number; // 分页栏显示几个页码 请填写大于2的奇数
}

/**
 * 分页计算
 * @author LiQingSong
 */
export class Pagination {
  total: number;
  pageSize: number;
  totalPages: number;
  rollPage: number;

  currentPage = 1;
  prePage = 0;
  nextPage = 2;
  isPrePage = false;
  isNextPage = false;
  isFirstPage = false;
  isLastPage = false;

  step = 1;
  pagesStartPage = 1;
  pagesEndPage = 1;

  constructor(parameters: PaginationConfig) {
    // 总记录数
    this.total = parameters.total;

    // 每页显示条数
    this.pageSize = parameters.pageSize || 10;

    // 总页数(也是最后一页的页码)
    this.totalPages = Math.ceil(this.total / this.pageSize);

    // 分页栏显示几个页码
    this.rollPage = parameters.rollPage || 5;

    // 设置页码
    this.setPage(parameters.currentPage);
  }

  // 设置页码 当点击分页时调用
  setPage(currentPage: number) {
    // 当前页码
    this.currentPage =
      currentPage > this.totalPages
        ? this.totalPages
        : currentPage < 1
        ? 1
        : currentPage;

    // 上一页
    this.prePage = this.currentPage - 1;

    // 下一页
    this.nextPage = this.currentPage + 1;

    // 是否显示上一页
    this.isPrePage = this.prePage > 0;

    // 是否显示下一页
    this.isNextPage = !(this.nextPage > this.totalPages);

    // 是否显示第一页(<<)
    this.isFirstPage = this.currentPage !== 1;

    // 是否显示最后一页(>>)
    this.isLastPage = this.currentPage !== this.totalPages;
  }

  // 设置分页列表的开始分页-截止分页 - 可以单独调用直接在页面循环
  setPages() {
    // 设置步长
    this.step = Math.floor(this.rollPage / 2);

    // 分页列表 - 开始分页
    let startPoor = 0;
    this.pagesStartPage = this.currentPage - this.step;
    if (this.pagesStartPage < 1) {
      startPoor = 1 - this.pagesStartPage;
      this.pagesStartPage = 1;
    }

    // 分页列表 - 截止分页
    let endPoor = 0;
    this.pagesEndPage = this.currentPage + this.step;
    if (this.pagesEndPage > this.totalPages) {
      endPoor = this.pagesEndPage - this.totalPages;
      this.pagesEndPage = this.totalPages;
    }

    // 分页列表 - 开始分页 - 重置
    this.pagesStartPage = this.pagesStartPage - endPoor;
    this.pagesStartPage = this.pagesStartPage < 1 ? 1 : this.pagesStartPage;

    // 分页列表 - 截止分页 - 重置
    this.pagesEndPage = this.pagesEndPage + startPoor;
    this.pagesEndPage =
      this.pagesEndPage > this.totalPages ? this.totalPages : this.pagesEndPage;
  }

  // 获取分页列表数组
  getPages() {
    this.setPages();
    let index = this.pagesStartPage;
    const arr: number[] = [];
    for (index; index <= this.pagesEndPage; index++) {
      arr.push(index);
    }
    return arr;
  }
}
