<template>
  <div>
    <MainHeader />
    <MainDetailLayout>
      <MyFitUpdate />
    </MainDetailLayout>
  </div>
</template>

<script setup>
import MainHeader from "@/components/common/MainHeader.vue";
import MainDetailLayout from "@/components/common/MainDetailLayout.vue";
import MyFitUpdate from "@/components/myfit/MyFitUpdate.vue";
</script>

<style scoped></style>
