<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuth } from "@/composables/useAuth";
import { useTheme } from "@/composables/useTheme";

const route = useRoute();
const router = useRouter();
const { isAuthenticated, signOut, loading } = useAuth();
const { isDarkMode, toggleTheme } = useTheme();

const showNavbar = ref(true);
const menuOpen = ref(false);
let lastScrollY = window.scrollY;

function toggleMenu() {
  menuOpen.value = !menuOpen.value;
}

function closeMenu() {
  menuOpen.value = false;
}

const handleScroll = () => {
  const currentScrollY = window.scrollY;

  if (currentScrollY > lastScrollY && currentScrollY > 80) {
    showNavbar.value = false;
  } else {
    showNavbar.value = true;
  }

  lastScrollY = currentScrollY;
};

function handlenavOnMouseMove(mousePosY) {
  const currentScrollY = window.scrollY;
  if (
    currentScrollY > 80 &&
    mousePosY < document.querySelector("#nav").offsetHeight
  ) {
    showNavbar.value = true;
  }
  if (
    currentScrollY > 80 &&
    mousePosY > document.querySelector("#nav").offsetHeight
  ) {
    showNavbar.value = false;
  }
}
const handleLogout = async () => {
  await signOut();
  window.location.href = window.location.pathname;
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
document.addEventListener("mousemove", function (event) {
  handlenavOnMouseMove(event.clientY);
});
</script>

<template>
  <header id="nav" :class="['nav-bar', { hidden: !showNavbar }]">
    <nav>
      <div class="lh-1 heading d-flex justify-content-between align-items-center px-3">
        <h2 class="text-uppercase fw-bold py-2 mb-0">Laguna Lovasklub</h2>
        <button
          class="btn-hamburger d-lg-none"
          @click="toggleMenu"
          :aria-expanded="menuOpen"
          aria-label="Menü"
        >
          <i :class="['bi', menuOpen ? 'bi-x-lg' : 'bi-list']" style="font-size: 1.5rem;"></i>
        </button>
      </div>
      <div :class="['nav-scroller', { 'menu-open': menuOpen }]">
        <nav class="nav justify-content-center flex-lg-row flex-column align-items-center">
          <button
            @click="toggleTheme"
            class="nav-item text-uppercase fw-bold nav-link px-4 btn-theme-toggle"
            :title="isDarkMode ? 'Világos téma' : 'Sötét téma'"
          >
            <i :class="['bi', isDarkMode ? 'bi-sun-fill' : 'bi-moon-fill']"></i>
          </button>
          <router-link
            class="nav-item text-uppercase fw-bold nav-link link-light link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover px-4"
            to="/"
            @click="closeMenu"
          >
            Rólunk
          </router-link>
          <router-link
            class="nav-item text-uppercase fw-bold nav-link link-light link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover px-4"
            to="/webshop"
            @click="closeMenu"
          >
            Webshop
          </router-link>
          <router-link
            class="nav-item text-uppercase fw-bold nav-link link-light link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover px-4"
            to="/lovaink"
            @click="closeMenu"
          >
            Lovaink
          </router-link>
          <router-link
            class="nav-item text-uppercase fw-bold nav-link link-light link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover px-4"
            to="/eredmenyeink"
            @click="closeMenu"
          >
            Eredményeink
          </router-link>
          <router-link
            class="nav-item text-uppercase fw-bold nav-link link-light link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover px-4"
            to="/kapcsolat"
            @click="closeMenu"
          >
            Kapcsolat
          </router-link>

          <router-link
            class="nav-item text-uppercase fw-bold nav-link link-light link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover px-4"
            to="/admin/login"
            v-show="!isAuthenticated"
            @click="closeMenu"
          >
            <i class="bi bi-shield-lock me-1"></i>
            Login
          </router-link>

          <router-link
            v-if="isAuthenticated"
            class="nav-item text-uppercase fw-bold nav-link link-light link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover px-4"
            to="/admin"
            @click="closeMenu"
          >
            <i class="bi bi-shield-lock me-1"></i>
            Admin
          </router-link>
          <button
            v-if="isAuthenticated"
            @click="handleLogout"
            class="nav-item text-uppercase fw-bold nav-link link-light link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover px-4 btn-logout"
            :disabled="loading"
          >
            <i class="bi bi-box-arrow-right me-1"></i>
            {{ loading ? "Kijelentkezés..." : "Kijelentkezés" }}
          </button>
        </nav>
      </div>
    </nav>
  </header>
</template>

<style scoped>
.nav-scroller {
  border-bottom: 2px solid var(--highlight);
}

.heading {
  border-bottom: 1px solid var(--border);
}

h2 {
  color: var(--text);
  font-size: 1.25rem;
}

#nav {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: var(--bg-light);
  transition:
    transform 0.25s ease,
    opacity 0.2s ease;
  z-index: 1000;
}

.hidden {
  transform: translateY(-100%);
  opacity: 0;
}

/* Hamburger button */
.btn-hamburger {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text);
  padding: 0.5rem;
}

/* Mobile menu collapse */
@media (max-width: 991.98px) {
  .nav-scroller {
    display: none;
    padding: 0 !important;
  }

  .nav-scroller.menu-open {
    display: block;
  }

  .nav-scroller .nav {
    flex-direction: column !important;
    align-items: stretch !important;
    padding: 0.5rem 0;
  }

  .nav-scroller .nav .nav-link {
    padding: 0.75rem 1.5rem !important;
    text-align: center;
    border-bottom: 1px solid var(--border);
  }

  .nav-scroller .nav .nav-link:last-child {
    border-bottom: none;
  }
}

@media (min-width: 992px) {
  .btn-hamburger {
    display: none !important;
  }

  h2 {
    font-size: 1.5rem;
  }
}

/* Header linkek stílusa */
.nav-link {
  color: var(--text) !important;
}

.nav-link:hover {
  color: var(--primary) !important;
}

.nav-link.router-link-active,
.nav-link.router-link-exact-active {
  color: var(--primary) !important;
}

.btn-theme-toggle {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem 1rem !important;
  color: var(--text) !important;
  fill: var(--text) !important;
  font-size: 1.2rem;
  transition: color 0.3s ease;
}

.btn-theme-toggle:hover {
  color: var(--primary) !important;
}

.btn-theme-toggle i {
  transition: transform 0.3s ease;
}

.btn-theme-toggle:hover i {
  transform: rotate(20deg);
}

.btn-logout {
  background: none;
  border: none;
}
</style>
