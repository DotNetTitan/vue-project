<template>
  <Layout v-if="!$route.meta.withoutLayout">
    <RouterView />
  </Layout>
  <RouterView v-else />
</template>

<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import Layout from '@/components/Layout.vue'

const route = useRoute()
</script>