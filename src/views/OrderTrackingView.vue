<script setup>
import OrderLookup from '@/components/orders/OrderLookup.vue'
import { useHead } from '@/composables/useHead'

useHead('Rendelés követése')
</script>

<template>
  <div>
    <main>
      <section class="p-3 p-md-5" style="padding-top: 100px !important;">
        <div class="row justify-content-center">
          <div class="col-12 col-md-8 col-lg-6">
            <OrderLookup />
          </div>
        </div>
      </section>
    </main>
  </div>
</template>
