<template>
  <div class="main-content-search">
    <h3>{{ menu }}</h3>

    <div class="search-bar">
      <!-- 검색 기준 선택 -->
      <!-- 🔻 드롭다운: challengefit 일 때만 표시 -->
      <select v-model="searchKey" v-if="menu === 'challengefit'">
        <option value="title">제목</option>
        <option value="content">내용</option>
        <option value="both">제목+내용</option>
        <option value="writer">작성자</option>
        <option value="exerciseType">운동타입</option>
        <option value="bodyPart">운동부위</option>
        <option value="level">난이도</option>
      </select>

      <!-- 🔻 fitlog일 경우에만 드롭다운을 따로 보여주고 싶다면 추가 -->
      <select v-model="searchKey" v-else-if="menu === 'fitlog'">
        <option value="title">제목</option>
        <option value="content">내용</option>
        <option value="both">제목+내용</option>
        <option value="writer">작성자</option>
      </select>

      <!-- 검색어 입력 -->
      <input
        type="text"
        :placeholder="menu != 'fittalk' ? '검색어를 입력하세요' : '채팅방을 검색하세요'"
        v-model="searchWord"
        @keyup.enter="search"
      />

      <!-- 검색 버튼 -->
      <button @click="search"><i class="fas fa-search"></i></button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
const route = useRoute();
const router = useRouter();
const searchWord = ref('');
const searchKey = ref('title');
const menu = ref(window.location.pathname.split('/')[1]);

function search() {
  const currentMenu = menu.value;
  const path = window.location.pathname;

  // fittube는 'q'만 넘김
  if (currentMenu === 'fittube') {
    router.push({
      path,
      query: {
        q: searchWord.value,
      },
    });
  }
  // 그 외는 key + word 방식 유지
  else {
    if (currentMenu === 'fittalk') {
      searchKey.value = 'name';
    }
    router.push({
      path,
      query: {
        key: searchKey.value,
        word: searchWord.value,
      },
    });
  }
}
onMounted(() => {
  const currentMenu = menu.value;
  if (currentMenu === 'fittube') {
    searchWord.value = route.query.q || '';
  } else {
    searchKey.value = route.query.key || 'title';
    searchWord.value = route.query.word || '';
  }
});
</script>

<style scoped>
.main-content-search {
  margin: 10px 0 0 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.main-content-search h3 {
  font-size: 1.4rem;
  color: #333;
  margin: 0;
}

/* 공통 검색바 */
.search-bar {
  display: flex;
  align-items: center;
  background-color: #f1f3f4;
  border-radius: 30px;
  padding: 0px 12px 0px 12px;
  width: 100%;
  max-width: 550px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  gap: 8px;
}

/* 드롭다운 없을 때 정렬 보정 */
.search-bar.only-input {
  justify-content: space-between;
}

/* 드롭다운 */
.search-bar select {
  border: none;
  background: transparent;
  color: #333;
  font-size: 0.9rem;
  padding: 6px 8px;
  border-radius: 8px;
  cursor: pointer;
  min-width: 80px;
}

/* 입력창 */
.search-bar input {
  flex: 1;
  padding: 10px 12px;
  border: none;
  outline: none;
  font-size: 1rem;
  background-color: white;
}

/* 버튼 */
.search-bar button {
  border: none;
  color: #333;
  font-size: 1.1rem;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 50%;
  background-color: #f1f3f4;
}
</style>
