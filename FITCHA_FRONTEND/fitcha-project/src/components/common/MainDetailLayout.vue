<template>
  <!-- 게시글들 레이아웃을 전체 감싸는 div -->
  <div class="main-content-wrapper" :class="menu == 'fittalk' ? 'fittalk' : ''">
    <div class="main-content">
      <slot />
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
const menu = ref(window.location.pathname.split('/')[1]);
console.log(menu.value);
</script>

<style scoped>
/*  메인 디테일 페이지 레이아웃 */
.main-content-wrapper {
  height: 720px;
  overflow-y: auto;
  padding-right: 14px;
  border-top: 1px solid #ccc;
  margin-top: 10px;
  padding-top: 10px;
}
.main-content-wrapper.fittalk {
  height: 680px;
  display: flex;
  justify-content: center;
}
.main-content-wrapper.fittalk .main-content {
  width: 100%;
  height: 100%;
}
/* 스크롤바 디자인 */
.main-content-wrapper::-webkit-scrollb {
  width: 6px;
}
.main-content-wrapper::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 4px;
}
.main-content-wrapper::-webkit-scrollbar-track {
  background: transparent;
}
</style>
