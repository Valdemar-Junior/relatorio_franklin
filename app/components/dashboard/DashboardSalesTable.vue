<script setup lang="ts">
import type { DashboardStatus, VendaFranklinSaleSummary } from '~/types/VendaFranklinDashboard'
import { formatCount, formatCurrencyBRL, formatDateBR } from '~/utils/formatters'

defineProps<{
  sales: VendaFranklinSaleSummary[]
}>()

function getStatusClasses(status: DashboardStatus): string {
  if (status === 'Quitado') {
    return 'bg-emerald-50 text-emerald-700 ring-emerald-200'
  }

  if (status === 'Parcial') {
    return 'bg-amber-50 text-amber-700 ring-amber-200'
  }

  if (status === 'Devolvido') {
    return 'bg-rose-50 text-rose-700 ring-rose-200'
  }

  if (status === 'Em aberto') {
    return 'bg-sky-50 text-sky-700 ring-sky-200'
  }

  return 'bg-slate-100 text-slate-600 ring-slate-200'
}
</script>

<template>
  <section class="rounded-[1.75rem] border border-slate-200/80 bg-white/90 shadow-[0_28px_70px_-45px_rgba(15,23,42,0.45)] backdrop-blur">
    <div class="border-b border-slate-200/80 px-6 py-5">
      <div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
            Compras consolidadas
          </p>

          <h2 class="mt-2 text-xl font-semibold tracking-tight text-slate-950">
            Histórico financeiro por lançamento
          </h2>
        </div>

        <span class="rounded-full bg-slate-950 px-3 py-1 text-xs font-semibold text-white">
          {{ formatCount(sales.length, 'compra', 'compras') }}
        </span>
      </div>
    </div>

    <div
      v-if="!sales.length"
      class="px-6 py-10 text-sm text-slate-500"
    >
      Nenhuma compra encontrada para o recorte atual.
    </div>

    <div
      v-else
      class="max-h-[44rem] overflow-y-auto"
    >
      <div class="divide-y divide-slate-200/80 lg:hidden">
        <article
          v-for="sale in sales"
          :key="sale.key"
          class="space-y-4 px-5 py-5"
        >
          <div class="flex items-start justify-between gap-4">
            <div>
              <p class="text-sm font-semibold text-slate-950">
                {{ formatDateBR(sale.dataVenda) }}
              </p>

              <p class="text-xs text-slate-500">
                Lançamento #{{ sale.numeroLancamento ?? 'Sem número' }}
              </p>
            </div>

            <span
              class="rounded-full px-3 py-1 text-xs font-semibold ring-1"
              :class="getStatusClasses(sale.statusPagamento)"
            >
              {{ sale.statusPagamento }}
            </span>
          </div>

          <div class="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p class="text-xs uppercase tracking-[0.18em] text-slate-500">
                Compra
              </p>

              <p class="mt-1 font-semibold text-slate-950">
                {{ formatCurrencyBRL(sale.valorCompra) }}
              </p>
            </div>

            <div>
              <p class="text-xs uppercase tracking-[0.18em] text-slate-500">
                Títulos gerados
              </p>

              <p class="mt-1 font-semibold text-slate-950">
                {{ formatCurrencyBRL(sale.titulosGerados) }}
              </p>
            </div>

            <div>
              <p class="text-xs uppercase tracking-[0.18em] text-slate-500">
                Pago
              </p>

              <p class="mt-1 font-semibold text-emerald-700">
                {{ formatCurrencyBRL(sale.valorPagoTitulos) }}
              </p>
            </div>

            <div>
              <p class="text-xs uppercase tracking-[0.18em] text-slate-500">
                Em aberto
              </p>

              <p class="mt-1 font-semibold text-rose-700">
                {{ formatCurrencyBRL(sale.valorPendenteTitulos) }}
              </p>
            </div>
          </div>

          <div class="space-y-2 text-sm text-slate-600">
            <p>{{ sale.formaPagamentoVenda }}</p>
            <p>{{ sale.operacao }}</p>
            <p>
              {{ formatCount(sale.parcelasGeradas, 'parcela', 'parcelas') }}
              • {{ formatCount(sale.contratosGerados, 'contrato', 'contratos') }}
            </p>
            <p v-if="sale.produtos.length">
              {{ sale.produtos.slice(0, 2).join(' • ') }}
            </p>
          </div>
        </article>
      </div>

      <div class="hidden overflow-x-auto lg:block">
        <table class="min-w-full border-collapse text-left">
          <thead class="sticky top-0 z-10 bg-slate-50/95 backdrop-blur">
            <tr class="text-xs uppercase tracking-[0.18em] text-slate-500">
              <th class="px-6 py-4 font-semibold">
                Compra
              </th>
              <th class="px-6 py-4 font-semibold">
                Forma de pagamento
              </th>
              <th class="px-6 py-4 font-semibold">
                Valor total
              </th>
              <th class="px-6 py-4 font-semibold">
                Títulos
              </th>
              <th class="px-6 py-4 font-semibold">
                Pago
              </th>
              <th class="px-6 py-4 font-semibold">
                Em aberto
              </th>
              <th class="px-6 py-4 font-semibold">
                Status
              </th>
            </tr>
          </thead>

          <tbody class="divide-y divide-slate-200/80">
            <tr
              v-for="sale in sales"
              :key="sale.key"
              class="align-top"
            >
              <td class="px-6 py-4">
                <p class="font-semibold text-slate-950">
                  {{ formatDateBR(sale.dataVenda) }}
                </p>

                <p class="mt-1 text-xs text-slate-500">
                  Lançamento #{{ sale.numeroLancamento ?? 'Sem número' }}
                </p>

                <p class="mt-2 max-w-sm text-sm text-slate-600">
                  {{ sale.produtos.slice(0, 2).join(' • ') || sale.operacao }}
                </p>
              </td>

              <td class="px-6 py-4 text-sm text-slate-700">
                <p>{{ sale.formaPagamentoVenda }}</p>

                <p class="mt-1 text-xs text-slate-500">
                  {{ sale.operacao }}
                </p>
              </td>

              <td class="px-6 py-4 text-sm font-semibold text-slate-950">
                {{ formatCurrencyBRL(sale.valorCompra) }}
              </td>

              <td class="px-6 py-4 text-sm text-slate-700">
                <p class="font-semibold text-slate-950">
                  {{ formatCurrencyBRL(sale.titulosGerados) }}
                </p>

                <p class="mt-1 text-xs text-slate-500">
                  {{ formatCount(sale.parcelasGeradas, 'parcela', 'parcelas') }}
                </p>
              </td>

              <td class="px-6 py-4 text-sm font-semibold text-emerald-700">
                {{ formatCurrencyBRL(sale.valorPagoTitulos) }}
              </td>

              <td class="px-6 py-4 text-sm font-semibold text-rose-700">
                {{ formatCurrencyBRL(sale.valorPendenteTitulos) }}
              </td>

              <td class="px-6 py-4">
                <span
                  class="rounded-full px-3 py-1 text-xs font-semibold ring-1"
                  :class="getStatusClasses(sale.statusPagamento)"
                >
                  {{ sale.statusPagamento }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>
