<template>
  <div>
    <MainHeader />
    <MainDetailLayout>
      <MyFit />
    </MainDetailLayout>
  </div>
</template>

<script setup>
import MainHeader from "@/components/common/MainHeader.vue";
import MainDetailLayout from "@/components/common/MainDetailLayout.vue";
import MyFit from "@/components/myfit/MyFit.vue";
</script>

<style scoped></style>
