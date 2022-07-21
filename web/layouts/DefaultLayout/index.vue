<script lang="ts" setup>
import { computed } from 'vue';
import { useRoute, RouteMeta } from 'vue-router';
const route = useRoute();
const meta = computed<RouteMeta>(()=> route.meta);
</script>
<template>
    <nav>
      <router-link to="/" :class="{'active': meta.navActive === 'home'}">Home</router-link> |
      <router-link to="/about" :class="{'active': meta.navActive === 'about'}">About</router-link> |
      <router-link :to="{path:'/localapi', query: {'uid':10}}" :class="{'active': meta.navActive === 'localapi'}">LocalApi</router-link>
    </nav>
    <router-view></router-view>
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.active {
  color: #42b983;
}
</style>
