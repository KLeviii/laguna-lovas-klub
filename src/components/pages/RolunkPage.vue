<script setup>
import { ref, onMounted } from "vue";
import { fetchLatestCompetitions } from "@/services/competitionService.js";
import { fetchHorsesForSale } from "@/services/horseService.js";
import { formatDate } from "@/utils/formatting.js";

const szolgaltatasok = [
  {
    cim: "Lovak belovaglása és versenyeztetése",
    leiras:
      "Tapasztalt szakembereink professzionális belovaglást és versenyeztetést biztosítanak minden ló számára.",
  },
  {
    cim: "Bértartás",
    leiras:
      "Modern istállóinkban kiváló körülmények között tarthatja lovát, teljes ellátással és szakszerű gondozással.",
  },
  {
    cim: "Lovasok edzése és versenyeztetése",
    leiras:
      "Képzett edzőink segítségével fejlesztheted lovaglástudásod és részt vehetsz versenyeken.",
  },
  {
    cim: "Hofmag terápia",
    leiras:
      "Korszerű mágnesterápiás kezelések állnak rendelkezésre lovak regenerációjára és egészségmegőrzésére.",
  },
];

const versenyek = ref([]);
const eladoLovak = ref([]);
const versenyekLoading = ref(false);
const lovakLoading = ref(false);

onMounted(async () => {
  versenyekLoading.value = true;
  lovakLoading.value = true;

  const [versenyResult, lovakResult] = await Promise.allSettled([
    fetchLatestCompetitions(5),
    fetchHorsesForSale(2),
  ]);

  if (versenyResult.status === "fulfilled") {
    versenyek.value = versenyResult.value;
  } else {
    console.error("Error loading competitions:", versenyResult.reason);
  }
  versenyekLoading.value = false;

  if (lovakResult.status === "fulfilled") {
    eladoLovak.value = lovakResult.value;
  } else {
    console.error("Error loading horses for sale:", lovakResult.reason);
  }
  lovakLoading.value = false;
});
</script>

<template>
  <div>
    <main>
      <div class="image-container">
        <div class="overlay"></div>
        <div class="text">Rólunk</div>
      </div>

      <section class="p-3 p-md-4 px-md-5">
        <div class="contanier">
          <div class="row">
            <div class="col-12 col-lg-8">
              <div class="rolunk">
                <h3 class="pb-4 mb-4 fst-italic border-bottom">Rólunk</h3>
                <p>
                  A Laguna Lovasklub Héregen a minőségi lótartás, a szakmai
                  fejlődés és a természetközeli életforma találkozik. Célunk,
                  hogy a lovak és lovasok egyaránt a legjobb körülmények között
                  bontakozhassanak ki – legyen szó belovaglásról,
                  versenyeztetésről vagy tenyésztésről.
                </p>
                <p>
                  Klubunkban tapasztalt edzők és felkészült szakemberek
                  dolgoznak azon, hogy minden ló és lovas a saját szintjén
                  fejlődjön, miközben a teljesítmény és a harmónia egyensúlyban
                  marad. A lovak regenerációját és egészségét korszerű terápiás
                  eszközökkel támogatjuk, mint a Hofmag, az Equiterra és a Bemer
                  rendszerek, melyek hozzájárulnak a hatékony felkészüléshez és
                  a hosszú távú jóléthez.
                </p>
                <p>
                  A Laguna Lovasklub versenyorientált szemlélete mellett megőrzi
                  barátságos, családias hangulatát – nálunk a szakmai igényesség
                  és a közösség ereje kéz a kézben jár. Gyere el Héregre, és
                  tapasztald meg, milyen, amikor a fejlődés, az elhivatottság és
                  a lovak iránti szenvedély egy helyen találkozik!
                </p>
              </div>

              <div class="szolgaltatasaink pt-3">
                <h3 class="pb-4 mb-4 fst-italic border-bottom">
                  Szolgáltatásaink
                </h3>
                <div class="contanier">
                  <div class="row">
                    <div
                      v-for="(szolg, index) in szolgaltatasok"
                      :key="index"
                      class="cards col-12 col-md-6 border rounded overflow-hidden flex-md-row p-3 shadow-sm position-relative mb-3"
                    >
                      <h4 class="pb-4 mb-4">{{ szolg.cim }}</h4>
                      <p>{{ szolg.leiras }}</p>
                    </div>
                  </div>
                </div>

                <div v-if="lovakLoading" class="eladoLovak mt-4">
                  <h3 class="pb-4 mb-4 fst-italic border-bottom">
                    Eladó lovaink
                  </h3>
                  <div class="text-center py-3">
                    <div class="spinner-border spinner-border-sm" role="status">
                      <span class="visually-hidden">Betöltés...</span>
                    </div>
                  </div>
                </div>

                <div v-else-if="eladoLovak.length > 0" class="eladoLovak mt-4">
                  <h3 class="pb-4 mb-4 fst-italic border-bottom">
                    Eladó lovaink
                  </h3>
                  <div class="contanier">
                    <div class="row">
                      <div
                        v-for="lo in eladoLovak"
                        :key="lo.id"
                        class="col-12 col-md-6"
                      >
                        <div
                          class="row g-0 border rounded overflow-hidden flex-md-row mb-4 shadow-sm h-md-250 position-relative"
                        >
                          <div
                            class="col p-4 d-flex flex-column position-static"
                          >
                            <h3 class="mb-0 pt-3">{{ lo.name }}</h3>
                            <p class="card-text mb-auto pt-3">
                              {{ lo.description }}
                            </p>
                            <router-link
                              :to="'/lovaink/' + lo.id"
                              class="text-end mt-3 know-more"
                            >
                              Tudj meg többet
                            </router-link>
                          </div>
                          <div class="col-auto d-none d-lg-block">
                            <img v-if="lo.main_img_url" :src="lo.main_img_url" :alt="lo.name" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-12 col-lg-4 mt-4 mt-lg-0">
              <div class="verseny-sidebar">
                <div class="verseny-intro mb-4 p-3 rounded">
                  <h4 class="fst-italic mb-2">Versenyeink</h4>
                  <p class="mb-0 text-muted">
                    Klubunk aktívan részt vesz különböző nemzeti és nemzetközi
                    díjugratóversenyeken. Nézd meg legújabb eredményeinket!
                  </p>
                </div>
                <h5 class="fst-italic mb-3">Legutóbbi Versenyeink</h5>
                <div v-if="versenyekLoading" class="text-center py-3">
                  <div class="spinner-border spinner-border-sm" role="status">
                    <span class="visually-hidden">Betöltés...</span>
                  </div>
                </div>
                <p v-else-if="versenyek.length === 0" class="text-muted">
                  Jelenleg nincsenek versenyek.
                </p>
                <ul v-else class="list-unstyled mb-0">
                  <li v-for="verseny in versenyek" :key="verseny.id">
                    <router-link
                      class="verseny-link d-flex flex-row gap-3 align-items-center py-3 text-decoration-none border-bottom"
                      to="/eredmenyeink"
                    >
                      <img
                        v-if="verseny.image_url"
                        :src="verseny.image_url"
                        class="verseny-img rounded"
                        :alt="verseny.name"
                      />
                      <div
                        v-else
                        class="verseny-img rounded bg-secondary d-flex align-items-center justify-content-center"
                      >
                        <i class="bi bi-trophy text-white"></i>
                      </div>
                      <div>
                        <h6 class="mb-1">{{ verseny.name }}</h6>
                        <small class="text-muted">{{ formatDate(verseny.start_date) }}</small>
                      </div>
                    </router-link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
.know-more {
  color: var(--text);
}

.verseny-intro {
  background-color: var(--bg-light);
  border: 1px solid var(--border);
  color: var(--text);
}

.verseny-link {
  color: var(--text);
  border-color: var(--border) !important;
}

.verseny-link:hover {
  color: var(--primary);
}

.verseny-img {
  width: 80px;
  height: 60px;
  object-fit: cover;
  flex-shrink: 0;
}
</style>
