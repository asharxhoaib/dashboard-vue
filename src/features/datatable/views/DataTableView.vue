<script setup lang="ts">
import { useQuery, useQueryClient } from '@tanstack/vue-query'
import Card from '@/components/ui/card.vue'
import DataTable from '@/features/datatable/components/DataTable.vue'
import { deleteTableRows, fetchTableRows } from '@/lib/mockApi'
import { useNotificationStore } from '@/stores/notificationStore'

const queryClient = useQueryClient()
const notificationStore = useNotificationStore()

const { data, isPending } = useQuery({
  queryKey: ['table-rows'],
  queryFn: () => fetchTableRows(),
  staleTime: 60_000,
})

async function handleDeleteRows(ids: string[]): Promise<void> {
  await deleteTableRows(ids)
  await queryClient.invalidateQueries({ queryKey: ['table-rows'] })
  await notificationStore.addNotification({
    title: 'Orders deleted',
    message: `${ids.length} order${ids.length === 1 ? '' : 's'} removed successfully.`,
    level: 'success',
  })
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <div>
      <h1 class="text-xl font-semibold tracking-tight">Orders</h1>
      <p class="text-sm text-muted-foreground">Sort, filter, and manage orders with bulk actions.</p>
    </div>

    <Card>
      <DataTable :rows="data ?? []" :is-loading="isPending" @delete-rows="handleDeleteRows" />
    </Card>
  </div>
</template>
