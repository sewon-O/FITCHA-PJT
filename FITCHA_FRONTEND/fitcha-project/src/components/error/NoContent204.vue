<template>
  <div class="no-content-wrapper">
    <img src="@/assets/images/error/noContent204.png" alt="No Result" />
    <p>앗! 찾으시는 {{ menu }} 없어요</p>
    <span>검색어를 바꿔보거나, 홈으로 돌아가보세요</span>
    <div class="button-group">
      <button @click="goBack">이전으로</button>
      <button @click="goHome">홈으로</button>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();

const menu = ref(window.location.pathname.split("/")[1]);
onMounted(() => {
  if (menu.value === "challengefit") {
    menu.value = "챌린지가";
  } else if (menu.value === "fittube") {
    menu.value = "영상이";
  } else if (menu.value === "fitlog") {
    menu.value = "인증글이";
  }
});
function goBack() {
  router.back();
}

function goHome() {
  router.push("/home");
}
</script>

<style scoped>
.no-content-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  padding: 32px;
  margin: 0 auto;
  background-color: #f8f9faa4;
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.no-content-wrapper img {
  width: 180px;
  margin-bottom: 24px;
  opacity: 0.85;
}

.no-content-wrapper p {
  font-size: 1.4rem;
  font-weight: bold;
  margin-bottom: 6px;
  color: #333;
}

.no-content-wrapper span {
  font-size: 0.95rem;
  color: #666;
}

.button-group {
  margin-top: 24px;
  display: flex;
  justify-content: center;
  gap: 12px;
}

.button-group button {
  padding: 10px 18px;
  border-radius: 8px;
  font-size: 0.95rem;
  cursor: pointer;
  border: none;
  background-color: #40c057;
  color: white;
  transition: background-color 0.2s;
}

.button-group button:hover {
  background-color: #38b24d;
}
</style>
