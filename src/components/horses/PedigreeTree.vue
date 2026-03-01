<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from "vue";
import { VueFlow, useVueFlow } from "@vue-flow/core";
import "@vue-flow/core/dist/style.css";
import "@vue-flow/core/dist/theme-default.css";
import {
  fetchPedigree,
  createPedigreeHorse,
  assignParent,
  removeParent,
  updateHorseName,
  deletePedigreeHorse,
} from "@/services/horseService.js";
import { buildPedigreeGraph } from "@/utils/pedigreeTree.js";

const props = defineProps({
  horseId: { type: String, required: true },
  show: { type: Boolean, default: false },
  editable: { type: Boolean, default: false },
});

const emit = defineEmits(["close", "pedigree-updated"]);

const nodes = ref([]);
const edges = ref([]);
const pedigreeLoading = ref(false);
const noAncestors = ref(false);
const pedigreeData = ref(null);

// --- Add ancestor form ---
const showAddForm = ref(false);
const newName = ref("");
const newGender = ref("male");
const selectedChildId = ref("");
const addError = ref("");
const addLoading = ref(false);

// Role is fully determined by gender — no separate dropdown
const selectedRole = computed(() => (newGender.value === "male" ? "sire" : "dam"));

// Only show children that are missing the required parent type
const validChildNodes = computed(() => {
  if (!nodes.value.length || !pedigreeData.value) return [];
  return nodes.value.filter((node) => {
    const horse = pedigreeData.value.byId[node.id];
    if (!horse) return false;
    return newGender.value === "male" ? !horse.sire_id : !horse.dam_id;
  });
});

// Keep selectedChildId in sync with the filtered list
watch(validChildNodes, (opts) => {
  if (!opts.find((n) => n.id === selectedChildId.value)) {
    selectedChildId.value = opts[0]?.id || "";
  }
});

// --- Context menu ---
const ctxMenu = ref({ show: false, x: 0, y: 0, nodeData: null, editMode: false, editName: "" });
const ctxLoading = ref(false);

const { fitView } = useVueFlow({ id: "pedigree-flow" });

// ---- Pedigree loading ----

async function loadPedigree() {
  pedigreeLoading.value = true;
  noAncestors.value = false;
  try {
    const data = await fetchPedigree(props.horseId);
    if (data) {
      pedigreeData.value = data;
      const graph = buildPedigreeGraph(data);
      nodes.value = graph.nodes;
      edges.value = graph.edges;
      noAncestors.value = graph.nodes.length <= 1;
      await nextTick();
      setTimeout(() => fitView({ padding: 0.2 }), 150);
    }
  } finally {
    pedigreeLoading.value = false;
  }
}

watch(() => props.show, (visible) => { if (visible) loadPedigree(); }, { immediate: true });

// ---- Modal ----

function closeModal() {
  showAddForm.value = false;
  resetAddForm();
  closeCtxMenu();
  emit("close");
}

// ---- Add ancestor form ----

function resetAddForm() {
  newName.value = "";
  newGender.value = "male";
  addError.value = "";
}

function openAddForm() {
  resetAddForm();
  showAddForm.value = true;
}

async function addAncestor() {
  addError.value = "";
  if (!newName.value.trim()) {
    addError.value = "A név megadása kötelező.";
    return;
  }
  if (!selectedChildId.value) {
    addError.value = "Nincs elérhető utód ehhez a szülőhöz.";
    return;
  }
  addLoading.value = true;
  try {
    const newHorse = await createPedigreeHorse(newName.value.trim(), newGender.value);
    await assignParent(selectedChildId.value, newHorse.id, selectedRole.value);
    showAddForm.value = false;
    resetAddForm();
    await loadPedigree();
    emit("pedigree-updated");
  } catch (err) {
    addError.value = err.message || "Hiba történt a mentés során.";
  } finally {
    addLoading.value = false;
  }
}

// ---- Context menu ----

function openCtxMenu(event, data) {
  if (!props.editable) return;
  const x = Math.min(event.clientX, window.innerWidth - 180);
  const y = Math.min(event.clientY, window.innerHeight - 140);
  ctxMenu.value = { show: true, x, y, nodeData: data, editMode: false, editName: data.name };
}

function closeCtxMenu() {
  ctxMenu.value.show = false;
  ctxMenu.value.editMode = false;
}

async function saveNodeName() {
  const name = ctxMenu.value.editName.trim();
  if (!name) return;
  ctxLoading.value = true;
  try {
    await updateHorseName(ctxMenu.value.nodeData.horseId, name);
    closeCtxMenu();
    await loadPedigree();
  } catch (e) {
    closeCtxMenu();
  } finally {
    ctxLoading.value = false;
  }
}

function findChildInTree(nodeId) {
  if (!pedigreeData.value) return null;
  for (const horse of Object.values(pedigreeData.value.byId)) {
    if (horse.sire_id === nodeId || horse.dam_id === nodeId) return horse;
  }
  return null;
}

async function removeNodeFromTree(nodeData) {
  closeCtxMenu();
  const horse = pedigreeData.value?.byId[nodeData.horseId];
  if (!horse) return;
  ctxLoading.value = true;
  try {
    // Disconnect from its biological child (the horse in the tree pointing TO this node)
    const child = findChildInTree(nodeData.horseId);
    if (child) {
      const role = child.sire_id === nodeData.horseId ? "sire" : "dam";
      await removeParent(child.id, role);
    }
    // Also clear this node's own parent links so its subtree disconnects
    if (horse.sire_id) await removeParent(horse.id, "sire");
    if (horse.dam_id) await removeParent(horse.id, "dam");
    // Delete the record only for pedigree-only stubs
    if (horse.is_pedigree_only) await deletePedigreeHorse(horse.id);
    await loadPedigree();
    emit("pedigree-updated");
  } catch (e) {
    console.error(e);
  } finally {
    ctxLoading.value = false;
  }
}

// Close context menu on outside click or Escape
function onGlobalClick() { if (ctxMenu.value.show) closeCtxMenu(); }
function onEscape(e) { if (e.key === "Escape") closeCtxMenu(); }
onMounted(() => {
  document.addEventListener("click", onGlobalClick);
  document.addEventListener("keydown", onEscape);
});
onUnmounted(() => {
  document.removeEventListener("click", onGlobalClick);
  document.removeEventListener("keydown", onEscape);
});
</script>

<template>
  <Teleport to="body">
    <!-- Modal -->
    <div
      v-if="show"
      class="modal fade show d-block"
      tabindex="-1"
      @click.self="closeModal"
    >
      <div class="modal-dialog modal-xl modal-dialog-centered">
        <div class="modal-content">
          <!-- Header -->
          <div class="modal-header">
            <h5 class="modal-title">
              <i class="bi bi-diagram-3 me-2"></i>Családfa
            </h5>
            <div class="ms-auto d-flex align-items-center gap-2">
              <button
                v-if="editable"
                class="btn btn-sm btn-success"
                @click="openAddForm"
              >
                <i class="bi bi-plus-circle me-1"></i>Ős hozzáadása
              </button>
              <button type="button" class="btn-close" @click="closeModal"></button>
            </div>
          </div>

          <!-- Add ancestor form -->
          <div v-if="editable && showAddForm" class="p-3 border-bottom bg-light">
            <div v-if="addError" class="alert alert-danger py-1 px-2 mb-2 small">
              {{ addError }}
            </div>
            <div class="row g-2 align-items-end">
              <div class="col-md-3">
                <label class="form-label mb-1 small">Név</label>
                <input
                  v-model="newName"
                  class="form-control form-control-sm"
                  placeholder="Ló neve"
                  @keyup.enter="addAncestor"
                />
              </div>
              <div class="col-md-2">
                <label class="form-label mb-1 small">Nem</label>
                <select v-model="newGender" class="form-select form-select-sm">
                  <option value="male">♂ Mén (apa)</option>
                  <option value="female">♀ Kanca (anya)</option>
                </select>
              </div>
              <div class="col-md-4">
                <label class="form-label mb-1 small">
                  Kinek a {{ newGender === "male" ? "apja" : "anyja" }}?
                </label>
                <select
                  v-if="validChildNodes.length"
                  v-model="selectedChildId"
                  class="form-select form-select-sm"
                >
                  <option
                    v-for="node in validChildNodes"
                    :key="node.id"
                    :value="node.id"
                  >
                    {{ node.data.name }}
                  </option>
                </select>
                <p v-else class="text-muted small mb-0 mt-1">
                  Minden lónak megvan a(z) {{ newGender === "male" ? "apja" : "anyja" }}.
                </p>
              </div>
              <div class="col-md-3 d-flex gap-1">
                <button
                  class="btn btn-sm btn-primary"
                  :disabled="addLoading || !validChildNodes.length"
                  @click="addAncestor"
                >
                  <span
                    v-if="addLoading"
                    class="spinner-border spinner-border-sm me-1"
                  ></span>
                  Mentés
                </button>
                <button
                  class="btn btn-sm btn-outline-secondary"
                  @click="showAddForm = false"
                >
                  Mégse
                </button>
              </div>
            </div>
          </div>

          <!-- Body -->
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
              class="d-flex flex-column justify-content-center align-items-center h-100 gap-3"
            >
              <p class="text-muted mb-0">Ennek a lónak nincs rögzített felmenője.</p>
              <button
                v-if="editable"
                class="btn btn-sm btn-success"
                @click="openAddForm"
              >
                <i class="bi bi-plus-circle me-1"></i>Ős hozzáadása
              </button>
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
                <div
                  class="card shadow-sm pedigree-node"
                  :class="[
                    data.gender === 'female' ? 'border-danger' : 'border-primary',
                    data.isPedigreeOnly ? 'pedigree-only' : '',
                  ]"
                  @contextmenu.prevent="openCtxMenu($event, data)"
                >
                  <div class="card-body p-2 text-center">
                    <router-link
                      v-if="!data.isPedigreeOnly"
                      :to="`/lovaink/${data.horseId}`"
                      class="fw-bold small text-dark text-decoration-none d-block"
                      @click.stop="closeModal"
                    >
                      {{ data.name }}
                    </router-link>
                    <div v-else class="fw-bold small text-dark">{{ data.name }}</div>
                    <div v-if="data.role" class="text-muted" style="font-size: 0.7rem">
                      {{ data.role }}
                    </div>
                  </div>
                </div>
              </template>
            </VueFlow>
          </div>
        </div>
      </div>
    </div>
    <div v-if="show" class="modal-backdrop fade show"></div>

    <!-- Context menu (fixed-positioned, outside modal stacking) -->
    <div
      v-if="ctxMenu.show"
      class="pedigree-ctx-menu card shadow-sm border"
      :style="{ left: ctxMenu.x + 'px', top: ctxMenu.y + 'px' }"
      @click.stop
    >
      <!-- Normal options -->
      <template v-if="!ctxMenu.editMode">
        <div class="px-3 py-2 border-bottom text-muted small">
          <strong>{{ ctxMenu.nodeData.name }}</strong>
        </div>
        <button
          class="ctx-item"
          @click="ctxMenu.editMode = true"
        >
          <i class="bi bi-pencil me-2"></i>Név szerkesztése
        </button>
        <button
          v-if="ctxMenu.nodeData?.horseId !== horseId"
          class="ctx-item ctx-item-danger"
          :disabled="ctxLoading"
          @click="removeNodeFromTree(ctxMenu.nodeData)"
        >
          <i class="bi bi-x-circle me-2"></i>Eltávolítás a fából
        </button>
      </template>

      <!-- Edit name form -->
      <template v-else>
        <div class="p-2">
          <div class="small fw-bold mb-2">Név szerkesztése</div>
          <input
            v-model="ctxMenu.editName"
            class="form-control form-control-sm mb-2"
            @keyup.enter="saveNodeName"
            @keyup.esc="ctxMenu.editMode = false"
          />
          <div class="d-flex gap-1">
            <button
              class="btn btn-sm btn-primary flex-fill"
              :disabled="ctxLoading"
              @click="saveNodeName"
            >
              <span v-if="ctxLoading" class="spinner-border spinner-border-sm"></span>
              <span v-else>Mentés</span>
            </button>
            <button
              class="btn btn-sm btn-outline-secondary"
              @click="ctxMenu.editMode = false"
            >
              Mégse
            </button>
          </div>
        </div>
      </template>
    </div>
  </Teleport>
</template>

<style scoped>
.pedigree-node {
  min-width: 150px;
  border-left-width: 4px !important;
  transition: transform 0.15s;
}

.pedigree-node:hover {
  transform: scale(1.05);
}

.pedigree-node.pedigree-only {
  opacity: 0.75;
  border-style: dashed !important;
}

/* Context menu */
.pedigree-ctx-menu {
  position: fixed;
  z-index: 9999;
  min-width: 170px;
  padding: 0;
  border-radius: 6px;
  overflow: hidden;
}

.ctx-item {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0.4rem 0.75rem;
  background: none;
  border: none;
  font-size: 0.875rem;
  text-align: left;
  cursor: pointer;
  transition: background 0.1s;
}

.ctx-item:hover {
  background-color: #f0f0f0;
}

.ctx-item-danger {
  color: #dc3545;
}

.ctx-item-danger:hover {
  background-color: #fff0f0;
}

.ctx-item:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
