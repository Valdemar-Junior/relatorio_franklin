<script setup lang="ts">
import type { BreakdownItem } from '~/types/VendaFranklinDashboard'
import { formatCount, formatCurrencyBRL } from '~/utils/formatters'

defineProps<{
  title: string
  description: string
  items: BreakdownItem[]
  emptyMessage: string
}>()
</script>

<template>
  <article class="rounded-[1.75rem] border border-slate-200/80 bg-white/90 p-6 shadow-[0_28px_70px_-45px_rgba(15,23,42,0.45)] backdrop-blur">
    <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <p class="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
          {{ title }}
        </p>

        <h2 class="mt-2 text-xl font-semibold tracking-tight text-slate-950">
          {{ description }}
        </h2>
      </div>

      <span class="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
        {{ formatCount(items.length, 'grupo', 'grupos') }}
      </span>
    </div>

    <div
      v-if="items.length"
      class="mt-6 space-y-4"
    >
      <div
        v-for="item in items"
        :key="item.label"
        class="space-y-2"
      >
        <div class="flex items-start justify-between gap-4">
          <div>
            <p class="text-sm font-medium text-slate-900">
              {{ item.label }}
            </p>

            <p class="text-xs text-slate-500">
              {{ formatCount(item.count, 'compra', 'compras') }}
            </p>
          </div>

          <div class="text-right">
            <p class="text-sm font-semibold text-slate-950">
              {{ formatCurrencyBRL(item.amount) }}
            </p>

            <p class="text-xs text-slate-500">
              {{ (item.share * 100).toFixed(1).replace('.', ',') }}%
            </p>
          </div>
        </div>

        <div class="h-2 rounded-full bg-slate-100">
          <div
            class="h-2 rounded-full bg-gradient-to-r from-emerald-500 via-sky-500 to-cyan-400"
            :style="{ width: `${Math.max(item.share * 100, 4)}%` }"
          />
        </div>
      </div>
    </div>

    <p
      v-else
      class="mt-6 text-sm leading-6 text-slate-500"
    >
      {{ emptyMessage }}
    </p>
  </article>
</template>
