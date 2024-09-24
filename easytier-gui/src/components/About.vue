<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <div class="pb-2 space-y-2">
    <h3 class="text-xl font-medium">
      EasyTier GUI
      <span class="text-sm">{{ `v${pkg.version}` }}</span>
    </h3>
    <p class="text-sm text-muted-foreground">
      {{ t('component.about.description') }}
    </p>
    <div class="flex flex-wrap space-x-2">
      <Image src="https://img.shields.io/github/license/EasyTier/EasyTier" alt="badge" />
      <Image src="https://img.shields.io/github/v/release/EasyTier/EasyTier" alt="badge" />
      <Image src="https://img.shields.io/github/last-commit/EasyTier/EasyTier" alt="badge" />
    </div>
  </div>
  <Separator />
</template>

<style lang="postcss" scoped>
</style>
