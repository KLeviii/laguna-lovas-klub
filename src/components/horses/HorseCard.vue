<script setup>
defineProps({
  horse: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <div class="card h-100">
    <div
      v-if="horse.main_img_url"
      class="card-img-top"
      style="height: 250px; object-fit: cover; overflow: hidden"
    >
      <img
        :src="horse.main_img_url"
        :alt="horse.name"
        style="width: 100%; height: 100%; object-fit: cover"
      />
    </div>
    <div
      v-else
      class="card-img-top bg-light d-flex align-items-center justify-content-center"
      style="height: 250px"
    >
      <span class="text-muted">Nincs kép</span>
    </div>

    <div class="card-body d-flex flex-column">
      <h5 class="card-title">{{ horse.name }}</h5>

      <p class="card-text text-muted">
        <small>
          {{ horse.gender === "F" ? "Kanca" : "Hérosz" }} •
          {{ horse.birth_year }}
        </small>
      </p>

      <div v-if="horse.is_available_for_sale" class="mb-2">
        <span class="badge bg-success">Eladó</span>
      </div>

      <router-link
        :to="`/lovaink/${horse.id}`"
        class="btn btn-primary btn-sm mt-auto"
      >
        Részletek
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.card {
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
</style>
