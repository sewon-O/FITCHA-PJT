<template>
  <div>
    <MainHeader />
    <MainDetailLayout>
      <ChallengeFitUpdate />
    </MainDetailLayout>
  </div>
</template>

<script setup>
import MainHeader from "@/components/common/MainHeader.vue";
import MainDetailLayout from "@/components/common/MainDetailLayout.vue";
import ChallengeFitUpdate from "@/components/challengefit/ChallengeFitUpdate.vue";
</script>

<style scoped></style>
