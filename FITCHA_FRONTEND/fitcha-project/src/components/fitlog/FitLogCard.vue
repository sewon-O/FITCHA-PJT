<template>
  <!-- 인증글 게시글 카드 구조 -->
  <router-link class="link-detail" :to="`/fitlog/${fitlog.proofBoardId}`">
    <div class="proof-card">
      <a style="text-decoration: none" href="../views/fitLogDetail.html">
        <!-- 헤더 작성자 정보 -->
        <div class="header">
          <img
            v-if="profileImgUrl"
            :src="profileImgUrl"
            alt="작성자 프로필 사진"
            class="user-profile-image"
          />
          <img
            v-else
            :src="defaultProfileImg"
            alt="기본 프로필 사진"
            class="user-profile-image"
          />
          <div class="user-info">
            <span class="title">{{ fitlog.title }}</span>
            <span class="user-name">{{ fitlog.writer }}</span>
          </div>
        </div>

        <!-- 운동 인증 이미지 -->
        <div class="main-image">
          <img :src="imgUrl" alt="운동 인증 사진" />
        </div>

        <!-- 운동 정보 뱃지 -->
        <div class="badges">
          <span class="badge distance">{{ fitlog.exerciseType }}</span>
          <span class="badge time">{{ fitlog.bodyPart }}</span>
          <span class="badge kcal">🔥 {{ fitlog.level }}</span>
        </div>

        <!-- 내용 -->
        <div class="content">
          {{ fitlog.content }}
        </div>
        <div class="hashtag">
          <span v-for="tag in fitlog.hashTags" :key="tag">{{ tag }}</span>
        </div>

        <!-- 하단 푸터 -->
        <div class="footer">
          <div class="date">{{ fitlog.regDate }}</div>
          <div class="stats">
            <div class="views">
              <i class="fas fa-eye"></i> <span>{{ fitlog.viewCount }}</span>
            </div>
            <div class="heart">
              <i class="fas fa-heart"></i> <span>{{ fitlog.likeCount }}</span>
            </div>
          </div>
        </div>
      </a>
    </div>
  </router-link>
</template>

<script setup>
import { computed } from "vue";
import defaultProfileImg from "@/assets/images/myfit/profile-default.svg";
import { BASE_URL } from "@/api/api";

const props = defineProps({
  fitlog: {
    type: Object,
  },
});

const profileImgUrl = computed(() => {
  if (props.fitlog?.userProfileImgUrl) {
    return BASE_URL + "/" + props.fitlog.userProfileImgUrl;
  }
  return "";
});

const imgUrl = computed(() => {
  return props.fitlog?.proofFiles?.length > 0
    ? BASE_URL + "/" + props.fitlog.proofFiles[0].fileUrl
    : "";
});
</script>

<style scoped>
.link-detail {
  text-decoration: none;
  margin: 0 auto;
}
.proof-card {
  width: 280px;
  border-radius: 16px;
  background-color: #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  font-family: "Arial", sans-serif;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  cursor: pointer;
}

.proof-card:hover {
  transform: translateY(-4px);
  box-shadow: 0px 6px 20px rgba(0, 0, 0, 0.15);
}

/* 작성자 정보 */
.proof-card .header {
  display: flex;
  align-items: center;
  padding: 12px;
  gap: 10px;
}

.proof-card .user-profile-image {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.proof-card .user-info {
  display: flex;
  flex-direction: column;
}

.proof-card .user-info .title {
  font-weight: bold;
  font-size: 1rem;
  color: #222;
}

.proof-card .user-info .user-name {
  font-size: 0.85rem;
  color: #777;
  margin-top: 7px;
}

/* 인증 이미지 */
.proof-card .main-image img {
  width: 100%;
  height: 160px;
  object-fit: cover;
}

/* 운동 정보 뱃지 */
.proof-card .badges {
  display: flex;
  gap: 8px;
  padding: 8px 16px 0;
}

.proof-card .badge {
  font-size: 0.7rem;
  background-color: #f1f3f5;
  color: #333;
  padding: 2px 8px;
  border-radius: 12px;
  display: flex;
  align-items: center;
}

.proof-card .badge.kcal {
  background-color: #ffe3e3;
  color: #e03131;
}

.proof-card .badge.time {
  background-color: #d0ebff;
  color: #1c7ed6;
}

.proof-card .badge.distance {
  background-color: #d3f9d8;
  color: #2b8a3e;
}

/* 인증 메시지 */
.content {
  font-size: 0.9rem;
  color: #444;
  padding: 12px 16px 0px;
  margin-bottom: 8px;
  line-height: 1.6;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
}

.hashtag {
  color: #3cb371;
  font-size: 0.85rem;
  margin: 0px 0px 12px 16px;
  display: flex;
  gap: 5px;
}

/* 하단 푸터 */
.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-top: 1px solid #eee;
  font-size: 0.8rem;
  color: #666;
}

.footer .heart {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.85rem;
}

.footer .heart i {
  color: #ff6b6b;
  font-size: 1rem;
  cursor: pointer;
}

.footer .date {
  font-size: 0.8rem;
  color: #999;
}
.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-top: 1px solid #eee;
  font-size: 0.8rem;
  color: #666;
}

.footer .stats {
  display: flex;
  align-items: center;
  gap: 12px;
}

.footer .heart,
.footer .views {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.85rem;
}

.footer .heart i {
  color: #ff6b6b;
  font-size: 1rem;
  cursor: pointer;
}

.footer .views i {
  color: #868e96;
  font-size: 1rem;
}
</style>
