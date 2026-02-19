import { createRouter, createWebHashHistory } from "vue-router";
import RolunkPage from "@/components/RolunkPage.vue";
import Webshop from "@/components/Webshop.vue";
import HorsesPage from "@/components/HorsesPage.vue";
import HorseDetailView from "@/views/HorseDetailView.vue";
import ResultsPage from "@/components/ResultsPage.vue";
import LoginPage from "@/components/admin/LoginPage.vue";
import AdminDashboard from "@/components/admin/AdminDashboard.vue";
import AdminHorseListView from "@/views/AdminHorseListView.vue";
import { useAuth } from "@/composables/useAuth";
import RouterConf from "@/components/RouterConf.vue";
import { ssrExportAllKey } from "vite/module-runner";

const routes = [
  { path: "/", component: RolunkPage },
  { path: "/webshop", component: Webshop },
  { path: "/lovaink", component: HorsesPage },
  { path: "/lovaink/:id", component: HorseDetailView },
  { path: "/eredmenyeink", component: ResultsPage },

  // Admin routes
  {
    path: "/admin/login",
    component: LoginPage,
    meta: { requiresGuest: true },
  },
  {
    path: "/admin",
    component: AdminDashboard,
    meta: { requiresAuth: true },
  },
  // Horse management (Increment 4)
  {
    path: "/admin/horses",
    component: AdminHorseListView,
    meta: { requiresAuth: true },
  },
  {
    path: "/admin/horses/new",
    component: AdminHorseListView,
    meta: { requiresAuth: true },
  },
  {
    path: "/admin/horses/:id/edit",
    component: AdminHorseListView,
    meta: { requiresAuth: true },
  },
  // Placeholder routes későbbi inkrementumokhoz
  {
    path: "/admin/products",
    component: AdminDashboard, // TODO: Inkrementum 6-ban lecserélni
    meta: { requiresAuth: true },
  },
  {
    path: "/admin/competitions",
    component: AdminDashboard, // TODO: Inkrementum 8-ban lecserélni
    meta: { requiresAuth: true },
  },
  {
    path: "/admin/messages",
    component: AdminDashboard, // TODO: Inkrementum 9-ben lecserélni
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

// Navigation Guard - védett admin oldalak

router.beforeEach((to, from, next) => {
  const { isAuthenticated, authReady } = useAuth();

  // Wait for auth initialization
  if (!authReady.value) {
    // Auth not initialized yet - wait a bit and retry
    setTimeout(() => {
      next(to.path);
    }, 100);
    return;
  }

  // Védett admin oldal - átirányítás login-ra ha nincs bejelentkezve
  if (to.meta.requiresAuth && !isAuthenticated.value) {
    return next("/admin/login");
  }

  // Login oldal - átirányítás dashboardra ha már be van jelentkezve
  if (to.meta.requiresGuest && isAuthenticated.value) {
    return next("/admin");
  }
  next();
});

export default router;
