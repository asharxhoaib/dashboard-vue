<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import AppShell from '@/components/layout/AppShell.vue'
import { useNotificationStore } from '@/stores/notificationStore'

const route = useRoute()
const notificationStore = useNotificationStore()

const isChromeless = computed(() => Boolean(route.meta.public))

onMounted(() => {
  notificationStore.initialize()
})
</script>

<template>
  <RouterView v-if="isChromeless" />
  <AppShell v-else>
    <RouterView />
  </AppShell>
</template>
