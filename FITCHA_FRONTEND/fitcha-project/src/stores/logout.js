// src/utils/logout.js
import { useUserStore } from '@/stores/user';

export function logout(router) {
  const userStore = useUserStore();
  userStore.clearUser(); // 상태 초기화
  localStorage.removeItem('access-token');
  alert('로그아웃 되었습니다.');
  router.push('/login');
}
