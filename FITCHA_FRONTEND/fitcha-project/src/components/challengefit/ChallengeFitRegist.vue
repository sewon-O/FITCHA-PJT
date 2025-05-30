<template>
  <div class="challenge-form-wrapper">
    <h2>챌린지 만들기</h2>

    <form class="challenge-form" @submit.prevent="requestChallengeRegist">
      <!-- 썸네일 미리보기 -->
      <div class="form-group">
        <label for="thumbnail">썸네일 이미지</label>
        <div class="image-preview" id="imagePreview">
          <span v-if="!thumbnailPreview">이미지를 선택하면 미리보기가 표시됩니다</span>
        </div>
        <input type="file" id="thumbnail" accept="image/*" @change="thumbnailPreviewChange" />
      </div>

      <!-- 제목 -->
      <div class="form-group">
        <label for="title">챌린지 제목</label>
        <input type="text" id="title" placeholder="예: 30일 아침 러닝 챌린지!!" v-model="title" required />
      </div>

      <!-- 설명 -->
      <div class="form-group">
        <label for="content">설명</label>
        <textarea id="content" rows="4" placeholder="챌린지 내용을 입력하세요." v-model="content" required></textarea>
      </div>

      <!-- 운동 타입 -->
      <div class="form-group">
        <label for="exerciseType">운동 타입</label>
        <select id="exerciseType" v-model="exerciseType">
          <option disabled hidden>선택</option>
          <option>근력 운동</option>
          <option>유산소</option>
          <option>필라테스</option>
          <option>스트레칭</option>
        </select>
      </div>

      <!-- 운동부위 -->
      <div class="form-group">
        <label for="bodyPart">운동 부위</label>
        <select id="bodyPart" v-model="bodyPart">
          <option disabled hidden>선택</option>
          <option>전신</option>
          <option>상체</option>
          <option>하체</option>
          <option>복부</option>
        </select>
      </div>

      <!-- 난이도 -->
      <div class="form-group">
        <label for="level">난이도</label>
        <select id="level" v-model="level">
          <option disabled hidden>선택</option>
          <option>초보</option>
          <option>중급</option>
          <option>고급</option>
        </select>
      </div>

      <!-- 모집 인원 -->
      <div class="form-group">
        <label for="totalParticipantCount">모집 인원</label>
        <input
          type="number"
          id="totalParticipantCount"
          placeholder="예: 10"
          min="1"
          max="100"
          v-model="totalParticipantCount"
        />
      </div>
      <!-- 챌린지 기간 -->
      <div class="form-group">
        <label for="duration">챌린지 기간</label>
        <input type="number" id="duration" placeholder="예: 10" min="1" max="100" v-model="duration" />
      </div>

      <!-- 제출 버튼 -->
      <div class="challenge-regist">
        <button type="submit" class="submit-btn">등록하기</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import api from '@/api/api';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';

const router = useRouter();

// 폼 데이터 상태
const title = ref('');
const content = ref('');
const exerciseType = ref('');
const bodyPart = ref('');
const level = ref('');
const totalParticipantCount = ref(1);
const thumbnailFile = ref(null);
const thumbnailPreview = ref('');
const duration = ref(1);
const { userId, nickName } = useUserStore();

// 이미지 미리보기 및 파일 저장
const thumbnailPreviewChange = e => {
  const file = e.target.files[0];
  if (file) {
    thumbnailFile.value = file;
    const reader = new FileReader();
    reader.onload = () => {
      const preview = document.getElementById('imagePreview');
      preview.style.backgroundImage = `url(${reader.result})`;
      thumbnailPreview.value = reader.result;
    };
    reader.readAsDataURL(file);
  }
};

// 폼 제출 처리
const requestChallengeRegist = async () => {
  try {
    const formData = new FormData();

    formData.append('userId', userId);
    formData.append('writer', nickName);
    formData.append('title', title.value);
    formData.append('content', content.value);
    formData.append('exerciseType', exerciseType.value);
    formData.append('bodyPart', bodyPart.value);
    formData.append('level', level.value);
    formData.append('totalParticipantCount', totalParticipantCount.value);
    formData.append('duration', duration.value);

    if (thumbnailFile.value) {
      formData.append('files', thumbnailFile.value);
    }

    const response = await api.post('/challenge', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      query: {
        isViewCounted: 'false',
        writer: nickName,
      },
    });

    if (response.status === 200) {
      router.push({
        name: 'ChallengeFitDetail',
        params: { id: response.data },
        query: {
          isViewCounted: 'false',
          writer: nickName,
        },
      });
    }
  } catch (err) {
    console.error('등록 실패:', err);
    alert('등록에 실패했습니다.');
  }
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
  font-family: 'Arial', sans-serif;
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
  height: 160px;
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
</style>
