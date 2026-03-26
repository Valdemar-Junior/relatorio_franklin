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
  <section class="dashboard-sales-table rounded-[1.75rem] border border-slate-200/80 bg-white/90 shadow-[0_28px_70px_-45px_rgba(15,23,42,0.45)] backdrop-blur">
    <div class="dashboard-sales-table__header border-b border-slate-200/80 px-6 py-5">
      <div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
            Compras consolidadas
          </p>

          <h2 class="mt-2 text-xl font-semibold tracking-tight text-slate-950">
            Histórico financeiro por lançamento
          </h2>
        </div>

        <span class="dashboard-sales-table__count rounded-full bg-slate-950 px-3 py-1 text-xs font-semibold text-white">
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
      class="dashboard-sales-table__scroll max-h-[44rem] overflow-y-auto"
    >
      <div class="dashboard-sales-table__mobile divide-y divide-slate-200/80 lg:hidden">
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

      <div class="dashboard-sales-table__desktop hidden overflow-x-auto lg:block">
        <table
          aria-hidden="true"
          class="dashboard-sales-table__print-head min-w-full border-collapse text-left"
        >
          <colgroup>
            <col class="dashboard-sales-table__col dashboard-sales-table__col--purchase">
            <col class="dashboard-sales-table__col dashboard-sales-table__col--payment">
            <col class="dashboard-sales-table__col dashboard-sales-table__col--amount">
            <col class="dashboard-sales-table__col dashboard-sales-table__col--titles">
            <col class="dashboard-sales-table__col dashboard-sales-table__col--paid">
            <col class="dashboard-sales-table__col dashboard-sales-table__col--open">
            <col class="dashboard-sales-table__col dashboard-sales-table__col--status">
          </colgroup>

          <thead>
            <tr>
              <th>Compra</th>
              <th>Forma de pagamento</th>
              <th>Valor total</th>
              <th>Titulos</th>
              <th>Pago</th>
              <th>Em aberto</th>
              <th>Status</th>
            </tr>
          </thead>
        </table>

        <table class="dashboard-sales-table__grid min-w-full border-collapse text-left">
          <colgroup>
            <col class="dashboard-sales-table__col dashboard-sales-table__col--purchase">
            <col class="dashboard-sales-table__col dashboard-sales-table__col--payment">
            <col class="dashboard-sales-table__col dashboard-sales-table__col--amount">
            <col class="dashboard-sales-table__col dashboard-sales-table__col--titles">
            <col class="dashboard-sales-table__col dashboard-sales-table__col--paid">
            <col class="dashboard-sales-table__col dashboard-sales-table__col--open">
            <col class="dashboard-sales-table__col dashboard-sales-table__col--status">
          </colgroup>

          <thead class="dashboard-sales-table__thead sticky top-0 z-10 bg-slate-50/95 backdrop-blur">
            <tr class="text-xs uppercase tracking-[0.18em] text-slate-500">
              <th class="dashboard-sales-table__column dashboard-sales-table__column--purchase px-6 py-4 font-semibold">
                Compra
              </th>
              <th class="dashboard-sales-table__column dashboard-sales-table__column--payment px-6 py-4 font-semibold">
                Forma de pagamento
              </th>
              <th class="dashboard-sales-table__column dashboard-sales-table__column--amount px-6 py-4 font-semibold">
                Valor total
              </th>
              <th class="dashboard-sales-table__column dashboard-sales-table__column--titles px-6 py-4 font-semibold">
                Títulos
              </th>
              <th class="dashboard-sales-table__column dashboard-sales-table__column--paid px-6 py-4 font-semibold">
                Pago
              </th>
              <th class="dashboard-sales-table__column dashboard-sales-table__column--open px-6 py-4 font-semibold">
                Em aberto
              </th>
              <th class="dashboard-sales-table__column dashboard-sales-table__column--status px-6 py-4 font-semibold">
                Status
              </th>
            </tr>
          </thead>

          <tbody class="divide-y divide-slate-200/80">
            <tr
              v-for="sale in sales"
              :key="sale.key"
              class="dashboard-sales-table__row align-top"
            >
              <td class="dashboard-sales-table__column dashboard-sales-table__column--purchase px-6 py-4">
                <p class="dashboard-sales-table__date font-semibold text-slate-950">
                  {{ formatDateBR(sale.dataVenda) }}
                </p>

                <p class="dashboard-sales-table__launch mt-1 text-xs text-slate-500">
                  Lançamento #{{ sale.numeroLancamento ?? 'Sem número' }}
                </p>

                <p class="dashboard-sales-table__description mt-2 max-w-sm text-sm text-slate-600">
                  {{ sale.produtos.slice(0, 2).join(' • ') || sale.operacao }}
                </p>
              </td>

              <td class="dashboard-sales-table__column dashboard-sales-table__column--payment px-6 py-4 text-sm text-slate-700">
                <p class="dashboard-sales-table__payment-method">
                  {{ sale.formaPagamentoVenda }}
                </p>

                <p class="dashboard-sales-table__operation mt-1 text-xs text-slate-500">
                  {{ sale.operacao }}
                </p>
              </td>

              <td class="dashboard-sales-table__column dashboard-sales-table__column--amount px-6 py-4 text-sm font-semibold text-slate-950">
                {{ formatCurrencyBRL(sale.valorCompra) }}
              </td>

              <td class="dashboard-sales-table__column dashboard-sales-table__column--titles px-6 py-4 text-sm text-slate-700">
                <p class="dashboard-sales-table__titles-amount font-semibold text-slate-950">
                  {{ formatCurrencyBRL(sale.titulosGerados) }}
                </p>

                <p class="dashboard-sales-table__titles-meta mt-1 text-xs text-slate-500">
                  {{ formatCount(sale.parcelasGeradas, 'parcela', 'parcelas') }}
                </p>
              </td>

              <td class="dashboard-sales-table__column dashboard-sales-table__column--paid px-6 py-4 text-sm font-semibold text-emerald-700">
                {{ formatCurrencyBRL(sale.valorPagoTitulos) }}
              </td>

              <td class="dashboard-sales-table__column dashboard-sales-table__column--open px-6 py-4 text-sm font-semibold text-rose-700">
                {{ formatCurrencyBRL(sale.valorPendenteTitulos) }}
              </td>

              <td class="dashboard-sales-table__column dashboard-sales-table__column--status px-6 py-4">
                <span
                  class="dashboard-sales-table__status rounded-full px-3 py-1 text-xs font-semibold ring-1"
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

<style>
.dashboard-sales-table__print-head {
  display: none;
}

@media print {
  @page {
    size: A4 landscape;
    margin: 8mm;
  }

  .dashboard-sales-table {
    border: none !important;
    border-radius: 0 !important;
    background: #fff !important;
    box-shadow: none !important;
    backdrop-filter: none !important;
  }

  .dashboard-sales-table__header {
    display: block !important;
    padding: 0 0 4mm !important;
    border-bottom-color: #cbd5e1 !important;
  }

  .dashboard-sales-table__count {
    border: 1px solid #cbd5e1 !important;
    background: #fff !important;
    color: #0f172a !important;
  }

  .dashboard-sales-table__scroll {
    max-height: none !important;
    overflow: visible !important;
  }

  .dashboard-sales-table__mobile {
    display: none !important;
  }

  .dashboard-sales-table__desktop {
    display: block !important;
    overflow: visible !important;
  }

  .dashboard-sales-table__print-head {
    display: table !important;
    width: 100% !important;
    min-width: 0 !important;
    table-layout: fixed;
    margin-bottom: 1mm;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .dashboard-sales-table__print-head thead {
    display: table-header-group !important;
  }

  .dashboard-sales-table__print-head tr {
    display: table-row !important;
  }

  .dashboard-sales-table__print-head th {
    display: table-cell !important;
    padding: 3mm 2mm !important;
    font-size: 9px !important;
    font-weight: 700 !important;
    letter-spacing: 0.14em !important;
    text-transform: uppercase;
    color: #0f172a !important;
    background: #e2e8f0 !important;
    border-top: 1px solid #cbd5e1 !important;
    border-bottom: 1px solid #cbd5e1 !important;
  }

  .dashboard-sales-table__grid {
    width: 100% !important;
    min-width: 0 !important;
    table-layout: fixed;
    font-size: 10px;
  }

  .dashboard-sales-table__grid thead {
    display: none !important;
  }

  .dashboard-sales-table__grid tr,
  .dashboard-sales-table__grid td,
  .dashboard-sales-table__grid th {
    break-inside: avoid;
    page-break-inside: avoid;
  }

  .dashboard-sales-table__grid td {
    padding: 2.5mm 2mm !important;
    line-height: 1.25 !important;
  }

  .dashboard-sales-table__col--purchase,
  .dashboard-sales-table__column--purchase {
    width: 28%;
  }

  .dashboard-sales-table__col--payment,
  .dashboard-sales-table__column--payment {
    width: 20%;
  }

  .dashboard-sales-table__col--amount,
  .dashboard-sales-table__col--titles,
  .dashboard-sales-table__column--amount,
  .dashboard-sales-table__column--titles {
    width: 12%;
  }

  .dashboard-sales-table__col--paid,
  .dashboard-sales-table__col--open,
  .dashboard-sales-table__column--paid,
  .dashboard-sales-table__column--open {
    width: 10%;
  }

  .dashboard-sales-table__col--status,
  .dashboard-sales-table__column--status {
    width: 8%;
  }

  .dashboard-sales-table__date,
  .dashboard-sales-table__titles-amount,
  .dashboard-sales-table__payment-method {
    font-size: 10px !important;
    line-height: 1.2 !important;
  }

  .dashboard-sales-table__launch,
  .dashboard-sales-table__operation,
  .dashboard-sales-table__titles-meta {
    margin-top: 1mm !important;
    font-size: 8px !important;
    line-height: 1.2 !important;
  }

  .dashboard-sales-table__description {
    margin-top: 1.5mm !important;
    max-width: none !important;
    font-size: 8.5px !important;
    line-height: 1.25 !important;
  }

  .dashboard-sales-table__status {
    display: inline-flex !important;
    justify-content: center;
    min-width: 0 !important;
    padding: 1mm 1.75mm !important;
    border-color: #cbd5e1 !important;
    background: transparent !important;
    color: #0f172a !important;
    box-shadow: none !important;
  }
}
</style>
