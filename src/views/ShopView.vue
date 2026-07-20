<template>
    <div class="container" style="padding: 40px 0 60px">
        <h1 style="font-size: 38px; margin-bottom: 20px">Belanja Bunga</h1>
        <div class="shop-layout">
            <aside class="shop-sidebar">
                <!-- Fitur Search lokal -->
                <div class="filter-group">
                    <div class="filter-title">Cari Produk</div>
                    <div class="search-field">
                        <span class="material-icons">search</span>
                        <input v-model="searchQuery" type="text" placeholder="Nama bunga..." />
                        <button v-if="searchQuery" class="clear-btn" @click="searchQuery = ''" aria-label="Hapus pencarian">
                            <span class="material-icons">close</span>
                        </button>
                    </div>
                </div>

                <div class="filter-group">
                    <div class="filter-title">Kategori</div>
                    <div class="cat-list">
                        <div class="cat-item" :class="{ active: selectedCat === 'all' }" @click="selectedCat = 'all'">
                            Semua Produk</div>
                        <div v-for="c in productStore.getCategories()" :key="c.name" class="cat-item"
                            :class="{ active: selectedCat === c.name }" @click="selectedCat = c.name">
                            {{ c.name }} ({{ c.count }})
                        </div>
                    </div>
                </div>
            </aside>

            <div class="shop-main">
                <p v-if="searchQuery" class="search-result-info">
                    Menampilkan hasil untuk "<strong>{{ searchQuery }}</strong>" ({{ filtered.length }} produk)
                </p>
                <!-- List Rendering with v-for -->
                <div class="product-grid" v-if="filtered.length">
                    <ProductCard v-for="p in filtered" :key="p.id" :product="p" @add-to-cart="handleAdd"
                        @view-detail="goDetail" @toggle-fav="handleFav" />
                </div>
                <div v-else class="empty-state">
                    <span class="material-icons icon">search_off</span>
                    <h3>Tidak ada produk ditemukan</h3>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import ProductCard from '../components/ProductCard.vue'
import { productStore } from '../stores/productStore'
import { cartStore } from '../stores/cartStore'
import { toastStore } from '../stores/toastStore'
import { favoriteStore } from '../stores/favoriteStore'

const router = useRouter()
const route = useRoute()
const selectedCat = ref('all')
// Fitur Search: terisi otomatis jika datang dari query ?q= (misal dari Navbar)
const searchQuery = ref(route.query.q || '')

// Sinkronkan jika query berubah (misal user search lagi dari Navbar)
watch(() => route.query.q, (val) => {
    searchQuery.value = val || ''
})

const filtered = computed(() => {
    let list = productStore.list

    if (selectedCat.value !== 'all') {
        list = list.filter(p => p.category === selectedCat.value)
    }

    if (searchQuery.value.trim()) {
        const q = searchQuery.value.trim().toLowerCase()
        list = list.filter(p =>
            p.name.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q)
        )
    }

    return list
})

const handleAdd = (product) => { cartStore.add(product); toastStore.add('Ditambahkan ke keranjang', 'success') }
const goDetail = (product) => router.push(`/product/${product.id}`)
const handleFav = (product) => { favoriteStore.toggle(product.id); toastStore.add('Favorit diperbarui', 'info') }
</script>

<style scoped>
.search-field {
    display: flex;
    align-items: center;
    gap: 8px;
    background: var(--bg);
    border: 1.5px solid var(--border);
    border-radius: 12px;
    padding: 10px 14px;
    transition: var(--transition);
}

.search-field:focus-within {
    border-color: var(--primary);
    background: white;
    box-shadow: 0 0 0 4px var(--primary-soft);
}

.search-field .material-icons {
    font-size: 18px;
    color: var(--text-muted);
}

.search-field input {
    border: none;
    background: transparent;
    outline: none;
    font-family: inherit;
    font-size: 14px;
    width: 100%;
    color: var(--text);
}

.clear-btn {
    display: grid;
    place-items: center;
    color: var(--text-muted);
}

.clear-btn:hover {
    color: var(--secondary-dark);
}

.search-result-info {
    margin-bottom: 16px;
    color: var(--text-muted);
    font-size: 14px;
}


.shop-layout {
    display: grid;
    grid-template-columns: 260px 1fr;
    gap: 32px;
}

.shop-sidebar {
    background: var(--surface);
    border-radius: var(--radius);
    padding: 24px;
    border: 1px solid var(--border);
    height: fit-content;
}

.filter-title {
    font-weight: 700;
    margin-bottom: 14px;
}

.cat-list {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.cat-item {
    padding: 9px 12px;
    border-radius: 10px;
    cursor: pointer;
    transition: var(--transition);
}

.cat-item:hover {
    background: var(--bg-alt);
}

.cat-item.active {
    background: var(--primary-soft);
    color: var(--primary-dark);
    font-weight: 600;
}

.product-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
}

@media (max-width: 768px) {

    .shop-layout,
    .product-grid {
        grid-template-columns: 1fr;
    }
}
</style>