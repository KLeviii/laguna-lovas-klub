<script setup>
const versenyek = [
  {
    kep: "../src/assets/img/kaposvar.jpg",
    nev: "Kaposvár-Fedeles Nemzeti + felkészítő",
    datum: "2025, November 7-9.",
  },
  {
    kep: "../src/assets/img/kecskemet.jpg",
    nev: "Nemzeti + felkészítő Pataki Ménes fedeles",
    datum: "2025, Október 24-26.",
  },
  {
    kep: "../src/assets/img/megyei.jpg",
    nev: "Nemzeti + Fejér és Veszprém vármegyei döntő",
    datum: "2025, Augusztus 15-17.",
  },
  {
    kep: "../src/assets/img/kecskemett.jpg",
    nev: "Nemzeti + Felkészítő verseny PATAKI MÉNES",
    datum: "2025, Július 22-24.",
  },
  {
    kep: "../src/assets/img/babolna.jpg",
    nev: "Hétköznapi Nemzeti Díjugrató Verseny Bábolna",
    datum: "January 13, 2024",
  },
]

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
]

const eladoLovak = [
  {
    nev: "Vagány",
    leiras: "Tehetséges díjugró, kiváló versenyeredményekkel.",
    kep: "img/vagany.jpg",
  },
  {
    nev: "Cooper",
    leiras: "Megbízható, gyakorlott versenyló.",
    kep: "img/cooper.jpg",
  },
]
</script>

<template>
  <div>
    <main>
      <div class="image-container">
        <div class="overlay"></div>
        <div class="text">Rólunk</div>
      </div>

      <section class="p-4 px-5">
        <div class="contanier">
          <div class="row">
            <div class="col-8">
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
                      class="cards col-6 border rounded overflow-hidden flex-md-row p-3 shadow-sm position-relative mb-3"
                    >
                      <h4 class="pb-4 mb-4">{{ szolg.cim }}</h4>
                      <p>{{ szolg.leiras }}</p>
                    </div>
                  </div>
                </div>

                <div class="eladoLovak mt-4">
                  <h3 class="pb-4 mb-4 fst-italic border-bottom">
                    Eladó lovaink
                  </h3>
                  <div class="contanier">
                    <div class="row">
                      <div
                        v-for="lo in eladoLovak"
                        :key="lo.nev"
                        class="col-6"
                      >
                        <div
                          class="row g-0 border rounded overflow-hidden flex-md-row mb-4 shadow-sm h-md-250 position-relative"
                        >
                          <div
                            class="col p-4 d-flex flex-column position-static"
                          >
                            <h3 class="mb-0 pt-3">{{ lo.nev }}</h3>
                            <p class="card-text mb-auto pt-3">
                              {{ lo.leiras }}
                            </p>
                            <router-link
                              to="/lovaink"
                              class="text-end mt-3 know-more"
                            >
                              Tudj meg többet
                            </router-link>
                          </div>
                          <div class="col-auto d-none d-lg-block">
                            <img :src="lo.kep" alt="" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-4">
              <div class="verseny-sidebar">
                <div class="verseny-intro mb-4 p-3 rounded">
                  <h4 class="fst-italic mb-2">Versenyeink</h4>
                  <p class="mb-0 text-muted">
                    Klubunk aktívan részt vesz különböző nemzeti és nemzetközi
                    díjugratóversenyeken. Nézd meg legújabb eredményeinket!
                  </p>
                </div>
                <h5 class="fst-italic mb-3">Legutóbbi Versenyeink</h5>
                <ul class="list-unstyled mb-0">
                  <li v-for="verseny in versenyek" :key="verseny.nev">
                    <router-link
                      class="verseny-link d-flex flex-row gap-3 align-items-center py-3 text-decoration-none border-bottom"
                      to="/eredmenyeink"
                    >
                      <img :src="verseny.kep" class="verseny-img rounded" alt="" />
                      <div>
                        <h6 class="mb-1">{{ verseny.nev }}</h6>
                        <small class="text-muted">{{ verseny.datum }}</small>
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
