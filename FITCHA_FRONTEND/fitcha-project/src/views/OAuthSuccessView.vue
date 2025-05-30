<template>
  <div>
    <p>로그인 중...</p>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useUserStore } from '@/stores/user';
import Signup from '@/components/login/Signup.vue';
import api, { BASE_URL } from '@/api/api';
import axios from 'axios';

const userStore = useUserStore();
const router = useRouter();
const route = useRoute();

onMounted(async () => {
  const { token, userId, nickName, signup } = route.query;

  if (!token) {
    // 토큰이 없으면 로그인으로
    return router.replace('/login');
  }

  if (signup == 'true') {
    router.push({
      name: 'Signup',
      query: {
        userId,
        nickName,
        from: route.fullPath,
      },
    });
  } else {
    localStorage.setItem('access-token', token);

    const response = await api.get(`${BASE_URL}/user/${nickName}`);
    userStore.setUser({
      userId: response.data.userId,
      nickName: response.data.nickName,
      userBoardId: response.data.userBoardId,
      profileImgUrl: response.data.profileImgUrl,
    });
    router.replace('/home');
  }
});
</script>
