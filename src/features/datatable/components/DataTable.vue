<script setup lang="ts">
import { computed, h, ref } from 'vue'
import {
  FlexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useVueTable,
  type ColumnDef,
  type RowSelectionState,
  type SortingState,
} from '@tanstack/vue-table'
import Input from '@/components/ui/input.vue'
import Button from '@/components/ui/button.vue'
import Badge from '@/components/ui/badge.vue'
import ColumnVisibilityMenu from '@/features/datatable/components/ColumnVisibilityMenu.vue'
import BulkActionsToolbar from '@/features/datatable/components/BulkActionsToolbar.vue'
import EmptyState from '@/components/charts/EmptyState.vue'
import { exportRowsAsCsv } from '@/lib/csv'
import type { TableRow } from '@/types/dashboard'

const props = defineProps<{ rows: TableRow[]; isLoading?: boolean }>()
const emit = defineEmits<{ 'delete-rows': [ids: string[]] }>()

const globalFilter = ref('')
const sorting = ref<SortingState>([{ id: 'date', desc: true }])
const rowSelection = ref<RowSelectionState>({})

const statusVariant: Record<TableRow['status'], 'success' | 'secondary' | 'destructive' | 'outline'> = {
  paid: 'success',
  pending: 'secondary',
  failed: 'destructive',
  refunded: 'outline',
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}

const columns: ColumnDef<TableRow>[] = [
  {
    id: 'select',
    header: ({ table }) =>
      h('input', {
        type: 'checkbox',
        class: 'h-3.5 w-3.5 rounded border-input',
        checked: table.getIsAllPageRowsSelected(),
        indeterminate: table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected(),
        onChange: (e: Event) => table.toggleAllPageRowsSelected((e.target as HTMLInputElement).checked),
      }),
    cell: ({ row }) =>
      h('input', {
        type: 'checkbox',
        class: 'h-3.5 w-3.5 rounded border-input',
        checked: row.getIsSelected(),
        onChange: (e: Event) => row.toggleSelected((e.target as HTMLInputElement).checked),
      }),
    enableSorting: false,
    enableHiding: false,
  },
  { accessorKey: 'id', header: 'Order ID' },
  { accessorKey: 'customer', header: 'Customer' },
  { accessorKey: 'email', header: 'Email' },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: (info) => formatCurrency(info.getValue<number>()),
  },
  { accessorKey: 'status', header: 'Status' },
  { accessorKey: 'channel', header: 'Channel' },
  {
    accessorKey: 'date',
    header: 'Date',
    cell: (info) => formatDate(info.getValue<string>()),
  },
]

const table = useVueTable({
  get data() {
    return props.rows
  },
  columns,
  state: {
    get globalFilter() {
      return globalFilter.value
    },
    get sorting() {
      return sorting.value
    },
    get rowSelection() {
      return rowSelection.value
    },
  },
  onGlobalFilterChange: (updater) => {
    globalFilter.value = typeof updater === 'function' ? updater(globalFilter.value) : updater
  },
  onSortingChange: (updater) => {
    sorting.value = typeof updater === 'function' ? updater(sorting.value) : updater
  },
  onRowSelectionChange: (updater) => {
    rowSelection.value = typeof updater === 'function' ? updater(rowSelection.value) : updater
  },
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  initialState: { pagination: { pageSize: 10 } },
})

const selectedIds = computed(() => table.getSelectedRowModel().rows.map((r) => r.original.id))
const selectedCount = computed(() => selectedIds.value.length)

function handleExportAll(): void {
  exportRowsAsCsv(props.rows, 'orders')
}

function handleExportSelected(): void {
  const selected = table.getSelectedRowModel().rows.map((r) => r.original)
  exportRowsAsCsv(selected, 'orders-selected')
}

function handleDeleteSelected(): void {
  emit('delete-rows', selectedIds.value)
  rowSelection.value = {}
}

function clearSelection(): void {
  rowSelection.value = {}
}
</script>

<template>
  <div class="flex flex-col gap-3">
    <div class="flex flex-wrap items-center gap-2">
      <Input
        :model-value="globalFilter"
        placeholder="Search orders…"
        class="max-w-xs"
        @update:model-value="(v) => (globalFilter = v)"
      />
      <ColumnVisibilityMenu :table="table" />
      <Button variant="outline" size="sm" class="ml-auto" @click="handleExportAll">Export CSV</Button>
    </div>

    <BulkActionsToolbar
      :selected-count="selectedCount"
      @delete="handleDeleteSelected"
      @export="handleExportSelected"
      @clear="clearSelection"
    />

    <div class="overflow-x-auto rounded-md border border-border">
      <table class="w-full text-left text-sm">
        <thead class="bg-muted/50">
          <tr v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
            <th
              v-for="header in headerGroup.headers"
              :key="header.id"
              class="whitespace-nowrap px-3 py-2 text-xs font-semibold text-muted-foreground"
              :class="header.column.getCanSort() ? 'cursor-pointer select-none' : ''"
              @click="header.column.getToggleSortingHandler()?.($event)"
            >
              <div class="flex items-center gap-1">
                <FlexRender v-if="!header.isPlaceholder" :render="header.column.columnDef.header" :props="header.getContext()" />
                <span v-if="header.column.getIsSorted() === 'asc'">▲</span>
                <span v-else-if="header.column.getIsSorted() === 'desc'">▼</span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="isLoading">
            <td :colspan="columns.length" class="px-3 py-10 text-center text-muted-foreground">Loading orders…</td>
          </tr>
          <tr v-else-if="table.getRowModel().rows.length === 0">
            <td :colspan="columns.length" class="px-3 py-6">
              <EmptyState title="No matching orders" description="Try adjusting your search or filters." />
            </td>
          </tr>
          <tr
            v-for="row in table.getRowModel().rows"
            :key="row.id"
            class="border-t border-border hover:bg-accent/50"
            :class="row.getIsSelected() ? 'bg-primary/5' : ''"
          >
            <td v-for="cell in row.getVisibleCells()" :key="cell.id" class="whitespace-nowrap px-3 py-2">
              <Badge v-if="cell.column.id === 'status'" :variant="statusVariant[row.original.status]" class="capitalize">
                {{ row.original.status }}
              </Badge>
              <span v-else-if="cell.column.id === 'channel'" class="capitalize">{{ row.original.channel }}</span>
              <FlexRender v-else :render="cell.column.columnDef.cell" :props="cell.getContext()" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
      <span>
        Page {{ table.getState().pagination.pageIndex + 1 }} of {{ Math.max(1, table.getPageCount()) }}
        · {{ table.getFilteredRowModel().rows.length }} rows
      </span>
      <div class="flex items-center gap-1.5">
        <Button variant="outline" size="sm" :disabled="!table.getCanPreviousPage()" @click="table.previousPage()">Prev</Button>
        <Button variant="outline" size="sm" :disabled="!table.getCanNextPage()" @click="table.nextPage()">Next</Button>
      </div>
    </div>
  </div>
</template>
