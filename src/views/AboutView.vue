<template>
  <div>
    <!-- HERO SECTION -->
    <section class="about-hero">
      <div class="container">
        <div class="about-grid">
          <div class="about-text">
            <span class="section-eyebrow">Tentang Rimbun</span>
            <h2>Melestarikan keindahan alam dalam setiap <span class="accent">rangkaian</span>.</h2>
            <p>Rimbun lahir pada tahun 2019 dari kecintaan mendalam terhadap bunga dan keinginan untuk menghadirkan
              keindahan tersebut ke setiap rumah di Indonesia. Kami percaya bahwa bunga bukan sekadar hadiah, tetapi
              cara untuk mengungkapkan perasaan, merayakan momen, dan menghidupkan ruang.</p>
            <p>Berawal dari toko kecil di Bandung, kini Rimbun telah menjadi destinasi bunga online terpercaya dengan
              ribuan pelanggan setia di seluruh Indonesia.</p>
            <router-link to="/shop" class="btn btn-primary btn-lg" style="margin-top: 12px">
              <span class="material-icons">storefront</span> Lihat Koleksi
            </router-link>
          </div>
          <div class="about-img">
            <img src="https://images.unsplash.com/photo-1487070183336-b863922373d4?w=800&q=80"
              alt="Toko bunga Rimbun" />
          </div>
        </div>
      </div>
    </section>

    <!-- VALUES SECTION -->
    <section class="section section-soft">
      <div class="container">
        <div class="section-head" v-fade-in>
          <span class="section-eyebrow">Nilai Kami</span>
          <h2 class="section-title">Yang Kami Percaya</h2>
          <p class="section-sub">Tiga prinsip utama yang menjadi fondasi setiap rangkaian bunga yang kami buat.</p>
        </div>
        <div class="values-grid">
          <!-- List Rendering dengan v-for -->
          <div class="value-card" v-for="(v, i) in values" :key="i" v-fade-in="{ delay: i * 100 }">
            <div class="value-icon"><span class="material-icons">{{ v.icon }}</span></div>
            <h4>{{ v.title }}</h4>
            <p>{{ v.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- STATS SECTION -->
    <section class="section">
      <div class="container">
        <div class="stats-wrap">
          <div class="stat-item" v-for="(s, i) in stats" :key="i">
            <div class="stat-num">{{ s.num }}</div>
            <div class="stat-label">{{ s.label }}</div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'

// Vue Object Cycles: onMounted
onMounted(() => {
  console.log('[AboutView] onMounted: Halaman About dirender')
})

// Data array untuk List Rendering
const values = [
  {
    icon: 'eco',
    title: 'Ramah Lingkungan',
    desc: 'Packaging biodegradable dan praktik berkelanjutan dari kebun ke rumah Anda.'
  },
  {
    icon: 'handshake',
    title: 'Mitra Petani Lokal',
    desc: 'Bekerja sama langsung dengan 45+ petani bunga lokal untuk kemakmuran bersama.'
  },
  {
    icon: 'favorite',
    title: 'Dibuat dengan Cinta',
    desc: 'Setiap rangkaian dirancang handmade oleh florist bersertifikat dengan perhatian detail.'
  },
]

const stats = [
  { num: '5K+', label: 'Pelanggan Bahagia' },
  { num: '45+', label: 'Mitra Petani' },
  { num: '120+', label: 'Variasi Bunga' },
  { num: '15+', label: 'Kota Terlayani' }
]
</script>

<style scoped>
.about-hero {
  padding: 70px 0 50px;
}

.about-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
}

.about-img {
  aspect-ratio: 4/3;
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-lg);
}

.about-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.about-text h2 {
  font-size: 42px;
  line-height: 1.1;
  margin-bottom: 18px;
}

.about-text h2 .accent {
  color: var(--primary);
  font-style: italic;
}

.about-text p {
  color: var(--text-muted);
  margin-bottom: 16px;
  line-height: 1.7;
}

.section {
  padding: 90px 0;
}

.section-soft {
  background: var(--bg-soft);
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
  line-height: 1.15;
  margin-bottom: 14px;
}

.section-sub {
  color: var(--text-muted);
  font-size: 17px;
}

.values-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.value-card {
  padding: 28px;
  background: var(--surface);
  border-radius: var(--radius);
  border: 1px solid var(--border);
  transition: var(--transition);
}

.value-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow);
}

.value-icon {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: var(--primary-soft);
  color: var(--primary-dark);
  display: grid;
  place-items: center;
  margin-bottom: 16px;
}

.value-card h4 {
  font-family: 'Fraunces', serif;
  font-size: 19px;
  margin-bottom: 8px;
}

.value-card p {
  font-size: 14px;
  color: var(--text-muted);
}

.stats-wrap {
  display: flex;
  justify-content: center;
  gap: 60px;
  flex-wrap: wrap;
  background: var(--surface);
  padding: 40px;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border);
}

.stat-item {
  text-align: center;
}

.stat-num {
  font-family: 'Fraunces', serif;
  font-size: 36px;
  font-weight: 700;
  color: var(--primary-dark);
}

.stat-label {
  font-size: 14px;
  color: var(--text-muted);
  margin-top: 4px;
}

@media (max-width: 768px) {

  .about-grid,
  .values-grid {
    grid-template-columns: 1fr;
  }
}
</style>