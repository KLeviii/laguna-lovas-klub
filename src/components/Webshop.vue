<script setup>
function data() {
  return {
    termekek: [
      {
        nev: "Equine America",
        kep: "img/Equine-America2x.avif",
        kategoria: "Tápok",
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
        <div class="text">Webshop</div>
      </div>
      <section class="p-4">
        <h2 class="text-center pt-4 pb-4">Tápok</h2>
        <div class="d-flex flex-wrap justify-content-center gap-4">
          <div v-for="termek in data().termekek" :key="termek.nev" class="text-center">
            <a href="#">
              <img
                :src="termek.kep"
                :alt="termek.nev"
                style="max-width: 300px"
              />
              <h4 class="mt-3">{{ termek.nev }}</h4>
            </a>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped></style>
