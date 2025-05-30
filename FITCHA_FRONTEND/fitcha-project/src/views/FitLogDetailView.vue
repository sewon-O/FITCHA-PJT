<template>
  <div>
    <MainHeader />
    <MainDetailLayout>
      <FitLogCardDetail :fitlog="fitlog" />
    </MainDetailLayout>
  </div>
</template>

<script setup>
import MainHeader from "@/components/common/MainHeader.vue";
import MainDetailLayout from "@/components/common/MainDetailLayout.vue";
import FitLogCardDetail from "@/components/fitlog/FitLogCardDetail.vue";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import api from "@/api/api";

const route = useRoute();
const proofBoardId = route.params.id;

const fitlog = ref({});

const requestFitLogDetail = async () => {
  const { data } = await api.get(`/proof/${proofBoardId}`, {
    withCredentials: true,
  });
  fitlog.value = data;
};
onMounted(() => {
  requestFitLogDetail();
});
</script>

<style scoped></style>
