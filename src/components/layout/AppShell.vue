<script setup lang="ts">
import { ref } from 'vue'
import Sidebar from '@/components/layout/Sidebar.vue'
import Topbar from '@/components/layout/Topbar.vue'
import BottomNav from '@/components/layout/BottomNav.vue'
import MobileDrawer from '@/components/layout/MobileDrawer.vue'
import CommandPalette from '@/components/layout/CommandPalette.vue'

const drawerOpen = ref(false)
const paletteOpen = ref(false)
</script>

<template>
  <div class="flex min-h-screen bg-background">
    <Sidebar />

    <div class="flex min-h-screen flex-1 flex-col">
      <Topbar @open-drawer="drawerOpen = true" @open-palette="paletteOpen = true" />

      <main class="flex-1 px-4 pb-20 pt-4 sm:px-6 md:pb-6 lg:px-8">
        <slot />
      </main>
    </div>

    <BottomNav />
    <MobileDrawer :open="drawerOpen" @close="drawerOpen = false" />
    <CommandPalette v-model:open="paletteOpen" />
  </div>
</template>
