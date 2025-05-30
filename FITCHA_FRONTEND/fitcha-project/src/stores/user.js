import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    userId: null,
    userBoardId: null,
    nickName: null,
    profileImgUrl: null,
  }),
  getters: {
    isLoggedIn: state => !!state.userId,
  },
  actions: {
    setUser({ userId, userBoardId, nickName, profileImgUrl }) {
      this.userBoardId = userBoardId;
      this.userId = userId;
      this.nickName = nickName;
      this.profileImgUrl = profileImgUrl;
    },
    clearUser() {
      this.userId = null;
      this.userBoardId = null;
      this.nickName = null;
      this.profileImgUrl = null;
    },
    // ✅ 추가: 프로필 이미지 경로만 업데이트하는 메서드
    updateProfileImgUrl(newUrl) {
      this.profileImgUrl = newUrl;
    },
  },

  persist: {
    storage: localStorage, // 또는 sessionStorage로 바꿀 수도 있음
  },
});
