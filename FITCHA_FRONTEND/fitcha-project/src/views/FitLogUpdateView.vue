<template>
  <div>
    <MainHeader />
    <MainDetailLayout>
      <FitLogUpdate :fitlog="fitlog" />
    </MainDetailLayout>
  </div>
</template>

<script setup>
import MainHeader from "@/components/common/MainHeader.vue";
import MainDetailLayout from "@/components/common/MainDetailLayout.vue";
import FitLogUpdate from "@/components/fitlog/FitLogUpdate.vue";
import { useRoute } from "vue-router";
import { onMounted, ref } from "vue";
import api from "@/api/api";

const route = useRoute();
const proofBoardId = route.params?.proofBoardId;
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
