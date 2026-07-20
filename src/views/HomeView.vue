<template>
  <div>
    <section class="hero">
      <div class="container">
        <div class="hero-grid">
          <div class="hero-content">
            <span class="hero-eyebrow"><span class="material-icons">eco</span> Bunga segar langsung dari kebun</span>
            <h1>Hadirkan <span class="accent">keceriaan</span> dengan setiap <span class="accent-pink">kelopak</span>
              bunga.</h1>
            <p>Rimbun menghadirkan rangkaian bunga segar pilihan dari petani lokal Indonesia.</p>
            <div class="hero-cta">
              <router-link to="/shop" class="btn btn-primary btn-lg"><span class="material-icons">storefront</span>
                Mulai Belanja</router-link>
            </div>
          </div>
          <div class="hero-visual">
            <div class="hero-card hero-card-1"><img
                src="https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=600&q=80" alt="Bouquet" /></div>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section-head" v-fade-in>
          <span class="section-eyebrow">Produk Terlaris</span>
          <h2 class="section-title">Pilihan Favorit Pelanggan</h2>
        </div>
        <div class="product-grid">
          <ProductCard v-for="p in featured" :key="p.id" :product="p" @add-to-cart="handleAdd" @view-detail="goDetail"
            @toggle-fav="handleFav" />
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ProductCard from '../components/ProductCard.vue'
import { productStore } from '../stores/productStore'
import { cartStore } from '../stores/cartStore'
import { toastStore } from '../stores/toastStore'
import { favoriteStore } from '../stores/favoriteStore'

const router = useRouter()
const featured = computed(() => productStore.featured())

const handleAdd = (product) => { cartStore.add(product); toastStore.add('Ditambahkan ke keranjang', 'success') }
const goDetail = (product) => router.push(`/product/${product.id}`)
const handleFav = (product) => { favoriteStore.toggle(product.id); toastStore.add('Favorit diperbarui', 'info') }
</script>

<style scoped>
.hero {
  padding: 80px 0 100px;
  background: radial-gradient(circle at 10% 20%, var(--secondary-soft) 0%, transparent 45%), var(--bg);
}

.hero-grid {
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: 60px;
  align-items: center;
}

.hero-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: white;
  padding: 8px 16px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 600;
  color: var(--primary-dark);
  box-shadow: var(--shadow-sm);
  margin-bottom: 24px;
}

.hero h1 {
  font-size: clamp(40px, 5vw, 64px);
  line-height: 1.05;
  font-weight: 700;
  margin-bottom: 22px;
}

.hero h1 .accent {
  color: var(--primary);
  font-style: italic;
}

.hero h1 .accent-pink {
  color: var(--secondary);
  font-style: italic;
}

.hero p {
  font-size: 18px;
  color: var(--text-muted);
  max-width: 520px;
  margin-bottom: 32px;
}

.hero-cta {
  display: flex;
  gap: 14px;
}

.hero-visual {
  position: relative;
  height: 400px;
}

.hero-card {
  position: absolute;
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-lg);
  background: white;
}

.hero-card-1 {
  width: 80%;
  height: 100%;
  right: 0;
}

.section {
  padding: 90px 0;
}

.section-head {
  text-align: center;
  max-width: 680px;
  margin: 0 auto 56px;
}

.section-eyebrow {
  display: inline-block;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--secondary);
  margin-bottom: 14px;
}

.section-title {
  font-size: clamp(32px, 4vw, 44px);
  font-weight: 700;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

@media (max-width: 768px) {

  .hero-grid,
  .product-grid {
    grid-template-columns: 1fr;
  }
}
</style>