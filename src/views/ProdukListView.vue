<template>
    <div class="container" style="padding: 40px 0 60px">
        <div class="page-head">
            <div>
                <h1 style="font-size: 32px; margin-bottom: 6px">Kelola Produk Bunga</h1>
                <p style="color: var(--text-muted)">Tambah, ubah, atau hapus data produk toko</p>
            </div>
            <router-link to="/kelola-produk/tambah" class="btn btn-primary">
                <span class="material-icons">add</span> Tambah Produk
            </router-link>
        </div>

        <!-- Loading Indicator (pola sama seperti di modul 17) -->
        <div v-if="productStore.loading" class="loading-state">Memuat data produk...</div>

        <div v-else class="table-wrap">
            <table class="produk-table">
                <thead>
                    <tr>
                        <th>Gambar</th>
                        <th>Nama</th>
                        <th>Kategori</th>
                        <th>Harga</th>
                        <th>Stok</th>
                        <th>Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="p in productStore.list" :key="p.id">
                        <td><img :src="p.image" :alt="p.name" class="thumb" /></td>
                        <td>{{ p.name }}</td>
                        <td>{{ p.category }}</td>
                        <td v-currency="p.price"></td>
                        <td>
                            <span :class="{ 'stock-low': p.stock <= 5 }">{{ p.stock }}</span>
                        </td>
                        <td class="aksi">
                            <router-link :to="`/kelola-produk/edit/${p.id}`" class="btn-icon" aria-label="Edit">
                                <span class="material-icons">edit</span>
                            </router-link>
                            <button class="btn-icon danger" @click="handleDelete(p.id)" aria-label="Hapus">
                                <span class="material-icons">delete</span>
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>

            <div v-if="productStore.list.length === 0" class="empty-state">
                <span class="material-icons icon">local_florist</span>
                <h3>Belum ada produk</h3>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { productStore } from '../stores/productStore'
import { toastStore } from '../stores/toastStore'

// Loading data saat halaman diakses (pola sama seperti onMounted di modul 16)
onMounted(async () => {
    if (productStore.list.length === 0) {
        await productStore.fetchAll()
    }
})

// Fitur Hapus produk (pola sama seperti deleteUser() di modul 17, pakai confirm())
const handleDelete = async (id) => {
    if (!confirm('Yakin ingin menghapus produk ini?')) return
    try {
        await productStore.deleteProduct(id)
        toastStore.add('Produk berhasil dihapus', 'success')
    } catch (e) {
        toastStore.add('Gagal menghapus produk', 'error')
    }
}
</script>

<style scoped>
.page-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 28px;
    gap: 16px;
    flex-wrap: wrap;
}

.loading-state {
    text-align: center;
    color: var(--text-muted);
    padding: 40px 0;
}

.table-wrap {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    overflow-x: auto;
}

.produk-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 14px;
}

.produk-table th {
    text-align: left;
    padding: 16px;
    background: var(--bg-alt);
    font-weight: 700;
    white-space: nowrap;
}

.produk-table td {
    padding: 14px 16px;
    border-top: 1px solid var(--border);
    vertical-align: middle;
}

.thumb {
    width: 48px;
    height: 48px;
    border-radius: 10px;
    object-fit: cover;
}

.stock-low {
    color: var(--secondary-dark);
    font-weight: 700;
}

.aksi {
    display: flex;
    gap: 8px;
}

.btn-icon {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    display: grid;
    place-items: center;
    background: var(--bg-alt);
    color: var(--text);
    transition: var(--transition);
}

.btn-icon:hover {
    background: var(--primary-soft);
    color: var(--primary-dark);
}

.btn-icon.danger:hover {
    background: var(--secondary-soft);
    color: var(--secondary-dark);
}
</style>
