<script setup>
import { useAuth } from '@/composables/useAuth'

const { isAuthenticated } = useAuth()

function data() {
  return {
    termekek: [
      {
        id: "termek1",
        nev: "Equine America",
        kep: "../src/assets/img/Equine-America2x.avif",
        kategoria: "Tápok",
        desc: "Ez egy kiváló táp!",
        price: "10000",
      },
      {
        id: "termek2",
        nev: "Equine America",
        kep: "../src/assets/img/Equine-America2x.avif",
        kategoria: "Tápok",
        desc: "Ez egy kiváló táp!",
        price: "10000",
      },
      {
        id: "termek3",
        nev: "Equine America",
        kep: "../src/assets/img/Equine-America2x.avif",
        kategoria: "Tápok",
        desc: "Ez egy kiváló táp!",
        price: "10000",
      },
      {
        id: "termek4",
        nev: "Equine America",
        kep: "../src/assets/img/Equine-America2x.avif",
        kategoria: "Tápok",
        desc: "Ez egy kiváló táp!",
        price: "10000",
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
        <div class="d-flex justify-content-between align-items-center pt-4 pb-4">
          <h2 class="mb-0">Tápok</h2>
          
          <!-- Admin gomb - csak bejelentkezve látható -->
          <router-link
            v-if="isAuthenticated"
            to="/admin/products"
            class="btn btn-primary"
          >
            <i class="bi bi-pencil-square me-2"></i>
            Termékek kezelése
          </router-link>
        </div>
        
        <div class="d-flex flex-wrap justify-content-center gap-4 products">
          <div
            v-for="termek in data().termekek"
            :key="termek.id"
            class="card"
            style="width: 18rem"
          >
            <a href="/product">
              <img
                :src="termek.kep"
                class="card-img-top p-3"
                :alt="termek.nev"
              />
              <div class="card-body">
                <h5 class="card-title">{{ termek.nev }}</h5>
                <p class="card-text">
                  {{ termek.desc }}
                </p>
                <h4>{{ termek.price }} Ft</h4>
              </div>
            </a>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
a {
  color: #19253c;
  text-decoration: none;
  transition: all 0.25s ease;
  border: 1px solid #19253c;
  border-radius: 10px;
}

a img {
  border-bottom: 1px solid #19253c;
}

a:hover {
  scale: 1.05;
}

a:hover h5 {
  text-decoration: underline;
}

.card {
  border: none;
}

.btn-primary {
  background-color: #4da6ff;
  border-color: #4da6ff;
}

.btn-primary:hover {
  background-color: #3399ff;
  border-color: #3399ff;
}
</style>
