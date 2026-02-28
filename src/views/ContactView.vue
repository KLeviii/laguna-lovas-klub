<script setup>
import ContactForm from "@/components/contact/ContactForm.vue";
import { useHead } from "@/composables/useHead";

useHead("Kapcsolat", "Vedd fel velünk a kapcsolatot — Laguna Lovasklub Héreg.");
</script>

<template>
  <div>
    <main>
      <div class="image-container">
        <div class="overlay"></div>
        <div class="text">Kapcsolat</div>
      </div>

      <section class="p-3 p-md-4 px-md-5">
        <div class="container">
          <div class="row justify-content-center">
            <div class="col-lg-8">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>
