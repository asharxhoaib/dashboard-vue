<script setup lang="ts">
import { useRouter } from 'vue-router'
import Button from '@/components/ui/button.vue'
import Card from '@/components/ui/card.vue'

const router = useRouter()
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-muted/30 px-4">
    <Card class="w-full max-w-sm text-center">
      <p class="text-5xl">🚫</p>
      <h1 class="mt-3 text-lg font-semibold">403 — Access denied</h1>
      <p class="mt-1 text-sm text-muted-foreground">You don't have permission to view this page.</p>
      <Button class="mt-4" @click="router.push('/')">Back to dashboard</Button>
    </Card>
  </div>
</template>
