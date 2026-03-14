<script setup>
import { usePageHead } from '~/composables/usePageHead'

usePageHead('Sikertelen fizetés')
</script>

<template>
  <div>
    <main>
      <section class="p-3 p-md-5" style="padding-top: 100px !important;">
        <div class="row justify-content-center">
          <div class="col-12 col-md-8 col-lg-6">

            <div class="card shadow-sm pt-0">
              <div class="card-body text-center py-5">
                <i class="bi bi-x-circle-fill text-danger" style="font-size: 4rem;"></i>
                <h3 class="mt-3">Sikertelen fizetés</h3>
                <p class="text-muted">
                  A fizetés nem sikerült vagy megszakadt. A rendelésed nem lett véglegesítve,
                  és bankkártyád nem lett megterhelve.
                </p>

                <div class="d-flex flex-column flex-sm-row gap-2 justify-content-center mt-4">
                  <NuxtLink to="/penztar" class="btn btn-primary">
                    <i class="bi bi-arrow-clockwise me-1"></i>
                    Újrapróbálás
                  </NuxtLink>
                  <NuxtLink to="/webshop" class="btn btn-outline-secondary">
                    <i class="bi bi-shop me-1"></i>
                    Vissza a webshopba
                  </NuxtLink>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </main>
  </div>
</template>
