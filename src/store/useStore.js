import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const demoTransactions = [
    { id: 1, type: 'income', amount: 6000000, cat: 'Gaji', note: 'Gaji Maret', account: 'Bank BCA', date: new Date(new Date().setDate(1)).toISOString() },
    { id: 2, type: 'expense', amount: 50000, cat: 'Makan', note: 'Makan siang warteg', account: 'Tunai', date: new Date().toISOString() },
    { id: 3, type: 'expense', amount: 25000, cat: 'Transport', note: 'GoJek ke kantor', account: 'GoPay', date: new Date().toISOString() },
    { id: 4, type: 'expense', amount: 200000, cat: 'Belanja', note: 'Alfamart mingguan', account: 'Bank BCA', date: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString() },
    { id: 5, type: 'expense', amount: 90000, cat: 'Makan', note: 'Makan malam bersama', account: 'Bank BCA', date: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString() },
    { id: 6, type: 'income', amount: 750000, cat: 'Freelance', note: 'Project UI design', account: 'Bank BCA', date: new Date(new Date().setDate(new Date().getDate() - 3)).toISOString() },
    { id: 7, type: 'expense', amount: 45000, cat: 'Hiburan', note: 'Netflix', account: 'Bank BCA', date: new Date(new Date().setDate(new Date().getDate() - 4)).toISOString() },
]

const demoAccounts = [
    { id: 1, n: 'Tunai', b: 500000 },
    { id: 2, n: 'Bank BCA', b: 3200000 },
    { id: 3, n: 'GoPay', b: 150000 },
    { id: 4, n: 'Tabungan', b: 5000000 },
]

export const useStore = create(
    persist(
        (set, get) => ({
            transactions: demoTransactions,
            accounts: demoAccounts,
            theme: '#3B5BDB',
            userName: 'Pengguna',
            period: 'Hari ini',

            setTheme: (theme) => set({ theme }),
            setUserName: (userName) => set({ userName }),
            setPeriod: (period) => set({ period }),

            addTransaction: (tx) => {
                const state = get()
                const acc = state.accounts.find(a => a.id === tx.accountId)
                if (!acc) return 'error'
                if (tx.type === 'expense' && acc.b < tx.amount) return 'insufficient'

                console.log('tx received:', tx) // ← tambah ini
                console.log('tx.date:', tx.date) // ← tambah ini

                const newTransaction = {
                    id: Date.now(),
                    type: tx.type,
                    amount: tx.amount,
                    cat: tx.cat,
                    note: tx.note,
                    account: tx.account,
                    date: tx.date || new Date().toISOString(),
                }
                console.log('newTransaction:', newTransaction) // ← tambah ini

                const updatedAccounts = state.accounts.map(a =>
                    a.id === tx.accountId
                        ? { ...a, b: tx.type === 'expense' ? a.b - tx.amount : a.b + tx.amount }
                        : a
                )

                set({
                    transactions: [...state.transactions, newTransaction],
                    accounts: updatedAccounts,
                })

                return 'success'
            },

            deleteTransaction: (id) => {
                const state = get()
                const tx = state.transactions.find(t => t.id === id)
                if (!tx) return

                const updatedAccounts = state.accounts.map(a =>
                    a.n === tx.account
                        ? { ...a, b: tx.type === 'expense' ? a.b + tx.amount : a.b - tx.amount }
                        : a
                )

                set({
                    transactions: state.transactions.filter(t => t.id !== id),
                    accounts: updatedAccounts,
                })
            },

            addAccount: (name) => {
                const state = get()
                set({
                    accounts: [...state.accounts, { id: Date.now(), n: name, b: 0 }],
                })
            },
        }),
        {
            name: 'dhuwitlog-storage',
        }
    )
)