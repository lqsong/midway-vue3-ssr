/**
 * LocalApi Demo store
 * @author LiQingSong
 */
import { defineStore } from 'pinia';
import { IResponseData } from '@/@types/utils.request';
import { User } from './data.d';
import { queryUser } from './service';

export interface IUserState {
  loading: boolean;
  user: User;
}

export const useUserStore = defineStore('user', {
  state(): IUserState {
    return {
      loading: false,
      user: {},
    };
  },
  actions: {
    async getUser(uid: string) {
      try {
        this.loading = true;
        const response: IResponseData<User> = await queryUser(uid);
        const data = response.data || {};
        if (data) {
          this.user = data;
        }
        this.loading = false;
      } catch (error: any) {
        console.log('error useUserStore getUser', error);
      }
    },
  },
});
