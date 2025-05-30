<template>
  <div class="page-wrapper">
    <MainHeader />
    <MainContentSearch />

    <MainDetailLayout>
      <div class="chat-room-list">
        <h2><i class="fa-solid fa-message"></i> 채팅방 목록</h2>

        <!-- 항상 보이게 -->
        <div class="chat-room-input">
          <input
            v-model="newRoom"
            placeholder="새 채팅방 이름"
            @keyup.enter="createRoom"
          />
          <button @click="createRoom">
            <i class="fa-solid fa-paper-plane"></i> 생성
          </button>
        </div>

        <!-- 조건부로 NoContent 또는 방 리스트 보여줌 -->
        <div v-if="noContent" class="noContent-container">
          <NoContent />
        </div>
        <ul v-else class="room-list">
          <li class="room-item" v-for="room in filteredRooms" :key="room.id">
            <span class="room-name">{{ room.name }}</span>
            <div class="button-group">
              <router-link class="enter-btn" :to="`/fittalk/room/${room.id}`">
                입장
              </router-link>
              <button
                v-if="room.writer === nickName"
                class="delete-btn"
                @click="deleteRoom(room.id)"
              >
                삭제
              </button>
            </div>
          </li>
        </ul>
      </div>
    </MainDetailLayout>
  </div>
</template>

<script setup>
import MainHeader from "@/components/common/MainHeader.vue";
import MainContentSearch from "@/components/common/MainContentSearch.vue";
import MainDetailLayout from "@/components/common/MainDetailLayout.vue";
import NoContent from "@/components/error/NoContent204.vue";

import api from "@/api/api";
import { ref, onMounted, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useUserStore } from "@/stores/user";

const route = useRoute();
const router = useRouter();
const { userId, nickName } = useUserStore();
const rooms = ref([]);
const newRoom = ref("");
const noContent = ref(false);

const filteredRooms = computed(() =>
  Array.isArray(rooms.value) ? rooms.value.filter((r) => r?.name) : []
);

async function loadRooms(searchKey, searchWord) {
  try {
    let response = await api.get("/api/chat/rooms", {
      params: {
        key: searchKey,
        word: searchWord,
      },
    });
    rooms.value = response.data;
    noContent.value = rooms.value.length === 0;
  } catch (err) {
    console.error("방 목록 불러오기 실패:", err);
  }
}

async function createRoom() {
  console.log("버튼클릭함");
  const name = newRoom.value.trim();
  if (!name) return;
  console.log("채팅방 생성 요청:", name); // ✅ 이거 찍어보세요
  try {
    await api.post("/api/chat/rooms", { name, writer: nickName });
    newRoom.value = "";
    await loadRooms();
  } catch (err) {
    console.error("채팅방 생성 실패:", err);
  }
}

async function deleteRoom(roomId) {
  try {
    await api.delete(`/api/chat/${roomId}`);

    await loadRooms();
  } catch (err) {
    console.error("채팅방 삭제 실패:", err);
  }
}

onMounted(loadRooms);

// 쿼리 변경 감지 시 재검색
watch(
  () => [route.query.key, route.query.word], // key 또는 word 둘 중 하나라도 바뀌면
  ([newKey, newWord]) => {
    loadRooms(newKey, newWord);
  }
);
</script>

<style scoped>
.noContent-container {
  margin-top: 10px;
}
.chat-room-list {
  padding: 12px;
  max-width: 720px;
  margin: 10px auto;
  background: linear-gradient(135deg, #f8f9fa, #ffffff);
  border-radius: 16px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.04);
}

.chat-room-list h2 {
  font-size: 24px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 10px;
  color: #2f9e44; /* 진한 초록 */
  border-bottom: 2px solid #e9ecef;
  padding-bottom: 10px;
}
.chat-room-list h2 i {
  color: #2f9e44;
  font-size: 22px;
}

.chat-room-input {
  display: flex;
  align-items: center;
  gap: 10px;
  background-color: #f1f3f5;
  padding: 12px 16px;
  border-radius: 10px;
  margin-bottom: 24px;
}

.chat-room-input input {
  flex: 1;
  padding: 10px 14px;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  background-color: #ffffff;
  color: #212529;
  transition: box-shadow 0.2s;
}
.chat-room-input input:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(64, 192, 87, 0.3);
}

.chat-room-input button {
  padding: 10px 16px;
  background-color: #40c057;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: background-color 0.2s;
}
.chat-room-input button:hover {
  background-color: #37b24d;
}

.room-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.room-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border: 1px solid #e9ecef;
  border-radius: 10px;
  background-color: #ffffff;
  transition: box-shadow 0.2s, transform 0.1s;
}
.room-item:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transform: translateY(-2px);
}

.room-name {
  font-size: 16px;
  font-weight: 600;
  color: #343a40;
  display: flex;
  align-items: center;
  gap: 30px;
}

.icon-room {
  color: #2f9e44;
  font-size: 18px;
}

.enter-btn {
  padding: 8px 16px;
  background-color: #40c057;
  color: white;
  border-radius: 8px;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: background-color 0.2s;
}
.enter-btn:hover {
  background-color: #37b24d;
}
.chat-room-list {
  padding: 3px 24px 20px;
  max-width: 720px;
  margin: 10px auto;
  background: linear-gradient(135deg, #f8f9fa, #ffffff);
  border-radius: 30px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.04);
}

.chat-room-list h2 {
  font-size: 24px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 25px;
  color: #2f9e44; /* 진한 초록 */
  border-bottom: 2px solid #e9ecef;
  padding-bottom: 10px;
}
.chat-room-list h2 i {
  color: #2f9e44;
  font-size: 22px;
}

.chat-room-input {
  display: flex;
  align-items: center;
  gap: 10px;
  background-color: #f1f3f5;
  padding: 12px 16px;
  border-radius: 10px;
  margin-bottom: 24px;
}

.chat-room-input input {
  flex: 1;
  padding: 10px 14px;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  background-color: #ffffff;
  color: #212529;
  transition: box-shadow 0.2s;
}
.chat-room-input input:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(64, 192, 87, 0.3);
}

.chat-room-input button {
  padding: 10px 16px;
  background-color: #fac74f;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: background-color 0.2s;
}
.chat-room-input button:hover {
  background-color: #fab005;
}

.room-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.room-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border: 1px solid #e9ecef;
  border-radius: 10px;
  background-color: #ffffff;
  transition: box-shadow 0.2s, transform 0.1s;
}
.room-item:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transform: translateY(-2px);
}

.room-name {
  font-size: 16px;
  font-weight: 600;
  color: #343a40;
  display: flex;
  align-items: center;
  gap: 8px;
}

.icon-room {
  color: #40c057;
  font-size: 18px;
}

.enter-btn {
  padding: 8px 16px;
  background-color: #20c997;
  color: white;
  border-radius: 8px;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: background-color 0.2s;
}
.enter-btn:hover {
  background-color: #37b24d;
}

.room-name {
  gap: 16px;
}

.chat-room-list h2 i {
  color: #ffffff;
}

.chat-room-list h2 {
  background: linear-gradient(135deg, #69db7c 0%, #38d9a9 100%);
  border-radius: 30px;
  color: #ffffff;
  height: 50px;
  padding: 7px 40px;
}
.room-item button {
  padding: 8px 16px;
  background-color: #ff6b6b;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.1s;
}

.room-item button:hover {
  background-color: #fa5252;
  transform: translateY(-1px);
}
.button-group {
  display: flex;
  gap: 10px;
}

.enter-btn {
  padding: 8px 16px;
  background-color: #20c997;
  color: white;
  border-radius: 8px;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: background-color 0.2s;
}
.enter-btn:hover {
  background-color: #37b24d;
}

.delete-btn {
  padding: 8px 16px;
  background-color: #ff6b6b;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.1s;
}
.delete-btn:hover {
  background-color: #fa5252;
  transform: translateY(-1px);
}
</style>
