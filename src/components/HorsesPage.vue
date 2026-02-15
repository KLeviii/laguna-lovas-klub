<script setup>
import { useAuth } from '@/composables/useAuth'

const { isAuthenticated } = useAuth()
</script>

<template>
  <div>
    <main>
      <div class="image-container">
        <div class="overlay"></div>
        <div class="text">Lovaink</div>
      </div>
      <section class="p-5">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h2 class="mb-0">Tenyésztési leszármazási fa</h2>
          
          <!-- Admin gomb - csak bejelentkezve látható -->
          <router-link
            v-if="isAuthenticated"
            to="/admin/horses"
            class="btn btn-primary"
          >
            <i class="bi bi-pencil-square me-2"></i>
            Lovak kezelése
          </router-link>
        </div>
        
        <div class="table-responsive">
          <table>
            <tbody>
              <tr>
                <td rowspan="4"><i class="bi bi-gender-male"></i> Név</td>
                <td rowspan="2"><i class="bi bi-gender-male"></i> Név</td>
                <td><i class="bi bi-gender-male"></i> Név</td>
              </tr>
              <tr>
                <td><i class="bi bi-gender-female"></i> Név</td>
              </tr>
              <tr>
                <td rowspan="2"><i class="bi bi-gender-female"></i> Név</td>
                <td><i class="bi bi-gender-male"></i> Név</td>
              </tr>
              <tr>
                <td><i class="bi bi-gender-female"></i> Név</td>
              </tr>
              <tr>
                <td rowspan="4"><i class="bi bi-gender-female"></i> Név</td>
                <td rowspan="2"><i class="bi bi-gender-male"></i> Név</td>
                <td><i class="bi bi-gender-male"></i> Név</td>
              </tr>
              <tr>
                <td><i class="bi bi-gender-female"></i> Név</td>
              </tr>
              <tr>
                <td rowspan="2"><i class="bi bi-gender-female"></i> Név</td>
                <td><i class="bi bi-gender-male"></i> Név</td>
              </tr>
              <tr>
                <td><i class="bi bi-gender-female"></i> Név</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
.btn-primary {
  background-color: #4da6ff;
  border-color: #4da6ff;
}

.btn-primary:hover {
  background-color: #3399ff;
  border-color: #3399ff;
}
</style>
