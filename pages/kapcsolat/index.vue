<script setup>
import ContactForm from "~/components/contact/ContactForm.vue";
import { usePageHead } from "~/composables/usePageHead";
import { computed } from "vue";

usePageHead("Kapcsolat", "Vedd fel velünk a kapcsolatot — Laguna Lovasklub Héreg.");

const email = computed(() => atob("bGFndW5hbG92YXNrbHViQGdtYWlsLmNvbQ=="));
const phone = computed(() => atob("KzM2IDIwIDk4MSAzMzgz"));
</script>

<template>
  <div>
    <main>
      <!-- Hero -->
      <section class="px-3 px-md-5 pt-5 mt-4 mt-md-5 pb-4">
        <div class="container-xl">
          <div class="contact-hero">
            <h1 class="display-6 fw-bold mb-3">Kapcsolat</h1>
            <p class="text-muted fs-5 mb-0">
              Lépjen velünk kapcsolatba, és fedezze fel a lovaglás élményét egy prémium környezetben.
            </p>
          </div>
        </div>
      </section>

      <!-- Two-column layout -->
      <section class="px-3 px-md-5 pb-5">
        <div class="container-xl">
          <div class="row g-5">

            <!-- Left: Form -->
            <div class="col-lg-6 order-2 order-lg-1">
              <ContactForm />
            </div>

            <!-- Right: Info + Map -->
            <div class="col-lg-6 order-1 order-lg-2">
              <!-- 4 info cards in 2x2 grid -->
              <div class="row g-4 mb-4">
                <div class="col-6">
                  <div class="d-flex flex-column gap-3">
                    <div class="contact-icon-wrap">
                      <i class="bi bi-geo-alt fs-4"></i>
                    </div>
                    <div>
                      <h6 class="fw-bold mb-1">Helyszín</h6>
                      <p class="text-muted small mb-0">
                        2832 Héreg<br />Laguna Lovasklub
                      </p>
                    </div>
                  </div>
                </div>

                <div class="col-6">
                  <div class="d-flex flex-column gap-3">
                    <div class="contact-icon-wrap">
                      <i class="bi bi-clock fs-4"></i>
                    </div>
                    <div>
                      <h6 class="fw-bold mb-1">Nyitvatartás</h6>
                      <p class="text-muted small mb-0">
                        H-P: 08:00 – 19:00<br />Szo-V: 09:00 – 17:00
                      </p>
                    </div>
                  </div>
                </div>

                <div class="col-6">
                  <div class="d-flex flex-column gap-3">
                    <div class="contact-icon-wrap">
                      <i class="bi bi-envelope fs-4"></i>
                    </div>
                    <div>
                      <h6 class="fw-bold mb-1">Email</h6>
                      <p class="text-muted small mb-0">{{ email }}</p>
                    </div>
                  </div>
                </div>

                <div class="col-6">
                  <div class="d-flex flex-column gap-3">
                    <div class="contact-icon-wrap">
                      <i class="bi bi-telephone fs-4"></i>
                    </div>
                    <div>
                      <h6 class="fw-bold mb-1">Telefon</h6>
                      <p class="text-muted small mb-0">{{ phone }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Map -->
              <div class="contact-map-wrap rounded-3 overflow-hidden position-relative">
                <iframe
                  class="contact-map-iframe"
                  src="https://maps.google.com/maps?q=2832+H%C3%A9reg+Laguna+Lovasklub&output=embed&z=15"
                  loading="lazy"
                  referrerpolicy="no-referrer-when-downgrade"
                  title="Térkép"
                ></iframe>
                <div class="contact-map-gradient"></div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
.contact-hero {
  max-width: 42rem;
}

.contact-icon-wrap {
  width: 3rem;
  height: 3rem;
  border-radius: var(--radius-md);
  background-color: rgba(var(--bs-primary-rgb, 146, 178, 242), 0.15);
  color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

/* Map container */
.contact-map-wrap {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
}

@media (min-width: 992px) {
  .contact-map-wrap {
    aspect-ratio: 1 / 1;
  }
}

.contact-map-iframe {
  width: 100%;
  height: 100%;
  border: none;
  display: block;
  filter: grayscale(1) opacity(0.6);
  transition: filter 0.7s;
}
.contact-map-wrap:hover .contact-map-iframe {
  filter: grayscale(0) opacity(1);
}

.contact-map-gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7) 0%, transparent 50%);
  pointer-events: none;
}
</style>
