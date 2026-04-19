<template>
  <div id="app">
    <Header />
    <router-view class="main-view" />
    <Footer />
  </div>
</template>

<script>
import Header from "./components/common/Header.vue";
import Footer from "./components/common/Footer.vue";
import { useRoute } from "vue-router";
import { computed } from "vue";

export default {
  name: "App",
  components: {
    Header,
    Footer,
  },
  setup() {
    const route = useRoute();
    const hiddenPaths = ["/signin", "/signup"];
    const showLayout = computed(() => !hiddenPaths.includes(route.path));
    return { showLayout };
  },
};
</script>

<style lang="scss">
html,
body {
  margin: 0;
  padding: 0;
  min-height: 100vh;
  background-color: #1e1e1e;
  color: #fff;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  overflow-x: hidden;
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-view {
  flex: 1;
  display: flex;
  flex-direction: column;
}
</style>
