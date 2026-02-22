import { createRouter, createWebHashHistory } from "vue-router";
import { watch } from "vue";
import RolunkPage from "@/components/pages/RolunkPage.vue";
import ProductListView from "@/views/ProductListView.vue";
import ProductDetailView from "@/views/ProductDetailView.vue";
import HorsesPage from "@/components/pages/HorsesPage.vue";
import HorseDetailView from "@/views/HorseDetailView.vue";
import ResultsPage from "@/components/pages/ResultsPage.vue";
import LoginPage from "@/components/admin/LoginPage.vue";
import AdminDashboard from "@/components/admin/AdminDashboard.vue";
import AdminHorseListView from "@/views/AdminHorseListView.vue";
import AdminProductListView from "@/views/AdminProductListView.vue";
import { useAuth } from "@/composables/useAuth";

const routes = [
  { path: "/", component: RolunkPage },
  { path: "/webshop", component: ProductListView },
  { path: "/webshop/:id", component: ProductDetailView },
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
  // Product management (Increment 6)
  {
    path: "/admin/products",
    component: AdminProductListView,
    meta: { requiresAuth: true },
  },
  {
    path: "/admin/products/new",
    component: AdminProductListView,
    meta: { requiresAuth: true },
  },
  {
    path: "/admin/products/:id/edit",
    component: AdminProductListView,
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

  function evaluate() {
    if (to.meta.requiresAuth && !isAuthenticated.value) {
      return next("/admin/login");
    }
    if (to.meta.requiresGuest && isAuthenticated.value) {
      return next("/admin");
    }
    next();
  }

  if (!authReady.value) {
    // Auth not yet initialized – wait for it reactively
    const stop = watch(authReady, (ready) => {
      if (ready) {
        stop();
        evaluate();
      }
    });
    return;
  }

  evaluate();
});

export default router;
