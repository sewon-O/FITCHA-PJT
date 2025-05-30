<template>
  <div class="profile-wrapper">
    <!-- 프로필 헤더 -->
    <div v-if="!isEditing" class="profile-info-wrapper">
      <img
        v-if="profileImgUrl"
        :src="profileImgUrl"
        alt="프로필 사진"
        class="profile-img"
      />
      <img
        v-else
        :src="defaultProfileImg"
        alt="기본 프로필 사진"
        class="profile-img"
      />
      <div class="user-info">
        <h2 class="user-name">{{ userInfo.name }}</h2>
        <p class="user-nickname">@{{ userInfo.nickName }}</p>
      </div>

      <!-- 팔로워/팔로잉 수 표시 삭제됨 -->

      <!-- 프로필 수정 버튼만 남김 -->
      <button
        v-if="isMine"
        class="edit-btn"
        type="button"
        @click="isEditing = true"
      >
        프로필 수정
      </button>
    </div>

    <MyFitUpdate
      v-if="isEditing"
      :name="userInfo.name"
      :nickName="userInfo.nickName"
      :profileImgUrl="userInfo.profileImgUrl"
      @close="handleClose"
    />

    <!-- 탭 메뉴 -->
    <div class="tab-menu">
      <button
        class="tab"
        :class="{ active: activeTab === 'challenge' }"
        @click="changeTab('challenge')"
      >
        참여한 챌린지
      </button>
      <button
        class="tab"
        :class="{ active: activeTab === 'posts' }"
        @click="changeTab('posts')"
      >
        내 인증 게시글
      </button>
    </div>

    <!-- 탭 콘텐츠 -->
    <div class="tab-content">
      <div class="tab-content-challenge" v-if="activeTab === 'challenge'">
        <!-- 참여한 챌린지 컴포넌트 -->
        <ChallengeFitCard
          v-for="challenge in challenges"
          :key="challenge.challengeBoardId"
          :challenge="challenge"
        />
      </div>
      <div class="tab-content-proof" v-else-if="activeTab === 'posts'">
        <!-- 인증 게시글 컴포넌트 -->
        <FitLogCard
          v-for="fitlog in fitlogs"
          :key="fitlog.proofBoardId"
          :fitlog="fitlog"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import api, { BASE_URL } from "@/api/api";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { onMounted, ref, computed } from "vue";
import FitLogCard from "../fitlog/FitLogCard.vue";
import ChallengeFitCard from "../challengefit/ChallengeFitCard.vue";
import MyFitUpdate from "./MyFitUpdate.vue";
import defaultProfileImg from "@/assets/images/myfit/profile-default.svg";
import { useRoute } from "vue-router";

const route = useRoute();
const targetNickName = route.params.targetNickName;
const isEditing = ref(false);
const userStore = useUserStore();
const { nickName } = storeToRefs(userStore);
const userInfo = ref({});
const fitlogs = ref([]);
const challenges = ref([]);
const isMine = computed(() => targetNickName === nickName.value);

// 팔로우 관련 상태와 함수 제거
// const isFollowing = ref(false);
// const isLoading = ref(false);

const profileImgUrl = computed(() => {
  if (userInfo.value?.profileImgUrl) {
    return BASE_URL + "/" + userInfo.value?.profileImgUrl;
  }
  return "";
});

// 탭 상태
const activeTab = ref("challenge"); // 초기값은 'challenge'
// 탭 클릭 핸들러
const changeTab = (tab) => {
  activeTab.value = tab;
};

const handleClose = (updatedProfile) => {
  if (updatedProfile) {
    userInfo.value = { ...userInfo.value, ...updatedProfile };

    if (updatedProfile.profileImgUrl) {
      userInfo.value.profileImgUrl = `${
        updatedProfile.profileImgUrl
      }?t=${Date.now()}`;
    }
  }

  isEditing.value = false;
};

const isDataLoaded = ref(false);

onMounted(async () => {
  try {
    const [userInfoList, challengeList, fitlogList] = await Promise.all([
      api.get(`/user/${targetNickName}`),
      api.get(`/challenge/participate/${targetNickName}`),
      api.get(`/proof`, {
        params: { key: "writer", word: targetNickName },
      }),
    ]);

    userInfo.value = userInfoList.data;
    challenges.value = challengeList.data;
    fitlogs.value = fitlogList.data;

    // 팔로우 여부 체크 코드 삭제
    /*
    if (nickName.value && !isMine.value) {
      const res = await api.get(
        `/follow/check/${nickName.value}/${targetNickName}`
      );
      isFollowing.value = res.data;
    }
    */

    isDataLoaded.value = true;
  } catch (error) {
    console.error("초기 데이터 불러오기 실패:", error);
  }
});
</script>

<style scoped>
.profile-wrapper {
  font-family: "Noto Sans KR", sans-serif;
  max-width: 480px;
  margin: 0 auto;
  border-radius: 20px;
  background-color: #ffffff;
  box-shadow: 0px 6px 20px rgba(0, 0, 0, 0.15);
}

.profile-info-wrapper {
  padding: 24px 24px 0px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.profile-info-wrapper .profile-img {
  width: 110px;
  height: 110px;
  border-radius: 50%;
  object-fit: cover;
}

.profile-info-wrapper .user-info {
  flex: 1;
}

.profile-info-wrapper .user-name {
  text-align: center;
  font-size: 1.2rem;
  margin: 0;
  font-weight: 600;
}

.profile-info-wrapper .user-nickname {
  margin: 0px;
  text-align: center;
  font-size: 0.9rem;
  color: #666;
  margin-top: 4px;
}

.edit-btn {
  padding: 6px 12px;
  font-size: 0.85rem;
  border: 1px solid #ccc;
  border-radius: 20px;
  background-color: white;
  color: #666;
  cursor: pointer;
}

.tags {
  margin-bottom: 16px;
  display: flex;
  justify-content: center;
  gap: 10px;
}

.tag {
  display: inline-block;
  background-color: #e0f7ec;
  color: #2ecc71;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.75rem;
  margin-right: 6px;
}

.tab-menu {
  display: flex;
  border: 1px solid #e0e0e0;
  margin-bottom: 16px;
}

.tab {
  flex: 1;
  padding: 10px 0;
  background: none;
  border: none;
  font-size: 1rem;
  cursor: pointer;
  color: #666;
}

.tab.active {
  color: #ffffff;
  background-color: #3cb371;
  font-weight: bold;
  border-color: #222;
}

.tab-content {
  padding: 10px 24px;
  font-size: 0.9rem;
  color: #444;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.tab-content-challenge {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.tab-content-proof {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.follow-btn {
  padding: 6px 16px;
  font-size: 0.85rem;
  border-radius: 20px;
  background-color: #3cb371;
  color: white;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
}
.follow-btn.followed {
  background-color: white;
  color: #3cb371;
  border: 1px solid #3cb371;
}
.follow-stats {
  display: flex;
  gap: 24px;
  justify-content: center;
  margin-top: 8px;
}

.stat-item {
  text-align: center;
}

.stat-count {
  font-weight: 700;
  font-size: 1rem;
  display: block;
}

.stat-label {
  font-size: 0.75rem;
  color: #888;
}
</style>
