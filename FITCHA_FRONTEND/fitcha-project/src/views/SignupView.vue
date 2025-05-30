<template>
  <div>
    <MainHeader />
    <MainDetailLayout>
      <Signup />
    </MainDetailLayout>
  </div>
</template>

<script setup>
import MainHeader from '@/components/common/MainHeader.vue';
import MainDetailLayout from '@/components/common/MainDetailLayout.vue';
import Signup from '@/components/login/Signup.vue';
</script>

<style scoped></style>
