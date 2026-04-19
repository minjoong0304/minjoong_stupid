<!-- src/views/Wishlist.vue -->
<template>
  <div class="wishlist">
    <div v-if="wishlist.length === 0" class="empty">
      위시 리스트가 비어있습니다.
    </div>
    <div v-else class="movies-grid">
      <MovieCard v-for="movie in wishlist" :key="movie.id" :movie="movie" />
    </div>
  </div>
</template>

<script>
import { computed } from "vue";
import { useStore } from "vuex";
import MovieCard from "../components/common/MovieCard.vue";

export default {
  name: "Wishlist",
  components: {
    MovieCard,
  },
  setup() {
    const store = useStore();
    const wishlist = computed(() => store.getters["wishlist/wishlist"]);

    return {
      wishlist,
    };
  },
};
</script>

<style scoped>
.wishlist {
  padding: 40px 20px;
  background-color: #1b1c1e;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.empty {
  background-color: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 20px 40px;
  border-radius: 12px;
  color: #ccc;
  font-size: 1.1em;
  text-align: center;
  margin-top: 100px;
  backdrop-filter: blur(6px);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.movies-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 24px;
  margin-top: 30px;
  max-width: 1400px;
  width: 100%;
  padding: 0 10px;
}

/* 반응형 - 모바일에서는 간격 좁게 */
@media (max-width: 768px) {
  .movies-grid {
    gap: 16px;
  }

  .empty {
    font-size: 1em;
    padding: 16px 24px;
  }
}
</style>
