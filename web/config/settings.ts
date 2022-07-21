/**
 * 站点配置
 * @author LiQingSong
 */
export interface SettingsType {
  /**
   * 站点名称
   */
  siteTitle: string;

  /**
   * 站点本地存储Token 的 Key值
   */
  siteTokenKey: string;

  /**
   * Ajax请求头发送Token 的 Key值
   */
  ajaxHeadersTokenKey: string;

  /**
   * Ajax返回值不参加统一验证的api地址
   */
  ajaxResponseNoVerifyUrl: string[];
}

const settings: SettingsType = {
  siteTitle: 'MIDWAY-VUE3-SSR',

  siteTokenKey: 'midway_vue3_ssr_token',
  ajaxHeadersTokenKey: 'x-token',
  ajaxResponseNoVerifyUrl: [
    '/user/login', // 用户登录
  ],
};

export default settings;
