<script setup lang="ts">
import { ChevronLeft, FileClock, MoreVertical, Share2, Trash2 } from 'lucide-vue-next'
import { parse, stringify } from 'smol-toml'
import { startNetworkInstance, stopNetworkInstance } from '~/composables/instance'

const { t } = useI18n()
const instanceStore = useInstanceStore()
const { selectedId, currentInstance, instances } = storeToRefs(instanceStore)

const instanceStatus = computed(() => currentInstance.value?.status)

async function toggleStatus(id: string) {
  // console.log(instanceStatus.value ? 'top' : 'start', currentInstance.value!.config.str)
  const curInstance = instances.value.find(i => i.id === id)
  if (curInstance?.status) {
    await stopNetworkInstance(id)
  }
  else {
    const toml = parse(curInstance!.config.str)
    toml.instance_id = id
    await startNetworkInstance(stringify(toml))
  }
}
function back() {
  if (isMobile.value)
    instanceStore.setSelectedId('')
}
</script>

<template>
  <div class="p-2 h-full w-full overflow-hidden">
    <template v-if="selectedId || isMobile">
      <div class="flex flex-row items-center justify-between">
        <div class="flex items-center">
          <Tooltip v-if="isMobile">
            <TooltipTrigger as-child>
              <Button variant="ghost" size="icon" @click="back()">
                <ChevronLeft class="size-4" />
                <span class="sr-only">{{ t('component.instance.display.back') }}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>{{ t('component.instance.display.back') }}</TooltipContent>
          </Tooltip>
        </div>
        <div class="flex items-center">
          <Switch :checked="instanceStatus" @update:checked="toggleStatus(selectedId)" />
          <Separator orientation="vertical" class="mx-2 h-6" />
          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <Button variant="ghost" size="icon">
                <MoreVertical class="size-4" />
                <span class="sr-only">{{ t('component.instance.display.more') }}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{{ t('component.instance.display.instanceAction') }}</DropdownMenuLabel>
              <DropdownMenuItem>
                <FileClock class="mr-2 h-4 w-4" />{{ t('component.instance.display.log') }}
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Share2 class="mr-2 h-4 w-4" />{{ t('component.instance.display.share') }}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem @click="instanceStore.deleteInstance(selectedId)">
                <Trash2 class="mr-2 h-4 w-4" />{{ t('component.instance.display.delete') }}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div class="w-full h-full mt-2 overflow-hidden">
        <InstanceStatus />
      </div>
    </template>
    <template v-else>
      <About />
    </template>
  </div>
</template>

<style lang="postcss" scoped></style>
