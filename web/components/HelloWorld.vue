<script setup lang="ts">
import { ref } from 'vue'

defineProps<{ msg: string }>()

const count = ref(0)
</script>

<template>
  <h1>{{ msg }}</h1>

  <p>
    Recommended IDE setup :
    <a href="https://code.visualstudio.com/" target="_blank">VS Code</a>
    +
    <a href="https://github.com/johnsoncodehk/volar" target="_blank">Volar</a>
  </p>

  <p>See <code>README.md</code> for more information.</p>

  <p>
    <a href="http://midway-vue3-ssr.liqingsong.cc/" target="_blank">Docs</a>
    |
    <a href="http://www.midwayjs.org/" target="_blank">Midway Docs</a>
    |
    <a href="https://v3.cn.vuejs.org/" target="_blank">Vue 3 Docs</a>    
    |
    <a href="https://element-plus.gitee.io/" target="_blank">Element Plus Docs</a>
    |
    <a href="https://cn.vitejs.dev/" target="_blank">Vite Docs</a>
  </p>

  <button type="button" @click="count++">count is: {{ count }}</button>
  <p>
    Edit
    <code>components/HelloWorld.vue</code> to test hot module replacement.
  </p>
</template>

<style scoped>
label {
  margin: 0 0.5em;
  font-weight: bold;
}

code {
  background-color: #eee;
  padding: 2px 4px;
  border-radius: 4px;
  color: #304455;
}
</style>
