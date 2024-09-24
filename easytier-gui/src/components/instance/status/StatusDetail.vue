<script setup lang="ts">
import type {
  ColumnFiltersState,
  ExpandedState,
  SortingState,
  VisibilityState,
} from '@tanstack/vue-table'
import { ChevronDownIcon } from '@radix-icons/vue'
import {
  createColumnHelper,
  FlexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useVueTable,
} from '@tanstack/vue-table'
import DropdownAction from '~/components/instance/status/DataTableDropDown.vue'
import { Button } from '~/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table'

import { cn, valueUpdater } from '~/lib/utils'
import type { InstancePeer } from '~/types/components'

const instanceStore = useInstanceStore()
const { currentInstance } = storeToRefs(instanceStore)

const data = computed(() => {
  const timePeer = currentInstance.value?.stats || []
  return currentInstance.value?.status && timePeer.length ? timePeer.at(-1)!.peers : []
})

const columnHelper = createColumnHelper<InstancePeer>()

const columns = [
  columnHelper.accessor('name', {
    enablePinning: true,
    header: '设备名',
    cell: ({ row }) => {
      return h('div', { class: 'capitalize' }, row.original.name)
    },
  }),
  columnHelper.accessor('ipv4', {
    enablePinning: true,
    header: 'ipv4',
    cell: ({ row }) => h('div', { class: 'capitalize' }, row.original.ipv4 ?? ''),
  }),
  columnHelper.accessor('cost', {
    header: '路由',
    cell: ({ row }) => {
      const cost = row.original.cost
      return h('div', { class: 'capitalize' }, cost > 0 ? cost === 1 ? 'p2p' : `delay(${cost})` : '本机')
    },
  }),
  columnHelper.accessor('latency', {
    enablePinning: true,
    header: '延迟',
    cell: ({ row }) => h('div', { class: 'capitalize' }, row.original.cost === 0 ? '-' : `${row.original.latency}ms`),
  }),
  columnHelper.accessor('lost', {
    enablePinning: true,
    header: '丢包',
    cell: ({ row }) => h('div', { class: 'capitalize' }, row.original.cost === 0 ? '-' : `${row.original.lost}%`),
  }),
  columnHelper.accessor('up', {
    enablePinning: true,
    header: '上行',
    cell: ({ row }) => {
      return h('div', { class: 'capitalize' }, row.original.cost === 0 ? '-' : humanStreamSize(row.original.up))
    },
  }),
  columnHelper.accessor('down', {
    enablePinning: true,
    header: '下行',
    cell: ({ row }) => {
      return h('div', { class: 'capitalize' }, row.original.cost === 0 ? '-' : humanStreamSize(row.original.down))
    },
  }),
  columnHelper.accessor('version', {
    enablePinning: true,
    header: '核心版本',
    cell: ({ row }) => {
      const version = row.original.version
      return h('div', { class: 'capitalize' }, `${version ? `v${version}` : 'unknown'}`)
    },
  }),
  columnHelper.display({
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      return h('div', { class: 'relative' }, h(DropdownAction, {
        payment: {
          id: row.original.id,
        },
        onExpand: row.toggleExpanded,
      }))
    },
  }),
]

const sorting = ref<SortingState>([])
const columnFilters = ref<ColumnFiltersState>([])
const columnVisibility = ref<VisibilityState>({})
const rowSelection = ref({})
const expanded = ref<ExpandedState>({})

const table = useVueTable({
  data,
  columns,
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getExpandedRowModel: getExpandedRowModel(),
  onSortingChange: updaterOrValue => valueUpdater(updaterOrValue, sorting),
  onColumnFiltersChange: updaterOrValue => valueUpdater(updaterOrValue, columnFilters),
  onColumnVisibilityChange: updaterOrValue => valueUpdater(updaterOrValue, columnVisibility),
  onRowSelectionChange: updaterOrValue => valueUpdater(updaterOrValue, rowSelection),
  onExpandedChange: updaterOrValue => valueUpdater(updaterOrValue, expanded),
  state: {
    get sorting() { return sorting.value },
    get columnFilters() { return columnFilters.value },
    get columnVisibility() { return columnVisibility.value },
    get rowSelection() { return rowSelection.value },
    get expanded() { return expanded.value },
    columnPinning: {
      left: ['status'],
    },
  },
})
</script>

<template>
  <div class="w-full">
    <div class="flex gap-2 items-center pb-4">
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button variant="outline" class="ml-auto">
            数据项
            <ChevronDownIcon class="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuCheckboxItem
            v-for="column in table.getAllColumns().filter((column) => column.getCanHide())"
            :key="column.id" class="capitalize" :checked="column.getIsVisible()" @update:checked="(value) => {
              column.toggleVisibility(!!value)
            }"
          >
            {{ column.id }}
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
    <div class="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
            <TableHead
              v-for="header in headerGroup.headers" :key="header.id" :data-pinned="header.column.getIsPinned()"
              :class="cn(
                { 'sticky bg-background/95': header.column.getIsPinned() },
                header.column.getIsPinned() === 'left' ? 'left-0' : 'right-0',
              )"
            >
              <FlexRender
                v-if="!header.isPlaceholder" :render="header.column.columnDef.header"
                :props="header.getContext()"
              />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <template v-if="table.getRowModel().rows?.length">
            <template v-for="row in table.getRowModel().rows" :key="row.id">
              <TableRow :data-state="row.getIsSelected() && 'selected'">
                <TableCell
                  v-for="cell in row.getVisibleCells()" :key="cell.id" :data-pinned="cell.column.getIsPinned()"
                  :class="cn(
                    { 'sticky bg-background/95': cell.column.getIsPinned() },
                    cell.column.getIsPinned() === 'left' ? 'left-0' : 'right-0',
                  )"
                >
                  <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
                </TableCell>
              </TableRow>
              <TableRow v-if="row.getIsExpanded()">
                <TableCell :colspan="row.getAllCells().length">
                  {{ JSON.stringify(row.original) }}
                </TableCell>
              </TableRow>
            </template>
          </template>

          <TableRow v-else>
            <TableCell :colspan="columns.length" class="h-24 text-center">
              No results.
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  </div>
</template>

<style lang="postcss" scoped></style>
