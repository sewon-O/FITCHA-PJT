<template>
  <!-- 프로필 정보 -->
  <div class="profile-update-wrapper">
    <!-- 상단 헤더 -->
    <div class="edit-header">
      <button class="back-btn" type="button" @click="closeEdit">
        <i class="fa fa-arrow-left"></i>
      </button>
      <span class="header-title">프로필 수정</span>
      <button class="save-btn" type="button" @click="onSave">저장</button>
    </div>

    <!-- 프로필 이미지 + 카메라 아이콘 -->
    <div class="edit-profile-img">
      <img :src="fullProfileImgUrl" class="profile-img" />
      <label class="camera-icon">
        <i class="fa fa-camera"></i>
        <input type="file" hidden @change="onFileChange" />
      </label>
    </div>

    <!-- 사용자 이름 입력 -->
    <div class="form-group"></div>
  </div>
</template>

<script setup>
import api, { BASE_URL } from "@/api/api";
import { ref, computed } from "vue";
import defaultProfileImg from "@/assets/images/myfit/profile-default.svg"; // 기본 이미지 경로
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
const userStore = useUserStore();
const { userBoardId } = storeToRefs(userStore);
const { updateProfileImgUrl } = userStore;

// 부모로부터 전달받는 props
const props = defineProps({
  nickName: String,
  profileImgUrl: String,
  name: String,
});

// ✅ computed로 미리보기 반영
const fullProfileImgUrl = computed(() => {
  if (previewUrl.value) return previewUrl.value;
  if (profileImgUrl.value) return `${BASE_URL}/${profileImgUrl.value}`;
  return defaultProfileImg;
});

// 닫기 이벤트 emit
const emit = defineEmits(["close"]);

// 상태 관리
const nickName = ref(props.nickName); // 닉네임
const name = ref(props.name); // 네임
const profileImgUrl = ref(props.profileImgUrl || ""); // 기존 프로필 이미지 URL
// const userBoardId = ref(props.userBoardId);
const previewUrl = ref(""); // 새로 업로드한 이미지의 미리보기 URL
const selectedFile = ref(null); // 실제 업로드할 파일 참조

// 파일 선택 시 실행되는 함수 (미리보기만 처리)
const onFileChange = (event) => {
  const file = event.target.files[0];
  if (!file) return;
  previewUrl.value = URL.createObjectURL(file);
  selectedFile.value = file;
};

// 저장 버튼 클릭 시 서버에 업로드 요청
const onSave = async () => {
  if (!selectedFile.value) {
    emit("close");
    return;
  }

  const formData = new FormData();
  formData.append("profileImgUrl", selectedFile.value);
  formData.append("nickName", nickName.value);

  try {
    const res = await api.put(`/user/update/${userBoardId.value}`, formData);
    const updatedProfile = res.data;

    console.log("업데이트 성공:", updatedProfile);

    // ✅ Pinia 상태도 함께 업데이트
    updateProfileImgUrl(updatedProfile.profileImgUrl);

    // 부모 컴포넌트에도 변경된 정보 전달
    emit("close", updatedProfile);
  } catch (err) {
    console.error("이미지 업로드 실패:", err);
    alert("이미지 업로드에 실패했습니다.");
  }

  emit("close");
};

// 닫기 버튼 (뒤로가기) 처리
const closeEdit = () => {
  emit("close");
};
</script>

<style scoped>
.profile-wrapper {
  font-family: "Noto Sans KR", sans-serif;
  max-width: 480px;
  margin: 0 auto;
  border-radius: 20px;
  background-color: #ffffff;
  box-shadow: 0px 6px 20px rgba(0, 0, 0, 0.15);
}

.profile-update-wrapper .edit-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid #e0e0e0;
}

.profile-update-wrapper .back-btn {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: #3cb371;
}

.profile-update-wrapper .header-title {
  font-size: 1rem;
  font-weight: bold;
  color: #333;
}

.profile-update-wrapper .save-btn {
  background-color: #3cb371;
  border: none;
  border-radius: 12px;
  padding: 6px 16px;
  font-size: 0.9rem;
  color: white;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.profile-update-wrapper .save-btn:hover {
  background-color: #2ea15d;
}

.profile-update-wrapper .edit-profile-img {
  position: relative;
  text-align: center;
  margin-top: 24px;
}

.profile-update-wrapper .profile-img {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
}

.profile-update-wrapper .camera-icon {
  position: absolute;
  right: calc(50% - 65px);
  bottom: -2px;
  background-color: #3cb371;
  border-radius: 50%;
  padding: 6px 12px;
  color: white;
  cursor: pointer;
  font-size: 1.5rem;
}

.profile-update-wrapper .form-group {
  padding: 16px 24px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.profile-update-wrapper .form-group label {
  margin-top: 10px;
  font-size: 0.9rem;
  color: #333;
  font-weight: 500;
}

.profile-update-wrapper .form-group .input {
  padding: 10px;
  font-size: 0.9rem;
  border: none;
  border-bottom: 1px solid #ccc;
  outline: none;
  background-color: transparent;
}

.profile-update-wrapper .form-group .description {
  font-size: 0.75rem;
  color: #888;
  margin-top: -4px;
  margin-bottom: 8px;
}

.profile-update-wrapper .tags-select {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.profile-update-wrapper .tags-select .tag {
  background-color: #eafaf1;
  border-radius: 16px;
  padding: 6px 12px;
  font-size: 0.8rem;
  color: #3cb371;
  cursor: pointer;
  border: 1px solid #cceedd;
  transition: background-color 0.2s ease;
}

.profile-update-wrapper .tags-select .tag:hover {
  background-color: #d4f3e3;
}
</style>
