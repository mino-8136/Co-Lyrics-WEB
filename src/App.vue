<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <v-app>
    <v-toolbar app color="primary" class="mb-4">
      <v-toolbar-title>Co-Lyrics-WEB</v-toolbar-title>
      <v-spacer></v-spacer>

      <v-btn @click="() => $router.push('/edit')">Edit</v-btn>
      <v-btn @click="() => $router.push('/play')">Play</v-btn>
      <v-btn @click="() => $router.push('/config')">Config</v-btn>
      <!--
        <v-btn @click="() => $router.push('/debug')">Debug</v-btn>
      -->
    </v-toolbar>
    <v-main>
      <RouterView />
    </v-main>
  </v-app>
</template>
