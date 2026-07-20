<template>
    <div class="container account-page" v-if="authStore.currentUser">
        <div class="account-card" v-fade-in>
            <div class="avatar">{{ initials }}</div>
            <h1>{{ authStore.currentUser.name }}</h1>
            <span class="role-badge" :class="{ owner: authStore.isOwner }">
                <span class="material-icons">{{ authStore.isOwner ? 'storefront' : 'shopping_bag' }}</span>
                {{ authStore.isOwner ? 'Pemilik Toko' : 'Pembeli' }}
            </span>
            <p class="email">{{ authStore.currentUser.email }}</p>
            <p class="joined">Bergabung sejak {{ formattedDate }}</p>

            <div class="account-actions">
                <router-link v-if="authStore.isOwner" to="/kelola-produk" class="btn btn-primary btn-block">
                    <span class="material-icons">local_florist</span>
                    Kelola Produk
                </router-link>
                <router-link to="/account/edit" class="btn btn-outline btn-block">
                    <span class="material-icons">edit</span>
                    Edit Profil
                </router-link>
                <button class="btn btn-block btn-danger" @click="handleDelete" :disabled="authStore.loading">
                    <span class="material-icons">delete</span>
                    Hapus Akun
                </button>
                <button class="btn btn-outline btn-block" @click="handleLogout">
                    <span class="material-icons">logout</span>
                    Keluar
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { authStore } from '../stores/authStore'
import { toastStore } from '../stores/toastStore'

const router = useRouter()

const initials = computed(() => {
    const name = authStore.currentUser?.name || ''
    return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
})

const formattedDate = computed(() => {
    if (!authStore.currentUser?.createdAt) return '-'
    return new Date(authStore.currentUser.createdAt).toLocaleDateString('id-ID', {
        day: 'numeric', month: 'long', year: 'numeric'
    })
})

const handleLogout = () => {
    authStore.logout()
    toastStore.add('Anda telah keluar', 'info')
    router.push('/')
}

// Fitur Hapus data (pola sama seperti deleteUser() di modul 17, pakai confirm())
const handleDelete = async () => {
    if (!confirm('Yakin ingin menghapus akun ini? Tindakan ini tidak bisa dibatalkan.')) return
    await authStore.deleteAccount()
    toastStore.add('Akun berhasil dihapus', 'info')
    router.push('/')
}
</script>

<style scoped>
.account-page {
    display: flex;
    justify-content: center;
    padding: 60px 24px 90px;
}

.account-card {
    width: 100%;
    max-width: 400px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: 40px;
    text-align: center;
}

.avatar {
    width: 76px;
    height: 76px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--primary), var(--primary-dark));
    color: white;
    font-weight: 700;
    font-size: 26px;
    display: grid;
    place-items: center;
    margin: 0 auto 18px;
}

.account-card h1 {
    font-size: 24px;
    margin-bottom: 6px;
}

.role-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 14px;
    border-radius: 999px;
    background: var(--bg-alt);
    color: var(--text-muted);
    font-size: 12px;
    font-weight: 700;
    margin-bottom: 14px;
}

.role-badge .material-icons {
    font-size: 15px;
}

.role-badge.owner {
    background: var(--primary-soft);
    color: var(--primary-dark);
}

.email {
    color: var(--text-muted);
    margin-bottom: 4px;
}

.joined {
    color: var(--text-muted);
    font-size: 13px;
    margin-bottom: 28px;
}

.account-actions {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.btn-danger {
    background: var(--secondary-soft);
    color: var(--secondary-dark);
    border: 1.5px solid var(--secondary-soft);
}

.btn-danger:hover {
    background: var(--secondary);
    color: white;
}
</style>
