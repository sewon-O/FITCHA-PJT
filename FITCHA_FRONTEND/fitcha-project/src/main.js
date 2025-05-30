import { createApp } from "vue"; // Vue 앱 생성
import { createPinia } from "pinia"; // Pinia 상태관리
import piniaPluginPersistedstate from "pinia-plugin-persistedstate"; // 상태 -> 로컬스토리지 연동
import App from "./App.vue";
import router from "./router"; // Vue Router

// 1. 앱 생성
const app = createApp(App);

// 2. Pinia 생성 및 플러그인 연결
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

// 3. 앱에 전역 사용 등록
app.use(pinia);
app.use(router);

// 4. 앱 마운트
app.mount("#app");
