import { createRouter, createWebHistory } from "vue-router";
import { watch } from "vue";
import RolunkPage from "@/components/pages/RolunkPage.vue";
import { useAuth } from "@/composables/useAuth";

const ProductListView = () => import("@/views/ProductListView.vue");
const ProductDetailView = () => import("@/views/ProductDetailView.vue");
const HorsesPage = () => import("@/components/pages/HorsesPage.vue");
const HorseDetailView = () => import("@/views/HorseDetailView.vue");
const ResultsPage = () => import("@/components/pages/ResultsPage.vue");
const LoginPage = () => import("@/components/admin/LoginPage.vue");
const AdminDashboard = () => import("@/components/admin/AdminDashboard.vue");
const AdminHorseListView = () => import("@/views/AdminHorseListView.vue");
const AdminProductListView = () => import("@/views/AdminProductListView.vue");
const AdminCompetitionListView = () =>
  import("@/views/AdminCompetitionListView.vue");
const ContactView = () => import("@/views/ContactView.vue");
const CartView = () => import("@/views/CartView.vue");
const CheckoutView = () => import("@/views/CheckoutView.vue");
const AdminContactListView = () =>
  import("@/views/AdminContactListView.vue");

const routes = [
  { path: "/", component: RolunkPage },
  { path: "/webshop", component: ProductListView },
  { path: "/webshop/:id", component: ProductDetailView },
  { path: "/lovaink", component: HorsesPage },
  { path: "/lovaink/:id", component: HorseDetailView },
  { path: "/eredmenyeink", component: ResultsPage },
  { path: "/kapcsolat", component: ContactView },
  {
    path: "/adatvedelem",
    component: () => import("@/views/PrivacyPolicyView.vue"),
  },
  { path: "/kosar", component: CartView },
  { path: "/penztar", component: CheckoutView },

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
    path: "/admin/products/categories",
    component: AdminProductListView,
    meta: { requiresAuth: true },
  },
  {
    path: "/admin/products/new-category",
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
    component: AdminCompetitionListView,
    meta: { requiresAuth: true },
  },
  {
    path: "/admin/competitions/new",
    component: AdminCompetitionListView,
    meta: { requiresAuth: true },
  },
  {
    path: "/admin/competitions/:id/edit",
    component: AdminCompetitionListView,
    meta: { requiresAuth: true },
  },
  {
    path: "/admin/messages",
    component: AdminContactListView,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
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
