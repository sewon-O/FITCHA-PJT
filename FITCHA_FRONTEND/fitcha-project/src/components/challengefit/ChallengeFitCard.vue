<template>
<router-link
          class="router-link"
          :to="{
            name: 'ChallengeFitDetail',
            params: { id: challenge.challengeBoardId },
            query: { isViewCounted: 'true' , writer : nickName},
          }"
        > <!-- 챌린지 게시글 카드 구조 -->
  <div class="challenge-card">
    <a style="text-decoration: none">
      <!-- 챌린지 카드 이미지 -->
      <img :src="imgUrl" alt="" />
      <!-- 챌린지 카드 내용 -->
      <div class="card-content">
        <h3>{{ challenge.title }}</h3>
        <div class="card-badges">
          <span class="badge activity">
            <i class="fas fa-running"></i>
            {{ challenge.exerciseType }}
          </span>
          <span class="badge location">
            <i class="fas fa-map-marker-alt"></i>
            {{ challenge.bodyPart }}
          </span>
          <span class="badge level">
            <i class="fas fa-star"></i>
            {{ challenge.level }}
          </span>
        </div>
        <!-- 챌린지 게시글 내용 -->
        <p class="card-desc">{{ challenge.content }}</p>
        <!-- 참여 인원 프로그래스바 -->
        <div class="progress-container">
          <div class="progress-bar">
            <div
  class="fill"
  :class="{ complete: isComplete }"
  :style="{ width: progressWidth }"
>      <!-- <span class="progress-text">{{ daysText }}</span> -->
      </div>
          </div>
        </div>

        <p class="participants">
          참여:{{ challenge.participantCount }} /
          {{ challenge.totalParticipantCount }}명
        </p>
        <p class="date">
          <div>
            {{ challenge.regDate }}
          </div>
          <div>
            <span class="comment-count">{{ challenge.comments?.length || 0 }}</span>
            개의 댓글
          </div>
        </p>
        <div class="card-footer">
          <div class="writer-info">
            <img v-if="profileImgUrl" :src="profileImgUrl" alt="" />
            <img v-else :src="defaultProfileImg" alt="" />
            <span>{{ challenge.writer }}</span>
          </div>
          <div class="stats">
          <div class="views">
            <i class="fas fa-eye"></i>
            <span>{{ challenge.viewCount }}</span>
          </div>
          <div class="like">
            <i class="fas fa-heart"></i>
            <span>{{ challenge.likeCount }}</span>
          </div>
        </div>
        </div>
      </div>
    </a>
  </div>
        
        </router-link>


 
</template>

<script setup>
import { computed } from 'vue';
import { useUserStore } from '@/stores/user';
import dayjs from 'dayjs';
import defaultProfileImg from "@/assets/images/myfit/profile-default.svg";


import api, { BASE_URL } from '@/api/api';

const props = defineProps({ challenge: { type: Object } });
const { userId, nickName } = useUserStore();
const imgUrl = computed(() => {
  return props.challenge?.challengeFiles?.[0]?.fileUrl
    ? `${BASE_URL}/${props.challenge.challengeFiles[0].fileUrl}`
    : '';
});

// 챌린지 작성자 프사 
const profileImgUrl = computed(() => {
  if (props.challenge?.userProfileImgUrl) {
    return "http://localhost:8080/" + props.challenge.userProfileImgUrl;
  }
  return "";
});

// 1) 경과 일수 (0 ~ duration 사이)
const daysElapsed = computed(() => {
  const { regDate, duration } = props.challenge;
  if (!regDate || !duration) return 0;
  const diff = dayjs().diff(dayjs(regDate), 'day');
  if (diff < 0) return 0;
  return diff > duration ? duration : diff;
});

// 2) 몇 일차: 경과 + 1, 최대 duration
const dayCount = computed(() => {
  const cnt = daysElapsed.value + 1;
  const { duration } = props.challenge;
  return duration ? Math.min(cnt, duration) : cnt;
});

// 3) 프로그레스바 너비
const progressWidth = computed(() => {
  const { duration } = props.challenge;
  if (!duration) return '0%';
  return Math.round((dayCount.value / duration) * 100) + '%';
});

 // 4) 표시용 텍스트
// const daysText = computed(() => `${dayCount.value}일차`);

// 5) 
const isComplete = computed(() => {
  return props.challenge.finish;
  // return props.challenge.duration
  //   ? dayCount.value >= props.challenge.duration
  //   : false
})


</script>

<style scoped>
.router-link {
  text-decoration: none;
  margin: 0 auto;
}
/* 챌린지 카드 디자인 */

.challenge-card {
  font-family: 'Arial', sans-serif;
  background-color: #ffffff;
  width: 280px;
  height: 420px;
  border-radius: 15px;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0px 6px 20px rgba(0, 0, 0, 0.15);
  cursor: pointer;
}

.challenge-card:hover {
  transform: translateY(-4px);
}

.challenge-card img {
  width: 100%;
  height: 160px;
  object-fit: cover;
}

.challenge-card .card-content {
  padding: 12px 16px;
}

.card-content h3 {
  margin: 0px;
  font-size: 1rem;
  font-weight: bold;
  margin-bottom: 10px;
  color: #222;
   display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-content .card-badges {
  margin-bottom: 12px;
}

.card-badges .badge {
  display: inline-block;
  color: #ffffff;
  padding: 2px 8px;
  border-radius: 5px;
  font-size: 0.65rem;
  margin-right: 7px;
}

.badge.activity {
  background-color: #3cb371; /* 활동 */
}

.badge.location {
  background-color: #4dabf7; /* 지역 */
}

.badge.level {
  background-color: #ffa94d; /* 난이도 */
}

.badge i {
  margin-right: 4px;
}

.card-desc {
  margin: 0px;
  font-size: 0.8rem;
  color: #555;
  margin-bottom: 10px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.progress-container {
  margin-bottom: 8px;
}

.progress-container .progress-bar {
  height: 8px;
  background-color: #eee;
  border-radius: 5px;
  overflow: hidden;
}

.progress-bar .fill {
  height: 100%;
  background-color: #3cb371;
  width: 50%;
  transition: width 0.3s;
}
.fill {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.fill.complete {
  background-color: #7c7c7c;  /* 완료된 경우 */
}

.progress-text {
  font-size: 0.7rem;
  color: #fff;
  pointer-events: none; /* 누르는 걸 방해하지 않도록 */
}

.participants {
  margin: 0px;
  font-size: 0.75rem;
  color: #444;
  margin-bottom: 8px;
}

.date {
  margin: 0px;
  font-size: 0.7rem;
  color: #888;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px;
  border-top: 1px solid #eee;
  font-size: 0.7rem;
  color: #666;

}

.card-footer .writer-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.card-footer .writer-info img {
  width: 30px;
  height: 30px;
  border-radius: 50%;
}

.stats {
  display: flex;
  align-items: center;
  gap: 10px;
}

.stats .like,
.stats .views {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  gap: 5px;
}

.stats .like {
  color: #ff6b6b;
  cursor: pointer;
}

.stats .views {
  color: #868e96;
}

</style>
