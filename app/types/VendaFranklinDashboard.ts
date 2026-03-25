export type DashboardStatus =
  | 'Sem título'
  | 'Quitado'
  | 'Em aberto'
  | 'Parcial'
  | 'Devolvido'

export interface DashboardFilterState {
  ano: string
  formaPagamento: string
  status: DashboardStatus | 'todos'
}

export interface DashboardSummary {
  totalCompras: number
  totalPrazo: number
  totalPago: number
  totalEmAberto: number
  quantidadeCompras: number
  quantidadeParcelas: number
  quantidadeContratos: number
  ticketMedio: number
  ultimaCompra: string | null
}

export interface BreakdownItem {
  label: string
  amount: number
  count: number
  share: number
}

export interface VendaFranklinSaleSummary {
  key: string
  numeroLancamento: number | null
  dataVenda: string | null
  formaPagamentoVenda: string
  tipoPagamentoDocumento: string
  operacao: string
  valorCompra: number
  valorEntrada: number
  valorFinanciado: number
  valorAcrescimos: number
  titulosGerados: number
  valorPagoTitulos: number
  valorPendenteTitulos: number
  parcelasGeradas: number
  contratosGerados: number
  statusPagamento: DashboardStatus
  produtos: string[]
}
