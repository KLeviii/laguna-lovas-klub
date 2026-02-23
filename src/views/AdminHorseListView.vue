<template>
  <div class="admin-layout mt-5">

    <!-- List view -->
    <div v-if="currentView === 'list'">
      <AdminHorseList />
    </div>

    <!-- Create view -->
    <div v-if="currentView === 'create'">
      <HorseForm />
    </div>

    <!-- Edit view -->
    <div v-if="currentView === 'edit'">
      <HorseForm />
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useHorses } from "@/composables/useHorses.js";
import AdminHorseList from "@/components/horses/AdminHorseList.vue";
import HorseForm from "@/components/horses/HorseForm.vue";

const route = useRoute();
const currentView = ref("list");
const { loadHorses } = useHorses();

// Load all horses when admin page mounts
onMounted(async () => {
  // Load all horses (no filter) for admin view
  await loadHorses(false);
});

// Watch route changes to determine which view to show
watch(
  () => route.path,
  (newPath) => {
    if (newPath === "/admin/horses") {
      currentView.value = "list";
    } else if (newPath === "/admin/horses/new") {
      currentView.value = "create";
    } else if (newPath.match(/^\/admin\/horses\/[^/]+\/edit$/)) {
      currentView.value = "edit";
    }
  },
  { immediate: true },
);

function setView(view) {
  currentView.value = view;
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

@media (max-width: 576px) {
  .admin-layout {
    padding: 1rem 0.5rem;
  }

  .nav-link {
    padding: 0.5rem 0.75rem;
    font-size: 0.85rem;
  }
}
</style>
