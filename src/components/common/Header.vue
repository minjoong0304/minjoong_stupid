<template>
  <header class="header">
    <div class="container">
      <!-- 좌측: 로고 + 언어 + 메뉴 -->
      <div class="left-group">
        <div class="logo" @click="navigateHome">
          <img src="@/assets/images/file.png" alt="Logo" class="logo-img" />
        </div>

        <select v-model="selectedLanguage" @change="changeLanguage">
          <option value="ko-KR">한국어</option>
          <option value="en-US">English</option>
          <option value="ja-JP">日本語</option>
        </select>

        <nav class="center">
          <router-link to="/"><span class="icon">🏠</span> 홈</router-link>
          <router-link to="/popular"
            ><span class="icon">🔥</span> 대세 콘텐츠</router-link
          >
          <router-link to="/search"
            ><span class="icon">🔍</span> 찾아보기</router-link
          >
          <router-link to="/wishlist"
            ><span class="icon">❤️</span> 찜 목록</router-link
          >
        </nav>
      </div>

      <!-- 우측: 로그인/로그아웃 -->
      <div class="right">
        <template v-if="isLoggedIn">
          <span class="welcome">
            <span class="nickname">{{ user?.nickname }}</span
            >님
          </span>
          <button @click="fetchProfile">정보</button>
          <button @click="logout">로그아웃</button>
        </template>
        <router-link v-else to="/signin" class="router-link-button"
          >로그인</router-link
        >
      </div>
    </div>

    <!-- 카카오 프로필 모달 -->
    <div
      v-if="showProfileModal"
      class="profile-modal"
      @click.self="showProfileModal = false"
    >
      <div class="profile-modal-content">
        <h2>카카오 프로필</h2>
        <div v-if="profileData">
          <p><strong>닉네임:</strong> {{ profileData.nickname }}</p>
          <p v-if="profileData.imageUrl">
            <img
              :src="profileData.imageUrl"
              alt="프로필 이미지"
              class="profile-img"
            />
          </p>
          <p v-else>프로필 이미지 없음</p>
        </div>
        <button @click="showProfileModal = false">닫기</button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";

const store = useStore();
const router = useRouter();
const toast = useToast();

const selectedLanguage = ref(
  localStorage.getItem("selectedLanguage") || "ko-KR"
);

const isLoggedIn = computed(() => store.getters["auth/isLoggedIn"]);
const user = computed(() => store.getters["auth/user"]);

const changeLanguage = () => {
  localStorage.setItem("selectedLanguage", selectedLanguage.value);
  window.location.reload();
};

const navigateHome = () => router.push("/");

const logout = () => {
  store.dispatch("auth/logout");
  if (window.Kakao?.Auth?.getAccessToken()) {
    window.Kakao.Auth.logout(() => console.log("Kakao logout complete"));
  }
  router.push("/signin");
};

// 프로필 모달
const showProfileModal = ref(false);
const profileData = ref(null);
const fetchProfile = () => {
  if (!window.Kakao?.isInitialized?.() || !window.Kakao.Auth.getAccessToken()) {
    toast.error("카카오 로그인 정보가 없습니다.");
    return;
  }
  window.Kakao.API.request({
    url: "/v2/user/me",
    success: (res) => {
      profileData.value = {
        nickname: res.kakao_account?.profile?.nickname || "",
        imageUrl: res.kakao_account?.profile?.profile_image_url || "",
      };
      showProfileModal.value = true;
    },
    fail: (error) => {
      toast.error("회원정보 조회 실패");
      console.error(error);
    },
  });
};
</script>

<style scoped>
.header {
  position: sticky;
  top: 0;
  width: 100%;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  z-index: 1000;
}

.container {
  max-width: 2500px;
  margin: 0 auto;
  padding: 1.5rem 2.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.left-group {
  display: flex;
  align-items: center;
  gap: 1.2rem;
}

.logo-img {
  height: 32px;
  cursor: pointer;
}

.center {
  display: flex;
  gap: 1.2rem;
}

.center a {
  position: relative;
  color: #eee;
  font-size: 16px;
  font-weight: 500;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  transition: color 0.3s ease;
}

.center a::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: -3px;
  width: 100%;
  height: 2px;
  background-color: #45f3ff;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s ease-in-out;
}

.center a:hover {
  color: #45f3ff;
}
.center a:hover::after {
  transform: scaleX(1);
}

.right {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

select {
  appearance: none;
  background-color: #111;
  color: #eee;
  border: 1px solid #555;
  border-radius: 6px;
  padding: 0.4rem 0.8rem;
  font-size: 14px;
  cursor: pointer;
  background-image: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23ccc' stroke-width='2' fill='none' fill-rule='evenodd'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.7rem center;
  background-size: 12px 8px;
}

button,
.router-link-button {
  background: none;
  border: 1px solid #666;
  color: #eee;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  text-decoration: none;
  transition: background 0.2s ease, border-color 0.2s ease, color 0.2s ease;
}

button:hover,
.router-link-button:hover {
  background: #45f3ff11;
  border-color: #45f3ff;
  color: #45f3ff;
}

.welcome {
  color: #ccc;
  font-size: 14px;
  font-weight: 500;
}

/* 프로필 모달 */
.profile-modal {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10000;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
}

.profile-modal-content {
  background: #111;
  color: #eee;
  padding: 24px 32px;
  border-radius: 12px;
  width: 300px;
  text-align: center;
}

.profile-img {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 50%;
  margin-top: 10px;
}

.nickname {
  color: #45f3ff;
  font-weight: bold;
  font-size: 1.1em;
  background: linear-gradient(90deg, #45f3ff, #1fa2ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: shine 2s infinite ease-in-out;
}

@keyframes shine {
  0%,
  100% {
    filter: brightness(1.1);
  }
  50% {
    filter: brightness(1.6);
  }
}
</style>
