<template>
  <!-- 회원가입 폼 -->
  <div class="signup-wrapper">
    <h2>🏃‍♀️ 회원가입하고 챌린지 시작하기!</h2>
    <form class="signup-form" @submit="signup">
      <div class="form-group">
        <label for="userid">아이디</label>
        <input
          type="text"
          id="userid"
          placeholder="아이디를 입력하세요"
          v-model="form.userId"
          required
          :readonly="!isPossible"
          :style="{ backgroundColor: isPossible ? '' : '#e0e0e0' }"
        />
      </div>

      <div class="form-group" v-if="isShow">
        <label for="password">패스워드</label>
        <input type="password" id="password" placeholder="비밀번호를 입력하세요" v-model="form.password" required />
      </div>

      <div class="form-group">
        <label for="name">이름</label>
        <input type="text" id="name" placeholder="이름을 입력하세요" required v-model="form.name" />
      </div>

      <div class="form-group">
        <label for="nickname">닉네임</label>
        <input type="text" id="nickname" placeholder="닉네임을 입력하세요" v-model="form.nickName" required />
        <p
          :style="{
            color: isNicknameValid ? 'green' : 'red',
            fontSize: '0.85rem',
            marginTop: '5px',
          }"
        >
          {{ nicknameMessage }}
        </p>
      </div>

      <div class="form-group">
        <label for="age">나이</label>
        <input type="number" id="age" placeholder="나이를 입력하세요" required v-model="form.age" min="0" />
      </div>

      <div class="form-group">
        <label for="gender">성별</label>
        <select id="gender" required v-model="form.gender">
          <option value="">선택</option>
          <option>남성</option>
          <option>여성</option>
        </select>
      </div>

      <button type="submit" class="signup-btn"><i class="fas fa-dumbbell"></i> 회원가입 완료</button>
    </form>
  </div>
</template>

<script setup>
import axios from 'axios';
import { onBeforeMount, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api, { BASE_URL } from '@/api/api';

const route = useRoute();
const router = useRouter();

const form = ref({
  userId: '',
  password: '',
  email: '',
  name: '',
  nickName: '',
  age: '',
  gender: '',
});

const isPossible = ref(true);
const nicknameMessage = ref('');
const isNicknameValid = ref(true);

// 닉네임 자동 생성
async function getRandomNickname() {
  try {
    const { data } = await axios.get(`${BASE_URL}/api/nickname/generate`);
    form.value.nickName = data;
    nicknameMessage.value = '자동으로 생성된 닉네임입니다.';
    isNicknameValid.value = true;
  } catch {
    nicknameMessage.value = '닉네임 생성 실패';
    isNicknameValid.value = false;
  }
}

// 닉네임 중복 검사
async function checkNickname() {
  const trimmed = form.value.nickName.trim();

  if (!trimmed) {
    nicknameMessage.value = '닉네임을 입력해주세요.';
    isNicknameValid.value = false;
    return;
  }

  try {
    const { data: exists } = await axios.get(`${BASE_URL}/api/nickname/check`, {
      params: { nickname: trimmed },
    });

    if (exists) {
      nicknameMessage.value = '이미 사용 중인 닉네임입니다.';
      isNicknameValid.value = false;
    } else {
      nicknameMessage.value = '사용 가능한 닉네임입니다.';
      isNicknameValid.value = true;
    }
  } catch {
    nicknameMessage.value = '닉네임 확인 실패';
    isNicknameValid.value = false;
  }
}
const isShow = ref(true);

// 최초 진입 시 자동 닉네임 생성
onMounted(() => {
  getRandomNickname();

  if (route.query.userId != null) {
    form.value.userId = route.query.userId;
    isPossible.value = false;
  }

  // 이전 경로 콘솔 확인
  if (route.query.from && route.query.from.substring(1, 14) == 'oauth-success') {
    // console.log('이전 페이지:', route.query.from);
    isShow.value = false;
    form.value.password = null;
  }
});

// 닉네임 감지하여 자동 검사
watch(
  () => form.value.nickName,
  (newVal, oldVal) => {
    if (newVal !== oldVal) checkNickname();
  }
);

// 회원가입 요청
const signup = async e => {
  e.preventDefault();

  if (!isNicknameValid.value) {
    alert('닉네임이 중복되었습니다. 다른 닉네임을 사용해주세요.');
    return;
  }

  try {
    form.value.nickName = form.value.nickName.trim(); // 백엔드로 전송 전 trim 처리
    await axios.post(`${BASE_URL}/user/signup`, form.value);
    alert('회원가입에 성공했습니다. 로그인해주세요');
    router.push(`/login`);
  } catch (err) {
    console.log('회원가입 실패: ', err);
  }
};
</script>

<style scoped>
.signup-wrapper {
  max-width: 400px;
  margin: 50px auto;
  background-color: #ffffff;
  padding: 40px 30px;
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(144, 228, 200, 0.5);
  text-align: center;
  font-family: 'Noto Sans KR', sans-serif;
}

.signup-wrapper h2 {
  margin-top: 0px;
  color: #333;
  margin-bottom: 30px;
  font-weight: 700;
}

.signup-form .form-group {
  margin-bottom: 20px;
  text-align: left;
}

.signup-form label {
  display: block;
  margin-bottom: 6px;
  font-weight: 600;
  color: #444;
}

.signup-form input,
.signup-form select {
  width: 100%;
  padding: 12px;
  border-radius: 10px;
  font-size: 14px;
  box-sizing: border-box;
  border: 2px solid #e0e0e0;
  transition: all 0.3s ease;
}

.signup-form input:focus,
.signup-form select:focus {
  border-color: #90e4c8;
  box-shadow: 0 0 5px rgba(144, 228, 200, 0.5);
  outline: none;
}

.signup-btn {
  width: 100%;
  padding: 14px;
  background-color: #ffa94d;
  color: #fff;
  font-size: 16px;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  font-weight: bold;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.signup-btn:hover {
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 6px 12px rgba(255, 169, 77, 0.5);
}

.signup-btn i {
  margin-right: 8px;
}
</style>
