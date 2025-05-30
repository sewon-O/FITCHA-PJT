<template>
  <div class="right-sidebar">
    <!-- 로그인 유저 정보 섹션 -->

    <div class="profile-section" v-if="nickName">
      <img
        :src="profileImgWithCache || defaultProfileImg"
        alt="프로필 이미지"
        class="profile-img"
      />
      <div class="profile-text">
        <span class="nickname">{{ nickName }}</span>
        <span class="user-meta">🌱 challenge Lv.1</span>
      </div>
      <router-link
        :to="`/myfit/${nickName}`"
        class="settings-icon"
        title="마이페이지"
      >
        <i class="fas fa-cog"></i>
      </router-link>
    </div>

    <!-- 로그인 버튼 -->
    <router-link style="text-decoration: none" to="/login">
      <div v-if="!nickName" class="loginBtn">
        <button type="button"><i class="fas fa-user-circle"></i> Login</button>
      </div>
    </router-link>

    <!-- 달력 영역 (현재 비어있음, 스타일만 지정됨) -->
    <div class="calendar-container">
      <Datepicker v-model="selectedDate" :inline="true" />
    </div>
    <!-- 위치 권한 요청 모달 -->
    <div v-if="showLocationRequest" class="modal-overlay">
      <div class="modal-content">
        <p>위치 기반 날씨 정보를 제공하려면 위치 권한이 필요합니다.</p>
        <div class="modal-buttons">
          <!-- 위치 권한 허용 버튼 -->
          <button @click="requestLocation">위치 권한 허용</button>
          <!-- 위치 권한 거부 버튼 -->
          <button class="reject-btn" @click="rejectLocation">거부</button>
        </div>
      </div>
    </div>

    <!-- 위치 권한 요청 모달이 닫힌 후 보여지는 날씨 정보 영역 -->
    <div class="weather" v-else>
      <div class="weather-icon">
        <i :class="weatherIconClass"></i>
      </div>

      <div v-if="loading">날씨 정보를 불러오는 중입니다...</div>

      <div v-else-if="error" class="error-msg">{{ error }}</div>

      <div v-else class="weather-data">
        <div>
          <i class="fas fa-temperature-high temp-icon"></i>
          <span>기온: {{ temperature || "-" }}°C</span>
        </div>
        <div>
          <i class="fas fa-tint humidity-icon"></i>
          <span>습도: {{ humidity || "-" }}%</span>
        </div>
        <div>
          <i class="fas fa-cloud-rain rain-icon"></i>
          <span>강수: {{ rain || "-" }}</span>
        </div>
        <div>
          <i class="fas fa-cloud-sun sky-icon"></i>
          <span>하늘: {{ sky || "-" }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 사용자 상태 관리를 위해 Pinia 스토어 사용
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import Datepicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

const selectedDate = ref(new Date());

// Vue Composition API
import { ref, computed, onMounted } from "vue";

// 기본 프로필 이미지 임포트
import defaultProfileImg from "@/assets/images/myfit/profile-default.svg";

// API 호출을 위한 공통 api 모듈 임포트
import api from "@/api/api";

onMounted(() => {
  const lastLocationPrompt = localStorage.getItem("lastLocationPrompt");
  const now = Date.now();

  if (!lastLocationPrompt || now - Number(lastLocationPrompt) > 3600000) {
    // 1시간(3600000ms) 지났으면 다시 물어봄
    showLocationRequest.value = true;
  } else {
    // 최근에 이미 물어봤으니 그냥 서울로 설정
    showLocationRequest.value = false;
    fetchWeather(37.5665, 126.978);
  }
});

// --- 상태 변수 선언 ---

// 날씨 데이터 저장 변수들 (초기값 빈 문자열)
const temperature = ref("");
const humidity = ref("");
const rain = ref("");
const sky = ref("");

// 로딩 상태 (날씨 정보 요청 중인지 여부)
const loading = ref(false);

// 에러 메시지 저장 변수
const error = ref(null);

// 위치 권한 요청 모달 표시 여부
const showLocationRequest = ref(true);

// --- 날씨 API 호출 함수 ---
async function fetchWeather(lat, lon) {
  try {
    loading.value = true; // 로딩 시작
    error.value = null; // 에러 초기화

    // 백엔드에 현재 위치(lat, lon) 전달해 날씨 정보 요청
    const { data } = await api.get("/weather", {
      params: { lat, lon },
    });

    // 받아온 날씨 데이터를 각각 변수에 저장
    temperature.value = data.temperature;
    humidity.value = data.humidity;
    rain.value = data.rain;
    sky.value = data.sky;
  } catch (err) {
    // 요청 실패 시 에러 메시지 저장 및 콘솔에 출력
    error.value = "날씨 정보를 불러오는데 실패했습니다.";
    console.error(err);
  } finally {
    loading.value = false; // 로딩 종료
  }
}

// --- 위치 권한 허용 요청 함수 ---
function requestLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        showLocationRequest.value = false;
        localStorage.setItem("lastLocationPrompt", Date.now()); // ✅ 시간 저장
        fetchWeather(pos.coords.latitude, pos.coords.longitude);
      },
      (err) => {
        showLocationRequest.value = false;
        error.value =
          "위치 권한이 거부되었습니다. 기본 위치(서울)로 설정합니다.";
        localStorage.setItem("lastLocationPrompt", Date.now()); // ✅ 시간 저장
        fetchWeather(37.5665, 126.978);
      }
    );
  } else {
    showLocationRequest.value = false;
    error.value = "이 브라우저는 위치 정보를 지원하지 않습니다.";
    localStorage.setItem("lastLocationPrompt", Date.now()); // ✅ 시간 저장
  }
}

function rejectLocation() {
  showLocationRequest.value = false;
  error.value =
    "위치 권한 요청이 거부되었습니다. 기본 위치(서울)로 설정합니다.";
  localStorage.setItem("lastLocationPrompt", Date.now()); // ✅ 시간 저장
  fetchWeather(37.5665, 126.978);
}

// --- 하늘 상태에 따른 아이콘 클래스 계산 (font awesome 클래스) ---
const weatherIconClass = computed(() => {
  switch (sky.value) {
    case "맑음":
      return "fas fa-sun";
    case "구름 많음":
    case "흐림":
      return "fas fa-cloud";
    case "비":
      return "fas fa-cloud-showers-heavy";
    case "눈":
      return "fas fa-snowflake";
    case "비/눈":
      return "fas fa-cloud-meatball";
    default:
      return "fas fa-smog";
  }
});

// --- 사용자 정보 스토어에서 닉네임과 프로필 이미지 URL 가져오기 ---
const userStore = useUserStore();
const { nickName, profileImgUrl } = storeToRefs(userStore);

// --- 프로필 이미지 캐시 무효화용 타임스탬프 (변경 시 이미지 강제 새로고침) ---
const cacheBuster = ref(Date.now());

import { BASE_URL } from "@/api/api";

// --- 프로필 이미지 URL에 타임스탬프 쿼리 추가 (없으면 빈 문자열 반환) ---
const profileImgWithCache = computed(() => {
  if (profileImgUrl.value) {
    return BASE_URL + `/${profileImgUrl.value}?t=${cacheBuster.value}`;
  }
  return "";
});
</script>

<style scoped>
/* 우측 사이드바 전체 레이아웃 */
.right-sidebar {
  width: 220px;
  padding: 40px 20px 30px;
}
/* 유저 정보 카드 스타일 */
.user-info {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 12px;
  cursor: default;
  transition: box-shadow 0.2s ease;
}

/* 프로필 이미지 스타일 */
.profile-img {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
}

/* 닉네임과 상태 인디케이터 컨테이너 */
.user-details {
  display: flex;
  align-items: center;
  gap: 6px;
}

/* 닉네임 텍스트 */
.nickname {
  font-size: 1.1rem;
  font-weight: 600;
  color: #334155; /* slate-700 계열, 깔끔하고 차분 */
  user-select: none;
}

/* 온라인 상태 점 (심플하게, 연한 초록색) */

/* 로그인 버튼 심플 스타일 */
.loginBtn {
  display: flex;
  justify-content: center;
}
.loginBtn button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 28px;
  border-radius: 9999px;
  background-color: white;
  border: 1.5px solid #cbd5e1; /* 연한 회색 테두리 */
  color: #475569; /* slate-600 */
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: none;
  transition: all 0.25s ease;
}
.loginBtn button:hover {
  background-color: #f1f5f9; /* 아주 연한 회색 */
}
.loginBtn i {
  font-size: 18px;
}

/* 달력 컨테이너 기본 스타일 */
.calendar-container {
  width: 220px;
  padding: 0.8rem;
  border-radius: 1rem;
  background: #f0fdfa;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  font-size: 0.9rem;
  box-sizing: border-box;
  height: 300px;
  margin-top: 25px;
  /* 자식 요소가 넘치지 않도록 */
  /* overflow-x: hidden; */
}
/* Datepicker 내부 스타일 override (선택사항) */
:deep(.dp__theme_light) {
  --dp-background-color: white;
  --dp-primary-color: #34d399;
  --dp-border-radius: 12px;
  --dp-text-color: #334155;
  --dp-hover-color: #d1fae5;
  --dp-border-color: #a7f3d0;
}
/* Datepicker를 container에 맞게 100%로 설정 */
:deep(.dp__main) {
  width: 100% !important;
  transform: scale(0.75); /* 크기 줄이기 */
  transform-origin: top left;
}
:deep(.dp__input_wrap) {
  width: 100%;
}

/* 날씨 영역 스타일 */
/* 날씨 영역 스타일 */
.weather {
  padding: 0px 20px;
  padding-bottom: 20px;
  margin-top: 50px;
  border-radius: 16px;
  /* background: linear-gradient(135deg, #e0f7f1, #d0f0ff); */
  /* box-shadow: 0 8px 20px rgba(50, 115, 170, 0.1); */
  font-size: 15px;
  color: #334155;
  text-align: center;
  animation: fadeIn 0.4s ease-in-out;
  user-select: none;
}

.weather-icon {
  font-size: 90px;
  margin-bottom: 14px;
  color: #f7b267; /* 부드러운 파스텔 오렌지빛 */
  /* filter: drop-shadow(0 0 6px rgba(52, 211, 153, 0.6)); */
  transition: color 0.3s ease;
}

/* 날씨 데이터 카드 컨테이너 */
.weather-data {
  display: flex;
  justify-content: space-around;
  gap: 14px;
  margin-top: 8px;
  flex-wrap: wrap;
}

/* 개별 데이터 카드 */
.weather-data > div {
  background: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.07);
  border-radius: 12px;
  flex: 1 1 90px;
  padding: 10px 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: #1e293b;
  user-select: text;
  transition: box-shadow 0.25s ease;
}

.weather-data > div:hover {
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.12);
}

/* 아이콘 스타일 */
.weather-data i {
  font-size: 20px;
  color: #34d399;
}

/* 온도 아이콘 색상 변경 */
.weather-data .temp-icon {
  color: #fbbf24; /* 노란 햇살 느낌 */
}

/* 습도 아이콘 색상 변경 */
.weather-data .humidity-icon {
  color: #3b82f6; /* 파란색 물방울 */
}

/* 강수 아이콘 색상 변경 */
.weather-data .rain-icon {
  color: #8694a7; /* 연한 파란색 빗방울 */
}

/* 하늘 상태 아이콘 색상 */
.weather-data .sky-icon {
  color: rgb(143, 240, 227); /* 무채색 톤 */
}

/* 에러 메시지 폰트 굵게 */
.error-msg {
  color: #ef4444;
  font-weight: 700;
  margin-top: 10px;
  user-select: none;
}

/* 부드러운 fade-in 등장 효과 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 모달 오버레이 스타일 (화면 전체 반투명 배경) */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

/* 모달 내부 컨텐츠 박스 */
.modal-content {
  background: white;
  padding: 30px 40px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  font-size: 1rem;
}

/* 모달 문단 */
.modal-content p {
  margin-bottom: 20px;
  font-weight: 600;
  color: #333;
}

/* 모달 내 버튼 컨테이너 (허용, 거부 버튼을 가로로 배치) */
.modal-content .modal-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
}

/* 공통 모달 버튼 스타일 */
.modal-content button {
  padding: 10px 30px;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 9999px;
  border: none;
  background-color: #34d399;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.modal-content button:hover {
  background-color: #059669;
}

/* 거부 버튼만 빨간색으로 스타일 별도 지정 */
.modal-content .reject-btn {
  background-color: #ef4444;
}

.modal-content .reject-btn:hover {
  background-color: #b91c1c;
}

.user-info-card {
  background: linear-gradient(135deg, #f0fdfa, #e0f2fe);
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  gap: 12px;
  animation: fadeIn 0.4s ease-in-out;
  position: relative;
}

.profile-section {
  display: flex;
  align-items: center;
  gap: 14px;
}

.profile-img {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid white;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.15);
}

.profile-text {
  display: flex;
  flex-direction: column;
}

.nickname {
  font-size: 1.1rem;
  font-weight: 700;
  color: #1e293b;
}

.user-meta {
  font-size: 0.85rem;
  color: #64748b;
}

.settings-icon {
  margin-left: auto;
  margin-bottom: 20px;
  font-size: 1.1rem;
  color: #64748b;
  cursor: pointer;
  transition: color 0.2s ease;
}
.settings-icon:hover {
  color: #0f766e;
}

.user-stats {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
}

.user-stats div {
  text-align: center;
}

.stat-value {
  font-size: 1rem;
  font-weight: 700;
  color: #0f172a;
}

.stat-label {
  font-size: 0.75rem;
  color: #64748b;
}
@keyframes floatEffect {
  0%,
  100% {
    transform: translateY(0px) scale(1);
  }
  50% {
    transform: translateY(-6px) scale(1.05);
  }
}

.weather-icon {
  animation: floatEffect 2.5s ease-in-out infinite;
}

/* 햇빛 반짝이는 효과 */
@keyframes sunPulse {
  0% {
    transform: scale(1);
    filter: brightness(1);
  }
  50% {
    transform: scale(1.1);
    filter: brightness(1.3);
  }
  100% {
    transform: scale(1);
    filter: brightness(1);
  }
}

.weather-icon.sunny {
  animation: sunPulse 2s ease-in-out infinite;
}

/* 구름 흔들리는 효과 */
@keyframes cloudDrift {
  0%,
  100% {
    transform: translateX(0px);
  }
  50% {
    transform: translateX(4px);
  }
}

.weather-icon.cloudy {
  animation: cloudDrift 3s ease-in-out infinite;
}

/* 반짝임 효과 */
@keyframes sparkle {
  0%,
  100% {
    filter: drop-shadow(0 0 0px rgba(255, 255, 255, 0));
  }
  50% {
    filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.7));
  }
}
</style>
