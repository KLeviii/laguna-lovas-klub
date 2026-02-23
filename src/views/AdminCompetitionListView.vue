<template>
  <div class="admin-layout">
    <!-- Navigation tabs -->
    <nav class="mb-4">
      <div class="nav nav-tabs" role="tablist">
        <button
          type="button"
          class="nav-link"
          :class="{ active: currentView === 'list' }"
          @click="navigateTo('list')"
        >
          <i class="bi bi-list-ul"></i> Versenyek listája
        </button>
        <button
          type="button"
          class="nav-link"
          :class="{ active: currentView === 'create' || currentView === 'edit' }"
          @click="navigateTo('create')"
        >
          <i class="bi bi-plus-circle"></i> Új verseny
        </button>
      </div>
    </nav>

    <!-- Competition List -->
    <div v-if="currentView === 'list'">
      <AdminCompetitionList />
    </div>

    <!-- Create Competition -->
    <div v-if="currentView === 'create'">
      <CompetitionForm @saved="onCompetitionSaved" @cancel="onCompetitionCancel" />
    </div>

    <!-- Edit Competition -->
    <div v-if="currentView === 'edit'">
      <CompetitionForm @saved="onCompetitionSaved" @cancel="onCompetitionCancel" />
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import AdminCompetitionList from "@/components/competitions/AdminCompetitionList.vue";
import CompetitionForm from "@/components/competitions/CompetitionForm.vue";

const route = useRoute();
const router = useRouter();
const currentView = ref("list");

watch(
  () => route.path,
  (newPath) => {
    if (newPath === "/admin/competitions") {
      currentView.value = "list";
    } else if (newPath === "/admin/competitions/new") {
      currentView.value = "create";
    } else if (newPath.match(/^\/admin\/competitions\/[^/]+\/edit$/)) {
      currentView.value = "edit";
    }
  },
  { immediate: true }
);

function navigateTo(view) {
  const routeMap = {
    list: "/admin/competitions",
    create: "/admin/competitions/new",
  };
  if (routeMap[view]) {
    router.push(routeMap[view]);
  }
}

function onCompetitionSaved() {
  router.push("/admin/competitions");
}

function onCompetitionCancel() {
  router.push("/admin/competitions");
}
</script>

<style scoped>
.admin-layout {
  padding: 2rem 1rem;
}

.nav-tabs {
  border-bottom: 1px solid var(--border);
  margin-bottom: 2rem;
}

.nav-link {
  border: none;
  border-bottom: 3px solid transparent;
  color: var(--text-muted);
  font-weight: 500;
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  transition: all 0.2s;
}

.nav-link:hover {
  color: var(--primary);
  border-color: var(--primary);
}

.nav-link.active {
  color: var(--primary);
  border-color: var(--primary);
  background-color: transparent;
}

i {
  margin-right: 0.5rem;
}
</style>
