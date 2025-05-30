<template>
  <div class="page-wrapper">
    <MainHeader />
    <MainContentSearch />
    <template v-if="noContent">
      <MainDetailLayout>
        <NoContent />
      </MainDetailLayout>
    </template>
    <template v-else>
      <MainGridLayout>
        <FitLogCard
          v-for="fitlog in fitlogs"
          :key="fitlog.proofBoardId"
          :fitlog="fitlog"
        />
      </MainGridLayout>
    </template>
  </div>
</template>

<script setup>
import MainHeader from "@/components/common/MainHeader.vue";
import MainContentSearch from "@/components/common/MainContentSearch.vue";
import MainGridLayout from "@/components/common/MainGridLayout.vue";
import FitLogCard from "@/components/fitlog/FitLogCard.vue";
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import api from "@/api/api";
import NoContent from "@/components/error/NoContent204.vue";
import MainDetailLayout from "@/components/common/MainDetailLayout.vue";

const route = useRoute();
const fitlogs = ref([]);
const noContent = ref(false);

async function fetchFitlogs(query = {}) {
  const params = {};
  if (query.key && query.word) {
    params.key = query.key;
    params.word = query.word;
  }
  const { data } = await api.get("/proof", { params });
  fitlogs.value = data;
  noContent.value = data.length === 0;
}

onMounted(() => {
  fetchFitlogs(route.query);
});

watch(
  () => route.query,
  (newQuery) => {
    fetchFitlogs(newQuery);
  }
);
</script>

<style scoped>
.page-wrapper {
  height: 780px;
  padding: 0px;
}
</style>
