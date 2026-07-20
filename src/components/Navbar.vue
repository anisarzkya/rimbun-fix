<template>
    <header class="navbar">
        <div class="container nav-inner">
            <router-link to="/" class="brand">
                <span class="brand-mark"><span class="material-icons">local_florist</span></span>
                Rimbun
            </router-link>
            <nav class="nav-links" :class="{ open: menuOpen }">
                <router-link to="/" class="nav-link">Beranda</router-link>
                <router-link to="/shop" class="nav-link">Belanja</router-link>
                <router-link to="/about" class="nav-link">Tentang</router-link>
                <router-link to="/contact" class="nav-link">Kontak</router-link>
                <router-link v-if="auth.isLoggedIn" to="/transaksi" class="nav-link">Transaksi</router-link>
                <router-link v-if="auth.isOwner" to="/kelola-produk" class="nav-link">Kelola Produk</router-link>
            </nav>

            <!-- Fitur Search -->
            <form class="search-box" :class="{ open: searchOpen }" @submit.prevent="submitSearch">
                <span class="material-icons search-icon">search</span>
                <input v-model="searchQuery" type="text" placeholder="Cari bunga favoritmu..."
                    @focus="searchOpen = true" />
            </form>

            <div class="nav-actions">
                <button class="icon-btn search-toggle" @click="searchOpen = !searchOpen" aria-label="Cari">
                    <span class="material-icons">search</span>
                </button>
                <router-link to="/cart" class="icon-btn" aria-label="Keranjang">
                    <span class="material-icons-outlined">shopping_bag</span>
                    <span v-if="cart.count > 0" class="cart-badge">{{ cart.count }}</span>
                </router-link>

                <!-- Auth-aware: tampilkan Akun jika sudah login, atau Masuk/Daftar jika belum -->
                <router-link v-if="auth.isLoggedIn" to="/account" class="icon-btn" aria-label="Akun">
                    <span class="material-icons-outlined">account_circle</span>
                </router-link>
                <router-link v-else to="/login" class="auth-link">
                    Masuk
                </router-link>

                <button class="icon-btn menu-toggle" @click="toggleMenu" aria-label="Menu">
                    <span class="material-icons">menu</span>
                </button>
            </div>
        </div>
    </header>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { cartStore } from '../stores/cartStore'
import { authStore } from '../stores/authStore'

const router = useRouter()
const menuOpen = ref(false)
const searchOpen = ref(false)
const searchQuery = ref('')
const cart = cartStore // Bind langsung ke store
const auth = authStore // Bind langsung ke store
const toggleMenu = () => menuOpen.value = !menuOpen.value

// Fitur Search: arahkan ke halaman Belanja dengan query pencarian
const submitSearch = () => {
    if (!searchQuery.value.trim()) return
    router.push({ path: '/shop', query: { q: searchQuery.value.trim() } })
    searchOpen.value = false
}
</script>

<style scoped>
.navbar {
    position: sticky;
    top: 0;
    z-index: 100;
    background: rgba(255, 251, 244, 0.85);
    backdrop-filter: blur(14px);
    border-bottom: 1px solid var(--border);
}

.nav-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 18px 0;
    gap: 24px;
}

.brand {
    display: flex;
    align-items: center;
    gap: 10px;
    font-family: 'Fraunces', serif;
    font-weight: 700;
    font-size: 26px;
    color: var(--primary-dark);
}

.brand-mark {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--primary), var(--primary-dark));
    display: grid;
    place-items: center;
    color: white;
    box-shadow: 0 4px 12px rgba(91, 164, 64, 0.3);
}

.brand-mark .material-icons {
    font-size: 22px;
}

.nav-links {
    display: flex;
    gap: 6px;
}

.nav-link {
    padding: 10px 18px;
    border-radius: 999px;
    font-weight: 500;
    font-size: 15px;
    color: var(--text-muted);
    transition: var(--transition);
}

.nav-link:hover {
    color: var(--primary-dark);
    background: var(--primary-soft);
}

.nav-link.router-link-exact-active {
    background: var(--primary);
    color: white;
}

.search-box {
    display: flex;
    align-items: center;
    gap: 6px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 999px;
    padding: 8px 14px;
    flex: 1;
    max-width: 280px;
    transition: var(--transition);
}

.search-box:focus-within {
    border-color: var(--primary);
    box-shadow: 0 0 0 4px var(--primary-soft);
}

.search-icon {
    font-size: 18px;
    color: var(--text-muted);
}

.search-box input {
    border: none;
    background: transparent;
    outline: none;
    font-family: inherit;
    font-size: 14px;
    width: 100%;
    color: var(--text);
}

.search-toggle {
    display: none;
}

.auth-link {
    padding: 10px 20px;
    border-radius: 999px;
    font-weight: 600;
    font-size: 14px;
    background: var(--primary);
    color: white;
    transition: var(--transition);
}

.auth-link:hover {
    background: var(--primary-dark);
}

.nav-actions {
    display: flex;
    align-items: center;
    gap: 10px;
}

.icon-btn {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    background: var(--surface);
    border: 1px solid var(--border);
    color: var(--text);
    transition: var(--transition);
    position: relative;
}

.icon-btn:hover {
    background: var(--primary-soft);
    border-color: var(--primary);
    color: var(--primary-dark);
    transform: translateY(-2px);
}

.cart-badge {
    position: absolute;
    top: -4px;
    right: -4px;
    background: var(--secondary);
    color: white;
    font-size: 11px;
    font-weight: 700;
    min-width: 20px;
    height: 20px;
    padding: 0 5px;
    border-radius: 999px;
    display: grid;
    place-items: center;
    border: 2px solid var(--bg);
}

.menu-toggle {
    display: none;
}

@media (max-width: 900px) {
    .search-box {
        display: none;
    }

    .search-box.open {
        display: flex;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        max-width: none;
        margin: 8px 16px;
        z-index: 10;
    }

    .search-toggle {
        display: grid;
    }

    .auth-link {
        padding: 8px 14px;
        font-size: 13px;
    }
}

@media (max-width: 768px) {
    .nav-links {
        display: none;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: white;
        flex-direction: column;
        padding: 16px;
        border-bottom: 1px solid var(--border);
    }

    .nav-links.open {
        display: flex;
    }

    .menu-toggle {
        display: grid;
    }
}
</style>