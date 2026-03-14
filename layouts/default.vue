<script setup>
import { onMounted } from 'vue'
import { useTheme } from '~/composables/useTheme'
const { initTheme } = useTheme()
onMounted(() => { initTheme() })
const route = useRoute()
</script>
<template>
  <a href="#main-content" class="visually-hidden-focusable">Ugrás a fő tartalomhoz</a>
  <div class="site-wrapper">
    <Header v-show="route.path !== '/admin/login'" />
    <div id="main-content" class="site-content">
      <slot />
    </div>
    <Footer v-show="route.path !== '/admin/login'" />
  </div>
</template>
