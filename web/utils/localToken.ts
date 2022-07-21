/**
 * 自定义 token 操作
 * @author LiQingSong
 */
import settings from '@/config/settings';

/**
 * 获取本地Token
 */
export const getToken = () => {
  return !import.meta.env.SSR
    ? localStorage.getItem(settings.siteTokenKey)
    : '';
};

/**
 * 设置存储本地Token
 */
export const setToken = (token: string) => {
  !import.meta.env.SSR && localStorage.setItem(settings.siteTokenKey, token);
};

/**
 * 移除本地Token
 */
export const removeToken = () => {
  !import.meta.env.SSR && localStorage.removeItem(settings.siteTokenKey);
};
