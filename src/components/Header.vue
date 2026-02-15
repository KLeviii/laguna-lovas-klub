<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const showNavbar = ref(true)
let lastScrollY = window.scrollY

const handleScroll = () => {
  const currentScrollY = window.scrollY

  if (currentScrollY > lastScrollY && currentScrollY > 80) {
    showNavbar.value = false
  } else {
    showNavbar.value = true
  }

  lastScrollY = currentScrollY
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <header id="nav" :class="['nav-bar', { hidden: !showNavbar }]">
    <nav>
      <div class="border-bottom lh-1">
        <div class="flex-nowrap justify-content-between align-items-center">
          <div class="text-center align-items-center">
            <h2 class="text-uppercase fw-bold py-2 ">Laguna Lovasklub</h2>
          </div>
        </div>
      </div>
      <div class="nav-scroller px-4 border-bottom">
        <nav class="nav nav-underline justify-content-center">
          <router-link
            class="nav-item text-uppercase fw-bold nav-link link-light link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover px-4"
            to="/"
          >
            Rólunk
          </router-link>
          <router-link
            class="nav-item text-uppercase fw-bold nav-link link-light link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover px-4"
            to="/webshop"
          >
            Webshop
          </router-link>
          <router-link
            class="nav-item text-uppercase fw-bold nav-link link-light link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover px-4"
            to="/lovaink"
          >
            Lovaink
          </router-link>
          <router-link
            class="nav-item text-uppercase fw-bold nav-link link-light link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover px-4"
            to="/eredmenyeink"
          >
            Eredményeink
          </router-link>
        </nav>
      </div>
    </nav>
  </header>
</template>

<style scoped>
#nav {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: #19253c;
  color: white;
  transition: transform 0.25s ease, opacity 0.2s ease;
  z-index: 1000;
}

.hidden {
  transform: translateY(-100%);
  opacity: 0;
}

nav router-link {
  margin-right: 16px;
  color: white;
  text-decoration: none;
}
</style>