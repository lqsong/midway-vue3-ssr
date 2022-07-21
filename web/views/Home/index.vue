<script lang="ts" setup>
import HelloWorld from "@/components/HelloWorld.vue";

</script>
<template>
  <div class="home">
    <img alt="Vue logo" src="../../assets/images/logo.png" />
    <hello-world msg="Welcome to Your MIDWAY-VUE3-SSR" />
    <el-row class="btn">
      <el-button>Default</el-button>
      <el-button type="primary">Primary</el-button>
      <el-button type="success">Success</el-button>
      <el-button type="info">Info</el-button>
      <el-button type="warning">Warning</el-button>
      <el-button type="danger">Danger</el-button>
      <el-button>中文</el-button>
    </el-row>
  </div>
</template>
<style lang="scss" scoped>
.btn {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>


