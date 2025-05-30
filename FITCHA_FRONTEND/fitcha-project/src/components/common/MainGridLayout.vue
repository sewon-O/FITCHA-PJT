<template>
  <!-- 게시글들 레이아웃을 전체 감싸는 div -->
  <div class="main-content-wrapper">
    <div class="main-content">
      <slot />
    </div>
  </div>
</template>

<script setup></script>

<style scoped>
/* 메인 그리드 레이아웃 */
.main-content-wrapper {
  height: 650px;
  overflow-y: auto;
  margin: 0px;
  padding: 10px 14px 50px;
}

.main-content {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
  gap: 25px;
  width: 100%;
  box-sizing: border-box;
  /* ✨ 높이 제한 제거 */
  max-height: unset;
  overflow: visible;
  padding-bottom: 50px;
}

/* 스크롤바 디자인 */
.main-content-wrapper::-webkit-scrollbar {
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
