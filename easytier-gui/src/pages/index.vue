<script setup lang="ts">
import { Plus, Search } from 'lucide-vue-next'

const { t } = useI18n()
const instanceStore = useInstanceStore()
const { selectedId } = storeToRefs(instanceStore)

const appStore = useAppStore()
const filterInstanceValue = ref('')
</script>

<template>
  <div :class="isMobile ? 'h-full' : 'flex h-full'">
    <div
      v-if="!isMobile || !selectedId"
      :class="`overflow-hidden h-full flex flex-col ${isMobile ? 'm-auto' : 'min-w-72'}`"
    >
      <div class="bg-background/95 supports-[backdrop-filter]:bg-background/60 p-2 backdrop-blur">
        <div class="flex w-full items-center gap-1.5 relative">
          <Search class="text-muted-foreground absolute left-2 top-2.5 size-4" />
          <Input v-model="filterInstanceValue" :placeholder="t('page.index.search')" class="pl-8" />
          <Button variant="outline" size="icon" @click="appStore.setAddInstanceDialogVisible(true)">
            <Plus class="w-4 h-4" />
          </Button>
        </div>
      </div>
      <InstanceList :filter="filterInstanceValue" />
    </div>
    <div v-if="!isMobile || selectedId" class="w-full h-full">
      <InstanceDisplay />
    </div>
  </div>
</template>
