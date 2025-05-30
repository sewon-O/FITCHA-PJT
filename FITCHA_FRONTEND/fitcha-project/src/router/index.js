import { createRouter, createWebHistory } from "vue-router";
import ChallengeFitView from "@/views/ChallengeFitView.vue";
import ChallengeFitDetailView from "@/views/ChallengeFitDetailView.vue";
import ChallengeFitRegistView from "@/views/ChallengeFitRegistView.vue";
import ChallengeFitUpdateView from "@/views/ChallengeFitUpdateView.vue";
import FitTubeView from "@/views/FitTubeView.vue";
import FitTubeDetailView from "@/views/FitTubeDetailView.vue";
import FitLogView from "@/views/FitLogView.vue";
import FitLogDetailView from "@/views/FitLogDetailView.vue";
import FitLogRegistView from "@/views/FitLogRegistView.vue";
import FitLogUpdateView from "@/views/FitLogUpdateView.vue";
import HomeView from "@/views/HomeView.vue";
import LoginView from "@/views/LoginView.vue";
import OAuthSuccessView from "@/views/OAuthSuccessView.vue";
import SignupView from "@/views/SignupView.vue";
import MyFitView from "@/views/MyFitView.vue";
import MyFitUpdateView from "@/views/MyFitUpdateView.vue";
import FitTalkDetailView from "@/views/FitTalkDetailView.vue";
import FitTalkView from "@/views/FitTalkView.vue";

const routes = [
  { path: "/home", name: "HomeView", component: HomeView },
  { path: "/", redirect: "/home" }, // 처음 진입시 항상 홈 뷰가 보이도록 설정
  { path: "/challengefit", name: "ChallengeFit", component: ChallengeFitView },
  {
    path: "/challengefit/:id",
    name: "ChallengeFitDetail",
    component: ChallengeFitDetailView,
    beforeEnter: (to, from, next) => {
      if (!to.query.isViewCounted) {
        next({
          path: to.path,
          query: { ...to.query, isViewCounted: "false" },
        });
      } else {
        next();
      }
    },
  },

  {
    path: "/challengefit/regist",
    name: "ChallengeFitRegist",
    component: ChallengeFitRegistView,
  },
  {
    path: "/challengefit/:id/update",
    name: "ChallengeFitUpdate",
    component: ChallengeFitUpdateView,
  },

  { path: "/fittube", name: "FitTube", component: FitTubeView },
  { path: "/fittube/:id", name: "FitTubeDetail", component: FitTubeDetailView },

  { path: "/fitlog", name: "FitLogView", component: FitLogView },
  {
    path: "/fitlog/:id",
    name: "FitLogDetailView",
    component: FitLogDetailView,
  },

  {
    path: "/fitlog/regist/:challengeBoardId/:writer",
    name: "FitLogRegistView",
    component: FitLogRegistView,
  },
  {
    path: "/fitlog/update/:proofBoardId",
    name: "FitLogUpdateView",
    component: FitLogUpdateView,
  },

  { path: "/login", component: LoginView },
  { path: "/oauth-success", name: "OAuthSuccess", component: OAuthSuccessView },

  { path: "/signup", name: "Signup", component: SignupView },
  { path: "/myfit/:targetNickName", name: "MyFitView", component: MyFitView },
  { path: "/myfit/update", component: MyFitUpdateView },
  {
    path: "/fittalk",
    name: "FitTalk",
    component: FitTalkView,
  },
  {
    path: "/fittalk/room/:roomId",
    name: "FitTalkDetail",
    component: FitTalkDetailView,
    props: true,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

import { useUserStore } from "@/stores/user";

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("access-token");
  const userStore = useUserStore();

  const isPublicPage = [
    "/login",
    "/signup",
    "/home",
    "/oauth-success",
  ].includes(to.path);
  const authRequired = !isPublicPage;

  // 1. 토큰 없으면 Pinia도 초기화
  if (!token) {
    userStore.clearUser(); // 확실히 초기화
  }

  // 2. 보호된 페이지인데 로그인 안 되어 있으면 로그인 페이지로 이동
  if (authRequired && !token) {
    return next("/login");
  }

  // 3. 모든 조건 통과
  next();
});

export default router;
