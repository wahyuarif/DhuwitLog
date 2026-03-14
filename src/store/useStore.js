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
                const { accounts } = get()
                const acc = accounts.find(a => a.id === tx.accountId)
                if (!acc) return
                if (tx.type === 'expense' && acc.b < tx.amount) return 'insufficient'
                set({
                    transactions: [...get().transactions, { ...tx, id: Date.now(), date: new Date().toISOString() }],
                    accounts: accounts.map(a =>
                        a.id === tx.accountId
                            ? { ...a, b: tx.type === 'expense' ? a.b - tx.amount : a.b + tx.amount }
                            : a
                    ),
                })
                return 'success'
            },

            deleteTransaction: (id) => {
                const tx = get().transactions.find(t => t.id === id)
                if (!tx) return
                set({
                    transactions: get().transactions.filter(t => t.id !== id),
                    accounts: get().accounts.map(a =>
                        a.n === tx.account
                            ? { ...a, b: tx.type === 'expense' ? a.b + tx.amount : a.b - tx.amount }
                            : a
                    ),
                })
            },

            addAccount: (name) => {
                set({
                    accounts: [...get().accounts, { id: Date.now(), n: name, b: 0 }],
                })
            },

            getFiltered: () => {
                const { transactions, period } = get()
                const now = new Date()
                return transactions.filter(t => {
                    const d = new Date(t.date)
                    if (period === 'Hari ini') return d.toDateString() === now.toDateString()
                    if (period === 'Minggu ini') { const w = new Date(now); w.setDate(now.getDate() - 7); return d >= w }
                    if (period === 'Bulan ini') return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
                    if (period === 'Tahun ini') return d.getFullYear() === now.getFullYear()
                    return true
                })
            },
        }),
        { name: 'dhuwitlog-storage' }
    )
)