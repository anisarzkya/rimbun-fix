<template>
    <div class="container" style="padding: 40px 0 60px">
        <div v-if="cart.items.length === 0" class="empty-state">
            <span class="material-icons icon">shopping_bag</span>
            <h3>Keranjang Anda kosong</h3>
            <router-link to="/shop" class="btn btn-primary">Mulai Belanja</router-link>
        </div>

        <div v-else class="cart-layout">
            <div class="cart-items">
                <div class="cart-item" v-for="item in cart.items" :key="item.id">
                    <img :src="item.image" :alt="item.name" class="cart-item-img" />
                    <div>
                        <h4>{{ item.name }}</h4>
                        <div v-currency="item.price"></div>
                    </div>
                    <div class="qty-control">
                        <button @click="cart.updateQty(item.id, item.qty - 1)">-</button>
                        <span>{{ item.qty }}</span>
                        <button @click="cart.updateQty(item.id, item.qty + 1)">+</button>
                    </div>
                    <button @click="cart.remove(item.id)"><span class="material-icons">delete</span></button>
                </div>
            </div>

            <div class="cart-summary">
                <h3>Ringkasan</h3>
                <div>Subtotal: <span v-currency="cart.subtotal"></span></div>
                <div>Ongkir: <span v-currency="cart.shipping"></span></div>
                <div>Total: <strong v-currency="cart.total"></strong></div>

                <!-- Form Checkout -->
                <form @submit.prevent="submitOrder" style="margin-top: 20px;">
                    <div class="form-group">
                        <label class="form-label">Nama Lengkap <span class="req">*</span></label>
                        <input v-model="form.name" class="form-input" :class="{ error: errors.name }" />
                        <div v-if="errors.name" class="form-error">{{ errors.name }}</div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Alamat Pengiriman <span class="req">*</span></label>
                        <input v-model="form.address" class="form-input" :class="{ error: errors.address }" />
                        <div v-if="errors.address" class="form-error">{{ errors.address }}</div>
                    </div>
                    <button type="submit" class="btn btn-primary btn-block" :disabled="submitting">
                        {{ submitting ? 'Memproses...' : 'Bayar Sekarang' }}
                    </button>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { cartStore } from '../stores/cartStore'
import { toastStore } from '../stores/toastStore'
import { transaksiStore } from '../stores/transaksiStore'
import { authStore } from '../stores/authStore'
import apiService from '../services/api'

const router = useRouter()
const cart = cartStore
const form = reactive({
    name: authStore.currentUser?.name || '',
    address: '',
})
const errors = reactive({})
const submitting = ref(false)

const validate = () => {
    Object.keys(errors).forEach(k => delete errors[k])
    if (!form.name.trim()) errors.name = 'Nama harus diisi'
    if (!form.address.trim()) errors.address = 'Alamat harus diisi'
    return Object.keys(errors).length === 0
}

// Integrasi API: submitOrder, lalu catat ke riwayat transaksi
const submitOrder = async () => {
    if (!validate()) return
    submitting.value = true
    try {
        const res = await apiService.submitOrder({ items: cart.items, customer: form })
        transaksiStore.addTransaksi({
            orderId: res.orderId,
            items: cart.items,
            customer: { ...form },
            subtotal: cart.subtotal,
            shipping: cart.shipping,
            total: cart.total,
            userEmail: authStore.currentUser?.email,
        })
        toastStore.add(`Pesanan ${res.orderId} berhasil!`, 'success')
        cart.clear()
        router.push('/transaksi')
    } catch (e) {
        toastStore.add('Gagal memproses pesanan', 'error')
    } finally {
        submitting.value = false
    }
}
</script>

<style scoped>
.cart-layout {
    display: grid;
    grid-template-columns: 1fr 380px;
    gap: 32px;
}

.cart-items {
    background: var(--surface);
    border-radius: var(--radius);
    border: 1px solid var(--border);
    padding: 20px;
}

.cart-item {
    display: grid;
    grid-template-columns: 80px 1fr auto auto;
    gap: 18px;
    align-items: center;
    padding-bottom: 16px;
    margin-bottom: 16px;
    border-bottom: 1px solid var(--border);
}

.cart-item-img {
    width: 80px;
    height: 80px;
    border-radius: 12px;
    object-fit: cover;
}

.qty-control {
    display: flex;
    gap: 8px;
    align-items: center;
    background: var(--bg);
    padding: 4px;
    border-radius: 999px;
}

.qty-control button {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    border: none;
    background: white;
    cursor: pointer;
}

.cart-summary {
    background: var(--surface);
    border-radius: var(--radius);
    border: 1px solid var(--border);
    padding: 24px;
    height: fit-content;
}
</style>