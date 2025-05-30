<template>
  <!-- 챌린지 인증글 작성 구조 -->
  <div class="challenge-form-wrapper">
    <h2>챌린지 인증 수정하기</h2>

    <form class="challenge-form" @submit.prevent="submitUpdateProof">
      <!-- 썸네일 미리보기 -->
      <div class="form-group">
        <label for="thumbnail">썸네일 이미지</label>
        <div
          class="image-preview"
          id="imagePreview"
          :style="
            thumbnailPreview
              ? { backgroundImage: `url(${thumbnailPreview})` }
              : {}
          "
        >
          <span v-if="!thumbnailPreview"
            >이미지를 선택하면 미리보기가 표시됩니다</span
          >
        </div>
        <input
          type="file"
          id="thumbnail"
          accept="image/*"
          @change="onImageChange"
        />
      </div>

      <!-- 제목 -->
      <div class="form-group">
        <label for="title">인증글 제목</label>
        <input type="text" id="title" v-model="title" />
      </div>

      <!-- 설명 -->
      <div class="form-group">
        <label for="description">설명</label>
        <textarea
          id="description"
          rows="4"
          placeholder="챌린지 내용을 입력하세요."
          v-model="content"
        ></textarea>
      </div>

      <!-- 해시태그 입력 영역 -->
      <div class="hashtag-input-box">
        <div class="tags">
          <span class="tag" v-for="(tag, index) in hashtags" :key="index">
            {{ tag }}
            <button class="remove-tag" type="button" @click="removeTag(index)">
              <span>x</span>
            </button>
          </span>
          <input
            v-model="newTag"
            @keydown.enter.prevent="addTag"
            @keydown.space.prevent="addTag"
            type="text"
            placeholder="해시태그 입력 후 엔터(예: #러닝)"
          />
        </div>
      </div>

      <!-- 운동 타입 -->
      <div class="form-group">
        <label for="type">운동 타입</label>
        <select id="type" disabled>
          <option>{{ exerciseType }}</option>
        </select>
      </div>

      <!-- 지역 -->
      <div class="form-group">
        <label for="location">지역</label>
        <select id="location" disabled>
          <option>{{ bodyPart }}</option>
        </select>
      </div>

      <!-- 난이도 -->
      <div class="form-group">
        <label for="level">난이도</label>
        <select id="level" disabled>
          <option>{{ level }}</option>
        </select>
      </div>

      <!-- 제출 버튼 -->
      <div class="challenge-regist">
        <button type="submit" class="submit-btn">등록하기</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import api, { BASE_URL } from "@/api/api";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
const router = useRouter();
const props = defineProps({
  fitlog: {
    type: Object,
  },
});

const title = ref("");
const content = ref("");
const challengeBoardId = ref(0);
const writer = ref("");
const exerciseType = ref("");
const bodyPart = ref("");
const level = ref("");
const hashtags = ref([]);
const thumbnailPreview = ref("");
const userId = ref("");
const nickName = ref("");
const thumbnailFile = ref(null);
const newTag = ref(""); // 해시태그 입력 필드 상태

watch(
  () => props.fitlog,
  async (fitlog) => {
    if (!fitlog) return;

    title.value = fitlog.title || "";
    content.value = fitlog.content || "";
    challengeBoardId.value = fitlog.challengeBoardId || 0;
    writer.value = fitlog.writer || "";
    exerciseType.value = fitlog.exerciseType || "";
    bodyPart.value = fitlog.bodyPart || "";
    level.value = fitlog.level || "";
    hashtags.value = [...(fitlog.hashTags || [])];

    if (fitlog.proofFiles?.length > 0) {
      thumbnailPreview.value = BASE_URL + "/" + fitlog.proofFiles[0].fileUrl;
    }
  },
  { immediate: true }
);

// 이미지 미리보기
function onImageChange(event) {
  const file = event.target.files[0];
  if (file) {
    thumbnailFile.value = file;
    thumbnailPreview.value = URL.createObjectURL(file);
  }
}

// 해쉬 태그 추가
function addTag() {
  const tag = newTag.value.trim();
  if (tag && !hashtags.value.includes(tag)) {
    hashtags.value.push(tag);
  }
  newTag.value = "";
}

function removeTag(index) {
  hashtags.value.splice(index, 1);
}

// 인증글 수정 요청
const submitUpdateProof = async () => {
  const formData = new FormData();
  formData.append("files", thumbnailFile.value);
  formData.append("title", title.value);
  formData.append("userId", userId.value);
  formData.append("challengeBoardId", String(challengeBoardId.value));
  formData.append("content", content.value);
  formData.append("writer", nickName.value);
  formData.append("exerciseType", exerciseType.value);
  formData.append("bodyPart", bodyPart.value);
  formData.append("level", level.value);
  hashtags.value.forEach((tag) => {
    formData.append("hashTags", tag);
  });

  await api.put(`/proof/${props.fitlog?.proofBoardId}`, formData);

  router.replace(`/fitlog/${props.fitlog?.proofBoardId}`);
};
</script>

<style scoped>
/* 챌린지 게시글 작성 폼 css */
/* 일단 인증글 작성폼도 동일하게 만들었기 때문에 인증글 작성폼에서도 이 css 파일 불러오면 됨 */
.challenge-form-wrapper {
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  background-color: #ffffff;
  border-radius: 15px;
  box-shadow: 0px 6px 20px rgba(0, 0, 0, 0.1);
  padding: 24px;
  font-family: "Arial", sans-serif;
}

.challenge-form-wrapper h2 {
  font-size: 1.3rem;
  color: #222;
  font-weight: bold;
  margin-bottom: 20px;
}

.challenge-form .form-group {
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
}

.challenge-form label {
  font-size: 0.9rem;
  margin-bottom: 6px;
  color: #333;
  font-weight: 500;
}

.challenge-form input,
.challenge-form select,
.challenge-form textarea {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 0.85rem;
  background-color: #f9f9f9;
  color: #333;
}

.challenge-form textarea {
  resize: vertical;
}

.challenge-form .date-group {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.challenge-form .date-group > div {
  flex: 1;
}

.challenge-regist-button-wrapper {
  display: flex;
  justify-content: end;
}
.challenge-form .submit-btn {
  background-color: #3cb371;
  color: #fff;
  border: none;
  padding: 12px;
  font-size: 1rem;
  font-weight: bold;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.challenge-form .submit-btn:hover {
  background-color: #2e9c64;
}

.challenge-form .image-preview {
  width: 100%;
  height: 280px;

  background-size: cover;
  background-position: center, center;
  background-repeat: no-repeat;
  overflow: hidden;

  border: 1px dashed #ccc;
  border-radius: 8px;
  margin-bottom: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #aaa;
  font-size: 0.8rem;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

/* 해쉬태그 입력 */
.hashtag-input-box {
  margin: 12px 0;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  border: 1px solid #ccc;
  padding: 6px 8px;
  border-radius: 8px;
  min-height: 42px;
}

.tags input {
  border: none;
  outline: none;
  font-size: 0.9rem;
  flex: 1;
  min-width: 100px;
}

.tag {
  background-color: #e6f4ea;
  color: #2b8a3e;
  padding: 6px 10px;
  border-radius: 20px;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 6px;
}

.remove-tag {
  background: none;
  border: none;
  color: #2b8a3e;
  font-weight: bold;
  cursor: pointer;
  padding: 0;
}
</style>
