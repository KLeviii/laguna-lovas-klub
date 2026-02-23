<script setup>
import { onMounted } from "vue";
import { useContacts } from "@/composables/useContacts.js";
import { formatDateTime } from "@/utils/formatting.js";

const {
  submissions,
  loading,
  error,
  unreadCount,
  isEmpty,
  loadSubmissions,
  markAsRead,
  removeSubmission,
} = useContacts();

async function confirmDelete(id, name) {
  if (!confirm(`Biztosan törölni szeretnéd "${name}" üzenetét?`)) return;
  await removeSubmission(id);
}

onMounted(() => {
  loadSubmissions();
});
</script>

<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h3>
        <i class="bi bi-envelope me-2"></i>Üzenetek
        <span v-if="unreadCount > 0" class="badge bg-danger ms-2">
          {{ unreadCount }} olvasatlan
        </span>
      </h3>
    </div>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Betöltés...</span>
      </div>
    </div>

    <div v-else-if="error" class="alert alert-danger">
      <i class="bi bi-exclamation-triangle me-2"></i>{{ error }}
      <button class="btn btn-sm btn-outline-danger ms-3" @click="loadSubmissions">
        Újrapróbálás
      </button>
    </div>

    <div v-else-if="isEmpty" class="alert alert-info">
      <i class="bi bi-info-circle me-2"></i>Nincsenek beérkezett üzenetek.
    </div>

    <div v-else class="table-responsive">
      <table class="table table-hover align-middle">
        <thead>
          <tr>
            <th>Státusz</th>
            <th>Név</th>
            <th>Email</th>
            <th>Tárgy</th>
            <th>Dátum</th>
            <th>Műveletek</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="sub in submissions"
            :key="sub.id"
            :class="{ 'fw-bold': !sub.is_read }"
          >
            <td>
              <span
                class="badge"
                :class="sub.is_read ? 'bg-secondary' : 'bg-success'"
              >
                {{ sub.is_read ? "Olvasott" : "Új" }}
              </span>
            </td>
            <td>{{ sub.name }}</td>
            <td>
              <a :href="'mailto:' + sub.email">{{ sub.email }}</a>
            </td>
            <td>{{ sub.subject || "—" }}</td>
            <td>{{ formatDateTime(sub.created_at) }}</td>
            <td>
              <div class="btn-group btn-group-sm">
                <button
                  v-if="!sub.is_read"
                  class="btn btn-outline-success"
                  title="Megjelölés olvasottként"
                  @click="markAsRead(sub.id)"
                >
                  <i class="bi bi-check2"></i>
                </button>
                <button
                  class="btn btn-outline-danger"
                  title="Törlés"
                  @click="confirmDelete(sub.id, sub.name)"
                >
                  <i class="bi bi-trash"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Message detail: expandable rows -->
      <div class="accordion mt-3" id="messageAccordion">
        <div
          v-for="sub in submissions"
          :key="'detail-' + sub.id"
          class="accordion-item"
        >
          <h2 class="accordion-header">
            <button
              class="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              :data-bs-target="'#msg-' + sub.id"
              :class="{ 'fw-bold': !sub.is_read }"
              @click="!sub.is_read && markAsRead(sub.id)"
            >
              <span class="badge me-2" :class="sub.is_read ? 'bg-secondary' : 'bg-success'">
                {{ sub.is_read ? "Olvasott" : "Új" }}
              </span>
              {{ sub.name }} — {{ sub.subject || "Nincs tárgy" }}
              <small class="text-muted ms-auto me-3">{{ formatDateTime(sub.created_at) }}</small>
            </button>
          </h2>
          <div :id="'msg-' + sub.id" class="accordion-collapse collapse">
            <div class="accordion-body">
              <div class="mb-2">
                <strong>Feladó:</strong> {{ sub.name }}
                (<a :href="'mailto:' + sub.email">{{ sub.email }}</a>)
              </div>
              <div v-if="sub.phone" class="mb-2">
                <strong>Telefon:</strong>
                <a :href="'tel:' + sub.phone">{{ sub.phone }}</a>
              </div>
              <div v-if="sub.subject" class="mb-2">
                <strong>Tárgy:</strong> {{ sub.subject }}
              </div>
              <hr />
              <p class="mb-0" style="white-space: pre-wrap;">{{ sub.message }}</p>
              <hr />
              <button
                class="btn btn-sm btn-outline-danger"
                @click="confirmDelete(sub.id, sub.name)"
              >
                <i class="bi bi-trash me-1"></i>Üzenet törlése
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
