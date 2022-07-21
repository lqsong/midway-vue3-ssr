import request from '@/utils/request';
import { TableListQueryParams } from './data.d';
export async function queryList(params?: TableListQueryParams): Promise<any> {
  return request({
    url: '/article/list',
    method: 'get',
    params,
  });
}
