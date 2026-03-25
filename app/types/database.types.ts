export interface Database {
  public: {
    Tables: {
      venda_franklin: {
        Row: {
          id: number
          codigo_cliente: string | null
          cliente: string | null
          numero_lancamento: number | null
          data_venda: string | null
          operacao: string | null
          tipo_grupo_operacao: string | null
          forma_pagamento_venda: string | null
          tipo_pagamento_documento: string | null
          valor_entrada: number | null
          valor_financiado: number | null
          valor_acrescimos_venda: number | null
          valor_total_documento: number | null
          valor_total_venda_com_acrescimo: number | null
          valor_total_pago_titulos: number | null
          valor_total_pendente_titulos: number | null
          codigo_produto: string | null
          produto: string | null
          quantidade_produto: number | null
          valor_unitario_produto: number | null
          numero_titulo: string | null
          parcela: number | null
          data_emissao_titulo: string | null
          data_vencimento_titulo: string | null
          data_ultimo_pagamento: string | null
          valor_nominal_titulo: number | null
          valor_pago_titulo: number | null
          valor_pendente_titulo: number | null
          status_titulo: string | null
          created_at: string | null
        }
        Insert: {
          id?: never
          codigo_cliente?: string | null
          cliente?: string | null
          numero_lancamento?: number | null
          data_venda?: string | null
          operacao?: string | null
          tipo_grupo_operacao?: string | null
          forma_pagamento_venda?: string | null
          tipo_pagamento_documento?: string | null
          valor_entrada?: number | null
          valor_financiado?: number | null
          valor_acrescimos_venda?: number | null
          valor_total_documento?: number | null
          valor_total_venda_com_acrescimo?: number | null
          valor_total_pago_titulos?: number | null
          valor_total_pendente_titulos?: number | null
          codigo_produto?: string | null
          produto?: string | null
          quantidade_produto?: number | null
          valor_unitario_produto?: number | null
          numero_titulo?: string | null
          parcela?: number | null
          data_emissao_titulo?: string | null
          data_vencimento_titulo?: string | null
          data_ultimo_pagamento?: string | null
          valor_nominal_titulo?: number | null
          valor_pago_titulo?: number | null
          valor_pendente_titulo?: number | null
          status_titulo?: string | null
          created_at?: string | null
        }
        Update: {
          id?: never
          codigo_cliente?: string | null
          cliente?: string | null
          numero_lancamento?: number | null
          data_venda?: string | null
          operacao?: string | null
          tipo_grupo_operacao?: string | null
          forma_pagamento_venda?: string | null
          tipo_pagamento_documento?: string | null
          valor_entrada?: number | null
          valor_financiado?: number | null
          valor_acrescimos_venda?: number | null
          valor_total_documento?: number | null
          valor_total_venda_com_acrescimo?: number | null
          valor_total_pago_titulos?: number | null
          valor_total_pendente_titulos?: number | null
          codigo_produto?: string | null
          produto?: string | null
          quantidade_produto?: number | null
          valor_unitario_produto?: number | null
          numero_titulo?: string | null
          parcela?: number | null
          data_emissao_titulo?: string | null
          data_vencimento_titulo?: string | null
          data_ultimo_pagamento?: string | null
          valor_nominal_titulo?: number | null
          valor_pago_titulo?: number | null
          valor_pendente_titulo?: number | null
          status_titulo?: string | null
          created_at?: string | null
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
