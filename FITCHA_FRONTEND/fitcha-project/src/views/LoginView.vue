<template>
  <div>
    <MainHeader />
    <MainDetailLayout>
      <Login />
    </MainDetailLayout>
  </div>
</template>

<script setup>
import MainHeader from "@/components/common/MainHeader.vue";
import MainDetailLayout from "@/components/common/MainDetailLayout.vue";
import Login from "@/components/login/Login.vue";
</script>

<style scoped></style>
