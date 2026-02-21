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
let lastScrollY = window.scrollY;

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
  const isOnAdminPage = route.path.startsWith("/admin");
  await signOut();
  if (isOnAdminPage) {
    router.push("/");
  }
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
      <div class="lh-1 heading">
        <div class="flex-nowrap justify-content-between align-items-center">
          <div class="text-center align-items-center">
            <h2 class="text-uppercase fw-bold py-2">Laguna Lovasklub</h2>
          </div>
        </div>
      </div>
      <div class="nav-scroller px-4">
        <nav class="nav justify-content-center">
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

          <router-link
            class="nav-item text-uppercase fw-bold nav-link link-light link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover px-4"
            to="/admin/login"
            v-show="!isAuthenticated"
          >
            <i class="bi bi-shield-lock me-1"></i>
            Login
          </router-link>

          <!-- Admin link - csak bejelentkezve látható -->
          <router-link
            v-if="isAuthenticated"
            class="nav-item text-uppercase fw-bold nav-link link-light link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover px-4"
            to="/admin"
          >
            <i class="bi bi-shield-lock me-1"></i>
            Admin
          </router-link>
          <!-- Kijelentkezés gomb - csak bejelentkezve látható -->
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

nav router-link {
  margin-right: 16px;
  color: var(--text) !important;
  text-decoration: none;
  display: inline-block;
}

/* Header linkek stílusa */
.nav-link {
  color: var(--text) !important;
}

.nav-link:hover {
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
</style>
