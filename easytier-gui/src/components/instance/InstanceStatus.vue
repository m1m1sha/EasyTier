<script setup lang="ts">
import { ArrowUpDown, PlaneTakeoff, Radar, Users } from 'lucide-vue-next'

const instanceStore = useInstanceStore()
const { currentInstance, chartStatsData, statusIpv4, statusUpTotal, statusDownTotal, currentPeers } = storeToRefs(instanceStore)
</script>

<template>
  <Tabs default-value="overview" style="height: calc(100% - 96px);">
    <TabsList>
      <TabsTrigger value="overview">
        概览
      </TabsTrigger>
      <TabsTrigger value="detail">
        详情
      </TabsTrigger>
      <TabsTrigger value="config">
        配置
      </TabsTrigger>
    </TabsList>
    <TabsContent value="overview" class="h-full overflow-y-scroll">
      <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 pr-px">
        <Card>
          <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle class="text-sm font-medium">
              虚拟IP
            </CardTitle>
            <PlaneTakeoff class="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div v-if="statusIpv4.split('.').length < 3" class="text-2xl font-bold">
              {{ statusIpv4 }}
            </div>
            <div v-else class="text-2xl font-bold">
              <NumberAnimation
                v-for="(item, index) in statusIpv4.split('.')" :key="index" :to="Number(item)"
                :suffix="index === 3 ? '' : '.'"
              />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle class="text-sm font-medium">
              Nat类型
            </CardTitle>
            <Radar class="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-bold">
              {{ currentInstance?.NatType ?? 'N/A' }}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle class="text-sm font-medium">
              {{ currentInstance?.status ? '实时' : '历史' }}设备
            </CardTitle>
            <Users class="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <NumberAnimation
              class="text-2xl font-bold"
              :to="currentInstance?.stats.at(-1)?.peers.length"
            />
            <LineChart
              v-if="currentInstance && currentInstance.stats.length > 0" class="h-[100px] mt-2 pt-2"
              :data="chartStatsData" index="time" :categories="['total']" :show-tooltip="false" :show-grid-line="false"
              :show-legend="false" :show-x-axis="false" :show-y-axis="false"
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle class="text-sm font-medium">
              {{ currentInstance?.status ? '实时' : '历史' }}流量
            </CardTitle>
            <ArrowUpDown class="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div class="flex flex-wrap text-2xl font-bold space-x-2 items-center">
              <NumberAnimation
                :to="statusUpTotal.size"
                :suffix="statusUpTotal.unit" :precision="1"
              />
              <Separator orientation="vertical" label="/" />
              <NumberAnimation
                class="text-[--vis-secondary-color-0x]"
                :to="statusDownTotal.size" :precision="1" :suffix="statusDownTotal.unit"
              />
            </div>
            <LineChart
              v-if="currentInstance && currentInstance.stats.length > 0" class="mt-2 pt-2 h-[100px]"
              :data="chartStatsData" index="time" :categories="['up', 'down']" :y-formatter="(tick, _i) => {
                return typeof tick === 'number' ? `${humanStreamSize(tick)}` : ''
              }" :show-tooltip="false" :show-grid-line="false" :show-legend="false" :show-x-axis="false"
              :show-y-axis="false"
            />
          </CardContent>
        </Card>
      </div>
    </TabsContent>
    <TabsContent value="detail" class="h-full overflow-y-scroll">
      <div
        v-if="currentInstance && currentInstance.stats.length > 0"
        class="grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 pr-px"
      >
        <PeerDetail v-for="peer in currentPeers" :id="peer.id" :key="peer.id" />
      </div>
      <div v-else class="w-full h-full flex text-center justify-center align-middle">
        Nothing here
      </div>
    </TabsContent>
    <TabsContent value="config" class="h-full overflow-y-scroll">
      <div class="pr-px">
        <InstanceConfig />
      </div>
    </TabsContent>
  </Tabs>
</template>

<style scoped lang="postcss"></style>
