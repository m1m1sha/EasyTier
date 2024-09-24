<script setup lang="ts">
import { ChevronLeft, FileClock, MoreVertical, Share2, Trash2 } from 'lucide-vue-next'

const instanceStore = useInstanceStore()
const { selectedId, currentInstance } = storeToRefs(instanceStore)

const instanceStatus = computed(() => currentInstance.value?.status)

function back() {
  if (isMobile.value)
    instanceStore.setSelectedId('')
}
</script>

<template>
  <div class="p-2 h-full overflow-hidden">
    <template v-if="selectedId || isMobile">
      <div class="flex flex-row items-center justify-between">
        <div class="flex items-center">
          <Tooltip v-if="isMobile">
            <TooltipTrigger as-child>
              <Button variant="ghost" size="icon" @click="back()">
                <ChevronLeft class="size-4" />
                <span class="sr-only">返回</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>返回</TooltipContent>
          </Tooltip>
        </div>
        <div class="flex items-center">
          <Switch :checked="instanceStatus" />
          <Separator orientation="vertical" class="mx-2 h-6" />
          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <Button variant="ghost" size="icon">
                <MoreVertical class="size-4" />
                <span class="sr-only">更多</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>实例操作</DropdownMenuLabel>
              <DropdownMenuItem>
                <FileClock class="mr-2 h-4 w-4" />日志
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Share2 class="mr-2 h-4 w-4" />分享
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem @click="instanceStore.deleteInstance(selectedId)">
                <Trash2 class="mr-2 h-4 w-4" />删除
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
