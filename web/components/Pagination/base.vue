<script lang="ts" setup>
import { reactive, watch } from "vue";
import { Pagination } from "@/utils/pagination";

interface Props {
    total: number;
    currentPage: number;
    pageSize?: number;
    rollPage?: number;
    pageUrl?: string;
}

const props = withDefaults(defineProps<Props>(), {
    pageSize: 10,
    rollPage: 5,
    pageUrl: '#', // /xxxxx?page={page}
})

const page = new Pagination({
    total: props.total,
    currentPage:  props.currentPage,
    pageSize: props.pageSize,
    rollPage: props.rollPage,
});

const ps = reactive({
    pages: page.getPages(),
    prePage: page.prePage,
    nextPage: page.nextPage,
    isPrePage: page.isPrePage,
    isNextPage: page.isNextPage
})

const setCurrentPage = (val: number)=> {
    page.setPage(val)
    ps.pages = page.getPages()
    ps.prePage = page.prePage
    ps.nextPage = page.nextPage
    ps.isPrePage = page.isPrePage
    ps.isNextPage = page.isNextPage
}

watch(()=> props.currentPage, () => {
    setCurrentPage(props.currentPage)
})

const getPageUrl = (val: number)=> {
    return props.pageUrl.replace('{page}', val.toString())
}

</script>
<template>
   <div v-if="ps.isPrePage || ps.isNextPage" class="el-pagination is-background">
       <ul class="el-pager">
            <li v-if="ps.isPrePage" class="number btn-prev">
                <router-link class="link" :to="getPageUrl(ps.prePage)">
                    <i class="el-icon"><svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M609.408 149.376 277.76 489.6a32 32 0 0 0 0 44.672l331.648 340.352a29.12 29.12 0 0 0 41.728 0 30.592 30.592 0 0 0 0-42.752L339.264 511.936l311.872-319.872a30.592 30.592 0 0 0 0-42.688 29.12 29.12 0 0 0-41.728 0z"></path></svg></i>
                </router-link>
              </li>
              <li v-for="item in ps.pages" :key="item" :class="{'is-active': currentPage === item}" class="number">
                  <router-link v-if="currentPage !== item" class="link" :to="getPageUrl(item)">{{ item }}</router-link>
                  <span v-else >{{ item }}</span>
              </li>
               <li v-if="ps.isNextPage" class="number btn-next">
                <router-link class="link" :to="getPageUrl(ps.nextPage)">
                    <i class="el-icon"><svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M340.864 149.312a30.592 30.592 0 0 0 0 42.752L652.736 512 340.864 831.872a30.592 30.592 0 0 0 0 42.752 29.12 29.12 0 0 0 41.728 0L714.24 534.336a32 32 0 0 0 0-44.672L382.592 149.376a29.12 29.12 0 0 0-41.728 0z"></path></svg></i>
                </router-link>
              </li>
         </ul>
    </div>
</template>
<style lang="scss" scoped>
.el-pager {
    li {
        padding: 0;
        * {
          pointer-events:inherit;
        }
    }
    .link {
        color: var(--el-text-color-regular);
        width: 100%;
    }
}

</style>
