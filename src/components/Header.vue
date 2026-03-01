<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useAuth } from "@/composables/useAuth";
import { useTheme } from "@/composables/useTheme";
import CartIcon from "@/components/webshop/CartIcon.vue";

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

function onMouseMove(event) {
  handlenavOnMouseMove(event.clientY);
}

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
  document.addEventListener("mousemove", onMouseMove);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
  document.removeEventListener("mousemove", onMouseMove);
});
</script>

<template>
  <header id="nav" :class="['nav-bar', { hidden: !showNavbar }]">
    <!-- Fő sor: logó | linkek | akció ikonok -->
    <div class="navbar-inner d-flex align-items-center px-3">
      <!-- Bal: logó -->
      <router-link to="/" class="navbar-brand" @click="closeMenu">
        <img
          src="@/assets/img/lagunaLovasKlub.jpg"
          alt="Laguna Lovasklub"
          class="navbar-logo"
        />
      </router-link>

      <!-- Közép: navigációs linkek (csak desktop) -->
      <div class="nav-links d-none d-lg-flex align-items-center">
        <router-link class="nav-link text-uppercase fw-bold" to="/">
          Rólunk
        </router-link>
        <router-link class="nav-link text-uppercase fw-bold" to="/webshop">
          Webshop
        </router-link>
        <router-link class="nav-link text-uppercase fw-bold" to="/lovaink">
          Lovaink
        </router-link>
        <router-link class="nav-link text-uppercase fw-bold" to="/eredmenyeink">
          Eredményeink
        </router-link>
        <router-link class="nav-link text-uppercase fw-bold" to="/kapcsolat">
          Kapcsolat
        </router-link>
      </div>

      <!-- Jobb: akció ikonok -->
      <div class="nav-actions d-flex align-items-center ms-auto">
        <CartIcon />

        <button
          @click="toggleTheme"
          class="btn-icon"
          :title="isDarkMode ? 'Világos téma' : 'Sötét téma'"
          :aria-label="isDarkMode ? 'Világos téma' : 'Sötét téma'"
        >
          <i :class="['bi', isDarkMode ? 'bi-sun-fill' : 'bi-moon-fill']"></i>
        </button>

        <!-- Kijelentkezett: login ikon -->
        <router-link
          v-if="!isAuthenticated"
          to="/admin/login"
          class="btn-icon"
          title="Bejelentkezés"
          aria-label="Bejelentkezés"
          @click="closeMenu"
        >
          <i class="bi bi-person-circle"></i>
        </router-link>

        <!-- Bejelentkezett: profil + logout ikon -->
        <router-link
          v-if="isAuthenticated"
          to="/admin"
          class="btn-icon"
          title="Admin"
          aria-label="Admin"
          @click="closeMenu"
        >
          <i class="bi bi-person-fill"></i>
        </router-link>
        <button
          v-if="isAuthenticated"
          @click="handleLogout"
          class="btn-icon"
          :disabled="loading"
          title="Kijelentkezés"
          aria-label="Kijelentkezés"
        >
          <i class="bi bi-box-arrow-right"></i>
        </button>

        <!-- Hamburger (csak mobil) -->
        <button
          class="btn-icon d-lg-none ms-1"
          @click="toggleMenu"
          :aria-expanded="menuOpen"
          aria-label="Menü"
        >
          <i :class="['bi', menuOpen ? 'bi-x-lg' : 'bi-list']" style="font-size: 1.4rem;"></i>
        </button>
      </div>
    </div>

    <!-- Mobil menü -->
    <div :class="['mobile-menu', { 'menu-open': menuOpen }]">
      <nav class="d-flex flex-column">
        <router-link class="mobile-link" to="/" @click="closeMenu">Rólunk</router-link>
        <router-link class="mobile-link" to="/webshop" @click="closeMenu">Webshop</router-link>
        <router-link class="mobile-link" to="/lovaink" @click="closeMenu">Lovaink</router-link>
        <router-link class="mobile-link" to="/eredmenyeink" @click="closeMenu">Eredményeink</router-link>
        <router-link class="mobile-link" to="/kapcsolat" @click="closeMenu">Kapcsolat</router-link>
        <router-link
          v-if="!isAuthenticated"
          class="mobile-link"
          to="/admin/login"
          @click="closeMenu"
        >
          <i class="bi bi-person-circle me-2"></i>Bejelentkezés
        </router-link>
        <router-link
          v-if="isAuthenticated"
          class="mobile-link"
          to="/admin"
          @click="closeMenu"
        >
          <i class="bi bi-person-fill me-2"></i>Admin
        </router-link>
        <button
          v-if="isAuthenticated"
          class="mobile-link text-start"
          @click="handleLogout"
          :disabled="loading"
        >
          <i class="bi bi-box-arrow-right me-2"></i>
          {{ loading ? "Kijelentkezés..." : "Kijelentkezés" }}
        </button>
      </nav>
    </div>
  </header>
</template>

<style scoped>
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

/* Navbar single row */
.navbar-inner {
  border-bottom: 2px solid var(--highlight);
  padding-top: 0.35rem;
  padding-bottom: 0.35rem;
}

/* Logo */
.navbar-brand {
  display: flex;
  align-items: center;
  text-decoration: none;
  flex-shrink: 0;
}

.navbar-logo {
  height: 40px;
  width: auto;
  border-radius: 4px;
}

/* Center nav links */
.nav-links {
  justify-content: center;
  gap: 0.25rem;
}

/* Nav link styling */
.nav-link {
  color: var(--text) !important;
  text-decoration: none;
  white-space: nowrap;
  padding: 0.5rem 0.75rem;
}

.nav-link:hover {
  color: var(--primary) !important;
}

.nav-link.router-link-active,
.nav-link.router-link-exact-active {
  color: var(--primary) !important;
}

/* Right action icons */
.nav-actions {
  gap: 0.25rem;
}

.btn-icon {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text);
  font-size: 1.2rem;
  padding: 0.4rem 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  transition: color 0.2s ease;
}

.btn-icon:hover {
  color: var(--primary);
}

.btn-icon i {
  transition: transform 0.3s ease;
}

.btn-icon:hover i {
  transform: rotate(10deg);
}

/* Mobile menu */
.mobile-menu {
  display: none;
  border-bottom: 2px solid var(--highlight);
}

.mobile-menu.menu-open {
  display: block;
}

.mobile-link {
  display: block;
  padding: 0.75rem 1.5rem;
  text-align: center;
  text-decoration: none;
  text-transform: uppercase;
  font-weight: bold;
  color: var(--text);
  border-bottom: 1px solid var(--border);
  background: none;
  border-left: none;
  border-right: none;
  border-top: none;
  width: 100%;
  cursor: pointer;
}

.mobile-link:last-child {
  border-bottom: none;
}

.mobile-link:hover {
  color: var(--primary);
}

.mobile-link.router-link-active,
.mobile-link.router-link-exact-active {
  color: var(--primary);
}

@media (min-width: 992px) {
  .navbar-logo {
    height: 45px;
  }

  /* Equal flex on both sides so center links are truly centered */
  .navbar-brand {
    flex: 1 0 0;
  }

  .nav-actions {
    flex: 1 0 0;
    justify-content: flex-end;
  }

  .mobile-menu {
    display: none !important;
  }
}
</style>
