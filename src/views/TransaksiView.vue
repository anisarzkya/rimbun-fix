<template>
    <div class="container" style="padding: 40px 0 60px">
        <h1 style="font-size: 32px; margin-bottom: 8px">
            {{ auth.isOwner ? 'Semua Transaksi Toko' : 'Riwayat Transaksi' }}
        </h1>
        <p style="color: var(--text-muted); margin-bottom: 28px">
            {{ auth.isOwner ? 'Pantau seluruh pesanan yang masuk dari pembeli' : 'Semua pesanan yang pernah kamu buat' }}
        </p>

        <div v-if="myTransaksi.length === 0" class="empty-state">
            <span class="material-icons icon">receipt_long</span>
            <h3>Belum ada transaksi</h3>
            <router-link to="/shop" class="btn btn-primary">Mulai Belanja</router-link>
        </div>

        <div v-else class="transaksi-list">
            <div class="transaksi-card" v-for="t in myTransaksi" :key="t.id">
                <div class="transaksi-head">
                    <div>
                        <div class="order-id">{{ t.orderId }}</div>
                        <div class="order-date">{{ formatDate(t.createdAt) }}</div>
                    </div>
                    <span v-if="!auth.isOwner" class="status-badge" :class="statusClass(t.status)">{{ t.status }}</span>
                    <select v-else class="status-select" :class="statusClass(t.status)" :value="t.status"
                        @change="handleStatusChange(t.id, $event.target.value)">
                        <option value="Diproses">Diproses</option>
                        <option value="Selesai">Selesai</option>
                        <option value="Dibatalkan">Dibatalkan</option>
                    </select>
                </div>

                <div class="transaksi-items">
                    <div class="item-row" v-for="item in t.items" :key="item.id">
                        <img :src="item.image" :alt="item.name" />
                        <div>
                            <div class="item-name">{{ item.name }}</div>
                            <div class="item-qty">{{ item.qty }}x <span v-currency="item.price"></span></div>
                        </div>
                    </div>
                </div>

                <div class="transaksi-foot">
                    <div>
                        <div class="foot-label">Total Belanja</div>
                        <div class="foot-total" v-currency="t.total"></div>
                    </div>
                    <div class="foot-actions">
                        <button class="btn btn-outline" @click="toggleDetail(t.id)">
                            {{ expanded === t.id ? 'Tutup Detail' : 'Lihat Detail' }}
                        </button>
                        <button class="btn btn-danger" @click="handleDelete(t.id)">
                            <span class="material-icons">delete</span>
                        </button>
                    </div>
                </div>

                <!-- Detail Modal Sederhana (before/after style seperti log_aktivitas) -->
                <div v-if="expanded === t.id" class="transaksi-detail">
                    <div><strong>Nama Penerima:</strong> {{ t.customer.name }}</div>
                    <div><strong>Alamat:</strong> {{ t.customer.address }}</div>
                    <div><strong>Subtotal:</strong> <span v-currency="t.subtotal"></span></div>
                    <div><strong>Ongkir:</strong> <span v-currency="t.shipping"></span></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { transaksiStore } from '../stores/transaksiStore'
import { authStore } from '../stores/authStore'
import { toastStore } from '../stores/toastStore'

const expanded = ref(null)
const auth = authStore

// Pemilik toko lihat semua transaksi; pembeli cuma lihat transaksi miliknya sendiri
const myTransaksi = computed(() => {
    if (auth.isOwner) return transaksiStore.list
    return transaksiStore.byUser(auth.currentUser?.email)
})

const toggleDetail = (id) => {
    expanded.value = expanded.value === id ? null : id
}

const formatDate = (iso) => new Date(iso).toLocaleString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
})

const statusClass = (status) => ({
    'status-diproses': status === 'Diproses',
    'status-selesai': status === 'Selesai',
    'status-batal': status === 'Dibatalkan',
})

// Fitur Update status (khusus Pemilik Toko)
const handleStatusChange = (id, status) => {
    transaksiStore.updateStatus(id, status)
    toastStore.add(`Status pesanan diubah ke "${status}"`, 'success')
}

// Fitur Hapus riwayat (pola sama seperti deleteUser() di modul 17)
const handleDelete = (id) => {
    if (!confirm('Hapus riwayat transaksi ini?')) return
    transaksiStore.deleteTransaksi(id)
    toastStore.add('Riwayat transaksi dihapus', 'info')
}
</script>

<style scoped>
.transaksi-list {
    display: flex;
    flex-direction: column;
    gap: 20px;
    max-width: 720px;
}

.transaksi-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: 22px;
}

.transaksi-head {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 16px;
    padding-bottom: 16px;
    border-bottom: 1px solid var(--border);
}

.order-id {
    font-weight: 700;
    font-size: 16px;
}

.order-date {
    font-size: 13px;
    color: var(--text-muted);
    margin-top: 2px;
}

.status-badge {
    padding: 6px 14px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 700;
}

.status-select {
    padding: 6px 12px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 700;
    border: none;
    cursor: pointer;
    font-family: inherit;
}

.status-diproses {
    background: var(--accent-soft);
    color: #92660c;
}

.status-selesai {
    background: var(--primary-soft);
    color: var(--primary-dark);
}

.status-batal {
    background: var(--secondary-soft);
    color: var(--secondary-dark);
}

.transaksi-items {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 16px;
}

.item-row {
    display: flex;
    align-items: center;
    gap: 12px;
}

.item-row img {
    width: 48px;
    height: 48px;
    border-radius: 10px;
    object-fit: cover;
}

.item-name {
    font-weight: 600;
    font-size: 14px;
}

.item-qty {
    font-size: 13px;
    color: var(--text-muted);
}

.transaksi-foot {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 16px;
    border-top: 1px solid var(--border);
}

.foot-label {
    font-size: 12px;
    color: var(--text-muted);
}

.foot-total {
    font-weight: 700;
    font-size: 17px;
    color: var(--primary-dark);
}

.foot-actions {
    display: flex;
    gap: 8px;
}

.btn-danger {
    background: var(--secondary-soft);
    color: var(--secondary-dark);
}

.btn-danger:hover {
    background: var(--secondary);
    color: white;
}

.transaksi-detail {
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px dashed var(--border);
    display: flex;
    flex-direction: column;
    gap: 6px;
    font-size: 14px;
    color: var(--text-muted);
}
</style>
