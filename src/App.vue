<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <v-app>
    <v-toolbar app color="primary" class="mb-4">
      <v-toolbar-title>研究用リリック</v-toolbar-title>
      <v-spacer></v-spacer>
      <!-- <v-btn text to="/">Home</v-btn>でいいのか疑問 -->
      <v-btn @click="() => $router.push('/')">Home</v-btn>
      <v-btn @click="() => $router.push('/edit')">Edit</v-btn>
      <v-btn @click="() => $router.push('/testplay')">TestPlay</v-btn>
      <v-btn @click="() => $router.push('/debug')">Debug</v-btn>
    </v-toolbar>
    <v-main>
      <RouterView />
    </v-main>
  </v-app>
</template>
