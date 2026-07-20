<template>
    <div class="container" style="padding: 30px 0 60px" v-if="product">
        <div class="detail-grid">
            <div class="detail-gallery">
                <div class="detail-main-img"><img :src="product.image" :alt="product.name" /></div>
            </div>
            <div class="detail-info">
                <div class="detail-cat">{{ product.category }}</div>
                <h1 class="detail-title">{{ product.name }}</h1>
                <p class="detail-desc">{{ product.description }}</p>
                <div class="detail-price-row">
                    <span class="detail-price" v-currency="product.price"></span>
                    <span v-if="product.oldPrice" style="text-decoration: line-through; color: var(--text-muted);"
                        v-currency="product.oldPrice"></span>
                </div>
                <div class="detail-actions">
                    <button class="btn btn-outline" @click="addToCart"><span
                            class="material-icons">add_shopping_cart</span> Tambah Keranjang</button>
                    <button class="btn btn-primary" @click="buyNow">Beli Sekarang</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, onUpdated } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import apiService from '../services/api'
import { cartStore } from '../stores/cartStore'
import { toastStore } from '../stores/toastStore'

const route = useRoute()
const router = useRouter()
const product = ref(null)

const loadProduct = async () => {
    try {
        product.value = await apiService.getProductById(route.params.id)
    } catch (e) {
        toastStore.add(e.message, 'error')
        router.push('/shop')
    }
}

// Vue Object Cycles: onMounted & Watch
loadProduct() // Trigger awal
watch(() => route.params.id, loadProduct)

onUpdated(() => { console.log('Detail View Updated') })

const addToCart = () => { cartStore.add(product.value); toastStore.add('Ditambahkan ke keranjang', 'success') }
const buyNow = () => { cartStore.add(product.value); router.push('/cart') }
</script>

<style scoped>
.detail-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 56px;
}

.detail-main-img {
    aspect-ratio: 1;
    border-radius: var(--radius-lg);
    overflow: hidden;
    box-shadow: var(--shadow);
}

.detail-main-img img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.detail-cat {
    font-size: 13px;
    color: var(--secondary);
    font-weight: 700;
    text-transform: uppercase;
    margin-bottom: 10px;
}

.detail-title {
    font-size: 40px;
    font-weight: 700;
    margin-bottom: 14px;
}

.detail-desc {
    color: var(--text-muted);
    margin-bottom: 26px;
}

.detail-price-row {
    display: flex;
    align-items: baseline;
    gap: 14px;
    margin-bottom: 26px;
}

.detail-price {
    font-family: 'Fraunces', serif;
    font-size: 38px;
    font-weight: 700;
    color: var(--primary-dark);
}

.detail-actions {
    display: flex;
    gap: 14px;
}

@media (max-width: 768px) {
    .detail-grid {
        grid-template-columns: 1fr;
    }
}
</style>