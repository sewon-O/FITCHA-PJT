<template>
  <div class="main-area">
    <!-- 히어로 이미지 + CTA -->
    <section class="hero-cta hero-full">
      <div class="hero-overlay">
        <div class="hero-image-wrapper">
          <img
            v-for="(image, index) in images"
            :key="index"
            :src="image"
            :class="['hero-image-large', { active: index === currentIndex }]"
            alt="hero"
          />
        </div>
        <div class="cta-text-hero">
          <h1>운동 챌린지로 건강한 삶 시작하기! 💪</h1>
          <p>
            매일 작은 실천이 모여 큰 변화를 만듭니다.<br />지금 인기 있는
            챌린지에 참여해보세요!
          </p>
          <router-link to="/challengefit">
            <button class="btn-primary btn-large">챌린지 둘러보기</button>
          </router-link>
        </div>
      </div>
    </section>

    <section class="popular-challenges">
      <h3>🔥 지금 인기 있는 챌린지</h3>
      <div class="challenge-cards">
        <div
          class="challenge-card"
          v-for="challenge in challenges.participants"
          :key="challenge.challengeBoardId"
        >
          <router-link
            class="router-link"
            :to="{
              name: 'ChallengeFitDetail',
              params: { id: challenge.challengeBoardId },
              query: { isViewCounted: 'true', writer: nickName },
            }"
          >
            <img
              :src="`${BASE_URL}/${challenge.challengeFiles[0].fileUrl}`"
              alt="요가챌린지"
            />
            <h4>{{ challenge.title }}</h4>
            <p>{{ challenge.subhead }}</p>
          </router-link>
        </div>
      </div>
    </section>

    <!-- 사진 슬라이더 -->

    <section class="proof-gallery">
      <h3>✨ 오늘의 인증</h3>
      <div class="slide-track">
        <!-- 무한 슬라이드를 위해 복제 -->
        <img
          v-for="proofImage in proofImages"
          :key="proofImage"
          :src="'http://localhost:8080/' + proofImage"
          alt="인증사진"
        />
      </div>
    </section>

    <!-- 랭킹 섹션과 추천 동영상 한 줄에 배치 -->
    <section class="ranking-and-recommendation">
      <section class="ranking-section">
        <h3>🏆 챌린지 참여 랭킹 TOP 5</h3>
        <ol class="ranking-list">
          <li
            v-for="(challenger, index) in top5Challengers"
            :key="challenger.participant"
          >
            <router-link
              :to="`/myfit/${challenger.participant}`"
              style="text-decoration: none; color: #2e6f44"
            >
              <span :class="`rank rank-${index + 1}`">{{ index + 1 }}위</span>
              {{ challenger.participant }}
              <span class="score"
                >{{ challenger.participationCount }}개 참여</span
              >
            </router-link>
          </li>
        </ol>
      </section>
      <section class="recommendation-section">
        <h3>🎥 오늘의 추천 동영상</h3>
        <div class="video-list">
          <div class="video-item">
            <iframe
              width="560"
              height="315"
              src="https://www.youtube.com/embed/4kZHHPH6heY?si=FeZ3y5c-xbkAf4df"
              title="YouTube video player"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerpolicy="strict-origin-when-cross-origin"
              allowfullscreen
            ></iframe>
            <p>오늘은 이거 하나면 끝! 근력 유산소 30분</p>
          </div>
        </div>
      </section>
    </section>

    <!--새로 생성한 챌린지 -->
    <h3>⚡ 새로 등록된 챌린지</h3>

    <section class="recent-challenges">
      <div class="recent-slide-track">
        <div
          class="challenge-card-slide"
          v-for="challenge in challenges.recent"
          :key="challenge.challengeBoardId"
        >
          <router-link
            class="router-link"
            :to="{
              name: 'ChallengeFitDetail',
              params: { id: challenge.challengeBoardId },
              query: { isViewCounted: 'true', writer: nickName },
            }"
          >
            <img
              :src="`${BASE_URL}/${challenge.challengeFiles[0]?.fileUrl}`"
              alt="챌린지 이미지"
            />
            <h4>{{ challenge.title }}</h4>
            <p>{{ challenge.subhead }}</p>
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import api, { BASE_URL } from "@/api/api";
import { useUserStore } from "@/stores/user";

// import img1 from "@/assets/images/home/run.jpg";
// import img2 from "@/assets/images/home/2.jpg";
// import img3 from "@/assets/images/home/3.jpg";

// 히어로 이미지
// const images = [img1, img2, img3];

const images = Object.values(
  import.meta.glob("@/assets/images/home/*.jpg", {
    eager: true,
    import: "default",
  })
);
const proofImages = ref([]);

const challenges = ref({});
const top5Challengers = ref([]);
const { userId, nickName } = useUserStore();

async function fetchProofImages() {
  try {
    const { data } = await api.get("/proof/images"); // 예시 API 엔드포인트
    // data가 이미지 URL 배열이라고 가정
    proofImages.value = data;
  } catch (error) {
    console.error("사진 슬라이더 이미지 불러오기 실패:", error);
  }
}

async function requestChallengeHome() {
  const { data } = await api.get("/home");
  challenges.value = data;
}
async function getTop5Challengers() {
  const { data } = await api.get("/challenge/top5");
  top5Challengers.value = data;
}

const currentIndex = ref(0);
let intervalId;

onMounted(() => {
  intervalId = setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % images.length;
  }, 3000);
  requestChallengeHome();
  getTop5Challengers();
  fetchProofImages();
});

onUnmounted(() => {
  clearInterval(intervalId);
});
</script>

<style scoped>
.router-link {
  text-decoration: none;
  margin: 0 auto;
}
/* 기본 레이아웃 */
/* .main-area {
  max-width: 800px;
  margin: 0 auto;
  padding: 30px 20px;
  border-radius: 20px;
  font-family: "Noto Sans KR", sans-serif;
  color: #2e4d43;
} */

.main-area {
  box-sizing: border-box;
  max-width: 800px;
  width: 100%;
  margin: 0 auto;
  padding: 30px 0px;
  font-family: "Noto Sans KR", sans-serif;
  color: #2e4d43;
}

@media (max-width: 600px) {
  .main-area {
    max-width: 100%;
    padding: 20px 10px;
  }
}

/* 히어로 섹션 */
.hero-full {
  position: relative;
  height: 500px;
  margin-bottom: 60px;
  border-radius: 25px;
  overflow: hidden;
  box-shadow: 0 20px 45px rgba(46, 139, 87, 0.25);
  animation: fadeInUp 1.8s ease forwards;
}

.hero-overlay,
.hero-image-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.hero-image-large {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(0.65);
  opacity: 0;
  transition: opacity 1s ease-in-out;
  z-index: 0;
  animation: zoomInSlow 30s ease-in-out infinite alternate;
}
.hero-image-large.active {
  opacity: 1;
  z-index: 1;
}

.cta-text-hero {
  position: absolute;
  z-index: 10;
  top: 23%;
  left: 7%;
  transform: translate(-50%, -50%);
  color: white;
  text-align: center;
  padding: 20px;
  max-width: 90%;
  animation: fadeInMove 1.5s ease forwards;
}

.cta-text-hero h1 {
  margin: 0;
  font-size: 2.8rem;
  font-weight: 800;
  text-shadow: 0 3px 8px rgba(0, 0, 0, 0.5);
  animation: slideScaleIn 1.6s ease-out forwards;
}

.cta-text-hero p {
  margin: 20px 0 25px;
  font-size: 1.4rem;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.9);
  text-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
  animation: fadeInMove 2s ease-out forwards;
}

/* 버튼 스타일 */
.btn-large {
  font-size: 1.2rem;
  padding: 14px 34px;
  border-radius: 40px;
  cursor: pointer;
}

.btn-primary.btn-large {
  position: relative;
  overflow: hidden;
  font-size: 1.2rem;
  padding: 12px 35px;
  border-radius: 40px;
  background: linear-gradient(135deg, #00d86d, #0ca678);
  color: #fff;
  font-weight: 700;
  letter-spacing: 0.5px;
  box-shadow: 0 8px 20px rgba(12, 166, 120, 0.4);
  animation: pulseGlow 2.4s ease-in-out infinite;
  border: none;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  z-index: 1;
}

.btn-primary.btn-large::before {
  content: "";
  position: absolute;
  top: 0;
  left: -75%;
  width: 150%;
  height: 100%;
  background: linear-gradient(
    120deg,
    rgba(255, 255, 255, 0.3) 0%,
    transparent 100%
  );
  transform: skewX(-20deg);
  transition: left 0.4s ease;
  z-index: 0;
}
.btn-primary.btn-large:hover::before {
  left: 100%;
}
.btn-primary.btn-large:hover {
  transform: translateY(-4px) scale(1.03);
  box-shadow: 0 10px 25px rgba(12, 166, 120, 0.5);
}

/* 인기 챌린지 섹션 */
.popular-challenges {
  margin-bottom: 60px;
  padding: 0 10px;
  filter: none !important;
  opacity: 1 !important;
}
.popular-challenges h3 {
  text-align: center;
  font-size: 1.8rem;
  margin-bottom: 30px;
  color: #3a6b47;
  font-weight: 700;
  text-shadow: 0 1px 3px rgba(58, 107, 71, 0.4);
  animation: fadeInUp 1.3s ease forwards;
}

.challenge-cards {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px 18px;
  max-width: 760px;
  margin: 0 auto;
}

.challenge-card {
  flex: 0 0 180px;
  background: #fff;
  border-radius: 20px;
  padding: 18px 14px;
  text-align: center;
  color: #2e4d38;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 6px 15px rgba(58, 107, 71, 0.15),
    0 3px 10px rgba(58, 107, 71, 0.1);
  animation: floatShakeSoft 4.5s ease-in-out infinite;
  transform-origin: center bottom;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.challenge-card:nth-child(odd) {
  margin-top: 25px;
}
.challenge-card:nth-child(even) {
  margin-top: 0;
  animation-delay: 2.25s;
}
.challenge-card:hover {
  transform: translateY(-15px) scale(1.08) rotate(-1.5deg);
  box-shadow: 0 15px 30px rgba(46, 139, 87, 0.3),
    0 10px 20px rgba(46, 139, 87, 0.25);
}
.challenge-card img {
  width: 100%;
  height: 140px;
  border-radius: 15px;
  object-fit: cover;
  margin-bottom: 14px;
  box-shadow: 0 5px 12px rgba(46, 139, 87, 0.15);
  transition: filter 0.3s ease;
}
.challenge-card h4,
.challenge-card-slide h4 {
  margin-bottom: 6px;
  font-size: 1.15rem;
  color: #33643d;
  text-shadow: 0 0 3px rgba(51, 100, 61, 0.3);
}
.challenge-card p {
  font-size: 0.9rem;
  color: #4a6b56;
  line-height: 1.35;
}

/* 랭킹 + 영상 */
.ranking-and-recommendation {
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
  justify-content: center;
  margin-bottom: 60px;
}
.ranking-section,
.recommendation-section {
  flex: 1 1 360px;
  border-radius: 25px;
  box-shadow: 0 12px 30px rgba(46, 139, 87, 0.15);
  animation: fadeInUp 1.5s ease forwards;
}
.ranking-section h3,
.recommendation-section h3 {
  margin: 15px 0 0;
  font-size: 1.8rem;
  text-align: center;
  color: #276644;
  text-shadow: 0 1px 3px rgba(39, 102, 68, 0.4);
}

/* 랭킹 리스트 */
.ranking-list {
  list-style: none;
  padding: 0;
  margin: 0 auto;
  max-width: 300px;
  text-align: left;
}
.ranking-list li {
  background: white;
  margin-top: 10px;
  margin-bottom: 12px;
  padding: 12px 22px;
  border-radius: 18px;
  font-size: 1.15em;
  font-weight: 600;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #2e6f44;
  box-shadow: 0 6px 18px rgba(46, 139, 87, 0.15);
  cursor: default;
  transition: background-color 0.3s ease;
}
.ranking-list li:hover {
  background-color: #c3e6be;
}
.rank {
  min-width: 50px;
  font-size: 1.2rem;
  font-weight: 700;
  color: #2e8b57;
  margin-right: 15px;
  text-shadow: 0 0 5px rgba(46, 139, 87, 0.3);
}
.rank-1 {
  color: #d4af37;
  text-shadow: 0 0 8px #d4af37;
}
.rank-2 {
  color: #c0c0c0;
  text-shadow: 0 0 8px #c0c0c0;
}
.rank-3 {
  color: #cd7f32;
  text-shadow: 0 0 8px #cd7f32;
}
.score {
  font-size: 1rem;
  font-weight: 400;
  color: #4a7c57;
}

/* 추천 동영상 */
.video-list {
  margin-top: 10px;
  padding: 0px 20px;
}
.video-item iframe {
  width: 100%;
  height: 250px;
  border-radius: 15px;
  box-shadow: 0 6px 15px rgba(46, 139, 87, 0.3);
}
.video-item p {
  margin-top: 8px;
  font-weight: 600;
  color: #33643d;
  font-size: 1.05rem;
  text-align: center;
}

/* 인증 사진 슬라이더 */
.proof-gallery {
  overflow: hidden;
  /* height: 180px; */
  position: relative;
  border-radius: 16px;
  margin-bottom: 60px;
}
.proof-gallery::before,
.proof-gallery::after {
  content: "";
  position: absolute;
  top: 0;
  width: 80px;
  height: 100%;
  z-index: 2;
  pointer-events: none;
}
.proof-gallery::before {
  left: 0;
  /* background: linear-gradient(to right, #f5fff7, transparent); */
}
.proof-gallery::after {
  right: 0;
  /* background: linear-gradient(to left, #f5fff7, transparent); */
}
.proof-gallery .slide-track {
  display: flex;
  gap: 18px;
  width: calc(180px * 12 + 18px * 11);
  animation: smoothSlide 25s ease-in-out infinite;
  margin-top: 40px;
  width: max-content;
  padding-bottom: 20px;
}
.proof-gallery img {
  width: 180px;
  height: 140px;
  border-radius: 16px;
  object-fit: cover;
  flex-shrink: 0;
  box-shadow: 0 10px 20px rgba(46, 139, 87, 0.25);
  transition: transform 0.4s ease, box-shadow 0.4s ease;
  animation: floatSwayZoom 6s ease-in-out infinite;
}
.proof-gallery img:hover {
  transform: translateY(-10px) scale(1.08) rotate(-1deg);
  box-shadow: 0 15px 30px rgba(46, 139, 87, 0.35);
  z-index: 1;
}

/* 새로 생성된 챌린지 슬라이드 */
.recent-challenges {
  position: relative;
  margin-bottom: 30px;
  padding: 20px 10px;
  overflow: hidden;
  border-radius: 20px;
  box-shadow: 0 8px 20px rgba(46, 139, 87, 0.2),
    0 4px 10px rgba(46, 139, 87, 0.1);
}
h3 {
  /* text-align: center; */
  margin: 10px 0px;
  font-size: 1.8rem;
  color: #3a6b47;
  font-weight: 700;
  text-shadow: 0 1px 3px rgba(58, 107, 71, 0.4);
  animation: fadeInUp 1.3s ease forwards;
}

.recent-slide-track {
  display: flex;
  gap: 20px;
  width: max-content;
  animation: smoothSlide 25s linear infinite;
  padding-left: 5px;
  align-items: stretch;
}

.challenge-card-slide {
  width: 180px;
  height: 280px;
  background: #fff;
  border-radius: 20px;
  padding: 14px;
  text-align: center;
  color: #2e4d38;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.challenge-card-slide img {
  width: 100%;
  height: 130px;
  object-fit: cover;
  border-radius: 12px;
  margin-bottom: 12px;
}

.challenge-card-slide p {
  font-size: 0.85rem;
  color: #4a6b56;
  line-height: 1.4;
  height: 2.8em;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
/* 양옆 안개 효과 */
.recent-challenges::before,
.recent-challenges::after {
  content: "";
  position: absolute;
  top: 0;
  width: 80px;
  height: 100%;
  z-index: 2;
  pointer-events: none;
}
.recent-challenges::before {
  left: 0;
  background: linear-gradient(to right, #ffffff, transparent);
}
.recent-challenges::after {
  right: 0;
  background: linear-gradient(to left, #ffffff, transparent);
}

/* ===== 애니메이션 ===== */
@keyframes fadeInUp {
  0% {
    opacity: 0;
    transform: translateY(25px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes fadeInMove {
  0% {
    opacity: 0;
    transform: translateY(15px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes slideScaleIn {
  0% {
    opacity: 0;
    transform: scale(0.8) translateY(30px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
@keyframes floatShakeSoft {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}
@keyframes floatSwayZoom {
  0%,
  100% {
    transform: translateY(0) scale(1);
  }
  50% {
    transform: translateY(-6px) scale(1.05);
  }
}
@keyframes floatSway {
  0%,
  100% {
    transform: translateY(0) rotate(0);
  }
  50% {
    transform: translateY(-5px) rotate(1deg);
  }
}
@keyframes smoothSlide {
  0% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-12.5%);
  }
  50% {
    transform: translateX(-25%);
  }
  75% {
    transform: translateX(-37.5%);
  }
  100% {
    transform: translateX(-50%);
  }
}
@keyframes zoomInSlow {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(1.1);
  }
}
@keyframes pulseGlow {
  0%,
  100% {
    box-shadow: 0 0 15px rgba(52, 199, 89, 0.4);
  }
  50% {
    box-shadow: 0 0 25px rgba(46, 139, 87, 0.8);
  }
}

/* 반응형 */
/* 기존 스타일 유지 ... */

@media (max-width: 1024px) {
  .main-area {
    padding: 20px 15px;
  }
  .hero-full {
    height: auto;
    min-height: 350px;
  }
  .cta-text-hero {
    top: 25%;
    left: 50%;
    transform: translate(-50%, -50%);
    max-width: 90%;
    padding: 15px;
  }
  .cta-text-hero h1 {
    font-size: 2rem;
  }
  .cta-text-hero p {
    font-size: 1.2rem;
  }
  .challenge-cards {
    gap: 15px 12px;
  }
  .challenge-card {
    flex: 0 0 45%;
    margin-top: 20px !important;
  }
  .challenge-card:nth-child(even) {
    margin-top: 20px !important;
    animation-delay: 0 !important;
  }
  .ranking-and-recommendation {
    flex-direction: column;
    gap: 25px;
  }
  .ranking-section,
  .recommendation-section {
    flex: 1 1 100%;
    max-width: 100%;
  }
  .video-item iframe {
    height: 200px;
  }
  .proof-gallery {
    height: 140px;
  }
  .proof-gallery .slide-track {
    width: auto;
  }
  .proof-gallery img {
    width: 140px;
    height: 110px;
  }
}

@media (max-width: 600px) {
  .cta-text-hero h1 {
    font-size: 1.6rem;
  }
  .cta-text-hero p {
    font-size: 1rem;
  }
  .btn-primary.btn-large {
    padding: 10px 28px;
    font-size: 1rem;
  }
  .challenge-card {
    flex: 0 0 100%;
  }
  .ranking-list {
    max-width: 100%;
    padding: 0 15px;
  }
  .video-item iframe {
    height: 160px;
  }
  .proof-gallery img {
    width: 110px;
    height: 85px;
  }
}
</style>
