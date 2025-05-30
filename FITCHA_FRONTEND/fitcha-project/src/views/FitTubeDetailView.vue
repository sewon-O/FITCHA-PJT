<template>
  <div>
    <MainHeader />
    <MainDetailLayout>
      <FitTubeCardDetail />
    </MainDetailLayout>
  </div>
</template>

<script setup>
import MainHeader from '@/components/common/MainHeader.vue';
import MainDetailLayout from '@/components/common/MainDetailLayout.vue';
import FitTubeCardDetail from '@/components/fittube/FitTubeCardDetail.vue';
</script>

<style scoped></style>
