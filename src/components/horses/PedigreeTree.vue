<script setup>
import { ref, watch, nextTick } from "vue";
import { VueFlow, useVueFlow } from "@vue-flow/core";
import "@vue-flow/core/dist/style.css";
import "@vue-flow/core/dist/theme-default.css";
import { fetchPedigree } from "@/services/horseService.js";
import { buildPedigreeGraph } from "@/utils/pedigreeTree.js";

const props = defineProps({
  horseId: { type: String, required: true },
  show: { type: Boolean, default: false },
});

const emit = defineEmits(["close"]);

const nodes = ref([]);
const edges = ref([]);
const pedigreeLoading = ref(false);
const noAncestors = ref(false);

const { fitView } = useVueFlow({ id: "pedigree-flow" });

watch(
  () => props.show,
  async (visible) => {
    if (!visible) return;
    pedigreeLoading.value = true;
    noAncestors.value = false;
    try {
      const data = await fetchPedigree(props.horseId);
      if (data) {
        const graph = buildPedigreeGraph(data);
        nodes.value = graph.nodes;
        edges.value = graph.edges;
        if (graph.nodes.length <= 1) {
          noAncestors.value = true;
        }
        await nextTick();
        setTimeout(() => fitView({ padding: 0.2 }), 150);
      }
    } finally {
      pedigreeLoading.value = false;
    }
  },
);

function closeModal() {
  emit("close");
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="show"
      class="modal fade show d-block"
      tabindex="-1"
      @click.self="closeModal"
    >
      <div class="modal-dialog modal-xl modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              <i class="bi bi-diagram-3 me-2"></i>Családfa
            </h5>
            <button
              type="button"
              class="btn-close"
              @click="closeModal"
            ></button>
          </div>
          <div class="modal-body p-0" style="height: 500px">
            <!-- Loading -->
            <div
              v-if="pedigreeLoading"
              class="d-flex justify-content-center align-items-center h-100"
            >
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Betöltés...</span>
              </div>
            </div>

            <!-- No ancestors -->
            <div
              v-else-if="noAncestors"
              class="d-flex justify-content-center align-items-center h-100"
            >
              <p class="text-muted">Nincs elérhető származási adat.</p>
            </div>

            <!-- Tree -->
            <VueFlow
              v-else
              id="pedigree-flow"
              :nodes="nodes"
              :edges="edges"
              :default-edge-options="{ type: 'smoothstep' }"
              :nodes-draggable="false"
              :nodes-connectable="false"
              :edges-updatable="false"
              fit-view-on-init
            >
              <template #node-pedigreeNode="{ data }">
                <router-link
                  :to="`/lovaink/${data.horseId}`"
                  class="text-decoration-none"
                  @click="closeModal"
                >
                  <div
                    class="card shadow-sm pedigree-node"
                    :class="
                      data.gender === 'female'
                        ? 'border-danger'
                        : 'border-primary'
                    "
                  >
                    <div class="card-body p-2 text-center">
                      <div class="fw-bold small text-dark">
                        {{ data.name }}
                      </div>
                      <div
                        v-if="data.role"
                        class="text-muted"
                        style="font-size: 0.7rem"
                      >
                        {{ data.role }}
                      </div>
                    </div>
                  </div>
                </router-link>
              </template>
            </VueFlow>
          </div>
        </div>
      </div>
    </div>
    <div v-if="show" class="modal-backdrop fade show"></div>
  </Teleport>
</template>

<style scoped>
.pedigree-node {
  min-width: 150px;
  border-left-width: 4px !important;
  cursor: pointer;
  transition: transform 0.15s;
}

.pedigree-node:hover {
  transform: scale(1.05);
}
</style>
