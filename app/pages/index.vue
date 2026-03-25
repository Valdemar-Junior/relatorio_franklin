<script setup lang="ts">
import { useAsyncData, useHead } from '#imports'
import { computed } from 'vue'

import DashboardBreakdownPanel from '~/components/dashboard/DashboardBreakdownPanel.vue'
import DashboardFilters from '~/components/dashboard/DashboardFilters.vue'
import DashboardMetricCard from '~/components/dashboard/DashboardMetricCard.vue'
import DashboardSalesTable from '~/components/dashboard/DashboardSalesTable.vue'
import { useVendaFranklin } from '~/composables/useVendaFranklin'
import { useVendaFranklinDashboard } from '~/composables/useVendaFranklinDashboard'
import { formatCurrencyBRL, formatDateBR } from '~/utils/formatters'

useHead({
  title: 'Dashboard financeiro | Franklin',
})

const { fetchTodasAsVendas } = useVendaFranklin()

const {
  data: rows,
  error,
  status: requestStatus,
} = await useAsyncData('venda-franklin-dashboard', fetchTodasAsVendas)

const {
  filters,
  clientName,
  clientCode,
  filteredSales,
  summary,
  availableYears,
  availablePaymentMethods,
  availableStatuses,
  paymentBreakdown,
  periodBreakdown,
  periodTitle,
  periodDescription,
  hasActiveFilters,
  clearFilters,
} = useVendaFranklinDashboard(rows)

function formatShare(value: number): string {
  return `${value.toFixed(1).replace('.', ',')}%`
}

const paidShare = computed(() => summary.value.totalPrazo > 0
  ? (summary.value.totalPago / summary.value.totalPrazo) * 100
  : 0)

const openShare = computed(() => summary.value.totalPrazo > 0
  ? (summary.value.totalEmAberto / summary.value.totalPrazo) * 100
  : 0)

const metricCards = computed(() => [
  {
    label: 'Valor total comprado',
    value: formatCurrencyBRL(summary.value.totalCompras),
    description: `${summary.value.quantidadeCompras} compras consolidadas • ticket médio ${formatCurrencyBRL(summary.value.ticketMedio)}`,
    glowClass: 'bg-emerald-400',
  },
  {
    label: 'Compras a prazo',
    value: formatCurrencyBRL(summary.value.totalPrazo),
    description: `${summary.value.quantidadeContratos} contratos e ${summary.value.quantidadeParcelas} parcelas geradas`,
    glowClass: 'bg-sky-400',
  },
  {
    label: 'Pago dos títulos',
    value: formatCurrencyBRL(summary.value.totalPago),
    description: `${formatShare(paidShare.value)} do crediário já foi liquidado`,
    glowClass: 'bg-amber-400',
  },
  {
    label: 'Saldo em aberto',
    value: formatCurrencyBRL(summary.value.totalEmAberto),
    description: `${formatShare(openShare.value)} do crediário ainda está pendente`,
    glowClass: 'bg-rose-400',
  },
])

const baseRangeLabel = computed(() => {
  if (!availableYears.value.length) {
    return 'Sem período'
  }

  const oldestYear = availableYears.value[availableYears.value.length - 1]
  const latestYear = availableYears.value[0]

  return oldestYear === latestYear ? latestYear : `${oldestYear} a ${latestYear}`
})

const filterContext = computed(() => {
  const labels: string[] = []

  if (filters.ano !== 'todos') {
    labels.push(`Ano ${filters.ano}`)
  }

  if (filters.formaPagamento !== 'todas') {
    labels.push(filters.formaPagamento)
  }

  if (filters.status !== 'todos') {
    labels.push(`Status ${filters.status}`)
  }

  return labels.length ? labels.join(' • ') : 'Base completa do cliente'
})

const overviewChips = computed(() => [
  `Código ${clientCode.value}`,
  `${summary.value.quantidadeCompras} compras visíveis`,
  `${summary.value.quantidadeParcelas} parcelas`,
  `Última compra ${formatDateBR(summary.value.ultimaCompra)}`,
])

const emptyMessage = computed(() => hasActiveFilters.value
  ? 'Nenhuma compra encontrada para os filtros aplicados.'
  : 'Nenhum dado disponível para montar o dashboard.')
</script>

<template>
  <main class="min-h-screen bg-[linear-gradient(180deg,#f8fafc_0%,#eef6f3_45%,#f8fafc_100%)] text-slate-950">
    <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <section class="relative overflow-hidden rounded-[2rem] border border-slate-200/70 bg-slate-950 px-6 py-8 text-white shadow-[0_40px_100px_-55px_rgba(15,23,42,0.9)] sm:px-8">
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.35),transparent_36%),radial-gradient(circle_at_bottom_right,rgba(56,189,248,0.22),transparent_28%)]" />

        <div class="relative flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div class="max-w-3xl">
            <p class="text-xs font-semibold uppercase tracking-[0.32em] text-emerald-200/80">
              Dashboard Financeiro
            </p>

            <h1 class="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              {{ clientName }}
            </h1>

            <p class="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
              Raio-x completo das compras, do crediário e do saldo em aberto do cliente,
              consolidando a base por lançamento para evitar duplicidade entre produto e parcela.
            </p>

            <div class="mt-5 flex flex-wrap gap-3">
              <span
                v-for="chip in overviewChips"
                :key="chip"
                class="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold text-slate-100 backdrop-blur"
              >
                {{ chip }}
              </span>
            </div>
          </div>

          <div class="grid gap-3 sm:grid-cols-2 xl:w-[26rem]">
            <div class="rounded-[1.5rem] border border-white/10 bg-white/5 p-4 backdrop-blur">
              <p class="text-xs font-semibold uppercase tracking-[0.24em] text-slate-300">
                Período da base
              </p>

              <p class="mt-2 text-lg font-semibold text-white">
                {{ baseRangeLabel }}
              </p>

              <p class="mt-2 text-sm leading-6 text-slate-300">
                Base carregada integralmente do Supabase com paginação.
              </p>
            </div>

            <div class="rounded-[1.5rem] border border-white/10 bg-white/5 p-4 backdrop-blur">
              <p class="text-xs font-semibold uppercase tracking-[0.24em] text-slate-300">
                Filtro atual
              </p>

              <p class="mt-2 text-base font-semibold text-white">
                {{ filterContext }}
              </p>

              <p class="mt-2 text-sm leading-6 text-slate-300">
                Os indicadores abaixo reagem instantaneamente a esse recorte.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        v-if="error"
        class="mt-6 rounded-[1.75rem] border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700"
      >
        Não foi possível carregar os dados do dashboard. Verifique a conexão com o Supabase.
      </section>

      <template v-else>
        <DashboardFilters
          class="mt-6"
          :years="availableYears"
          :payment-methods="availablePaymentMethods"
          :statuses="availableStatuses"
          :selected-year="filters.ano"
          :selected-payment-method="filters.formaPagamento"
          :selected-status="filters.status"
          :filtered-count="filteredSales.length"
          :has-active-filters="hasActiveFilters"
          @update:selected-year="filters.ano = $event"
          @update:selected-payment-method="filters.formaPagamento = $event"
          @update:selected-status="filters.status = $event"
          @reset="clearFilters"
        />

        <div
          v-if="requestStatus === 'pending'"
          class="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4"
        >
          <div
            v-for="placeholder in 4"
            :key="placeholder"
            class="h-40 animate-pulse rounded-[1.75rem] bg-slate-200/80"
          />
        </div>

        <div
          v-else-if="filteredSales.length"
          class="mt-6 space-y-6"
        >
          <section class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <DashboardMetricCard
              v-for="card in metricCards"
              :key="card.label"
              :label="card.label"
              :value="card.value"
              :description="card.description"
              :glow-class="card.glowClass"
            />
          </section>

          <section class="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
            <DashboardBreakdownPanel
              :title="periodTitle"
              :description="periodDescription"
              :items="periodBreakdown"
              empty-message="Não há compras suficientes para montar essa visão."
            />

            <DashboardBreakdownPanel
              title="Formas de pagamento"
              description="Peso financeiro de cada forma de pagamento no recorte atual."
              :items="paymentBreakdown"
              empty-message="Nenhuma forma de pagamento encontrada para esse recorte."
            />
          </section>

          <DashboardSalesTable :sales="filteredSales" />
        </div>

        <section
          v-else
          class="mt-6 rounded-[1.75rem] border border-slate-200/80 bg-white/90 px-6 py-12 text-center shadow-[0_28px_70px_-45px_rgba(15,23,42,0.45)]"
        >
          <h2 class="text-xl font-semibold tracking-tight text-slate-950">
            Nenhum resultado encontrado
          </h2>

          <p class="mt-3 text-sm leading-6 text-slate-600">
            {{ emptyMessage }}
          </p>
        </section>
      </template>
    </div>
  </main>
</template>
