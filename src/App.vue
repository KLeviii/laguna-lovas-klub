<script setup>
import { onMounted } from "vue";
import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";
import { useTheme } from "./composables/useTheme";

const { initTheme } = useTheme();

onMounted(() => {
  initTheme();
});
</script>
<template>
  <a href="#main-content" class="visually-hidden-focusable">Ugrás a fő tartalomhoz</a>
  <div class="site-wrapper">
    <Header v-show="$route.path != '/admin/login'"></Header>
    <div id="main-content" class="site-content">
      <router-view />
    </div>
    <Footer v-show="$route.path != '/admin/login'"></Footer>
  </div>
</template>
<style scoped></style>
