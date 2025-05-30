<template>
  <!-- 전체 레이아웃 감싸는 div -->
  <div class="layout-wrapper">
    <div class="layout-container">
      <!-- slot -->
      <slot />
    </div>
  </div>
</template>

<script setup></script>

<style scoped>
.layout-wrapper {
  box-shadow: 1px 1px 5px black;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

.layout-container {
  background-color: #ffff;
  box-shadow: 5px 10px 25px gray;
  display: flex;
  width: 1400px;
  height: 880px;
  border-radius: 30px;
}
</style>
