import { createRouter, createWebHashHistory } from "vue-router";
import RolunkPage from "@/components/RolunkPage.vue";
import Webshop from "@/components/Webshop.vue";
import HorsesPage from "@/components/HorsesPage.vue";
import ResultsPage from "@/components/ResultsPage.vue";

const routes = [
  { path: "/", component: RolunkPage },
  { path: "/webshop", component: Webshop },
  { path: "/lovaink", component: HorsesPage },
  { path: "/eredmenyeink", component: ResultsPage },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router; 
