<!-- src/views/Popular.vue -->
<template>
  <div class="popular">
    <h1>Popular Movies</h1>
    <div class="view-toggle">
      <button
        @click="setView('table')"
        :class="{ active: currentView === 'table' }"
      >
        테이블 형태로 보기
      </button>
      <button
        @click="setView('infinite')"
        :class="{ active: currentView === 'infinite' }"
      >
        무한 스크롤
      </button>
    </div>
    <div v-if="currentView === 'table'" class="table-view">
      <table>
        <thead>
          <tr>
            <th>영화</th>
            <th>제목</th>
            <th>줄거리</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="movie in movies" :key="movie.id">
            <td><img :src="getImageUrl(movie.poster_path)" alt="Poster" /></td>
            <td>{{ movie.title }}</td>
            <td>{{ truncateText(movie.overview, 100) }}</td>
          </tr>
        </tbody>
      </table>
      <div class="pagination">
        <button @click="prevPage" :disabled="page === 1">이전</button>
        <span>Page {{ page }}</span>
        <button @click="nextPage">다음</button>
      </div>
    </div>
    <div v-else class="infinite-view">
      <div class="movies-grid">
        <MovieCard v-for="movie in movies" :key="movie.id" :movie="movie" />
      </div>
      <div v-if="loading" class="loading">Loading more movies...</div>
    </div>
  </div>
</template>

<script>
import { ref, watch, onMounted, onUnmounted } from "vue";
import { useFetch } from "../hooks/useFetch";
import MovieCard from "../components/common/MovieCard.vue";
import { IMAGE_BASE_URL, POSTER_SIZE } from "../utils/constants";

export default {
  name: "Popular",
  components: {
    MovieCard,
  },
  setup() {
    const currentView = ref("table");
    const page = ref(1);
    const params = ref({ page: page.value });
    const { data, error, loading } = useFetch("/movie/popular", params.value);
    const movies = ref([]);

    watch(
      [data, page],
      ([newData]) => {
        if (newData) {
          if (currentView.value === "infinite") {
            movies.value = movies.value.concat(newData.results);
          } else {
            movies.value = newData.results;
          }
        }
      },
      { immediate: true }
    );

    const setView = (view) => {
      currentView.value = view;
      if (view === "table") {
        page.value = 1;
        movies.value = [];
      }
    };

    const nextPage = () => {
      page.value += 1;
      params.value.page = page.value;
    };

    const prevPage = () => {
      if (page.value > 1) {
        page.value -= 1;
        params.value.page = page.value;
      }
    };

    const getImageUrl = (path) => {
      return path
        ? `${IMAGE_BASE_URL}${POSTER_SIZE}${path}`
        : "https://via.placeholder.com/500x750?text=No+Image";
    };

    const truncateText = (text, maxLength) => {
      if (!text) {
        return "";
      }
      if (text.length > maxLength) {
        return text.substring(0, maxLength) + "...";
      }
      return text;
    };

    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
          document.body.offsetHeight - 500 &&
        !loading.value
      ) {
        nextPage();
      }
    };

    onMounted(() => {
      if (currentView.value === "infinite") {
        window.addEventListener("scroll", handleScroll);
      }
    });

    onUnmounted(() => {
      window.removeEventListener("scroll", handleScroll);
    });

    watch(currentView, (newView) => {
      if (newView === "infinite") {
        window.addEventListener("scroll", handleScroll);
      } else {
        window.removeEventListener("scroll", handleScroll);
      }
    });

    return {
      currentView,
      setView,
      movies,
      loading,
      error,
      page,
      nextPage,
      prevPage,
      getImageUrl,
      truncateText,
    };
  },
};
</script>

<style scoped>
.popular {
  padding: 40px 0;
  background-color: #0e0e0e;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  color: #fff;
}

/* 🎯 버튼 영역 */
.view-toggle {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 24px;
}

.view-toggle button {
  padding: 10px 22px;
  margin: 0 6px;
  border: 2px solid #00e5ff;
  border-radius: 999px;
  background-color: transparent;
  color: #00e5ff;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.25s ease;
}

.view-toggle button:hover {
  background-color: #00bcd4;
  color: #000;
}

.view-toggle button.active {
  background-color: transparent;
  color: #00e5ff;
  border: 2px solid #00e5ff;
}

.view-toggle button.active:hover {
  background-color: #00bcd4;
  color: #000;
}

/* 📊 테이블 뷰 전체 레이아웃 */
.table-view {
  width: 100%;
  display: flex;
  justify-content: center;
}

.table-view table {
  width: 90%;
  max-width: 80%;
  border-collapse: collapse;
  background-color: #1a1a1a;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 0 20px rgba(0, 188, 212, 0.15);
}

/* 🧾 테이블 셀 스타일 */
.table-view th,
.table-view td {
  padding: 16px;
  text-align: left;
  vertical-align: middle;
  color: #f5f5f5;
  border-bottom: 1px solid #333;
}

.table-view th {
  background-color: #222;
  color: #ffffff;
  font-size: 15px;
  font-weight: 600;
}

/* 🖼️ 포스터 이미지 */
.table-view img {
  width: 80px;
  height: auto;
  border-radius: 4px;
}

/* ⏩ 페이지네이션 버튼 */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 30px;
  gap: 12px;
  color: white;
}

.pagination button {
  padding: 10px 18px;
  border: 2px solid #00bcd4;
  background-color: transparent;
  color: #00bcd4;
  font-weight: 600;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s;
}

.pagination button:hover:not(:disabled) {
  background-color: #00bcd4;
  color: #000;
}

.pagination button:disabled {
  border-color: #444;
  color: #666;
  cursor: not-allowed;
  background-color: transparent;
}

/* 📦 무한스크롤 카드뷰 */
.infinite-view .movies-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
}

.loading {
  margin-top: 20px;
  font-size: 1.2em;
  color: #aaa;
}
</style>
