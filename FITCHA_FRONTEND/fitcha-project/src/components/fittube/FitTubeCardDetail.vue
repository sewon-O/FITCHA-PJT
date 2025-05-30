<template>
  <div v-if="videoInfo">
    <div class="proof-detail">
      <iframe
        width="600"
        height="315"
        :src="videoUrl"
        title="YouTube video player"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerpolicy="strict-origin-when-cross-origin"
        allowfullscreen
      ></iframe>

      <div class="header">
        <div class="userAndTitle">
          <!-- <img class="user-profile-image" src="../assets/images/user1.jpg" alt="작성자 프로필" /> -->
          <div class="user-info">
            <span class="title">{{ videoInfo.snippet.title }} </span>
          </div>
        </div>
      </div>

      <div class="header-lower">
        <!-- 태그 -->
        <div class="bages-like-container">
          <div class="user-name">{{ videoInfo.snippet.channelTitle }}</div>
          <div class="badges">
            <span
              v-for="(tag, idx) in Tags"
              :key="tag"
              class="badge"
              :class="{
                distance: idx % 3 === 0,
                time: idx % 3 === 1,
                kcal: idx % 3 === 2,
              }"
            >
              {{ tag }}
            </span>
          </div>
          <!-- 좋아요 -->
        </div>
        <div class="like-btn">
          <i
            class="fa-heart fa-2x"
            :class="isLike == 1 ? 'fas' : 'far'"
            :style="isLike == 1 ? { color: '#ff6b6b' } : { color: '#ccc' }"
            @click="updateLike"
          ></i>
        </div>
      </div>
      <!-- 하단 날짜 + 좋아요 -->
      <div class="footer">
        <div class="write-date"></div>
        <div class="stats">
          <div class="views">
            <span>댓글 {{ comments?.length || 0 }} 개</span>
          </div>
          <div class="like">
            <i class="fas fa-heart"></i>
            <span>좋아요 {{ likeCount }}</span>
          </div>
        </div>
      </div>
      <!-- 댓글 영역 -->
      <div class="comment-list">
        <div class="challenge-detail__comment-form">
          <input
            type="text"
            placeholder="댓글을 남기세요..."
            v-model="comment"
          />
          <button @click="requestVideoCommentRegist">작성</button>
        </div>

        <div
          class="comment-card"
          v-for="comment in comments"
          :key="comment.videoId"
        >
          <img
            class="comment-profile"
            src="../../assets/images/2.jpg"
            alt="프로필"
          />
          <div class="comment-body">
            <div class="comment-header">
              <span class="comment-author">{{ comment.writer }}</span>

              <template v-if="comment.writer === nickName">
                <div
                  class="challenge-detail__options"
                  @click="openCommentModal(comment.commentId, comment.content)"
                >
                  <i style="cursor: pointer" class="fas fa-ellipsis-v"></i>
                </div>
              </template>
            </div>
            <template v-if="editVideoCommentId != comment.commentId">
              <div class="comment-text">{{ comment.content }}</div>
            </template>
            <template v-else>
              <div class="challenge-detail__comment-form">
                <input type="text" v-model="editCommentContent" />
                <button @click="requestVideoCommentUpdate()">수정완료</button>
              </div>
            </template>

            <div class="comment-date">{{ comment.regDate }}</div>
          </div>
        </div>
      </div>

      <!-- 댓글 수정/삭제 모달 -->
      <div
        v-if="showCommentModal"
        class="modal-overlay"
        @click.self="closeCommentModal(false)"
      >
        <div class="modal-box">
          <button class="modal-close-button" @click="closeCommentModal(false)">
            ×
          </button>
          <div class="modal-title">댓글 관리</div>
          <button class="modal-button" @click="closeCommentModal(true)">
            수정하기
          </button>
          <button class="modal-button delete" @click="requestDeleteComment">
            삭제하기
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import api from "@/api/api";
import { ref, computed, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import { useUserStore } from "@/stores/user";

const { userId, nickName } = useUserStore();
const route = useRoute();
const videoId = route.params.id;
const videoInfo = ref(null);

const editVideoCommentId = ref(-1);
const editCommentContent = ref("");
const comments = ref({});
const comment = ref("");

const videoUrl = computed(() => `https://www.youtube.com/embed/${videoId}`);
// tags 중 앞 5개만 안전하게 꺼내는 computed
const Tags = computed(() => {
  // videoInfo.value 가 아직 null 이면 빈 배열
  const tags = videoInfo.value?.snippet?.tags ?? [];
  return tags.slice(0, 5);
});
onMounted(async () => {
  try {
    let { data } = await api.get(`/youtube/${videoId}`);
    // data.items 가 배열일 때만 첫 번째 객체를 할당
    videoInfo.value = Array.isArray(data.items) ? data.items[0] : null;
    requestVideoCommentList();
    requestVideoLike();
  } catch (e) {
    console.error("영상 요청 실패", e);
  }
});

//댓글 조회
async function requestVideoCommentList() {
  const { data } = await api.get(`/youtube/${videoId}/comment`);
  comments.value = data;
}
//댓글 등록
async function requestVideoCommentRegist() {
  const { status } = await api.post(`/youtube/${videoId}/comment`, {
    videoId: videoId,
    userId: userId,
    content: comment.value,
    writer: nickName,
  });
  comment.value = "";

  //성공시 전체 댓글 불러오기
  if (status === axios.HttpStatusCode.Created) {
    requestVideoCommentList();
  } else {
    console.log("댓글불러오기 실패..");
  }
}
//댓글 수정
async function requestVideoCommentUpdate() {
  const { status } = await api.put(
    `/youtube/${videoId}/comment/${editVideoCommentId.value}`,
    {
      videoId: videoId,
      commentId: editVideoCommentId.value,
      content: editCommentContent.value,
    }
  );

  editVideoCommentId.value = -1;
  editCommentContent.value = "";

  //성공시 전체 댓글 불러오기
  if (status === axios.HttpStatusCode.Ok) {
    requestVideoCommentList();
  } else {
    console.log("댓글수정 실패..");
  }
}
//댓글 삭제
const requestDeleteComment = async () => {
  const { status } = await api.delete(
    `/youtube/${videoId}/comment/${editVideoCommentId.value}`
  );
  requestVideoCommentList();
  closeCommentModal(false);
};

// 댓글 수정 삭제 모달
const showCommentModal = ref(false);
const openCommentModal = (commentId, content) => {
  showCommentModal.value = true;
  editVideoCommentId.value = commentId;
  editCommentContent.value = content;
};
const closeCommentModal = (isContinue) => {
  showCommentModal.value = false;
  if (!isContinue) {
    editVideoCommentId.value = "";
  }
};

//좋아요

const likeCount = ref(0);
const isLike = ref(0);
//좋아요 조회
async function requestVideoLike() {
  const { data } = await api.get(`/youtube/${videoId}/like/${nickName}`);
  isLike.value = data.like;
  likeCount.value = data.likeCount;
}
//좋아요 수정
async function updateLike() {
  isLike.value = isLike.value == 0 ? 1 : 0;
  console.log(isLike.value);
  const { data } = await api.post(`/youtube/${videoId}/like`, {
    videoId: videoId,
    writer: nickName,
    like: isLike.value,
  });
  requestVideoLike();
}
</script>

<style scoped>
.proof-detail {
  max-width: 600px;
  margin: 20px auto 30px;
  padding: 12px 20px 24px;
  background-color: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  color: #333;
}

/* 작성자 정보 */
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  padding-bottom: 0px;
  gap: 10px;
}

.header-lower {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px 12px;
  padding-bottom: 0px;
  gap: 10px;
}

.userAndTitle {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-profile-image {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.user-info .title {
  font-weight: bold;
  font-size: 1.3rem;
  color: #222;
}

.user-info .user-name {
  font-size: 1rem;
  color: #777;
  margin-top: 7px;
}
.user-name {
  gap: 10px;
}

.proof-menu {
  font-size: 1.3rem;
  width: 20px;
  height: 30px;
  cursor: pointer;
  display: flex;
  align-items: start;
  justify-content: end;
}

/* 영상 */
iframe {
  border-radius: 12px;
}

/* 운동 정보 뱃지 */
.badges {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
  margin-top: 12px;
}

.badge {
  font-size: 0.75rem;
  padding: 2px 10px;
  border-radius: 12px;
  font-weight: 500;
  display: flex;
  align-items: center;
}

.badge.distance {
  background-color: #d3f9d8;
  color: #2b8a3e;
}

.badge.time {
  background-color: #d0ebff;
  color: #1c7ed6;
}

.badge.kcal {
  background-color: #ffe3e3;
  color: #e03131;
}

/* 해시태그 + 챌린지 링크 라인 */
.content-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.hashtags {
  color: #3cb371;
  font-size: 0.8rem;
}

.go-challenge {
  font-size: 0.8rem;
  color: #3cb371;
  font-weight: bold;
  text-decoration: none;
}

.go-challenge:hover {
  text-decoration: underline;
  color: #2b8a3e;
}

/* 하단 날짜 + 좋아요 */
.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #eee;
  padding-top: 5px;
  font-size: 0.85rem;
  color: #666;
}

.write-date {
  font-size: 0.8rem;
  color: #888;
}

.stats {
  display: flex;
  align-items: center;
  gap: 12px;
}

.stats .like,
.stats .views {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  gap: 7px;
}

.stats .like {
  color: #ff6b6b;
  cursor: pointer;
}
.like-btn {
  margin: 0px;
  cursor: pointer;
}

.stats .views {
  color: #868e96;
}
/* 댓글 섹션 */
.comments-section {
  margin-top: 32px;
  border-top: 1px solid #eee;
  padding-top: 20px;
}

/* 댓글 작성 폼 */
.comment-form {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.comment-form input {
  flex: 1;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 0.9rem;
}

.comment-form button {
  padding: 10px 16px;
  background-color: #3cb371;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.comment-form button:hover {
  background-color: #2b8a3e;
}

/* 댓글 리스트 */
.comment-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 10px;
}

.comment-card {
  display: flex;
  background-color: #f9f9f9;
  padding: 12px 16px;
  border-radius: 12px;
  gap: 10px;
  align-items: flex-start;
  position: relative;
}

.comment-profile {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 12px;
}

.comment-body {
  flex: 1;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.comment-author {
  font-weight: bold;
  font-size: 0.9rem;
  color: #222;
}

.comment-menu {
  color: #666;
  cursor: pointer;
  font-size: 1rem;
}

.comment-text {
  margin: 4px 0 6px;
  font-size: 0.88rem;
  color: #444;
  line-height: 1.4;
}

.comment-date {
  font-size: 0.75rem;
  color: #999;
}

/* 모달 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  backdrop-filter: blur(4px);
  background-color: rgba(0, 0, 0, 0.25);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.modal-box {
  position: relative;
  background: #fff;
  width: 280px;
  padding: 24px 20px 20px;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  align-items: stretch;
  animation: fadeIn 0.25s ease;
}

.modal-title {
  font-size: 1rem;
  font-weight: bold;
  margin-bottom: 16px;
  text-align: center;
  color: #333;
}

.modal-button {
  font-size: 0.95rem;
  padding: 10px;
  margin: 6px 0;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  background-color: #f1f3f5;
  color: #333;
  transition: background-color 0.2s;
}

.modal-button:hover {
  background-color: #e9ecef;
}

.modal-button.delete {
  background-color: #ffe3e3;
  color: #e03131;
}

.modal-button.delete:hover {
  background-color: #ffc9c9;
}

.modal-close-button {
  position: absolute;
  top: 12px;
  right: 14px;
  background: transparent;
  border: none;
  font-size: 1.2rem;
  color: #888;
  cursor: pointer;
  transition: color 0.2s;
}

.modal-close-button:hover {
  color: #222;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 댓글 영역 */
.challenge-detail__comment-form {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
}

.challenge-detail__comment-form input {
  flex: 1;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
}

.challenge-detail__comment-form button {
  padding: 10px 16px;
  background: #51cf66;
  color: #fff;
  font-weight: bold;
  border-radius: 8px;
  border: none;
  cursor: pointer;
}
</style>
