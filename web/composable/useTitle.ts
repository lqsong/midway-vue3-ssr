/**
 * 设置 html Title  composables
 * @author LiQingSong
 */
import { ComputedRef, onMounted, watch } from 'vue';
import { RouteMeta } from 'vue-router';
import { siteTitle } from '@/config/settings';

export default function useTitle(meta: ComputedRef<RouteMeta>): void {
  const setTitle = (title: string): void => {
    document.title = `${title} - ${siteTitle}`;
  };

  watch<RouteMeta, false>(meta, () => {
    setTitle(meta.value.title || '');
  });

  onMounted(() => {
    setTitle(meta.value.title || '');
  });
}
