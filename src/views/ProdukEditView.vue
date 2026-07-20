<template>
    <div class="container form-page">
        <div class="form-card" v-fade-in v-if="!loading">
            <h1>Edit Produk Bunga</h1>
            <p class="sub">Perbarui detail produk</p>

            <form @submit.prevent="submit">
                <div class="form-group">
                    <label class="form-label">Nama Produk <span class="req">*</span></label>
                    <input v-model="form.name" class="form-input" :class="{ error: errors.name }" />
                    <div v-if="errors.name" class="form-error">{{ errors.name }}</div>
                </div>

                <div class="form-grid">
                    <div class="form-group">
                        <label class="form-label">Kategori <span class="req">*</span></label>
                        <select v-model="form.category" class="form-select">
                            <option value="Bouquet">Bouquet</option>
                            <option value="Vas">Vas</option>
                            <option value="Papan">Papan</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Warna</label>
                        <input v-model="form.color" class="form-input" />
                    </div>
                </div>

                <div class="form-grid">
                    <div class="form-group">
                        <label class="form-label">Harga (Rp) <span class="req">*</span></label>
                        <input v-model.number="form.price" type="number" min="0" class="form-input"
                            :class="{ error: errors.price }" />
                        <div v-if="errors.price" class="form-error">{{ errors.price }}</div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Stok <span class="req">*</span></label>
                        <input v-model.number="form.stock" type="number" min="0" class="form-input"
                            :class="{ error: errors.stock }" />
                        <div v-if="errors.stock" class="form-error">{{ errors.stock }}</div>
                    </div>
                </div>

                <div class="form-group">
                    <label class="form-label">URL Gambar <span class="req">*</span></label>
                    <input v-model="form.image" class="form-input" :class="{ error: errors.image }" />
                    <div v-if="errors.image" class="form-error">{{ errors.image }}</div>
                </div>

                <div class="form-group">
                    <label class="form-label">Deskripsi</label>
                    <textarea v-model="form.description" class="form-textarea"></textarea>
                </div>

                <div class="form-actions">
                    <router-link to="/kelola-produk" class="btn btn-outline">Batal</router-link>
                    <button type="submit" class="btn btn-primary" :disabled="productStore.loading">
                        <span v-if="productStore.loading" class="material-icons" style="animation: spin 0.8s linear infinite">refresh</span>
                        <span v-else class="material-icons">save</span>
                        {{ productStore.loading ? 'Menyimpan...' : 'Update Produk' }}
                    </button>
                </div>
            </form>
        </div>

        <div v-else class="loading-state">Memuat data produk...</div>
    </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { productStore } from '../stores/productStore'
import apiService from '../services/api'
import { toastStore } from '../stores/toastStore'

const route = useRoute()
const router = useRouter()

const loading = ref(true)
const form = reactive({
    name: '', category: 'Bouquet', price: 0, stock: 0, image: '', color: '', description: '',
})
const errors = reactive({})

// Ambil data existing dulu sebelum ditampilkan di form (pola sama seperti EditUser.vue di modul 17)
onMounted(async () => {
    try {
        const data = await apiService.getProductById(route.params.id)
        Object.assign(form, data)
    } catch (e) {
        toastStore.add('Produk tidak ditemukan', 'error')
        router.push('/kelola-produk')
    } finally {
        loading.value = false
    }
})

const validate = () => {
    Object.keys(errors).forEach(k => delete errors[k])
    if (!form.name.trim()) errors.name = 'Nama produk harus diisi'
    if (!form.price || form.price <= 0) errors.price = 'Harga harus lebih dari 0'
    if (form.stock === '' || form.stock < 0) errors.stock = 'Stok tidak boleh minus'
    if (!form.image.trim()) errors.image = 'URL gambar harus diisi'
    return Object.keys(errors).length === 0
}

// Integrasi API: Update produk (pola sama seperti updateUser() di modul 17)
const submit = async () => {
    if (!validate()) {
        toastStore.add('Periksa kembali isian Anda', 'error')
        return
    }
    try {
        await productStore.updateProduct(route.params.id, { ...form })
        toastStore.add('Produk berhasil diperbarui', 'success')
        router.push('/kelola-produk')
    } catch (e) {
        toastStore.add('Gagal memperbarui produk', 'error')
    }
}
</script>

<style scoped>
.form-page {
    display: flex;
    justify-content: center;
    padding: 50px 24px 90px;
}

.form-card {
    width: 100%;
    max-width: 560px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: 40px;
}

.form-card h1 {
    font-size: 26px;
    margin-bottom: 6px;
}

.sub {
    color: var(--text-muted);
    font-size: 14px;
    margin-bottom: 26px;
}

.loading-state {
    text-align: center;
    color: var(--text-muted);
    padding: 60px 0;
}

.form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
}

.form-group {
    margin-bottom: 18px;
}

.form-label {
    display: block;
    font-weight: 600;
    font-size: 14px;
    margin-bottom: 8px;
}

.form-label .req {
    color: var(--secondary);
}

.form-input,
.form-select,
.form-textarea {
    width: 100%;
    padding: 13px 16px;
    border: 1.5px solid var(--border);
    border-radius: 12px;
    font-family: inherit;
    font-size: 15px;
    background: var(--bg);
    transition: var(--transition);
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
    outline: none;
    border-color: var(--primary);
    background: white;
    box-shadow: 0 0 0 4px var(--primary-soft);
}

.form-input.error {
    border-color: var(--secondary);
    background: var(--secondary-soft);
}

.form-error {
    color: var(--secondary-dark);
    font-size: 13px;
    margin-top: 6px;
}

.form-textarea {
    min-height: 100px;
    resize: vertical;
}

.form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 10px;
}

@media (max-width: 600px) {
    .form-grid {
        grid-template-columns: 1fr;
    }
}
</style>
