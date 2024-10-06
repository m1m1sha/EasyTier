import type { InstanceData } from '~/types/components'

export const useInstanceStore = defineStore('instanceStore', () => {
  const instances = ref<InstanceData[]>(isDev ? instancesMock() : [])
  const selectedId = ref('')

  const currentInstance = computed(() => instances.value.find(instance => instance.id === selectedId.value) || undefined)

  const statusIpv4 = computed(() => {
    return currentInstance.value?.ipv4 ?? 'N/A'
  })

  const statusUpTotal = computed(() => {
    return humanStreamSizeSplit(currentInstance.value?.stats.at(-1)?.peers.reduce((a, c) => a + c.up, 0))
  })

  const statusDownTotal = computed(() => {
    return humanStreamSizeSplit(currentInstance.value?.stats.at(-1)?.peers.reduce((a, c) => a + c.down, 0))
  })

  const currentPeers = computed(() => {
    return currentInstance.value?.stats.at(-1)?.peers
  })

  return {
    instances,
    selectedId,
    currentInstance,
    statusIpv4,
    statusUpTotal,
    statusDownTotal,
    currentPeers,
    setInstances(newInstances: InstanceData[]) {
      instances.value = newInstances
    },
    addInstance(adder: InstanceData) {
      instances.value.push(adder)
    },
    setSelectedId(newId: string) {
      selectedId.value = newId
    },
    deleteInstance(id: string) {
      // stop instance
      instances.value = instances.value.filter(instance => instance.id !== id)
      if (selectedId.value === id)
        selectedId.value = ''
    },
  }
}, {
  persist: true,
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useInstanceStore, import.meta.hot))
