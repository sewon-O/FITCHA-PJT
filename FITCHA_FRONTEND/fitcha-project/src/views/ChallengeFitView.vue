<template>
  <div class="page-wrapper">
    <MainHeader />
    <MainContentSearch />
    <!-- 종료된 챌린지 포함여부 버튼 -->
    <div class="view-mode-toggle">
      <button
        :class="{ active: viewMode === 'ongoing' }"
        @click="changeViewMode('ongoing')"
      >
        진행중
      </button>
      <button
        :class="{ active: viewMode === 'all' }"
        @click="changeViewMode('all')"
      >
        전체
      </button>
      <button
        :class="{ active: viewMode === 'finished' }"
        @click="changeViewMode('finished')"
      >
        종료된 챌린지
      </button>
    </div>
    <template v-if="noContent">
      <NoContent />
    </template>

    <template v-else>
      <MainGridLayout>
        <template v-for="challenge in challenges" :key="challenge">
          <ChallengeFitCard :challenge="challenge" />
        </template>
      </MainGridLayout>
    </template>
  </div>
</template>

<script setup>
import MainGridLayout from "@/components/common/MainGridLayout.vue";
import ChallengeFitCard from "@/components/challengefit/ChallengeFitCard.vue";
import MainHeader from "@/components/common/MainHeader.vue";
import MainContentSearch from "@/components/common/MainContentSearch.vue";
import { onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import NoContent from "@/components/error/NoContent204.vue";
import api from "@/api/api";
import axios from "axios";
const route = useRoute();
const router = useRouter();
let challenges = ref({});
const noContent = ref(false);

const viewMode = ref("ongoing"); // 기본은 진행 중 보기

const showFinished = ref(false); // 종료 챌린지 포함 여부

function toggleFinished() {
  showFinished.value = !showFinished.value;
  requestChallengeSearch(route.query.key, route.query.word);
}
function changeViewMode(mode) {
  viewMode.value = mode;
  requestChallengeSearch(route.query.key, route.query.word);
}

async function requestChallengeSearch(searchKey, searchWord) {
  let response;
  if (!searchKey || !searchWord) {
    response = await api.get("/challenge");
  } else {
    response = await api.get("/challenge", {
      params: {
        key: searchKey,
        word: searchWord,
      },
    });
  }
  // console.log(response);
  const allChallenges = response.data;

  if (viewMode.value === "all") {
    challenges.value = allChallenges;
  } else if (viewMode.value === "finished") {
    challenges.value = allChallenges.filter((c) => c.finish);
  } else {
    console.log(viewMode.value);
    if (allChallenges) {
      // ongoing
      challenges.value = allChallenges.filter((c) => !c.finish);
    } else {
      noContent.value = true;
      return;
    }
  }
  noContent.value = challenges.value.length === 0;
}
onMounted(() => {
  requestChallengeSearch(route.query.key, route.query.word);
});

// 쿼리 변경 감지 시 재검색
watch(
  () => [route.query.key, route.query.word], // key 또는 word 둘 중 하나라도 바뀌면
  ([newKey, newWord]) => {
    requestChallengeSearch(newKey, newWord);
  }
);
</script>

<style scoped>
.page-wrapper {
  height: 780px;
  overflow-y: hidden;
}
.include-finished-toggle {
  text-align: right;
  margin: 10px 20px 0 0;
}
.include-finished-toggle button {
  padding: 6px 14px;
  border: none;
  border-radius: 8px;
  background-color: #40c057;
  color: white;
  cursor: pointer;
}
.view-mode-toggle {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin: 10px 20px 10px 0;
}

.view-mode-toggle button {
  padding: 6px 12px;
  border: none;
  border-radius: 8px;
  background-color: #dee2e6;
  cursor: pointer;
  color: #333;
}

.view-mode-toggle button.active {
  background-color: #40c057;
  color: #fff;
}
</style>
