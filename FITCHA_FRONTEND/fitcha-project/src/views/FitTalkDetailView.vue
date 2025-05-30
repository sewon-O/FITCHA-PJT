<template>
  <div class="chat-room-wrapper">
    <div class="chat-room-content">
      <MainDetailLayout>
        <div class="chat-title">
          <span><i class="fa-regular fa-comment fa-2x"></i></span>

          <h2>{{ roomTitle }}</h2>
        </div>
        <div class="chat-messages" ref="messageBox">
          <div
            v-for="(msg, index) in messages"
            :key="index"
            :class="[
              'chat-message',
              msg.sender === userStore.nickName ? 'self' : 'other',
            ]"
          >
            <strong v-if="msg.sender !== userStore.nickName">{{
              msg.sender
            }}</strong>
            {{ msg.message }}
          </div>
        </div>
        <div class="chat-input">
          <input
            v-model="input"
            type="text"
            placeholder="메시지를 입력하세요"
            @keyup.enter="sendMessage"
          />
          <button @click="sendMessage">전송</button>
        </div>
      </MainDetailLayout>
    </div>
    <a class="challenge-detail__back" @click="goBack">
      <i class="fas fa-arrow-left"></i>
      뒤로 가기
    </a>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import api, { BASE_URL } from "@/api/api";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { useUserStore } from "@/stores/user";
import MainDetailLayout from "@/components/common/MainDetailLayout.vue";

const route = useRoute();
const router = useRouter();
const roomId = route.params.roomId;
const roomTitle = ref("");
const messages = ref([]);
const input = ref("");
const messageBox = ref(null);
const userStore = useUserStore();
let stompClient = null;

// 채팅방 제목 가져오기
const fetchRoomTitle = async () => {
  try {
    const { data } = await api.get(`/api/chat/rooms/${roomId}`);
    roomTitle.value = data.name ? data.name : "FITCHA";
  } catch (err) {
    console.error("방 제목 로딩 실패:", err);
    roomTitle.value = "채팅방";
  }
};

// 기존 메시지 불러오기
const fetchMessages = async () => {
  try {
    const res = await api.get(`/api/chat/messages/${roomId}`);
    messages.value = res.data;
  } catch (err) {
    console.error("메시지 불러오기 실패:", err);
  }
};

// STOMP/WebSocket 연결 및 구독
const connectSocket = () => {
  const token = localStorage.getItem("access-token");
  const socket = new SockJS(`${BASE_URL}/ws?token=${token}`);

  stompClient = new Client({
    // webSocketFactory OR brokerURL 중 하나는 반드시 제공해야 합니다
    webSocketFactory: () => socket,
    // brokerURL: `ws://localhost:8080/ws?token=${token}`,

    connectHeaders: {
      Authorization: `Bearer ${token}`,
    },
    debug: (msg) => console.log("[STOMP DEBUG]", msg),
    reconnectDelay: 5000,
    onConnect: () => {
      console.log("✅ STOMP 연결 성공! 구독을 시작합니다.");
      stompClient.subscribe(`/topic/chat/${roomId}`, (frame) => {
        console.log("📥 GOT FRAME:", frame);
        const parsed = JSON.parse(frame.body);
        console.log("📨 PARSED MSG:", parsed);
        messages.value.push(parsed);
        // 스크롤 맨 아래로
        nextTick(() => {
          if (messageBox.value) {
            messageBox.value.scrollTop = messageBox.value.scrollHeight;
          }
        });
      });
    },
    onStompError: (frame) => {
      console.error("❌ STOMP 에러:", frame.headers["message"]);
    },
    onWebSocketError: (ev) => {
      console.error("❌ WS 에러:", ev);
    },
  });

  stompClient.activate();
};

// 메시지 전송 함수
function sendMessage() {
  if (!input.value.trim()) return;
  console.log("🖱️ sendMessage 호출, input:", input.value);

  if (!stompClient || !stompClient.connected) {
    return alert("⛔ STOMP 연결이 되지 않았습니다. 잠시 후 다시 시도해주세요.");
  }

  stompClient.publish({
    destination: `/app/chat/${roomId}`,
    body: JSON.stringify({
      roomId: Number(roomId),
      sender: userStore.nickName,
      message: input.value,
    }),
  });

  input.value = "";
}

onMounted(async () => {
  await fetchRoomTitle();
  await fetchMessages();
  connectSocket();
  // 초기 로드 시 스크롤 맨 아래
  nextTick(() => {
    if (messageBox.value) {
      messageBox.value.scrollTop = messageBox.value.scrollHeight;
    }
  });
});

onBeforeUnmount(() => {
  if (stompClient) stompClient.deactivate();
});
function goBack() {
  router.back(); // 이전 페이지로 이동
}
</script>

<style scoped>
.chat-room-wrapper {
  max-width: 640px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f1f3f5;
  border-radius: 16px;
}

.chat-room-content {
  width: 100%;
}

.chat-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(135deg, #69db7c 0%, #38d9a9 100%);
  color: white;
  padding: 15px 20px;
  border-radius: 12px;
  margin-bottom: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.chat-title span {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 18px;
}

.chat-title h2 {
  margin: 0;
  margin-left: 15px;
  font-size: 20px;
  font-weight: bold;
  flex: 1;
  text-align: left;
}

.chat-messages {
  height: 500px;
  overflow-y: auto;
  background-color: #ffffff;
  padding: 20px;
  border-radius: 12px;
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.05);
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.chat-message {
  display: flex;
  flex-direction: column;
  max-width: 70%;
  padding: 10px 14px;
  border-radius: 16px;
  font-size: 15px;
  line-height: 1.4;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  word-break: break-word;
}

.chat-message.self {
  align-self: flex-end;
  background-color: #d3f9d8;
  color: #2f9e44;
  border-bottom-right-radius: 0;
}

.chat-message.other {
  align-self: flex-start;
  background-color: #f1f3f5;
  color: #212529;
  border-bottom-left-radius: 0;
}

.chat-message strong {
  display: block;
  font-size: 12px;
  color: #868e96;
  margin-bottom: 4px;
}

.chat-input {
  display: flex;
  gap: 10px;
}

.chat-input input {
  flex: 1;
  padding: 10px;
  border-radius: 10px;
  border: 1px solid #ccc;
  font-size: 15px;
}

.chat-input button {
  padding: 10px 20px;
  border: none;
  border-radius: 10px;
  background-color: #fac74f;
  color: white;
  font-weight: bold;
  cursor: pointer;
}
.chat-messages::-webkit-scrollbar {
  width: 8px;
}

.chat-messages::-webkit-scrollbar-thumb {
  background-color: #ced4da;
  border-radius: 4px;
}

.chat-messages::-webkit-scrollbar-track {
  background-color: #f1f3f5;
  border-radius: 4px;
}
/* 뒤로가기 */
.challenge-detail__back {
  display: inline-flex;
  align-items: center;
  margin-top: 10px;
  text-decoration: none;
  color: #444;
  gap: 6px;
  cursor: pointer;
}
</style>
