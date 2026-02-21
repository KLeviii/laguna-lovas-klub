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
  <Header v-show="$route.path != '/admin/login'"></Header>
  <router-view />
  <Footer v-show="$route.path != '/admin/login'"></Footer>
</template>
<style scoped></style>
