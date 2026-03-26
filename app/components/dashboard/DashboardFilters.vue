<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

const props = defineProps<{
  years: string[]
  paymentMethods: string[]
  statuses: string[]
  selectedYear: string
  selectedPaymentMethods: string[]
  selectedStatus: string
  filteredCount: number
  hasActiveFilters: boolean
  canPrint: boolean
}>()

const emit = defineEmits<{
  'update:selectedYear': [value: string]
  'update:selectedPaymentMethods': [value: string[]]
  'update:selectedStatus': [value: string]
  reset: []
  print: []
}>()

const paymentDropdownRef = ref<HTMLElement | null>(null)
const isPaymentDropdownOpen = ref(false)
const paymentDropdownId = 'payment-methods-dropdown'

const selectedPaymentCount = computed(() => props.selectedPaymentMethods.length)
const hasSelectedPaymentMethods = computed(() => selectedPaymentCount.value > 0)

const paymentMethodSummary = computed(() => {
  if (!hasSelectedPaymentMethods.value) {
    return 'Todas as formas'
  }

  if (selectedPaymentCount.value === 1) {
    return props.selectedPaymentMethods[0]
  }

  return `${selectedPaymentCount.value} formas selecionadas`
})

const paymentMethodHint = computed(() => {
  if (!hasSelectedPaymentMethods.value) {
    return 'Sem restricao: todas as formas entram no recorte'
  }

  if (selectedPaymentCount.value === 1) {
    return '1 forma marcada'
  }

  return `${selectedPaymentCount.value} formas marcadas`
})

const paymentMethodFooterMessage = computed(() => {
  if (!hasSelectedPaymentMethods.value) {
    return 'Todas as formas disponiveis serao consideradas.'
  }

  return selectedPaymentCount.value === 1
    ? '1 forma de pagamento selecionada.'
    : `${selectedPaymentCount.value} formas de pagamento selecionadas.`
})

function closePaymentDropdown(): void {
  isPaymentDropdownOpen.value = false
}

function togglePaymentDropdown(): void {
  isPaymentDropdownOpen.value = !isPaymentDropdownOpen.value
}

function isPaymentMethodSelected(paymentMethod: string): boolean {
  return props.selectedPaymentMethods.includes(paymentMethod)
}

function updateSelectedPaymentMethods(nextPaymentMethods: string[]): void {
  emit('update:selectedPaymentMethods', nextPaymentMethods)
}

function clearPaymentMethods(): void {
  updateSelectedPaymentMethods([])
}

function selectAllPaymentMethods(): void {
  updateSelectedPaymentMethods([...props.paymentMethods])
}

function togglePaymentMethod(paymentMethod: string): void {
  const nextPaymentMethods = isPaymentMethodSelected(paymentMethod)
    ? props.selectedPaymentMethods.filter((currentPaymentMethod) => currentPaymentMethod !== paymentMethod)
    : [...props.selectedPaymentMethods, paymentMethod]

  updateSelectedPaymentMethods(nextPaymentMethods)
}

function handlePointerDown(event: PointerEvent): void {
  if (!paymentDropdownRef.value) {
    return
  }

  const eventTarget = event.target

  if (eventTarget instanceof Node && !paymentDropdownRef.value.contains(eventTarget)) {
    closePaymentDropdown()
  }
}

function handleEscape(event: KeyboardEvent): void {
  if (event.key === 'Escape') {
    closePaymentDropdown()
  }
}

onMounted(() => {
  document.addEventListener('pointerdown', handlePointerDown)
  document.addEventListener('keydown', handleEscape)
})

onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', handlePointerDown)
  document.removeEventListener('keydown', handleEscape)
})
</script>

<template>
  <section class="dashboard-filters rounded-[1.75rem] border border-slate-200/80 bg-white/90 p-5 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.35)] backdrop-blur sm:p-6">
    <div class="flex flex-col gap-6">
      <div class="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div class="max-w-2xl">
          <p class="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
            Filtros
          </p>

          <h2 class="mt-2 text-xl font-semibold tracking-tight text-slate-950 sm:text-[1.38rem]">
            Recorte do dashboard
          </h2>

          <p class="mt-1 text-sm leading-6 text-slate-600">
            Filtre por ano, forma de pagamento e status financeiro das compras.
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-2 xl:justify-end">
          <span class="inline-flex h-10 items-center rounded-full bg-slate-950 px-4 text-xs font-semibold tracking-[0.02em] text-white">
            {{ filteredCount }} compras visiveis
          </span>

          <button
            v-if="canPrint"
            type="button"
            class="inline-flex h-10 items-center justify-center rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white transition hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 focus-visible:ring-offset-2"
            @click="emit('print')"
          >
            Imprimir PDF
          </button>

          <button
            type="button"
            class="inline-flex h-10 items-center justify-center rounded-xl border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40"
            :disabled="!hasActiveFilters"
            @click="emit('reset')"
          >
            Limpar filtros
          </button>
        </div>
      </div>

      <div
        ref="paymentDropdownRef"
        class="space-y-4"
      >
        <div class="grid gap-4 xl:grid-cols-[15rem_minmax(0,1fr)_15rem]">
          <label class="space-y-2">
            <span class="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Ano</span>

            <div class="relative">
              <select
                class="h-14 w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50 px-4 pr-11 text-sm font-medium text-slate-900 outline-none transition focus:border-emerald-400 focus:bg-white"
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

              <svg
                class="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-slate-400"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M5 7.5L10 12.5L15 7.5"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.8"
                />
              </svg>
            </div>
          </label>

          <div class="space-y-2">
            <span class="block text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Forma de pagamento</span>

            <button
              type="button"
              class="flex h-14 w-full items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-left transition hover:border-slate-300 hover:bg-white focus:border-sky-400 focus:bg-white focus:outline-none"
              :aria-controls="paymentDropdownId"
              :aria-expanded="isPaymentDropdownOpen"
              aria-haspopup="dialog"
              @click="togglePaymentDropdown"
            >
              <span class="min-w-0">
                <span class="block truncate text-sm font-medium text-slate-950">
                  {{ paymentMethodSummary }}
                </span>

                <span class="mt-1 block truncate text-xs text-slate-500">
                  {{ paymentMethodHint }}
                </span>
              </span>

              <span class="grid size-8 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-500">
                <svg
                  class="h-4 w-4 transition"
                  :class="{ 'rotate-180': isPaymentDropdownOpen }"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M5 7.5L10 12.5L15 7.5"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.8"
                  />
                </svg>
              </span>
            </button>
          </div>

          <label class="space-y-2">
            <span class="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Status</span>

            <div class="relative">
              <select
                class="h-14 w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50 px-4 pr-11 text-sm font-medium text-slate-900 outline-none transition focus:border-amber-400 focus:bg-white"
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

              <svg
                class="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-slate-400"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M5 7.5L10 12.5L15 7.5"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.8"
                />
              </svg>
            </div>
          </label>
        </div>

        <div
          v-if="isPaymentDropdownOpen"
          :id="paymentDropdownId"
          class="rounded-2xl border border-slate-200 bg-white shadow-[0_26px_60px_-34px_rgba(15,23,42,0.42)]"
        >
          <div class="flex flex-col gap-3 border-b border-slate-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p class="text-sm font-semibold text-slate-950">
                Forma de pagamento
              </p>

              <p class="text-xs text-slate-500">
                Selecione uma ou mais opcoes.
              </p>
            </div>

            <div class="flex items-center gap-2">
              <button
                type="button"
                class="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40"
                :disabled="selectedPaymentCount === paymentMethods.length || paymentMethods.length === 0"
                @click="selectAllPaymentMethods"
              >
                Selecionar todas
              </button>

              <button
                type="button"
                class="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40"
                :disabled="selectedPaymentCount === 0"
                @click="clearPaymentMethods"
              >
                Limpar
              </button>
            </div>
          </div>

          <div class="max-h-72 overflow-y-auto p-2">
            <div class="grid gap-1 sm:grid-cols-2 xl:grid-cols-3">
              <label
                v-for="paymentMethod in paymentMethods"
                :key="paymentMethod"
                class="flex cursor-pointer items-start gap-3 rounded-xl border px-3 py-2 transition"
                :class="isPaymentMethodSelected(paymentMethod)
                  ? 'border-slate-300 bg-slate-100/80'
                  : 'border-transparent hover:border-slate-200 hover:bg-slate-50'"
              >
                <input
                  type="checkbox"
                  class="mt-0.5 size-4 rounded border-slate-300 text-slate-950 focus:ring-slate-950"
                  :checked="isPaymentMethodSelected(paymentMethod)"
                  @change="togglePaymentMethod(paymentMethod)"
                >

                <span class="min-w-0 text-sm leading-5 text-slate-700">
                  {{ paymentMethod }}
                </span>
              </label>
            </div>

            <p
              v-if="paymentMethods.length === 0"
              class="px-3 py-5 text-center text-sm text-slate-500"
            >
              Nenhuma forma de pagamento encontrada.
            </p>
          </div>

          <div class="flex flex-col gap-2 border-t border-slate-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <p class="text-xs text-slate-500">
              {{ paymentMethodFooterMessage }}
            </p>

            <button
              type="button"
              class="inline-flex h-8 items-center justify-center self-end rounded-lg bg-slate-900 px-3 text-xs font-semibold text-white transition hover:bg-slate-800 sm:self-auto"
              @click="closePaymentDropdown"
            >
              Concluir
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
@media print {
  .dashboard-filters {
    display: none !important;
  }
}
</style>
