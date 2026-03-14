<script setup>
definePageMeta({ middleware: 'auth' })

import AdminLayout from '~/components/admin/AdminLayout.vue'
import AdminOrderList from '~/components/orders/AdminOrderList.vue'
</script>

<template>
  <AdminLayout>
    <div class="container">
      <AdminOrderList />
    </div>
  </AdminLayout>
</template>
