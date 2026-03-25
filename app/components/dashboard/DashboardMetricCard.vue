<script setup lang="ts">
defineProps<{
  label: string
  value: string
  description: string
  glowClass: string
}>()
</script>

<template>
  <article class="relative overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-white/90 p-5 shadow-[0_28px_70px_-45px_rgba(15,23,42,0.45)] backdrop-blur">
    <div
      :class="[
        'absolute right-0 top-0 h-28 w-28 translate-x-8 -translate-y-8 rounded-full opacity-20 blur-2xl',
        glowClass,
      ]"
    />

    <div class="relative">
      <p class="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
        {{ label }}
      </p>

      <p class="mt-4 text-3xl font-semibold tracking-tight text-slate-950">
        {{ value }}
      </p>

      <p class="mt-2 text-sm leading-6 text-slate-600">
        {{ description }}
      </p>
    </div>
  </article>
</template>
