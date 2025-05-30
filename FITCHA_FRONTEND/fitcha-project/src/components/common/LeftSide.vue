<template>
  <!-- 왼쪽 사이드바  -->
  <div class="left-sidebar">
    <!-- 로고 또는 프로젝트 이름 -->
    <div class="logo">
      <span>FITCHA</span>
    </div>

    <!-- 다른 페이지로 이동하는 nav바 -->
    <ul>
      <li>
        <router-link to="/home">
          <i class="fas fa-home"></i>
          Home
        </router-link>
      </li>
      <li>
        <router-link to="/challengefit">
          <i class="fas fa-fire"></i>
          ChallengeFit
        </router-link>
      </li>
      <li>
        <router-link to="/fittube">
          <i class="fab fa-youtube"></i>
          FitTube
        </router-link>
      </li>
      <li>
        <router-link to="/fitlog">
          <i class="fas fa-users"></i>
          Fitlog
        </router-link>
      </li>
      <li>
        <router-link
          v-if="nickName"
          :to="{ name: 'MyFitView', params: { targetNickName: nickName } }"
        >
          <i class="fas fa-user-circle"></i>
          MyFit
        </router-link>
      </li>

      <li>
        <router-link to="/fittalk">
          <i class="fas fa-comments"></i>
          FitTalk
        </router-link>
      </li>
    </ul>

    <!-- 로그아웃 버튼 -->
    <div class="logout-btn" v-if="nickName">
      <button type="button" @click="handleLogout">
        <i class="fas fa-sign-out-alt"></i>
        logout
      </button>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from "@/stores/user";
import { useRouter } from "vue-router";
import { logout } from "@/stores/logout";

import { computed } from "vue";

const router = useRouter();
const userStore = useUserStore();
const nickName = computed(() => userStore.nickName);

const handleLogout = () => {
  logout(router); // router 전달
};
</script>

<style scoped>
/* 전체 공통 레이아웃 중 왼쪽 사이드바 css */

/* Left Sidebar */
.left-sidebar {
  width: 160px;
  padding: 60px 20px 30px;
}

.left-sidebar .logo {
  font-size: 1.7rem;
  font-weight: bold;
  margin-bottom: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.left-sidebar ul {
  list-style: none;
  padding: 0px;
}

.left-sidebar li a {
  text-decoration: none;
  height: 50px;
  margin-bottom: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 15px;
  cursor: pointer;
  color: #9fa3a6;
  gap: 8px;
}

.left-sidebar li a:hover {
  background-color: #1ec08a;
  color: #ffff;
}

.left-sidebar li i {
  padding-top: 2px;
}

.left-sidebar .logout-btn {
  display: flex;
  justify-content: center;
  align-items: center;
}
.left-sidebar .logout-btn button {
  width: 180px;
  height: 50px;
  background-color: #fff;
  border: none;
  color: #9fa3a6;
  font-size: 1.2rem;
  margin-top: 140px;
  cursor: pointer;
}
</style>
