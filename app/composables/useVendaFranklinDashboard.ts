import { computed, reactive } from 'vue'
import type { Ref } from 'vue'

import type {
  BreakdownItem,
  DashboardFilterState,
  DashboardStatus,
  DashboardSummary,
  VendaFranklinSaleSummary,
} from '~/types/VendaFranklinDashboard'
import type { VendaFranklinRow } from '~/types/VendaFranklinRow'
import {
  getMonthKey,
  getMonthLabel,
  getTimestamp,
  getYearFromDate,
  normalizeText,
  toNumber,
} from '~/utils/formatters'

type MutableSale = VendaFranklinSaleSummary & {
  contractSet: Set<string>
  installmentSet: Set<string>
  productSet: Set<string>
  rawStatusSet: Set<string>
}

function createSaleKey(row: VendaFranklinRow): string {
  return row.numero_lancamento !== null ? String(row.numero_lancamento) : `linha-${row.id}`
}

function getSaleAmount(row: VendaFranklinRow): number {
  const totalComAcrescimo = toNumber(row.valor_total_venda_com_acrescimo)

  if (totalComAcrescimo > 0) {
    return totalComAcrescimo
  }

  return toNumber(row.valor_total_documento)
}

function hasInstallmentData(row: VendaFranklinRow): boolean {
  return row.numero_titulo !== null
    || row.parcela !== null
    || row.data_emissao_titulo !== null
    || row.data_vencimento_titulo !== null
    || row.data_ultimo_pagamento !== null
    || row.status_titulo !== null
    || toNumber(row.valor_nominal_titulo) > 0
    || toNumber(row.valor_pago_titulo) > 0
    || toNumber(row.valor_pendente_titulo) > 0
}

function createInstallmentKey(row: VendaFranklinRow): string | null {
  if (!hasInstallmentData(row)) {
    return null
  }

  return [
    createSaleKey(row),
    row.numero_titulo ?? 'sem-titulo',
    row.parcela ?? 0,
  ].join('|')
}

function createProductLabel(row: VendaFranklinRow): string {
  const productCode = normalizeText(row.codigo_produto, '')
  const productName = normalizeText(row.produto, '')

  if (productCode && productName) {
    return `${productCode} - ${productName}`
  }

  return productCode || productName
}

function createEmptySale(row: VendaFranklinRow, key: string): MutableSale {
  return {
    key,
    numeroLancamento: row.numero_lancamento,
    dataVenda: row.data_venda,
    formaPagamentoVenda: normalizeText(row.forma_pagamento_venda),
    tipoPagamentoDocumento: normalizeText(row.tipo_pagamento_documento),
    operacao: normalizeText(row.operacao),
    valorCompra: getSaleAmount(row),
    valorEntrada: toNumber(row.valor_entrada),
    valorFinanciado: toNumber(row.valor_financiado),
    valorAcrescimos: toNumber(row.valor_acrescimos_venda),
    titulosGerados: 0,
    valorPagoTitulos: 0,
    valorPendenteTitulos: 0,
    parcelasGeradas: 0,
    contratosGerados: 0,
    statusPagamento: 'Sem título',
    produtos: [],
    contractSet: new Set<string>(),
    installmentSet: new Set<string>(),
    productSet: new Set<string>(),
    rawStatusSet: new Set<string>(),
  }
}

function deriveSaleStatus(sale: MutableSale): DashboardStatus {
  if (sale.rawStatusSet.has('devolvido')) {
    return 'Devolvido'
  }

  if (sale.parcelasGeradas === 0) {
    return 'Sem título'
  }

  if (sale.valorPagoTitulos > 0 && sale.valorPendenteTitulos > 0) {
    return 'Parcial'
  }

  if (sale.valorPendenteTitulos <= 0 && sale.valorPagoTitulos > 0) {
    return 'Quitado'
  }

  return 'Em aberto'
}

function aggregateSales(rows: VendaFranklinRow[]): VendaFranklinSaleSummary[] {
  const salesMap = new Map<string, MutableSale>()

  for (const row of rows) {
    const saleKey = createSaleKey(row)
    const existingSale = salesMap.get(saleKey) ?? createEmptySale(row, saleKey)

    existingSale.numeroLancamento = existingSale.numeroLancamento ?? row.numero_lancamento
    existingSale.dataVenda = existingSale.dataVenda ?? row.data_venda
    existingSale.formaPagamentoVenda = existingSale.formaPagamentoVenda === 'Não informado'
      ? normalizeText(row.forma_pagamento_venda)
      : existingSale.formaPagamentoVenda
    existingSale.tipoPagamentoDocumento = existingSale.tipoPagamentoDocumento === 'Não informado'
      ? normalizeText(row.tipo_pagamento_documento)
      : existingSale.tipoPagamentoDocumento
    existingSale.operacao = existingSale.operacao === 'Não informado'
      ? normalizeText(row.operacao)
      : existingSale.operacao
    existingSale.valorCompra = Math.max(existingSale.valorCompra, getSaleAmount(row))
    existingSale.valorEntrada = Math.max(existingSale.valorEntrada, toNumber(row.valor_entrada))
    existingSale.valorFinanciado = Math.max(existingSale.valorFinanciado, toNumber(row.valor_financiado))
    existingSale.valorAcrescimos = Math.max(existingSale.valorAcrescimos, toNumber(row.valor_acrescimos_venda))

    const productLabel = createProductLabel(row)

    if (productLabel) {
      existingSale.productSet.add(productLabel)
    }

    const installmentKey = createInstallmentKey(row)

    if (installmentKey && !existingSale.installmentSet.has(installmentKey)) {
      existingSale.installmentSet.add(installmentKey)
      existingSale.parcelasGeradas += 1
      existingSale.titulosGerados += toNumber(row.valor_nominal_titulo)
      existingSale.valorPagoTitulos += toNumber(row.valor_pago_titulo)
      existingSale.valorPendenteTitulos += toNumber(row.valor_pendente_titulo)

      if (row.numero_titulo) {
        existingSale.contractSet.add(String(row.numero_titulo))
      }

      const rawStatus = normalizeText(row.status_titulo, '').toLowerCase()

      if (rawStatus) {
        existingSale.rawStatusSet.add(rawStatus)
      }
    }

    salesMap.set(saleKey, existingSale)
  }

  return [...salesMap.values()]
    .map((sale) => ({
      key: sale.key,
      numeroLancamento: sale.numeroLancamento,
      dataVenda: sale.dataVenda,
      formaPagamentoVenda: sale.formaPagamentoVenda,
      tipoPagamentoDocumento: sale.tipoPagamentoDocumento,
      operacao: sale.operacao,
      valorCompra: sale.valorCompra,
      valorEntrada: sale.valorEntrada,
      valorFinanciado: sale.valorFinanciado,
      valorAcrescimos: sale.valorAcrescimos,
      titulosGerados: sale.titulosGerados,
      valorPagoTitulos: sale.valorPagoTitulos,
      valorPendenteTitulos: sale.valorPendenteTitulos,
      parcelasGeradas: sale.parcelasGeradas,
      contratosGerados: sale.contractSet.size,
      statusPagamento: deriveSaleStatus(sale),
      produtos: [...sale.productSet],
    }))
    .sort((currentSale, nextSale) => {
      const dateDifference = getTimestamp(nextSale.dataVenda) - getTimestamp(currentSale.dataVenda)

      if (dateDifference !== 0) {
        return dateDifference
      }

      return (nextSale.numeroLancamento ?? 0) - (currentSale.numeroLancamento ?? 0)
    })
}

function createSummary(sales: VendaFranklinSaleSummary[]): DashboardSummary {
  const totalCompras = sales.reduce((total, sale) => total + sale.valorCompra, 0)
  const totalPrazo = sales.reduce((total, sale) => total + sale.titulosGerados, 0)
  const totalPago = sales.reduce((total, sale) => total + sale.valorPagoTitulos, 0)
  const totalEmAberto = sales.reduce((total, sale) => total + sale.valorPendenteTitulos, 0)
  const quantidadeCompras = sales.length
  const quantidadeParcelas = sales.reduce((total, sale) => total + sale.parcelasGeradas, 0)
  const quantidadeContratos = sales.reduce((total, sale) => total + sale.contratosGerados, 0)

  return {
    totalCompras,
    totalPrazo,
    totalPago,
    totalEmAberto,
    quantidadeCompras,
    quantidadeParcelas,
    quantidadeContratos,
    ticketMedio: quantidadeCompras > 0 ? totalCompras / quantidadeCompras : 0,
    ultimaCompra: sales[0]?.dataVenda ?? null,
  }
}

function createBreakdown(
  sales: VendaFranklinSaleSummary[],
  labelResolver: (sale: VendaFranklinSaleSummary) => string,
): BreakdownItem[] {
  const breakdownMap = new Map<string, { amount: number, count: number, label: string }>()
  const totalAmount = sales.reduce((total, sale) => total + sale.valorCompra, 0)

  for (const sale of sales) {
    const label = labelResolver(sale)
    const currentItem = breakdownMap.get(label) ?? { label, amount: 0, count: 0 }

    currentItem.amount += sale.valorCompra
    currentItem.count += 1

    breakdownMap.set(label, currentItem)
  }

  return [...breakdownMap.values()]
    .map((item) => ({
      ...item,
      share: totalAmount > 0 ? item.amount / totalAmount : 0,
    }))
    .sort((currentItem, nextItem) => nextItem.amount - currentItem.amount)
}

function createPeriodBreakdown(sales: VendaFranklinSaleSummary[], selectedYear: string): BreakdownItem[] {
  if (selectedYear === 'todos') {
    return createBreakdown(sales, (sale) => getYearFromDate(sale.dataVenda) ?? 'Sem data')
      .sort((currentItem, nextItem) => {
        const currentYear = Number(currentItem.label)
        const nextYear = Number(nextItem.label)

        if (Number.isNaN(currentYear)) {
          return 1
        }

        if (Number.isNaN(nextYear)) {
          return -1
        }

        return nextYear - currentYear
      })
  }

  const monthItems = createBreakdown(
    sales.filter((sale) => getYearFromDate(sale.dataVenda) === selectedYear),
    (sale) => getMonthKey(sale.dataVenda) ?? 'Sem data',
  )

  return monthItems
    .sort((currentItem, nextItem) => currentItem.label.localeCompare(nextItem.label, 'pt-BR'))
    .map((item) => ({
      ...item,
      label: item.label === 'Sem data' ? item.label : getMonthLabel(item.label),
    }))
}

function matchesSelectedPaymentMethods(sale: VendaFranklinSaleSummary, selectedPaymentMethods: string[]): boolean {
  return selectedPaymentMethods.length === 0 || selectedPaymentMethods.includes(sale.formaPagamentoVenda)
}

function matchesFilters(sale: VendaFranklinSaleSummary, filters: DashboardFilterState): boolean {
  const saleYear = getYearFromDate(sale.dataVenda)

  return (filters.ano === 'todos' || saleYear === filters.ano)
    && matchesSelectedPaymentMethods(sale, filters.formaPagamento)
    && (filters.status === 'todos' || sale.statusPagamento === filters.status)
}

function matchesComparisonFilters(sale: VendaFranklinSaleSummary, filters: DashboardFilterState): boolean {
  return matchesSelectedPaymentMethods(sale, filters.formaPagamento)
    && (filters.status === 'todos' || sale.statusPagamento === filters.status)
}

export function useVendaFranklinDashboard(rows: Ref<VendaFranklinRow[] | null | undefined>) {
  const filters = reactive<DashboardFilterState>({
    ano: 'todos',
    formaPagamento: [],
    status: 'todos',
  })

  const sales = computed(() => aggregateSales(rows.value ?? []))

  const clientName = computed(() => normalizeText(rows.value?.find((row) => row.cliente)?.cliente, 'Cliente'))
  const clientCode = computed(() => normalizeText(rows.value?.find((row) => row.codigo_cliente)?.codigo_cliente, 'Sem código'))

  const availableYears = computed(() => {
    const years = sales.value
      .map((sale) => getYearFromDate(sale.dataVenda))
      .filter((year): year is string => Boolean(year))

    return [...new Set(years)].sort((currentYear, nextYear) => Number(nextYear) - Number(currentYear))
  })

  const availablePaymentMethods = computed(() => {
    const paymentMethods = sales.value.map((sale) => sale.formaPagamentoVenda)

    return [...new Set(paymentMethods)].sort((currentMethod, nextMethod) => currentMethod.localeCompare(nextMethod, 'pt-BR'))
  })

  const availableStatuses = computed(() => {
    const statusOrder: DashboardStatus[] = ['Sem título', 'Em aberto', 'Parcial', 'Quitado', 'Devolvido']
    const statuses = new Set(sales.value.map((sale) => sale.statusPagamento))

    return statusOrder.filter((status) => statuses.has(status))
  })

  const filteredSales = computed(() => sales.value.filter((sale) => matchesFilters(sale, filters)))
  const summary = computed(() => createSummary(filteredSales.value))
  const paymentBreakdown = computed(() => createBreakdown(filteredSales.value, (sale) => sale.formaPagamentoVenda))
  const comparisonSales = computed(() => sales.value.filter((sale) => matchesComparisonFilters(sale, filters)))
  const periodBreakdown = computed(() => createPeriodBreakdown(comparisonSales.value, filters.ano))

  const periodTitle = computed(() => filters.ano === 'todos' ? 'Compras por ano' : `Compras em ${filters.ano} por mês`)

  const periodDescription = computed(() => filters.ano === 'todos'
    ? 'Visão anual do volume financeiro do cliente.'
    : `Distribuição mensal das compras dentro de ${filters.ano}.`)

  const hasActiveFilters = computed(() => filters.ano !== 'todos'
    || filters.formaPagamento.length > 0
    || filters.status !== 'todos')

  function clearFilters() {
    filters.ano = 'todos'
    filters.formaPagamento = []
    filters.status = 'todos'
  }

  return {
    filters,
    clientName,
    clientCode,
    sales,
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
  }
}
