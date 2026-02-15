<script setup>
import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";
</script>
<template>
  <Header v-show="$route.path != '/admin/login'"></Header>
  <router-view />
  <Footer v-show="$route.path != '/admin/login'"></Footer>
</template>
<style scoped></style>
