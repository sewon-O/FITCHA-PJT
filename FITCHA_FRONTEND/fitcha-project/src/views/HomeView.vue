<template>
  <div>
    <MainHeader />
    <MainDetailLayout>
      <Home />
    </MainDetailLayout>
  </div>
</template>

<script setup>
import MainHeader from "@/components/common/MainHeader.vue";
import MainDetailLayout from "@/components/common/MainDetailLayout.vue";
import Home from "@/components/home/Home.vue";
</script>

<style scoped></style>
