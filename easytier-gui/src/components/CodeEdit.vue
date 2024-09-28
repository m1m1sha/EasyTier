<script setup lang="ts">
import type { EditorConfiguration } from 'codemirror'
import type { CmComponentRef } from 'codemirror-editor-vue3'
// import { yaml } from '@codemirror/lang-yaml'
// import { oneDark } from '@codemirror/theme-one-dark'
import CodeMirror from 'codemirror-editor-vue3'
// import CodeMirror from 'vue-codemirror6'
import 'codemirror/mode/toml/toml.js'
import 'codemirror/theme/ayu-dark.css'
import '~/styles/codeMirror.css'

const props = defineProps<{
  modelValue: string
}>()

const emits = defineEmits<{
  'update:modelValue': [code: string]
}>()

const t = ref<NodeJS.Timeout | null>()

function onChange(value: string) {
  if (t.value !== null) {
    clearTimeout(t.value)
  }
  t.value = setTimeout(() => {
    emits('update:modelValue', value)
  }, 100)
}

const cmRef = ref<CmComponentRef>()
const cmOptions: EditorConfiguration = {
  mode: 'text/x-toml',
  theme: 'easytier-dark',
}

onMounted(() => {
  setTimeout(() => {
    cmRef.value?.refresh()
  }, 100)
})

onUnmounted(() => {
  cmRef.value?.destroy()
})
</script>

<template>
  <CodeMirror ref="cmRef" :value="props.modelValue" :options="cmOptions" class="border rounded-md flex-1" @change="onChange" />
  <!-- <CodeMirror
    v-model="code"
    basic
    :lang="yaml()"
    :extensions="[oneDark]"
  /> -->
</template>

<style lang="postcss" scoped></style>
