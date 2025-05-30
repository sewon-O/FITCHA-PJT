<template>
  <div class="comment-card">
    <img
      v-if="commentProfileImgUrl"
      class="comment-profile"
      :src="commentProfileImgUrl"
      alt="프로필"
    />
    <img v-else class="comment-profile" :src="defaultProfileImg" alt="프로필" />
    <div class="comment-body">
      <div class="comment-header">
        <span class="comment-author">{{ comment.writer }}</span>
        <div class="comment-menu" v-if="isMyComment" @click="openCommentModal">
          <i class="fas fa-ellipsis-v"></i>
        </div>
      </div>
      <div v-if="!isEditing" class="comment-text">
        {{ comment.content }}
      </div>
      <div v-else class="comment-edit">
        <input
          type="text"
          class="edit-input"
          :value="editingContent"
          @input="onInput"
          placeholder="댓글을 수정하세요"
          @keyup.enter="submitEdit"
        />
        <button class="edit-button" @click="submitEdit">수정 완료</button>
      </div>

      <div class="comment-date">{{ comment.regDate }}</div>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { computed, ref, watch } from "vue";
import defaultProfileImg from "@/assets/images/myfit/profile-default.svg";
import api from "@/api/api";
import { BASE_URL } from "@/api/api";

const userStore = useUserStore();
const { nickName, userId } = storeToRefs(userStore);
const props = defineProps({
  comment: {
    type: Object,
    required: true,
  },
  isEditing: {
    type: Boolean,
    default: false,
  },
  editingContent: {
    type: String,
    default: "",
  },
});

// 댓글 작성자 프사
const commentProfileImgUrl = ref(""); // 반응형으로 선언
watch(
  () => props.comment?.writer,
  async (writer) => {
    if (writer) {
      try {
        const { data } = await api.get(`/user/${writer}`);
        commentProfileImgUrl.value = data.profileImgUrl
          ? `${BASE_URL}/${data.profileImgUrl}`
          : defaultProfileImg;
      } catch (error) {
        console.error("작성자 프로필 이미지 가져오기 실패:", error);
        commentProfileImgUrl.value = defaultProfileImg;
      }
    } else {
      commentProfileImgUrl.value = defaultProfileImg;
    }
  },
  { immediate: true }
);

const isMyComment = computed(() => {
  return props.comment?.writer === nickName.value;
});

// 댓글 모달 띄우기 부모에 emit
const emit = defineEmits([
  "updateEditingContent",
  "submitEdit",
  "open-comment-modal",
]);

const onInput = (e) => {
  emit("updateEditingContent", e.target.value);
};

const submitEdit = () => {
  emit("submitEdit", props.comment.proofCommentId);
};

const openCommentModal = () => {
  emit("open-comment-modal", props.comment);
};
</script>

<style scoped>
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

/* 댓글 수정 폼 */
.comment-edit {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 6px 0;
}

.edit-input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #c0d5c2;
  border-radius: 8px;
  font-size: 0.88rem;
  outline: none;
  transition: border-color 0.2s;
  /* background-color: #f4fdf5; */
  color: #2d4930;
}

.edit-input:focus {
  border-color: #7db97e;
  box-shadow: 0 0 0 2px rgba(125, 185, 126, 0.2);
}

.edit-button {
  padding: 6px 12px;
  background-color: #7db97e;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.edit-button:hover {
  background-color: #639e67;
}
</style>
