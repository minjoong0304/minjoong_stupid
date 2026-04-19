<!-- src/views/Search.vue -->
<template>
  <div class="search-page">
    <div class="filter-header">
      <h1 class="title">선호하는 설정을 선택하세요</h1>
      <div class="filter-bar">
        <div class="filter">
          <label for="genre">장르 (전체)</label>
          <select
            v-model="selectedGenre"
            id="genre"
            @change="fetchFilteredMovies"
          >
            <option value="">장르 (전체)</option>
            <option v-for="genre in genres" :key="genre.id" :value="genre.id">
              {{ genre.name }}
            </option>
          </select>
        </div>
        <div class="filter">
          <label for="rating">평점 (전체)</label>
          <select
            id="rating"
            v-model="selectedRating"
            @change="fetchFilteredMovies"
          >
            <option value="">평점 (전체)</option>
            <option value="7">7 이상</option>
            <option value="8">8 이상</option>
            <option value="9">9 이상</option>
          </select>
        </div>
        <div class="filter">
          <label for="language">언어 (전체)</label>
          <select
            id="language"
            v-model="selectedLanguage"
            @change="fetchFilteredMovies"
          >
            <option value="">언어 (전체)</option>
            <option value="en">영어</option>
            <option value="ko">한국어</option>
            <option value="ja">일본어</option>
          </select>
        </div>
        <button @click="resetFilters" class="reset-btn">초기화</button>
      </div>
    </div>
    <div class="movie-grid">
      <MovieCard v-for="movie in movies" :key="movie.id" :movie="movie" />
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import api from "../services/api";
import MovieCard from "../components/common/MovieCard.vue";

export default {
  name: "Search",
  components: {
    MovieCard,
  },
  setup() {
    const selectedGenre = ref("");
    const selectedRating = ref("");
    const selectedLanguage = ref("");
    const genres = ref([]);
    const movies = ref([]);

    const fetchGenres = async () => {
      try {
        const response = await api.get("/genre/movie/list");
        genres.value = response.data.genres;
      } catch (err) {
        console.error(err);
      }
    };

    const fetchFilteredMovies = async () => {
      const params = {
        with_genres: selectedGenre.value,
        "vote_average.gte": selectedRating.value,
        with_original_language: selectedLanguage.value,
      };
      try {
        const response = await api.get("/discover/movie", { params });
        movies.value = response.data.results;
      } catch (err) {
        console.error(err);
      }
    };

    const resetFilters = () => {
      selectedGenre.value = "";
      selectedRating.value = "";
      selectedLanguage.value = "";
      movies.value = [];
    };

    onMounted(() => {
      fetchGenres();
    });

    return {
      selectedGenre,
      selectedRating,
      selectedLanguage,
      genres,
      movies,
      fetchFilteredMovies,
      resetFilters,
    };
  },
};
</script>

<style scoped>
.search-page {
  padding: 40px 20px;
  background-color: #121212;
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

.filter-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
}

.title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;
}

.filter-bar {
  display: flex;
  gap: 16px;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}

.filter {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
}

.filter label {
  font-size: 0.85rem;
  color: #bbb;
}

.filter select {
  padding: 10px 14px;
  border: 1px solid #00cfff;
  background-color: transparent;
  color: #fff;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.95rem;
  transition: all 0.3s;
}

.filter select:hover,
.filter select:focus {
  background-color: rgba(0, 207, 255, 0.1);
  outline: none;
}

.reset-btn {
  padding: 10px 22px;
  border-radius: 20px;
  background-color: transparent;
  border: 1px solid #00cfff;
  color: #00cfff;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
}

.reset-btn:hover {
  background-color: #00cfff;
  color: #000;
}

.movie-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  justify-content: center;
  margin-top: 20px;
}

/* 반응형 */
@media (max-width: 768px) {
  .filter-bar {
    flex-direction: column;
    gap: 12px;
  }

  .filter select,
  .reset-btn {
    width: 100%;
    font-size: 0.95rem;
  }
}

select option {
  background-color: #23242a;
  color: white;
}

select option:hover {
  background-color: #00cfff;
  color: black;
}
</style>
