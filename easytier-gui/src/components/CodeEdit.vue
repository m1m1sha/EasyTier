<script setup lang="ts">
import type { EditorConfiguration } from 'codemirror'
import type { CmComponentRef } from 'codemirror-editor-vue3'
import Codemirror from 'codemirror-editor-vue3'
import { parse, stringify } from 'smol-toml'
import 'codemirror/mode/toml/toml.js'
import 'codemirror/theme/ayu-dark.css'
import '~/styles/codeMirror.css'

const props = defineProps<{
  code: string
}>()
// const { t } = useI18n()

const cmRef = ref<CmComponentRef>()
const cmOptions: EditorConfiguration = {
  mode: 'text/x-toml',
  theme: 'easytier-dark',
}

onMounted(() => {
  setTimeout(() => {
    cmRef.value?.refresh()
  }, 100)

  // setTimeout(() => {
  //   cmRef.value?.cminstance.isClean()
  // }, 3000)
})

onUnmounted(() => {
  cmRef.value?.destroy()
})
</script>

<template>
  <Codemirror ref="cmRef" :value="props.code" :options="cmOptions" class="border rounded-md flex-1" />
</template>

<style lang="postcss" scoped></style>
