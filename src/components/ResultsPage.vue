<script setup>
import { useAuth } from '@/composables/useAuth'

const { isAuthenticated } = useAuth()

function data() {
  return {
    statisztikak: [
      { szam: 10, ikon: "bi-person-fill", leiras: "Aktív versenyző" },
      { szam: 10, ikon: "bi-trophy-fill", leiras: "Bajnoki cím" },
      { szam: 50, ikon: "bi-award-fill", leiras: "Elért helyezés" },
    ],
    evek: [
      {
        ev: "2025",
        tartalom: "A 2025-ös év eredményei hamarosan elérhetők lesznek.",
      },
      {
        ev: "2024",
        tartalom:
          "A 2024-es évben számos kiváló helyezést értünk el nemzeti versenyeken.",
      },
      {
        ev: "2023",
        tartalom:
          "A 2023-as év kiemelkedő versenyeredményeket hozott klubunk számára.",
      },
    ],
  };
}
</script>

<template>
  <div>
    <main>
      <div class="image-container">
        <div class="overlay"></div>
        <div class="text">Eredményeink</div>
      </div>

      <section class="p-4">
        <div class="d-flex">
          <div class="row w-100">
            <div v-for="stat in data().statisztikak" :key="stat.leiras" class="col-4">
              <div class="card">
                <div class="d-flex justify-content-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="50"
                    height="50"
                    fill="currentColor"
                    :class="'bi ' + stat.ikon"
                    viewBox="0 0 16 16"
                  >
                    <path
                      v-if="stat.ikon === 'bi-person-fill'"
                      d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6"
                    />
                    <path
                      v-if="stat.ikon === 'bi-trophy-fill'"
                      d="M2.5.5A.5.5 0 0 1 3 0h10a.5.5 0 0 1 .5.5q0 .807-.034 1.536a3 3 0 1 1-1.133 5.89c-.79 1.865-1.878 2.777-2.833 3.011v2.173l1.425.356c.194.048.377.135.537.255L13.3 15.1a.5.5 0 0 1-.3.9H3a.5.5 0 0 1-.3-.9l1.838-1.379c.16-.12.343-.207.537-.255L6.5 13.11v-2.173c-.955-.234-2.043-1.146-2.833-3.012a3 3 0 1 1-1.132-5.89A33 33 0 0 1 2.5.5m.099 2.54a2 2 0 0 0 .72 3.935c-.333-1.05-.588-2.346-.72-3.935m10.083 3.935a2 2 0 0 0 .72-3.935c-.133 1.59-.388 2.885-.72 3.935"
                    />
                    <path
                      v-if="stat.ikon === 'bi-award-fill'"
                      d="m8 0 1.669.864 1.858.282.842 1.68 1.337 1.32L13.4 6l.306 1.854-1.337 1.32-.842 1.68-1.858.282L8 12l-1.669-.864-1.858-.282-.842-1.68-1.337-1.32L2.6 6l-.306-1.854 1.337-1.32.842-1.68L6.331.864z"
                    />
                    <path
                      v-if="stat.ikon === 'bi-award-fill'"
                      d="M4 11.794V16l4-1 4 1v-4.206l-2.018.306L8 13.126 6.018 12.1z"
                    />
                  </svg>
                  <h3 class="m-2">{{ stat.szam }}</h3>
                </div>
                <h3 class="text-center mt-3">{{ stat.leiras }}</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="p-5">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h2 class="mb-0">Versenyeredmények</h2>
          
          <!-- Admin gomb - csak bejelentkezve látható -->
          <router-link
            v-if="isAuthenticated"
            to="/admin/competitions"
            class="btn btn-primary"
          >
            <i class="bi bi-pencil-square me-2"></i>
            Versenyek kezelése
          </router-link>
        </div>
        
        <div class="accordion" id="accordionExample">
          <div v-for="(ev, index) in data().evek" :key="ev.ev" class="accordion-item">
            <h2 class="accordion-header">
              <button
                class="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                :data-bs-target="'#collapse' + index"
                aria-expanded="false"
                :aria-controls="'collapse' + index"
              >
                {{ ev.ev }}
              </button>
            </h2>
            <div
              :id="'collapse' + index"
              class="accordion-collapse collapse"
              data-bs-parent="#accordionExample"
            >
              <div class="accordion-body">
                <strong>{{ ev.ev }} - Eredményeink</strong> {{ ev.tartalom }}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
.btn-primary {
  background-color: #4da6ff;
  border-color: #4da6ff;
}

.btn-primary:hover {
  background-color: #3399ff;
  border-color: #3399ff;
}
</style>
