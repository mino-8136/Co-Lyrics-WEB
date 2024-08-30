<template>
  <p>Debug</p>
  <p>{{ store.someState }}</p>
  <p>{{ store.counter }}</p>
  <button @click="store.increment">Increment</button>
</template>

<script setup lang="ts">
import { defineStore } from 'pinia'
import { onMounted } from 'vue';

const useStore = defineStore('store', {
  state: () => ({
    someState: 'hello pinia',
    counter: 0,
  }),
  actions: {
    increment() {
      this.counter++
    },
  },
  persist: {
    beforePersist: (store) => {
      console.log(`about to persist`, store)
    },
    afterPersist: (store) => {
      console.log(`just persisted`, store)
    },
    beforeHydrate: (ctx) => {
      console.log('about to hydrate', ctx)
    },
    afterHydrate: (ctx) => {
      console.log(`about to restore`, ctx)
    },
    
  },
})

const store = useStore()

onMounted(() => {
  console.log(store)
})


</script>
