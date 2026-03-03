<script setup>
import { ref, computed, onMounted, nextTick, onUnmounted } from "vue";
import { fetchLatestCompetitions } from "@/services/competitionService.js";
import { fetchAllHorses } from "@/services/horseService.js";
import { fetchAllProducts } from "@/services/productService.js";
import { formatDate } from "@/utils/formatting.js";
import { useHead } from "@/composables/useHead";
import { useReveal } from "@/composables/useReveal";
import ProductCard from "@/components/webshop/ProductCard.vue";
import heroImg from "@/assets/img/vagany.jpg";
import champiImg from "@/assets/img/champi.jpg";
import champi2Img from "@/assets/img/champi2.jpg";
import cooperImg from "@/assets/img/cooper.jpg";
import kaposvarImg from "@/assets/img/kaposvar.jpg";
import megyeiImg from "@/assets/img/megyei.jpg";
import aboutImg from "@/assets/img/cordocan.jpg";
import webshopImg from "@/assets/img/babolna.jpg";

const heroImages = [heroImg, champiImg, champi2Img, cooperImg, kaposvarImg, megyeiImg];
const currentIndex = ref(0);
const prevIndex = ref(-1);
let slideInterval = null;

useHead(
  "Kezdőlap",
  "Laguna Lovasklub Héreg — lovas hagyomány, modern szemlélettel.",
);
const { observe } = useReveal();

const yearsOfExperience = computed(() => new Date().getFullYear() - 2019);

const products = ref([]);
const horses = ref([]);
const competitions = ref([]);
const loading = ref(true);

onMounted(async () => {
  slideInterval = setInterval(() => {
    prevIndex.value = currentIndex.value;
    currentIndex.value = (currentIndex.value + 1) % heroImages.length;
  }, 4000);

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

  await nextTick();
  observe();
});

onUnmounted(() => clearInterval(slideInterval));

function scrollToRolunk() {
  const el = document.getElementById("rolunk");
  if (el) el.scrollIntoView({ behavior: "smooth" });
}
</script>

<template>
  <div class="hero-container">

    <!-- Hero Section -->
    <section class="hero-section d-flex align-items-center justify-content-center text-center">
      <div class="hero-slides" aria-hidden="true">
        <img
          v-for="(img, i) in heroImages"
          :key="i"
          :src="img"
          :class="['hero-slide', { 'slide-active': i === currentIndex, 'slide-prev': i === prevIndex }]"
          alt=""
        />
      </div>
      <div class="hero-overlay"></div>
      <div class="hero-content position-relative">
        <h1 class="hero-title mb-4">
          Lovas <em class="serif-accent text-primary">hagyomány</em>,<br />
          <strong>modern</strong> szemlélettel
        </h1>
        <p class="hero-subtitle mb-5">
          Fedezze fel a lovaglás művészetét exkluzív környezetben, ahol a<br class="d-none d-md-inline" />
          tradíció és az innováció találkozik a Laguna Lovasklub szívében.
        </p>
        <div class="d-flex flex-wrap justify-content-center gap-3">
          <button
            class="btn btn-primary btn-lg rounded-pill px-5"
            @click="scrollToRolunk"
          >
            Fedezd fel
          </button>
          <button
            class="btn btn-outline-light btn-lg rounded-pill px-5"
            @click="$router.push('/webshop')"
          >
            Vásárolj tőlünk
          </button>
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
          <!-- Image with decorative frame -->
          <div class="col-12 col-lg-6 reveal">
            <div class="about-img-wrapper">
              <div class="about-corner-tl"></div>
              <img
                :src="aboutImg"
                alt="Laguna Lovasklub"
                class="about-img rounded-3 shadow-lg"
                loading="lazy"
              />
              <div class="about-badge d-none d-md-flex">
                <span class="about-badge-number">{{ yearsOfExperience }}+</span>
                <span class="about-badge-text">Év tapasztalat</span>
              </div>
            </div>
          </div>

          <!-- Text -->
          <div class="col-12 col-lg-6 reveal reveal-delay-2">
            <div class="about-tag mb-4">
              <i class="bi bi-stars me-1"></i> Prémium Színvonal
            </div>
            <h2 class="about-heading mb-4">
              A minőség az <em class="serif-accent text-secondary">alapvetésünk</em>
            </h2>
            <p class="lead mb-3">
              A Laguna Lovasklub nem csupán egy istálló; ez egy közösség és egy
              életérzés.
            </p>
            <p class="text-muted mb-5">
              Célunk, hogy a lovak és lovasok egyaránt a legjobb körülmények
              között bontakozhassanak ki — legyen szó belovaglásról,
              versenyeztetésről vagy tenyésztésről. Klubunkban tapasztalt edzők
              és felkészült szakemberek gondoskodnak mindenkiről.
            </p>
            <div class="row g-4">
              <div class="col-6">
                <div class="d-flex gap-3 align-items-start">
                  <i class="bi bi-award text-secondary fs-3 flex-shrink-0"></i>
                  <div>
                    <h6 class="fw-bold mb-1">Elit Képzés</h6>
                    <p class="small text-muted mb-0">Tapasztalt edzők és módszertanok.</p>
                  </div>
                </div>
              </div>
              <div class="col-6">
                <div class="d-flex gap-3 align-items-start">
                  <i class="bi bi-house text-secondary fs-3 flex-shrink-0"></i>
                  <div>
                    <h6 class="fw-bold mb-1">Modern Boxok</h6>
                    <p class="small text-muted mb-0">Tágas, világos és higiénikus terek.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Webshop Section with parallax background -->
    <div
      class="webshop-parallax"
      :style="{ backgroundImage: `url(${webshopImg})` }"
    >
      <div class="webshop-overlay"></div>
      <section class="section-padding webshop-inner">
        <div class="container">
          <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-5 gap-3 reveal">
            <div>
              <h2 class="section-title mb-2">Webshop kínálatunk</h2>
              <p class="text-muted mb-0">
                Válogatott prémium kiegészítők a legmagasabb minőségben.
              </p>
            </div>
            <router-link
              to="/webshop"
              class="d-inline-flex align-items-center gap-2 fw-bold text-primary text-decoration-none webshop-link"
            >
              Minden termék megtekintése
              <i class="bi bi-arrow-right"></i>
            </router-link>
          </div>

          <div v-if="loading" class="text-center py-5">
            <div class="spinner-border" role="status">
              <span class="visually-hidden">Betöltés...</span>
            </div>
          </div>

          <div v-else-if="products.length > 0" class="row g-4">
            <div
              v-for="(product, i) in products"
              :key="product.id"
              class="col-12 col-sm-6 col-lg-3 reveal"
              :style="{ transitionDelay: `${i * 0.04}s` }"
            >
              <ProductCard :product="product" />
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- Büszkeségeink Section -->
    <section class="section-padding">
      <div class="container-xl">
        <h2 class="section-title text-center mb-5 reveal">Büszkeségeink</h2>

        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Betöltés...</span>
          </div>
        </div>

        <div v-else-if="horses.length > 0" class="row g-3">
          <!-- First horse: big card -->
          <div class="col-12 col-md-7 reveal">
            <router-link :to="`/lovaink/${horses[0].id}`" class="horse-card-link">
              <div class="horse-card horse-card-big">
                <img
                  v-if="horses[0].main_img_url"
                  :src="horses[0].main_img_url"
                  :alt="horses[0].name"
                  class="horse-card-img"
                />
                <div v-else class="horse-card-placeholder">
                  <i class="bi bi-heart text-muted" style="font-size: 3rem"></i>
                </div>
                <div class="horse-card-overlay">
                  <h4 class="horse-card-name">{{ horses[0].name }}</h4>
                </div>
              </div>
            </router-link>
          </div>

          <!-- Remaining horses: stacked small cards -->
          <div class="col-12 col-md-5 d-flex flex-column gap-3">
            <router-link
              v-for="(horse, i) in horses.slice(1)"
              :key="horse.id"
              :to="`/lovaink/${horse.id}`"
              class="horse-card-link reveal"
              :style="{ transitionDelay: `${(i + 1) * 0.06}s` }"
            >
              <div class="horse-card horse-card-small">
                <img
                  v-if="horse.main_img_url"
                  :src="horse.main_img_url"
                  :alt="horse.name"
                  class="horse-card-img"
                />
                <div v-else class="horse-card-placeholder">
                  <i class="bi bi-heart text-muted" style="font-size: 2rem"></i>
                </div>
                <div class="horse-card-overlay">
                  <h5 class="horse-card-name">{{ horse.name }}</h5>
                </div>
              </div>
            </router-link>
          </div>
        </div>

        <div class="text-center mt-5 reveal">
          <router-link to="/lovaink" class="btn btn-primary btn-lg px-5">
            Összes lovunk
            <i class="bi bi-arrow-right ms-2"></i>
          </router-link>
        </div>
      </div>
    </section>

    <!-- Eredményeink Section -->
    <section class="results-section section-padding">
      <div class="container">
        <div class="text-center mb-5 reveal">
          <h2 class="section-title">Legutóbbi eredményeink</h2>
          <p class="text-muted mt-2">Lovasaink sikere a mi büszkeségünk is egyben.</p>
        </div>

        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Betöltés...</span>
          </div>
        </div>

        <div v-else-if="competitions.length > 0" class="d-flex flex-column gap-3 mx-auto results-list">
          <div
            v-for="(comp, i) in competitions"
            :key="comp.id"
            class="result-item reveal"
            :style="{ transitionDelay: `${i * 0.04}s` }"
          >
            <div class="d-flex align-items-center gap-4">
              <div class="result-badge" :class="i === 0 ? 'result-badge-gold' : ''">
                {{ i + 1 }}.
              </div>
              <div>
                <h5 class="mb-0 fw-bold">{{ comp.name }}</h5>
                <small class="text-muted">
                  <i class="bi bi-calendar3 me-1"></i>{{ formatDate(comp.start_date) }}
                </small>
              </div>
            </div>
          </div>
        </div>

        <div class="text-center mt-5 reveal">
          <router-link to="/eredmenyeink" class="btn btn-primary btn-lg px-5">
            Összes eredmény
            <i class="bi bi-arrow-right ms-2"></i>
          </router-link>
        </div>
      </div>
    </section>

    <!-- Személyes megtekintés Section -->
    <section class="section-padding">
      <div class="container">
        <div class="cta-box text-center reveal">
          <div class="cta-gradient"></div>
          <div class="cta-content">
            <h2 class="cta-title mb-4">Keress meg minket</h2>
            <p class="cta-text mb-5">
              Kérdésed van, vagy szeretnél többet megtudni szolgáltatásainkról?
              Vedd fel velünk a kapcsolatot!
            </p>
            <router-link to="/kapcsolat" class="btn btn-primary btn-lg px-5">
              Kapcsolatfelvétel
              <i class="bi bi-envelope ms-2"></i>
            </router-link>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>

<style scoped>
/* ---- Base ---- */
.hero-container {
  margin-top: 0;
}

.serif-accent {
  font-family: "Times New Roman", serif;
  font-style: italic;
}

.section-padding {
  padding: 5rem 0;
}

.section-title {
  font-size: 2.25rem;
  font-weight: 700;
}

/* ---- Hero ---- */
.hero-section {
  position: relative;
  min-height: 100vh;
  min-width: 100%;
  overflow: hidden;
  padding-top: 58px;
}

.hero-slides {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.hero-slide {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: translateX(100%);
  transition: transform 0.8s ease;
}

.hero-slide.slide-active {
  transform: translateX(0);
  z-index: 1;
}

.hero-slide.slide-prev {
  transform: translateX(-100%);
}

.hero-overlay {
  position: absolute;
  inset: 0;
  z-index: 2;
  background: linear-gradient(
    to bottom,
    rgba(1, 4, 14, 0.45) 0%,
    rgba(1, 4, 14, 0.45) 45%,
    rgba(1, 4, 14, 0.92) 100%
  );
  text-shadow: 0px 4px 4px #00000030, 0px 12px 12px 
}

.hero-content {
  z-index: 3;
  padding: 2rem;
}

.hero-title {
  font-size: clamp(2.25rem, 5.5vw, 5.5rem);
  font-weight: 300;
  color: #fff;
  letter-spacing: -0.02em;
  line-height: 1.1;
}

.hero-title strong {
  font-weight: 800;
}

.hero-subtitle {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.75);
  font-weight: 300;
  max-width: 580px;
  margin: 0 auto;
  line-height: 1.65;
}

.hero-chevron {
  animation: bounce 2s infinite;
  color: rgba(255, 255, 255, 0.5);
  font-size: 1.5rem;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-10px); }
  60% { transform: translateY(-5px); }
}

/* ---- About ---- */
.about-img-wrapper {
  position: relative;
  display: inline-block;
  width: 100%;
  padding-bottom: 1.5rem;
  padding-right: 1.5rem;
}

.about-corner-tl {
  position: absolute;
  top: -1.25rem;
  left: -1.25rem;
  width: 5rem;
  height: 5rem;
  border-top: 2px solid var(--secondary);
  border-left: 2px solid var(--secondary);
  opacity: 0.45;
  z-index: 1;
  pointer-events: none;
}

.about-img {
  width: 100%;
  height: auto;
  object-fit: cover;
  max-height: 460px;
  position: relative;
  z-index: 2;
}

.about-badge {
  position: absolute;
  bottom: 0;
  right: 0;
  z-index: 3;
  background-color: var(--secondary);
  padding: 1.25rem 1.75rem;
  border-radius: 0.75rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.2rem;
}

.about-badge-number {
  font-size: 2.25rem;
  font-weight: 900;
  color: var(--bg-dark);
  line-height: 1;
}

.about-badge-text {
  font-size: 0.62rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: rgba(1, 4, 14, 0.7);
  white-space: nowrap;
}

.about-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.35rem 1rem;
  border-radius: 999px;
  border: 1px solid var(--secondary);
  color: var(--secondary);
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  opacity: 0.9;
}

.about-heading {
  font-size: clamp(1.75rem, 3vw, 3rem);
  font-weight: 700;
}

/* ---- Webshop parallax ---- */
.webshop-parallax {
  position: relative;
  min-width: 100%;
  padding: 3rem 0;
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

.webshop-inner {
  position: relative;
  z-index: 1;
  background-color: var(--bg-light);
  border-radius: 1.25rem;
  max-width: 1300px;
  margin: 0 auto;
  padding: 3rem 2rem;
}

.webshop-link:hover {
  text-decoration: underline !important;
}

/* ---- CTA / Személyes megtekintés box ---- */
.cta-box {
  position: relative;
  overflow: hidden;
  border-radius: 1.5rem;
  background-color: var(--bg);
  padding: 4rem 2.5rem;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
}

.cta-gradient {
  position: absolute;
  inset: 0;
  opacity: 0.15;
  pointer-events: none;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
}

.cta-content {
  position: relative;
  z-index: 1;
  max-width: 600px;
  margin: 0 auto;
}

.cta-title {
  font-size: 2rem;
  font-weight: 700;
  color: #fff;
}

.cta-text {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.65);
}

.cta-ghost-btn {
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
  backdrop-filter: blur(4px);
}

.cta-ghost-btn:hover {
  background: rgba(255, 255, 255, 0.16);
  color: #fff;
}

/* ---- Horses ---- */
.horse-card-link {
  display: block;
  text-decoration: none;
}

.horse-card {
  position: relative;
  border-radius: 1rem;
  overflow: hidden;
  cursor: pointer;
}

.horse-card-big {
  height: 540px;
}

.horse-card-small {
  height: 255px;
}

.horse-card-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.7s ease;
}

.horse-card-link:hover .horse-card-img {
  transform: scale(1.08);
}

.horse-card-placeholder {
  position: absolute;
  inset: 0;
  background: var(--bg-light);
  display: flex;
  align-items: center;
  justify-content: center;
}

.horse-card-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.88) 0%,
    rgba(0, 0, 0, 0.1) 45%,
    transparent 100%
  );
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 1.5rem 2rem;
  opacity: 0;
  transition: opacity 0.4s ease;
}

.horse-card-link:hover .horse-card-overlay {
  opacity: 1;
}

.horse-card-name {
  color: #fff;
  font-weight: 700;
  margin-bottom: 0;
}

/* ---- Results ---- */
.results-section {
  background-color: var(--bg-dark);
  min-width: 100%;
}

.results-list {
  max-width: 780px;
}

.result-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  background: var(--bg-light);
  border: 1px solid var(--border);
  border-radius: 0.75rem;
  transition: background 0.2s;
}

.result-item:hover {
  background: var(--highlight);
}

.result-badge {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background: var(--border);
  color: var(--text);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  font-size: 0.9rem;
  flex-shrink: 0;
}

.result-badge-gold {
  background: var(--secondary);
  color: var(--bg-dark);
}

/* ---- Responsive ---- */
@media (max-width: 768px) {
  .section-padding {
    padding: 4rem 0;
  }

  .hero-title {
    font-size: 2rem;
  }

  .horse-card-big {
    height: 340px;
  }

  .horse-card-small {
    height: 200px;
  }
}
</style>
