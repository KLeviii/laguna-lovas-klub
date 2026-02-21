<script setup>
function email() {
  return "lagunalovasklub" + "@" + "gmail.com";
}
function mailto() {
  return "mailto:" + email();
}
function phone() {
  return "+36" + "20" + "981" + "3383";
}
function telLink() {
  return "tel:" + phone();
}
</script>

<template>
  <footer class="text-center text-lg-start">
    <section class="contanier">
      <div class="pt-2 text-center text-md-start px-5">
        <div class="row mt-3">
          <div
            class="d-flex align-items-center justify-content-center m-3 mx-auto"
            style="width: 150px; height: 150px"
          >
            <img src="@/assets/img/lagunaLovasKlub.jpg" />
          </div>
          <div class="col-md-3 col-lg-4 col-xl-3 mx-auto m-3">
            <h6 class="text-uppercase fw-bold">Laguna lovasklub</h6>
            <hr
              class="mb-4 mt-0 d-inline-block mx-auto"
              style="width: 60px; background-color: var(--primary); height: 2px"
            />
            <p>
              A Laguna Lovasklub Héregen a minőségi lótartás, a szakmai fejlődés
              és a természetközeli életforma találkozik.
            </p>
          </div>
          <div class="col-md-2 col-lg-2 col-xl-2 mx-auto m-3">
            <h6 class="text-uppercase fw-bold">Partnereink</h6>
            <hr
              class="mb-4 mt-0 d-inline-block mx-auto"
              style="width: 60px; background-color: var(--primary); height: 2px"
            />
            <p>
              <a href="https://www.hofmagtherapy.com/" target="_blank"
                >Hofmag</a
              >
            </p>
            <p>
              <a
                href="https://www.facebook.com/p/Equi-Terra-61553204902114/"
                target="_blank"
                >Equiterra</a
              >
            </p>
            <p>
              <a href="https://bemergroup.com/hu_HU/kezdolap" target="_blank"
                >Bemer</a
              >
            </p>
            <p>
              <a href="https://www.st-hippolyt.de/" target="_blank"
                >St. Hippolyt</a
              >
            </p>
            <p>
              <a
                href="https://www.equine-america.com/?gad_campaignid=20548104383"
                target="_blank"
                >Equine America</a
              >
            </p>
          </div>
          <div class="col-md-3 col-lg-2 col-xl-2 mx-auto m-3">
            <h6 class="text-uppercase fw-bold">Közösségi Média</h6>
            <hr
              class="mb-4 mt-0 d-inline-block mx-auto"
              style="width: 60px; background-color: var(--primary); height: 2px"
            />
            <div class="d-flex">
              <a
                href="https://www.facebook.com/lagunalovasklubkft?locale=hu_HU"
                target="_blank"
              >
                <h4><i class="bi bi-facebook m-2"></i></h4>
              </a>
              <a
                href="https://www.instagram.com/laguna_lovasklub_kft/"
                target="_blank"
              >
                <h4><i class="bi bi-instagram m-2"></i></h4>
              </a>
            </div>
          </div>
          <div class="col-md-3 col-lg-2 col-xl-2 mx-auto mb-md-0 m-3">
            <h6 class="text-uppercase fw-bold">Elérhetőségeink</h6>
            <hr
              class="mb-4 mt-0 d-inline-block mx-auto"
              style="width: 60px; background-color: var(--primary); height: 2px"
            />
            <p>
              <a :href="mailto"> lagunalovasklub@gmail.com </a>
            </p>
            <p>
              <a :href="telLink">+36 20 981 3383</a>
            </p>
            <p>
              <a
                href="https://www.google.com/maps/place/Laguna+lovasklub+H%C3%A9reg/@47.6480603,18.5212508,17z/data=!3m1!4b1!4m6!3m5!1s0x476a43bd70a547c3:0x4afb99b01aff5255!8m2!3d47.6480603!4d18.5238257!16s%2Fg%2F11vhgh8v6g?entry=ttu&g_ep=EgoyMDI2MDIwNC4wIKXMDSoKLDEwMDc5MjA2N0gBUAM%3D"
              >
                2832, Héreg, Laguna Lovasklub
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
    <div class="text-center p-3 copyright">
      2026 Copyright &copy; Laguna Lovasklub Kft.
    </div>
  </footer>
</template>

<style scoped>
footer {
  background-color: var(--bg);
  color: var(--text);
}

footer p,
footer h6 {
  color: var(--text);
}

footer div p {
  color: var(--text);
}

.copyright {
  background-color: var(--bg-dark);
}

a {
  color: var(--text-muted);
  text-decoration: underline;
}

a:hover {
  color: var(--text);
}

footer {
  position: relative;
  bottom: 0;
}
</style>
