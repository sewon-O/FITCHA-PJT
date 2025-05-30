<template>
  <div class="login-component">
    <div class="login-bg"></div>

    <div class="login-card">
      <h2><span>🏃‍♀️</span> 운동하러 왔나요?</h2>

      <form class="login-form" @submit="login">
        <input type="text" placeholder="아이디" required v-model="form.userId" />
        <input type="password" placeholder="비밀번호" required v-model="form.password" />
        <button type="submit">로그인</button>
      </form>

      <router-link to="/signup">
        <div class="signup-btn">
          <button>회원가입</button>
        </div>
      </router-link>

      <div class="social-login">
        <div class="divider"><span>또는</span></div>

        <button class="social-btn kakao" @click="oauthLogin('kakao')">
          <img src="../../assets/images/login/kakao.svg" alt="Kakao" />
          카카오로 시작하기
        </button>

        <button class="social-btn naver" @click="oauthLogin('naver')">
          <img src="../../assets/images/login/naver.svg" alt="Naver" />
          네이버로 시작하기
        </button>

        <button class="social-btn google" @click="oauthLogin('google')">
          <img src="../../assets/images/login/google.png" alt="Google" />
          구글로 시작하기
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { BASE_URL } from "@/api/api";
import { useUserStore } from "@/stores/user";
import axios from "axios";
import { ref } from "vue";
import { useRouter } from "vue-router";

const userStore = useUserStore();
const router = useRouter();

const form = ref({
  userId: '',
  password: '',
});

const login = async e => {
  e.preventDefault(); // 폼 기본 기능 막기(새로고침)
  try {
    const response = await axios.post(`${BASE_URL}/user/login`, form.value);
    const { token, userId, nickName, userBoardId, profileImgUrl } = response.data;

    // 토큰 저장
    localStorage.setItem('access-token', token);

    // Pinia 상태 저장
    userStore.setUser({ userId, nickName, userBoardId, profileImgUrl });

    router.push(`/home`);
  } catch (err) {
    console.error('로그인 실패: ', err);
    alert('로그인에 실패했습니다.');
  }
};

const oauthLogin = provider => {
  window.location.href = `${BASE_URL}/oauth2/authorization/${provider}`;
};
</script>

<style scoped>
.login-component {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 500px;
  padding: 60px 0;
  overflow: hidden;
}

.login-component .login-bg {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  /* background: linear-gradient(135deg, #b2f1e6, #e2fcf5, #c2f6e6); */
  background-size: 400% 400%;
  animation: login-moveGradient 12s ease infinite;
  z-index: 1;
  opacity: 0.6;
  filter: blur(40px);
}

@keyframes login-moveGradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.login-component .login-card {
  position: relative;
  z-index: 2;
  max-width: 360px;
  margin: auto;
  background: white;
  border-radius: 20px;
  padding: 40px 30px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  animation: login-fadeInUp 1.2s ease;
  text-align: center;
}

@keyframes login-fadeInUp {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.login-component .login-card h2 {
  margin: 0px;
  font-size: 22px;
  margin-bottom: 24px;
  font-weight: 800;
  color: #222;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.login-component .login-form input {
  width: 100%;
  padding: 14px;
  margin-bottom: 15px;
  box-sizing: border-box;
  border: 1px solid #ddd;
  border-radius: 10px;
  background: #f9f9f9;
  transition: 0.3s;
  font-size: 15px;
}

.login-component .login-form input:focus {
  border-color: #49c5b6;
  background: #fff;
  outline: none;
  box-shadow: 0 0 0 2px #bdf0e6;
}

.login-component .login-form button {
  width: 100%;
  padding: 14px;
  background-color: #49c5b6;
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s;
}

.login-component .login-form button:hover {
  background-color: #3db0a4;
  transform: scale(1.03);
}

.login-component .login-links {
  font-size: 13px;
  margin-top: 12px;
}
.signup-btn button {
  width: 100%;
  padding: 14px;
  background-color: #ffffff;
  color: #49c5b6;
  font-weight: bold;
  border: 2px solid #49c5b6;
  border-radius: 10px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 10px;
}

.signup-btn button:hover {
  background-color: #e6fbf8;
  transform: scale(1.03);
}

.login-component .login-links a {
  color: #49c5b6;
  text-decoration: none;
}

.login-component .login-links a:hover {
  text-decoration: underline;
}

.login-component .divider {
  text-align: center;
  margin: 20px 0;
  position: relative;
  font-size: 13px;
  color: #aaa;
}
.login-component .divider::before,
.login-component .divider::after {
  content: '';
  position: absolute;
  top: 50%;
  width: 40%;
  height: 1px;
  background: #ddd;
}
.login-component .divider::before {
  left: 0;
}
.login-component .divider::after {
  right: 0;
}

.login-component .social-login {
  margin-top: 20px;
}

.login-component .social-btn {
  width: 100%;
  display: flex;
  align-items: center; /* 수직 중앙 정렬 */
  justify-content: center; /* 가운데 정렬 */
  gap: 12px;
  padding: 12px;
  margin-bottom: 10px;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s ease;
  text-align: center;
  line-height: 1; /* 높이 균형 */
}

.login-component .social-btn img {
  width: 22px;
  height: 22px;
  display: inline-block;
}

/* 플랫폼별 스타일 */
.login-component .kakao {
  background-color: #fee500;
  color: #3a1d1d;
}
.login-component .kakao:hover {
  background-color: #f1d400;
}

.login-component .naver {
  background-color: #03c75a;
  color: #fff;
}
.login-component .naver:hover {
  background-color: #02b34f;
}

.login-component .google {
  background-color: #ffffff;
  color: #444;
  border: 1px solid #ddd;
}
.login-component .google:hover {
  background-color: #f5f5f5;
}
</style>
