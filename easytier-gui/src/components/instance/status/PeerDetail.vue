<script setup lang="ts">
import type { InstancePeerDetail, InstancePeerStat } from '~/types/components'

const props = defineProps<PeerDetailProps>()
const instanceStore = useInstanceStore()
const { currentInstance, chartStatsData, statusUpTotal, statusDownTotal } = storeToRefs(instanceStore)
interface PeerDetailProps {
  id: string
}

const detailStatsData = computed(() => {
  const sliceStats = currentInstance.value?.stats ?? []
  const peerDetail: InstancePeerDetail = {
    id: props.id,
    name: '',
    stats: [] as InstancePeerStat[],
  }

  peerDetail.stats = sliceStats.map((item) => {
    const peer = item.peers.find(peer => peer.id === props.id)
    if (peer && !peerDetail.name)
      peerDetail.name = peer.name

    if (peer && !peerDetail.version)
      peerDetail.version = peer.version

    return (peer
      ? {
          time: item.time,
          ipv4: peer?.ipv4,
          ipv6: peer?.ipv6,
          up: peer?.up || 0,
          down: peer?.down || 0,
          cost: peer?.cost || 0,
          latency: peer?.latency || 0,
          lost: peer?.lost || 0,
        }
      : {}) as InstancePeerStat
  }) ?? []
  return peerDetail
})

const currentStatsData = computed(() => {
  return detailStatsData.value.stats.at(-1)!
})
</script>

<template>
  <div class="border rounded-xl p-4 w-auto flex flex-col space-y-2 overflow-hidden relative">
    <div class="flex mb-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger as-child>
            <span class="font-semibold leading-none tracking-tight max-w-[150px] truncate">{{ detailStatsData.name
            }}</span>
          </TooltipTrigger>
          <TooltipContent>
            <p>{{ detailStatsData.name }}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <span class="text-xs text-gray-500 ml-2">{{ `${detailStatsData.version ? 'v' : ''}${detailStatsData.version
        || 'unknown'}` }}</span>
    </div>
    <div v-if="currentInstance?.status">
      <Badge class="!bg-primary/85 mr-2 mt-2">
        {{ `IP: ${currentStatsData.ipv4 || '-'}` }}
      </Badge>
      <Badge variant="secondary" class="mr-2 mt-2">
        {{ currentStatsData.cost > 0 ? currentStatsData.cost === 1 ? 'p2p' : `relay(${currentStatsData.cost})` : '本机' }}
      </Badge>
    </div>
    <div v-if="currentStatsData.cost > 0" class="flex flex-wrap">
      <HoverCard>
        <HoverCardTrigger as-child>
          <Badge variant="outline" class="mr-2 mt-2 space-x-2">
            <NumberAnimation :to="currentStatsData.latency" suffix="ms" />
            <Separator orientation="vertical" />
            <NumberAnimation class="text-[--vis-accent-color-0x]" :to="currentStatsData.lost" suffix="%" />
          </Badge>
        </HoverCardTrigger>
        <HoverCardContent class="!p-0">
          <CardHeader class="border-b p-3">
            <CardTitle>
              <span>延迟</span>
              <span class="mx-1">/</span>
              <span class="text-[--vis-accent-color-0x]">丢包</span>
            </CardTitle>
          </CardHeader>
          <CardContent class="min-w-[180px] flex flex-col px-2 pb-2">
            <AreaChart
              class="w-full h-28 mt-4" :data="detailStatsData.stats" index="time"
              :categories="['latency', 'lost']" :colors="['#ffffff', '#f27474']"
              :y-formatter="(tick, _i) => tick.toString()" :show-tooltip="false"
              :show-grid-line="true" :show-legend="false" :show-x-axis="false"
            />
          </CardContent>
        </HoverCardContent>
      </HoverCard>
      <HoverCard>
        <HoverCardTrigger as-child>
          <Badge variant="outline" class="mr-2 mt-2 space-x-2">
            <NumberAnimation
              :to="humanStreamSizeSplit(currentStatsData.up).size"
              :suffix="humanStreamSizeSplit(currentStatsData.up).unit" :precision="1"
            />
            <Separator orientation="vertical" />
            <NumberAnimation
              class="text-[--vis-secondary-color-0x]"
              :to="humanStreamSizeSplit(currentStatsData.down).size" :precision="1"
              :suffix="humanStreamSizeSplit(currentStatsData.down).unit"
            />
          </Badge>
        </HoverCardTrigger>
        <HoverCardContent class="!p-0">
          <CardHeader class="border-b p-3">
            <CardTitle>
              <span>上传</span>
              <span class="mx-1">/</span>
              <span class="text-[--vis-secondary-color-0x]">下载</span>
            </CardTitle>
          </CardHeader>
          <CardContent class="min-w-[180px] flex flex-col px-2 pb-2">
            <AreaChart
              class="w-full h-28 mt-4" :data="detailStatsData.stats" index="time" :categories="['up', 'down']"
              :y-formatter="(tick, _i) => typeof tick === 'number' ? `${humanStreamSize(tick)}` : ''"
              :show-tooltip="false" :show-grid-line="true" :show-legend="false" :show-x-axis="false"
            />
          </CardContent>
        </HoverCardContent>
      </HoverCard>
    </div>
    <div
      v-if="currentInstance && currentInstance.stats.length > 0 && chartStatsData?.length && currentStatsData.cost === 0"
      class="flex flex-wrap"
    >
      <HoverCard>
        <HoverCardTrigger as-child>
          <Badge variant="outline" class="mr-2 mt-2">
            <NumberAnimation :to="chartStatsData.at(-1)?.total" prefix="设备数: " />
          </Badge>
        </HoverCardTrigger>
        <HoverCardContent class="!p-0">
          <CardHeader class="border-b p-3">
            <CardTitle>
              <p>设备数</p>
            </CardTitle>
          </CardHeader>
          <CardContent class="min-w-[180px] flex flex-col px-2 pb-2">
            <LineChart
              class="h-[100px] mt-2 pt-2" :data="chartStatsData" index="time" :categories="['total']"
              :show-tooltip="false" :show-grid-line="false" :show-legend="false" :show-x-axis="false"
            />
          </CardContent>
        </HoverCardContent>
      </HoverCard>
      <HoverCard>
        <HoverCardTrigger as-child>
          <Badge variant="outline" class="mr-2 mt-2 space-x-2">
            <NumberAnimation :to="statusUpTotal.size" :suffix="statusUpTotal.unit" :precision="1" />
            <Separator orientation="vertical" />
            <NumberAnimation
              class="text-[--vis-secondary-color-0x]" :to="statusDownTotal.size" :precision="1"
              :suffix="statusDownTotal.unit"
            />
          </Badge>
        </HoverCardTrigger>
        <HoverCardContent class="!p-0">
          <CardHeader class="border-b p-3">
            <CardTitle>
              <span>上传</span>
              <span class="mx-1">/</span>
              <span class="text-[--vis-secondary-color-0x]">下载</span>
            </CardTitle>
          </CardHeader>
          <CardContent class="min-w-[180px] flex flex-col px-2 pb-2">
            <AreaChart
              class="w-full h-28 mt-4" :data="chartStatsData" index="time" :categories="['up', 'down']"
              :y-formatter="(tick, _i) => typeof tick === 'number' ? `${humanStreamSize(tick)}` : ''"
              :show-tooltip="false" :show-grid-line="true" :show-legend="false" :show-x-axis="false"
            />
          </CardContent>
        </HoverCardContent>
      </HoverCard>
    </div>
    <!-- <Cable class="absolute top-[-32px] right-[-16px] w-20 h-20 text-gray-600 rotate-45" /> -->
  </div>
</template>

<style lang="postcss" scoped>

</style>
