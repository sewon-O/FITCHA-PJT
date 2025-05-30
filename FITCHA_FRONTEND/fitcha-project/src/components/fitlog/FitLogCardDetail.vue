<template>
  <div>
    <div class="proof-detail">
      <!-- 상단 작성자 정보 -->
      <div class="header">
        <router-link
          v-if="fitlog.writer"
          :to="{ name: 'MyFitView', params: { targetNickName: fitlog.writer } }"
          style="text-decoration: none"
        >
          <div class="userAndTitle">
            <img
              v-if="writerProfileImgUrl"
              class="user-profile-image"
              :src="writerProfileImgUrl"
              alt="작성자 프로필"
            />
            <img
              v-else
              :src="defaultProfileImg"
              class="user-profile-image"
              alt="작성자 프로필"
            />
            <div class="user-info">
              <span class="title">{{ fitlog.title }}</span>
              <span class="user-name">{{ fitlog.writer }}</span>
            </div>
          </div>
        </router-link>

        <!-- 내 글이면 메뉴 보임 -->
        <div v-if="isMyFitLog" class="proof-menu" @click="openProofModal">
          <i class="fas fa-ellipsis-v"></i>
        </div>
      </div>

      <!-- 인증 이미지 -->
      <div class="proof-image">
        <img :src="imgUrl" alt="운동 인증" />
      </div>

      <!-- 운동 정보 뱃지 -->
      <div class="badges">
        <span class="badge distance">{{ fitlog.exerciseType }}</span>
        <span class="badge time">{{ fitlog.bodyPart }}</span>
        <span class="badge kcal">🔥 {{ fitlog.level }}</span>
      </div>

      <!-- 인증글 내용 -->
      <div class="proof-content">
        <p>{{ fitlog.content }}</p>

        <div class="content-bottom">
          <div class="hashtags">
            <span v-for="hashtag in fitlog.hashTags" :key="hashtag">
              {{ hashtag }}
            </span>
          </div>
          <router-link
            class="go-challenge"
            :to="`/challengefit/${fitlog.challengeBoardId}`"
          >
            참여한 챌린지 보기 &rarr;
          </router-link>
        </div>
      </div>

      <!-- 하단 날짜 + 좋아요 -->
      <div class="footer">
        <div class="write-date">{{ fitlog.regDate }}</div>
        <div class="stats">
          <div class="views">
            <i class="fas fa-eye"></i>
            <span>{{ fitlog.viewCount }}</span>
          </div>
          <div
            class="like"
            @click="toggleLike"
            @animationend="likeAnimation = false"
          >
            <i
              :class="['fas', 'fa-heart', likeAnimation ? 'pop' : '']"
              :style="{ color: isLiked ? '#ff6b6b' : '#ccc' }"
            ></i>
            <span>{{ likeCount || 0 }}</span>
          </div>
        </div>
      </div>

      <!-- 댓글 영역 -->
      <div class="comment-list">
        <!-- 댓글 입력 폼 -->
        <div class="comment-form">
          <img
            class="comment-profile"
            :src="profileImgWithCache || defaultProfileImg"
            alt="내 프로필"
          />
          <input
            type="text"
            placeholder="댓글을 입력하세요..."
            v-model="commentContent"
            @keyup.enter="submitComment"
          />
          <button @click="submitComment">등록</button>
        </div>

        <!-- 댓글 리스트 -->
        <FitlogCardComment
          v-for="comment in comments"
          :key="comment.proofCommentId"
          :comment="comment"
          :isEditing="editingCommentId === comment.proofCommentId"
          :editingContent="editingCommentContent"
          @updateEditingContent="updateCommentContent"
          @submitEdit="updateComment"
          @open-comment-modal="openCommentModal"
        />
      </div>

      <!-- 댓글 수정/삭제 모달 -->
      <div
        v-if="showCommentModal"
        class="modal-overlay"
        @click.self="closeCommentModal"
      >
        <div class="modal-box">
          <button class="modal-close-button" @click="closeCommentModal">
            ×
          </button>
          <div class="modal-title">댓글 관리</div>
          <button class="modal-button" @click="editComment">수정하기</button>
          <button class="modal-button delete" @click="deleteComment">
            삭제하기
          </button>
        </div>
      </div>

      <!-- 인증글 수정/삭제 모달 -->
      <div
        v-if="showProofModal"
        class="modal-overlay"
        @click.self="closeProofModal"
      >
        <div class="modal-box">
          <button class="modal-close-button" @click="closeProofModal">×</button>
          <div class="modal-title">인증글 관리</div>
          <button class="modal-button" @click="editProof">수정하기</button>
          <button
            class="modal-button delete"
            type="button"
            @click="deleteProof"
          >
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
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import FitlogCardComment from "./FitlogCardComment.vue";
import defaultProfileImg from "@/assets/images/myfit/profile-default.svg";
import { BASE_URL } from "@/api/api";

// props로 fitlog 객체 받음
const props = defineProps({
  fitlog: {
    type: Object,
    required: true,
  },
});

// 반응성 유지 위해 computed로 래핑
const fitlog = computed(() => props.fitlog);

// proofBoardId 추출 (댓글, 좋아요 API에 사용)
const proofBoardId = computed(() => fitlog.value?.proofBoardId || null);

// 유저 정보(store) 가져오기
const userStore = useUserStore();
const { nickName, userId, profileImgUrl } = storeToRefs(userStore);

const cacheBuster = ref(Date.now());

// 캐시 무효화를 위한 쿼리스트링 추가
const profileImgWithCache = computed(() => {
  if (profileImgUrl.value) {
    return `${BASE_URL}/${profileImgUrl.value}?t=${cacheBuster.value}`;
  }
  return "";
});

// 내 글인지 확인 (작성자 닉네임과 현재 닉네임 비교)
const isMyFitLog = computed(() => fitlog.value?.writer === nickName.value);

// 라우터 인스턴스
const router = useRouter();

// 댓글 및 인증글 모달 상태
const showCommentModal = ref(false);
const showProofModal = ref(false);

// 인증 이미지 URL (첫번째 proofFile이 있으면 주소 붙여서 반환)
const imgUrl = computed(() => {
  if (fitlog.value?.proofFiles?.length > 0) {
    return BASE_URL + "/" + fitlog.value.proofFiles[0].fileUrl;
  }
  return "";
});

// 좋아요 상태 관리
const isLiked = ref(false);
// 초기 좋아요 개수는 fitlog의 값을 넣되, 서버에서 새로고침 시 최신화 필요
const likeCount = ref(fitlog.value.likeCount || 0);
const likeAnimation = ref(false);

// 댓글 리스트 관리
const comments = ref([]);

// 댓글 작성 입력 상태
const commentContent = ref("");

// 댓글 수정 상태
const editingCommentId = ref(null);
const editingCommentContent = ref("");

// 선택된 댓글 (댓글 모달에서 관리 대상)
const selectedComment = ref(null);

/**
 * 좋아요 상태와 좋아요 개수를 서버에서 동기화하여 불러오는 함수
 * 컴포넌트 마운트 시, proofBoardId 혹은 닉네임 변경 시 호출하여 UI와 서버 상태 일치
 */
async function fetchLikeStatusAndCount() {
  if (!proofBoardId.value || !nickName.value) return;

  try {
    // 1) 좋아요 여부 조회 API 호출
    const resLikeStatus = await api.get(
      `/proof/${proofBoardId.value}/like/check`,
      {
        params: { writer: nickName.value },
      }
    );
    isLiked.value = resLikeStatus.data.liked;

    // 2) 인증글 상세 조회 API 호출하여 최신 좋아요 개수 받아오기
    const resProof = await api.get(`/proof/${proofBoardId.value}`);
    likeCount.value = resProof.data.likeCount ?? 0;
  } catch (error) {
    console.error("좋아요 상태 및 개수 불러오기 실패:", error);
  }
}

/**
 * 댓글 리스트 조회 API 호출
 */
async function fetchComments() {
  if (!proofBoardId.value) return;
  try {
    const res = await api.get(`/proof/${proofBoardId.value}/comment`);
    comments.value = res.data;
  } catch (error) {
    console.error("댓글 로딩 실패:", error);
  }
}

/**
 * 좋아요 토글 함수
 * UI는 즉시 반영(좋아요 수 1 증가/감소) - Optimistic UI
 * 실패 시 이전 상태로 롤백
 * 성공 시 서버 최신 데이터로 좋아요 수 재동기화
 */
const toggleLike = async () => {
  if (!proofBoardId.value || !nickName.value) return;

  likeAnimation.value = true;

  // 이전 좋아요 상태와 좋아요 수 저장 (롤백용)
  const prevLiked = isLiked.value;
  const prevCount = likeCount.value;

  // Optimistic UI 업데이트
  isLiked.value = !prevLiked;
  likeCount.value += isLiked.value ? 1 : -1;

  try {
    if (prevLiked) {
      // 이전에 좋아요 누른 상태였다면 좋아요 취소 API 호출
      await api.delete(`/proof/${proofBoardId.value}/like`, {
        data: { nickName: nickName.value },
      });
    } else {
      // 이전에 좋아요 안 누른 상태였다면 좋아요 추가 API 호출
      await api.post(`/proof/${proofBoardId.value}/like`, {
        nickName: nickName.value,
      });
    }

    // 좋아요 처리 후, 서버에서 최신 좋아요 개수 다시 받아와서 동기화
    const res = await api.get(`/proof/${proofBoardId.value}`);
    likeCount.value = res.data.likeCount ?? 0;
  } catch (error) {
    // 에러 발생 시 UI 롤백
    isLiked.value = prevLiked;
    likeCount.value = prevCount;
    console.error("좋아요 처리 실패:", error);
  }
};

/**
 * 댓글 등록 함수
 */
const submitComment = async () => {
  if (!commentContent.value.trim()) return; // 빈 댓글 무시

  if (!proofBoardId.value || !nickName.value || !userId.value) return;

  try {
    await api.post(`/proof/${proofBoardId.value}/comment`, {
      content: commentContent.value,
      writer: nickName.value,
      userId: userId.value,
      proofBoardId: proofBoardId.value,
    });
    commentContent.value = "";
    await fetchComments(); // 댓글 리스트 업데이트
  } catch (error) {
    console.error("댓글 등록 실패:", error);
  }
};

/**
 * 댓글 수정 내용 업데이트 (자식 컴포넌트에서 호출)
 */
const updateCommentContent = (val) => {
  editingCommentContent.value = val;
};

/**
 * 댓글 수정 함수
 */
const updateComment = async (proofCommentId) => {
  if (!proofBoardId.value) return;

  try {
    await api.put(`/proof/${proofBoardId.value}/comment/${proofCommentId}`, {
      content: editingCommentContent.value,
    });
    await fetchComments();
    editingCommentId.value = null;
    editingCommentContent.value = "";
  } catch (error) {
    console.error("댓글 수정 실패:", error);
  }
};

/**
 * 댓글 모달 열기
 */
const openCommentModal = (comment) => {
  selectedComment.value = comment;
  showCommentModal.value = true;
};

/**
 * 댓글 모달 닫기
 */
const closeCommentModal = () => {
  showCommentModal.value = false;
  selectedComment.value = null;
};

/**
 * 댓글 수정 버튼 클릭 시 호출
 */
const editComment = () => {
  if (!selectedComment.value) return;
  editingCommentId.value = selectedComment.value.proofCommentId;
  editingCommentContent.value = selectedComment.value.content;
  showCommentModal.value = false;
};

/**
 * 댓글 삭제 함수
 */
const deleteComment = async () => {
  if (!selectedComment.value || !proofBoardId.value) return;

  try {
    await api.delete(
      `/proof/${proofBoardId.value}/comment/${selectedComment.value.proofCommentId}`
    );
    showCommentModal.value = false;
    await fetchComments();
  } catch (error) {
    console.error("댓글 삭제 실패:", error);
  }
};

/**
 * 인증글 모달 상태 관리
 */
const openProofModal = () => {
  showProofModal.value = true;
};

const closeProofModal = () => {
  showProofModal.value = false;
};

/**
 * 인증글 수정 (이동)
 */
const editProof = () => {
  router.push({
    name: "FitLogUpdateView",
    params: { proofBoardId: proofBoardId.value },
  });
  closeProofModal();
};

/**
 * 인증글 삭제
 */
const deleteProof = async () => {
  if (!proofBoardId.value) return;

  try {
    await api.delete(`/proof/${proofBoardId.value}`);
    closeProofModal();
    router.push({ name: "FitLogView" });
  } catch (error) {
    console.error("인증글 삭제 실패:", error);
  }
};

// --- 컴포넌트 마운트 시, 좋아요 상태 및 댓글 목록 동기화 ---
onMounted(async () => {
  await fetchLikeStatusAndCount(); // 좋아요 상태와 개수 함께 받아옴
  await fetchComments();
});

// 작성자 프사 이미지
const writerProfileImgUrl = ref(""); // 반응형으로 선언
watch(
  () => fitlog.value?.writer,
  async (writer) => {
    if (writer) {
      try {
        const { data } = await api.get(`/user/${writer}`);
        writerProfileImgUrl.value = data.profileImgUrl
          ? `${BASE_URL}/${data.profileImgUrl}`
          : defaultProfileImg;
      } catch (error) {
        console.error("작성자 프로필 이미지 가져오기 실패:", error);
        writerProfileImgUrl.value = defaultProfileImg;
      }
    } else {
      writerProfileImgUrl.value = defaultProfileImg;
    }
  },
  { immediate: true }
);

// proofBoardId 또는 닉네임이 변경될 때도 다시 동기화
watch([proofBoardId, nickName], async ([newProofId, newNick]) => {
  if (newProofId && newNick) {
    await fetchLikeStatusAndCount();
    await fetchComments();
  }
});
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
/* 작성자 정보 */
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  gap: 10px;
}

.userAndTitle {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-profile-image {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.user-info .title {
  font-weight: bold;
  font-size: 1.6rem;
  color: #222;
}

.user-info .user-name {
  font-size: 1.1rem;
  color: #777;
  margin-top: 7px;
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

/* 인증 이미지 */
.proof-image img {
  width: 100%;
  max-height: 500px;
  object-fit: cover; /* 비율 유지하면서 채우기 (일부 잘릴 수 있음) */
  border-radius: 12px;
  margin-bottom: 16px;
}

/* 운동 정보 뱃지 */
.badges {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.badge {
  font-size: 1rem;
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

/* 인증글 본문 */
.proof-content p {
  font-size: 1.25rem;
  line-height: 1.6;
  color: #444;
  margin-bottom: 8px;
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
  font-size: 1rem;
  display: flex;
  gap: 10px;
}

.go-challenge {
  font-size: 1rem;
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
  padding-top: 12px;
  font-size: 1rem;
  color: #666;
}

.write-date {
  font-size: 1rem;
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
  cursor: pointer;
}

.stats .like i {
  transition: transform 0.2s ease, color 0.2s ease;
}

.stats .like:hover i {
  transform: scale(1.8);
  color: #ff8787; /* hover 시 색 강조 */
}

.fa-heart.liked {
  color: #ff6b6b;
}
.fa-heart {
  color: #ccc;
  transition: color 0.3s;
}
/* .stats .like {
  color: #ff6b6b;
  cursor: pointer;
} */
.pop {
  animation: pop 0.3s ease;
}

@keyframes pop {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.5);
  }
  100% {
    transform: scale(1);
  }
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
  margin-top: 24px;
}

.comment-card {
  display: flex;
  background-color: #f9f9f9;
  padding: 12px 16px;
  border-radius: 12px;
  align-items: flex-start;
  position: relative;
}

.comment-profile {
  width: 36px;
  height: 36px;
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
</style>
