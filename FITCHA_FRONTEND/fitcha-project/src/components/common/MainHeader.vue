<template>
  <div class="main-header">
    <!-- 중간 메인 영역의 가장 위 헤더 -->
    <h2 v-if="nickName">
      Hello! <span class="userName">{{ nickName }}</span>
    </h2>
    <h2 v-if="!nickName">Welcome! <span class="userName"></span></h2>
    <div class="challenge-create-wrapper" v-if="menu === 'challengefit'">
      <RouterLink :to="{ name: 'ChallengeFitRegist' }">
        <a>
          <button class="header__challenge-create-btn"><i class="fas fa-pen"></i> 챌린지 작성</button>
        </a>
      </RouterLink>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from '@/stores/user';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
ref;
const userStore = useUserStore();
const { nickName } = storeToRefs(userStore);
const menu = ref(window.location.pathname.split('/')[1]);
</script>

<style scoped>
.main-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.main-header h2 {
  font-size: 1.7rem;
  font-weight: bold;
  margin: 0px;
}

/* 챌린지 등록 버튼 */
/* 챌린지 등록 버튼 (헤더용) */
.challenge-create-wrapper a {
  text-decoration: none;
}
.header__challenge-create-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: linear-gradient(135deg, #3cb371, #2e8b57); /* 민트~그린 그라디언트 */
  color: white;
  border: none;
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 600;
  border-radius: 30px;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(60, 179, 113, 0.4);
  position: relative;
  overflow: hidden;
  animation: pulse-move 3s infinite ease-in-out;
  transition: transform 0.2s ease;
}

.header__challenge-create-btn:hover {
  transform: scale(1.05);
}

.header__challenge-create-btn i {
  font-size: 16px;
}

/* 역동적 움직임 + 반짝이는 느낌 */
@keyframes pulse-move {
  0% {
    transform: translateY(0px);
    box-shadow: 0 0 0 rgba(60, 179, 113, 0.4);
  }
  50% {
    transform: translateY(-2px);
    box-shadow: 0 0 12px rgba(60, 179, 113, 0.5);
  }
  100% {
    transform: translateY(0px);
    box-shadow: 0 0 0 rgba(60, 179, 113, 0.4);
  }
}
</style>
