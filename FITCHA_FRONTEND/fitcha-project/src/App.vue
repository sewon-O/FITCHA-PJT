<template>
  <Layout>
    <LeftSide />
    <!-- Main -->
    <main class="main">
      <!-- 여기서 라우터에 따라 컴포넌트가 바뀜 -> 즉 라우터에 따라 알맞은 View 컴포넌트가 들어가는거 -->
      <router-view />
    </main>
    <RightSide />
  </Layout>
</template>

<script setup>
import Layout from "./components/common/Layout.vue";
import LeftSide from "./components/common/LeftSide.vue";
import RightSide from "./components/common/RightSide.vue";
import { onMounted } from "vue";
import { useUserStore } from "@/stores/user";

const userStore = useUserStore();

onMounted(() => {
  const token = localStorage.getItem("access-token");
  if (!token) {
    userStore.clearUser(); // 토큰 없으면 상태 초기화
  }
});
</script>

<style scoped>
/* Main */
.main {
  flex: 1;
  padding: 30px 20px 40px 20px;
  border-radius: 50px;
  background-color: #f0f6f4;
  margin: 20px 0px;
}
</style>
