<template>
  <div class="page-wrapper">
    <MainHeader />
    <MainContentSearch />

    <!-- ✨ scroll 담당, 스타일 간섭 X -->
    <div class="main">
      <MainGridLayout>
        <template v-for="video in videos" :key="video.id.videoId">
          <router-link
            class="router-link"
            :to="{
              name: 'FitTubeDetail',
              params: { id: video.id.videoId },
            }"
          >
            <FitTubeCard :video="video" />
          </router-link>
        </template>
        <!-- 이 요소가 화면에 보이면 → 다음 영상 요청 -->
        <div ref="observerTarget" class="observer-sentinel"></div>
      </MainGridLayout>
    </div>
  </div>
</template>

<script setup>
import MainHeader from '@/components/common/MainHeader.vue';
import MainContentSearch from '@/components/common/MainContentSearch.vue';
import MainGridLayout from '@/components/common/MainGridLayout.vue';
import FitTubeCard from '@/components/fittube/FitTubeCard.vue';
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import api from '@/api/api';
import { useRoute } from 'vue-router';

const route = useRoute(); // 현재 라우터 객체
const query = ref(route.query.q || '');
watch(
  () => route.query.q,
  (newQ, oldQ) => {
    if (newQ !== oldQ) {
      query.value = newQ;
      videos.value = []; // 초기화
      nextPageToken.value = '';
      requestYoutubeVideos(); // 재요청
    }
  }
);

const videos = ref([]);

const nextPageToken = ref('');
const isLoading = ref(false);
const observerTarget = ref(null);
let observer;

async function requestYoutubeVideos() {
  if (isLoading.value) return;
  isLoading.value = true;

  try {
    const { data } = await api.get(`/youtube/search`, {
      params: { query: query.value, pageToken: nextPageToken.value },
    });
    videos.value.push(...data.items);
    nextPageToken.value = data.nextPageToken || '';
  } catch (error) {
    console.error('영상 요청 실패:', error);
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  requestYoutubeVideos();

  observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting && nextPageToken.value) {
        requestYoutubeVideos();
      }
    },
    {
      threshold: 1.0,
    }
  );

  if (observerTarget.value) {
    observer.observe(observerTarget.value);
  }
});

onBeforeUnmount(() => {
  if (observer && observerTarget.value) {
    observer.unobserve(observerTarget.value);
  }
});
</script>

<style scoped>
/* 전체 페이지 기준 */
.page-wrapper {
  height: 780px;
  overflow-y: hidden;
  display: flex;
  flex-direction: column;
}
.main {
  flex: 1;
  overflow: visible;
  background: inherit; /* 상위와 동일하게 */
  padding: 0; /* 여백 없음 */
  margin: 0;
  box-sizing: border-box;
  display: block;
}

.observer-sentinel {
  width: 100%;
  height: 1px;
}

.router-link {
  text-decoration: none;
}
</style>
