import { useSupabaseClient } from '#imports'

import type { Database } from '~/types/database.types'
import type { VendaFranklinRow } from '~/types/VendaFranklinRow'

const PAGE_SIZE = 500

export function useVendaFranklin() {
  const supabase = useSupabaseClient<Database>()

  const fetchTodasAsVendas = async (): Promise<VendaFranklinRow[]> => {
    const rows: VendaFranklinRow[] = []
    let from = 0

    while (true) {
      const to = from + PAGE_SIZE - 1
      const { data, error } = await supabase
        .from('venda_franklin')
        .select('*')
        .order('id', { ascending: true })
        .range(from, to)

      if (error) {
        throw error
      }

      if (!data?.length) {
        break
      }

      rows.push(...data)

      if (data.length < PAGE_SIZE) {
        break
      }

      from += PAGE_SIZE
    }

    return rows
  }

  return {
    fetchTodasAsVendas,
  }
}
