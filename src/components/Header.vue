<script setup>

</script>

<template>
    <header id="nav">
      <nav>
        <div class="border-bottom lh-1">
          <div class="flex-nowrap justify-content-between align-items-center">
            <div class="text-center align-items-center">
              <h2 class="text-uppercase fw-bold">Laguna Lovasklub</h2>
            </div>
          </div>
        </div>
        <div class="nav-scroller px-4 border-bottom">
          <nav class="nav nav-underline justify-content-center">
            <router-link 
              class="nav-item text-uppercase fw-bold nav-link link-light link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover px-4" 
              to="/">
              Rólunk
            </router-link>
            <router-link 
              class="nav-item text-uppercase fw-bold nav-link link-light link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover px-4" 
              to="/webshop">
              Webshop
            </router-link>
            <router-link 
              class="nav-item text-uppercase fw-bold nav-link link-light link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover px-4" 
              to="/lovaink">
              Lovaink
            </router-link>
            <router-link 
              class="nav-item text-uppercase fw-bold nav-link link-light link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover px-4" 
              to="/eredmenyeink">
              Eredményeink
            </router-link>
          </nav>
        </div>
      </nav>
    </header>
</template>

<style scoped>

</style>