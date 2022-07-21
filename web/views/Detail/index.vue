<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useDetailStore } from "./store";
import { Article } from "./data.d";
export default defineComponent({
  async asyncData({store, route}) {
    const query = route.query || {};
    const id = query.id?.toString() || '';
    const detailStore = useDetailStore(store);
    await detailStore.getDetail(id);
  },
  seo({store}) {
   const detailStore = useDetailStore(store);
   return {
      title: detailStore.article.title + '-详情测试',
   }
  }
})
</script>
<script lang="ts" setup>
// 读取数据
const detailStore = useDetailStore();
const article = computed<Article>(()=>detailStore.$state.article)
</script>
<template>
  <div class="detail">
    <p>{{article.title}}</p>
    <p>{{article.addtime}}</p>
    <p>{{article.content}}</p>
  </div>
</template>
<style lang="scss" scoped>

</style>


