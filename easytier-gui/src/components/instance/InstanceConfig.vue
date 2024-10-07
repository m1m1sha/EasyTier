<script setup lang="ts">
import { parse, stringify } from 'smol-toml'
import { useToast } from '~/components/ui/toast/use-toast'

const instanceStore = useInstanceStore()
const { currentInstance } = storeToRefs(instanceStore)
const { toast } = useToast()
const configStr = computed({
  get() {
    const toml = parse(currentInstance.value!.config.str)
    toml.instance_id = currentInstance.value!.id
    toml.instance_name = currentInstance.value!.name
    return stringify(toml)
  },
  set(value) {
    try {
      const toml = parse(value)
      toml.instance_id = currentInstance.value!.id
      currentInstance.value!.name = toml.instance_name.toString()
      currentInstance.value!.config.str = stringify(toml)
    }
    catch (e: any) {
      toast({
        title: 'Instance Config',
        variant: 'destructive',
        description: h('div', { class: 'whitespace-pre-wrap', innerHTML: e }),
      })
    }
  },
})
</script>

<template>
  <div class="flex h-full space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
    <CodeEdit v-if="currentInstance" v-model="configStr" class="flex-1" />
  </div>
</template>

<style scoped lang="postcss"></style>
