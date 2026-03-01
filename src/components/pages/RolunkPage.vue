<script setup>
import { ref, onMounted } from "vue";
import { fetchLatestCompetitions } from "@/services/competitionService.js";
import { fetchAllHorses } from "@/services/horseService.js";
import { fetchAllProducts } from "@/services/productService.js";
import { formatDate } from "@/utils/formatting.js";
import { useHead } from "@/composables/useHead";
import ProductCard from "@/components/webshop/ProductCard.vue";
import heroImg from "@/assets/img/vagany.jpg";
import aboutImg from "@/assets/img/cordocan.jpg";
import webshopImg from "@/assets/img/babolna.jpg";
useHead(
  "Kezdőlap",
  "Laguna Lovasklub Héreg — lovas hagyomány, modern szemlélettel.",
);

const products = ref([]);
const horses = ref([]);
const competitions = ref([]);
const loading = ref(true);

onMounted(async () => {
  const [prodResult, horseResult, compResult] = await Promise.allSettled([
    fetchAllProducts({ available_only: true }),
    fetchAllHorses(),
    fetchLatestCompetitions(5),
  ]);

  if (prodResult.status === "fulfilled") {
    products.value = prodResult.value.slice(0, 4);
  }
  if (horseResult.status === "fulfilled") {
    horses.value = horseResult.value.slice(0, 3);
  }
  if (compResult.status === "fulfilled") {
    competitions.value = compResult.value;
  }

  loading.value = false;
});

function scrollToRolunk() {
  const el = document.getElementById("rolunk");
  if (el) el.scrollIntoView({ behavior: "smooth" });
}
</script>

<template>
  <div class="hero-container">
    <!-- Hero Section -->
    <section
      class="hero-section d-flex align-items-center justify-content-center text-center"
      :style="{ backgroundImage: `url(${heroImg})` }"
    >
      <div class="hero-overlay"></div>
      <div class="hero-content position-relative">
        <h1 class="hero-title mb-4">Lovas hagyomány, modern szemlélettel</h1>
        <p class="hero-subtitle mb-5">Laguna Lovasklub — Héreg</p>
        <div class="d-flex flex-wrap justify-content-center gap-3">
          <button
            class="btn btn-outline-light btn-lg px-4"
            @click="scrollToRolunk"
          >
            Ismerd meg a klubot
          </button>
          <router-link to="/webshop" class="btn btn-primary btn-lg px-4">
            Webshop
          </router-link>
        </div>
        <div class="hero-chevron mt-5">
          <i class="bi bi-chevron-down"></i>
        </div>
      </div>
    </section>

    <!-- Rólunk Section -->
    <section id="rolunk" class="section-padding">
      <div class="container">
        <div class="row align-items-center g-5">
          <div class="col-12 col-lg-7">
            <h2 class="section-title mb-4">Rólunk</h2>
            <p class="lead mb-4">
              A Laguna Lovasklub Héregen a minőségi lótartás, a szakmai fejlődés
              és a természetközeli életforma találkozik.
            </p>
            <p>
              Célunk, hogy a lovak és lovasok egyaránt a legjobb körülmények
              között bontakozhassanak ki — legyen szó belovaglásról,
              versenyeztetésről vagy tenyésztésről. Klubunkban tapasztalt edzők
              és felkészült szakemberek dolgoznak azon, hogy minden ló és lovas
              a saját szintjén fejlődjön.
            </p>
            <p>
              A lovak regenerációját és egészségét korszerű terápiás eszközökkel
              támogatjuk. A Laguna Lovasklub versenyorientált szemlélete mellett
              megőrzi barátságos, családias hangulatát — nálunk a szakmai
              igényesség és a közösség ereje kéz a kézben jár.
            </p>
          </div>
          <div class="col-12 col-lg-5">
            <img
              :src="aboutImg"
              alt="Laguna Lovasklub"
              class="img-fluid rounded shadow-lg about-img"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Webshop Section -->
    <section
      class="webshop-section-bg d-flex align-items-center justify-content-center text-center"
      :style="{ backgroundImage: `url(${webshopImg})` }"
    >
    <div class="webshop-overlay"></div>
      <section class="section-padding section-alt webshop-preview">
        <div class="container">
          <div class="text-center mb-5">
            <h2 class="section-title">Vásárolj tőlünk</h2>
            <p class="text-muted mt-3">
              Válogass minőségi lovas felszerelések és kiegészítők közül.
            </p>
          </div>

          <div v-if="loading" class="text-center py-5">
            <div class="spinner-border" role="status">
              <span class="visually-hidden">Betöltés...</span>
            </div>
          </div>

          <div v-else-if="products.length > 0" class="row g-4">
            <div
              v-for="product in products"
              :key="product.id"
              class="col-12 col-sm-6 col-lg-3"
            >
              <ProductCard :product="product" />
            </div>
          </div>

          <div class="text-center mt-5">
            <router-link to="/webshop" class="btn btn-primary btn-lg px-5">
              Összes termék
              <i class="bi bi-arrow-right ms-2"></i>
            </router-link>
          </div>
        </div>
      </section>
    </section>

    <!-- Pedigré Section -->
    <div class="snap-section">
      <section class="section-padding">
        <div class="container">
          <div class="text-center mb-5">
            <h2 class="section-title">Pedigrénk</h2>
            <p class="text-muted mt-3">
              Ismerkedj meg lovainkkal — minőségi tenyésztés, kiválóan képzett
              lovak.
            </p>
          </div>

          <div v-if="loading" class="text-center py-5">
            <div class="spinner-border" role="status">
              <span class="visually-hidden">Betöltés...</span>
            </div>
          </div>

          <div
            v-else-if="horses.length > 0"
            class="row g-4 justify-content-center"
          >
            <div
              v-for="horse in horses"
              :key="horse.id"
              class="col-12 col-sm-6 col-lg-4"
            >
              <router-link
                :to="`/lovaink/${horse.id}`"
                class="text-decoration-none"
              >
                <div
                  class="card horse-card h-100 border-0 shadow-sm overflow-hidden pt-0"
                >
                  <div class="horse-img-wrapper">
                    <img
                      v-if="horse.main_img_url"
                      :src="horse.main_img_url"
                      :alt="horse.name"
                      class="card-img-top"
                      loading="lazy"
                    />
                    <div
                      v-else
                      class="horse-img-placeholder d-flex align-items-center justify-content-center"
                    >
                      <i
                        class="bi bi-heart text-muted"
                        style="font-size: 3rem"
                      ></i>
                    </div>
                  </div>
                  <div class="card-body text-center">
                    <h5 class="card-title mb-0">{{ horse.name }}</h5>
                  </div>
                </div>
              </router-link>
            </div>
          </div>

          <div class="text-center mt-5">
            <router-link to="/lovaink" class="btn btn-primary btn-lg px-5">
              Összes lovunk
              <i class="bi bi-arrow-right ms-2"></i>
            </router-link>
          </div>
        </div>
      </section>
    </div>

    <!-- Eredményeink Section -->
    <div class="results-section-bg">
      <div class="results-overlay"></div>
      <section class="section-padding section-alt results-preview">
        <div class="container">
          <div class="text-center mb-5">
            <h2 class="section-title">Eredményeink</h2>
            <p class="text-muted mt-3">
              Legutóbbi versenyeink és eredményeink.
            </p>
          </div>

          <div v-if="loading" class="text-center py-5">
            <div class="spinner-border" role="status">
              <span class="visually-hidden">Betöltés...</span>
            </div>
          </div>

          <div
            v-else-if="competitions.length > 0"
            class="row g-4 justify-content-center"
          >
            <div
              v-for="comp in competitions"
              :key="comp.id"
              class="col-12 col-sm-6 col-lg-4"
            >
              <div
                class="card competition-card h-100 border-0 shadow-sm overflow-hidden pt-0"
              >
                <div class="comp-img-wrapper">
                  <img
                    v-if="comp.image_url"
                    :src="comp.image_url"
                    :alt="comp.name"
                    class="card-img-top"
                    loading="lazy"
                  />
                  <div
                    v-else
                    class="comp-img-placeholder d-flex align-items-center justify-content-center"
                  >
                    <i
                      class="bi bi-trophy text-muted"
                      style="font-size: 3rem"
                    ></i>
                  </div>
                </div>
                <div class="card-body">
                  <h6 class="card-title mb-2">{{ comp.name }}</h6>
                  <small class="text-muted">
                    <i class="bi bi-calendar3 me-1"></i>
                    {{ formatDate(comp.start_date) }}
                  </small>
                </div>
              </div>
            </div>
          </div>

          <div class="text-center mt-5">
            <router-link to="/eredmenyeink" class="btn btn-primary btn-lg px-5">
              Összes eredmény
              <i class="bi bi-arrow-right ms-2"></i>
            </router-link>
          </div>
        </div>
      </section>
    </div>

    <!-- Kapcsolat Section -->
    <section class="section-padding">
      <div class="container">
        <div class="text-center" style="max-width: 600px; margin: 0 auto">
          <h2 class="section-title mb-4">Keress meg minket</h2>
          <p class="text-muted mb-5">
            Kérdésed van, vagy szeretnél többet megtudni szolgáltatásainkról?
            Vedd fel velünk a kapcsolatot!
          </p>
          <router-link to="/kapcsolat" class="btn btn-primary btn-lg px-5">
            Kapcsolatfelvétel
            <i class="bi bi-envelope ms-2"></i>
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.hero-container {
  margin-top: 57.8px;
}

.webshop-section-bg {
  position: relative;
  padding-top: 3rem;
  padding-bottom: 3rem;
  min-width: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
}
.results-section-bg {
  position: relative;
  background: url("@/assets/img/vagany.jpg") no-repeat center center fixed;
  padding-top: 3rem;
  padding-bottom: 3rem;
  min-width: 100%;
  background-size: cover;
}

.webshop-preview,
.results-preview {
  position: relative;
  z-index: 1;
  border-radius: 20px;
}
/* Hero */
.hero-section {
  position: relative;
  min-height: 100vh;
  min-width: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
}
.webshop-overlay {
  position: absolute;
  inset: 0;
  z-index: 0;
  background: rgba(0, 0, 0, 0.6);
}
.hero-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
}
.results-overlay {
  position: absolute;
  inset: 0;
  z-index: 0;
  background: rgba(0, 0, 0, 0.6);
}
.hero-content {
  z-index: 1;
  padding: 2rem;
}

.hero-title {
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 800;
  color: #fff;
  letter-spacing: -0.02em;
}

.hero-subtitle {
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 300;
}

.hero-chevron {
  animation: bounce 2s infinite;
  color: rgba(255, 255, 255, 0.6);
  font-size: 1.5rem;
}

@keyframes bounce {
  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

/* Sections */
.section-padding {
  padding: 5rem 0;
}

.section-alt {
  background-color: var(--bg-light);
}

.section-title {
  font-size: 2.25rem;
  font-weight: 700;
  color: var(--text);
}

/* About image */
.about-img {
  width: 100%;
  height: auto;
  object-fit: cover;
  max-height: 450px;
}

/* Horse cards */
.horse-card {
  transition:
    transform 0.2s,
    box-shadow 0.2s;
  background-color: var(--bg-light);
}

.horse-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15) !important;
}

.horse-img-wrapper {
  height: 250px;
  overflow: hidden;
}

.horse-img-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.horse-img-placeholder {
  height: 100%;
  background-color: var(--bg);
}

.horse-card .card-title {
  color: var(--text);
}

/* Competition cards */
.competition-card {
  background-color: var(--bg);
}

.comp-img-wrapper {
  height: 200px;
  overflow: hidden;
}

.comp-img-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.comp-img-placeholder {
  height: 100%;
  background-color: var(--bg-light);
}

.competition-card .card-title {
  color: var(--text);
}

/* Responsive */
@media (max-width: 768px) {
  .section-padding {
    padding: 4rem 0;
  }

  .hero-title {
    font-size: 1.75rem;
  }
}
</style>
