import request from '@/utils/request';
export async function queryDetail(id: string): Promise<any> {
  return request({
    url: '/article/detail',
    method: 'get',
    params: {
      id,
    },
  });
}
