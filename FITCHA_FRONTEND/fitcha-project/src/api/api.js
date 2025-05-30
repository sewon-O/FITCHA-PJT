import axios from 'axios';
import router from '@/router';
// baseURL을 상수로 정의
export const BASE_URL = 'http://localhost:8080';

// axios 인스턴스 생성
const api = axios.create({
  baseURL: BASE_URL,
});

// 요청 인터셉터: 요청 시 토큰이 있으면 Authorization 헤더에 넣어 보냄
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('access-token'); // 로컬스토리지에서 토큰 조회
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // 토큰이 있으면 헤더에 추가
    }
    return config;
  },
  error => Promise.reject(error) // 요청 에러 있을 경우 그대로 전달
);

// 응답 인터셉터: 응답 중 401 에러(토큰 만료 등) 처리
// 응답 인터셉터 수정 예시
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      const message = error.response.data?.message || '';

      if (message.includes('만료')) {
        // 토큰 만료인 경우만 로그아웃 처리
        localStorage.removeItem('access-token');
        alert('토큰이 만료되었습니다. 다시 로그인해주세요.');
        router.push('/login');
      } else {
        // 만료가 아닌 401은 로그아웃 처리하지 않고 그냥 에러만 반환
        console.warn('401 응답이지만 토큰 만료 메시지가 아님:', message);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
