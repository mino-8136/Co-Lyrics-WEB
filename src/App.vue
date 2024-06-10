<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <nav>
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/edit">Edit</RouterLink>
      <RouterLink to="/debug">Debug</RouterLink>
    </nav>
  </header>

  <RouterView />
</template>
