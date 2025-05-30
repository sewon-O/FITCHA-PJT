<template>
  <div class="ytc-card">
    <div class="ytc-thumbnail">
      <!-- 유튜브 썸네일 -->
      <img
        :src="video.snippet.thumbnails.high.url"
        :alt="video.snippet.title"
      />
      <span class="ytc-duration">LIVE</span>
      <!-- duration은 Search API에 없음 -->
    </div>
    <div class="ytc-info">
      <!-- 채널 프로필 대체 아이콘 -->
      <div class="ytc-profile-placeholder">👤</div>
      <div class="ytc-text">
        <div class="ytc-title">{{ video.snippet.title }}</div>
        <div class="ytc-channel">{{ video.snippet.channelTitle }}</div>
        <div class="ytc-meta">
          <span class="ytc-views">유튜브 영상</span> ·
          <span class="ytc-date">{{ formattedDate }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  video: Object,
});

const formattedDate = computed(() => {
  const raw = props.video?.snippet?.publishedAt;
  if (!raw) return "";
  return new Date(raw).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
});
</script>

<style scoped>
.ytc-card {
  width: 280px;
  /* height: 340px; */
  background-color: #fff;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  flex-direction: column;
  margin: 0 auto;
}

.ytc-card:hover {
  transform: translateY(-4px);
}

.ytc-thumbnail {
  position: relative;
  width: 100%;
  height: 160px;
  overflow: hidden;
  background-color: #ddd;
}

.ytc-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.ytc-duration {
  position: absolute;
  bottom: 8px;
  right: 8px;
  background-color: rgba(0, 0, 0, 0.8);
  color: #fff;
  padding: 2px 6px;
  font-size: 0.75rem;
  border-radius: 4px;
}

.ytc-info {
  display: flex;
  padding: 12px 16px;
  flex: 1;
}

.ytc-profile {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  margin-right: 12px;
  object-fit: cover;
}

.ytc-text {
  flex: 1;
}

.ytc-title {
  font-size: 0.95rem;
  font-weight: 500;
  color: #0f0f0f;
  margin-bottom: 6px;

  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;

  overflow: hidden;
  text-overflow: ellipsis;

  min-height: 2.8em; /* 줄 수 고정 */
  line-height: 1.4;

  word-break: break-word; /* ✅ 핵심: 줄바꿈 강제 허용 */
  white-space: normal; /* ✅ 줄바꿈 허용 */
}

.ytc-channel {
  font-size: 0.85rem;
  color: #606060;
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ytc-meta {
  font-size: 0.8rem;
  color: #909090;
}
</style>
