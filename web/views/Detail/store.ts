/**
 * Detail store
 * @author LiQingSong
 */
import { defineStore } from 'pinia';
import { IResponseData } from '@/@types/utils.request';
import { Article } from './data.d';
import { queryDetail } from './service';

export interface IDetailState {
  loading: boolean;
  article: Article;
}

export const useDetailStore = defineStore('detail', {
  state(): IDetailState {
    return {
      loading: false,
      article: {},
    };
  },
  actions: {
    async getDetail(uid: string) {
      try {
        this.loading = true;
        const response: IResponseData<Article> = await queryDetail(uid);
        const data = response.data || {};
        if (data) {
          this.article = data;
        }
        this.loading = false;
      } catch (error: any) {
        console.log('error useDetailStore getDetail', error);
      }
    },
  },
});
