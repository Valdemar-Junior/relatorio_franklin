<script setup lang="ts">
defineProps<{
  years: string[]
  paymentMethods: string[]
  statuses: string[]
  selectedYear: string
  selectedPaymentMethod: string
  selectedStatus: string
  filteredCount: number
  hasActiveFilters: boolean
}>()

const emit = defineEmits<{
  'update:selectedYear': [value: string]
  'update:selectedPaymentMethod': [value: string]
  'update:selectedStatus': [value: string]
  reset: []
}>()
</script>

<template>
  <section class="rounded-[1.75rem] border border-slate-200/80 bg-white/85 p-5 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.35)] backdrop-blur">
    <div class="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
      <div>
        <p class="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
          Filtros
        </p>

        <h2 class="mt-2 text-xl font-semibold tracking-tight text-slate-950">
          Recorte do dashboard
        </h2>

        <p class="mt-1 text-sm text-slate-600">
          Filtre por ano, forma de pagamento e status financeiro das compras.
        </p>
      </div>

      <div class="flex flex-wrap items-center gap-3">
        <span class="rounded-full bg-slate-950 px-3 py-1 text-xs font-semibold text-white">
          {{ filteredCount }} compras visíveis
        </span>

        <button
          type="button"
          class="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-950 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-40"
          :disabled="!hasActiveFilters"
          @click="emit('reset')"
        >
          Limpar filtros
        </button>
      </div>
    </div>

    <div class="mt-5 grid gap-4 md:grid-cols-3">
      <label class="space-y-2">
        <span class="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Ano</span>

        <select
          class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-400 focus:bg-white"
          :value="selectedYear"
          @change="emit('update:selectedYear', ($event.target as HTMLSelectElement).value)"
        >
          <option value="todos">
            Todos os anos
          </option>

          <option
            v-for="year in years"
            :key="year"
            :value="year"
          >
            {{ year }}
          </option>
        </select>
      </label>

      <label class="space-y-2">
        <span class="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Forma de pagamento</span>

        <select
          class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:bg-white"
          :value="selectedPaymentMethod"
          @change="emit('update:selectedPaymentMethod', ($event.target as HTMLSelectElement).value)"
        >
          <option value="todas">
            Todas as formas
          </option>

          <option
            v-for="paymentMethod in paymentMethods"
            :key="paymentMethod"
            :value="paymentMethod"
          >
            {{ paymentMethod }}
          </option>
        </select>
      </label>

      <label class="space-y-2">
        <span class="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Status</span>

        <select
          class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-400 focus:bg-white"
          :value="selectedStatus"
          @change="emit('update:selectedStatus', ($event.target as HTMLSelectElement).value)"
        >
          <option value="todos">
            Todos os status
          </option>

          <option
            v-for="statusOption in statuses"
            :key="statusOption"
            :value="statusOption"
          >
            {{ statusOption }}
          </option>
        </select>
      </label>
    </div>
  </section>
</template>
