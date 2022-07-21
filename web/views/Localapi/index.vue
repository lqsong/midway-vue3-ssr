<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useUserStore } from "./store";
import { User } from "./data.d";
export default defineComponent({
  async asyncData({store, route}) {
    const query = route.query || {};
    const uid = query.uid?.toString() || '';
    const userStore = useUserStore(store);
    await userStore.getUser(uid);
  },
  seo({store}) {
   const userStore = useUserStore(store);
   return {
      title: userStore.user.uid + '-测试',
   }
  }
})
</script>
<script lang="ts" setup>
// 读取数据
const userStore = useUserStore();
const user = computed<User>(()=>userStore.$state.user)
</script>
<template>
  <div class="user">
    <p>{{user.uid}}</p>
    <p>{{user.phone}}</p>
    <p>{{user.username}}</p>
  </div>
</template>



