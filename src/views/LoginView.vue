<template>
    <div class="container auth-page">
        <div class="auth-card" v-fade-in>
            <div class="auth-head">
                <span class="material-icons icon">local_florist</span>
                <h1>Masuk ke Rimbun</h1>
                <p>Belum punya akun? <router-link to="/register" class="link">Daftar di sini</router-link></p>
            </div>

            <form @submit.prevent="submit">
                <div class="form-group">
                    <label class="form-label">Email <span class="req">*</span></label>
                    <input v-model="form.email" type="email" class="form-input" :class="{ error: errors.email }"
                        placeholder="email@contoh.com" />
                    <div v-if="errors.email" class="form-error">
                        <span class="material-icons" style="font-size:14px">error</span> {{ errors.email }}
                    </div>
                </div>

                <div class="form-group">
                    <label class="form-label">Password <span class="req">*</span></label>
                    <input v-model="form.password" type="password" class="form-input"
                        :class="{ error: errors.password }" placeholder="Masukkan password" />
                    <div v-if="errors.password" class="form-error">
                        <span class="material-icons" style="font-size:14px">error</span> {{ errors.password }}
                    </div>
                </div>

                <button type="submit" class="btn btn-primary btn-block btn-lg" :disabled="authStore.loading">
                    <span v-if="authStore.loading" class="material-icons" style="animation: spin 0.8s linear infinite">refresh</span>
                    <span v-else class="material-icons">login</span>
                    {{ authStore.loading ? 'Memproses...' : 'Masuk' }}
                </button>
            </form>
        </div>
    </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { authStore } from '../stores/authStore'
import { toastStore } from '../stores/toastStore'

const router = useRouter()
const route = useRoute()

const form = reactive({ email: '', password: '' })
const errors = reactive({})

const validate = () => {
    Object.keys(errors).forEach(k => delete errors[k])

    if (!form.email.trim()) errors.email = 'Email harus diisi'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Format email tidak valid'

    if (!form.password) errors.password = 'Password harus diisi'

    return Object.keys(errors).length === 0
}

// Integrasi API: Login
const submit = async () => {
    if (!validate()) {
        toastStore.add('Periksa kembali isian Anda', 'error')
        return
    }
    try {
        const user = await authStore.login({ ...form })
        toastStore.add(`Selamat datang kembali, ${user.name}!`, 'success')
        router.push(route.query.redirect || '/')
    } catch (e) {
        toastStore.add(e.message, 'error')
    }
}
</script>

<style scoped>
.auth-page {
    display: flex;
    justify-content: center;
    padding: 60px 24px 90px;
}

.auth-card {
    width: 100%;
    max-width: 440px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: 40px;
}

.auth-head {
    text-align: center;
    margin-bottom: 30px;
}

.auth-head .icon {
    width: 56px;
    height: 56px;
    display: grid;
    place-items: center;
    margin: 0 auto 14px;
    border-radius: 50%;
    background: var(--primary-soft);
    color: var(--primary-dark);
    font-size: 28px;
}

.auth-head h1 {
    font-size: 26px;
    margin-bottom: 8px;
}

.auth-head p {
    color: var(--text-muted);
    font-size: 14px;
}

.link {
    color: var(--primary-dark);
    font-weight: 600;
    text-decoration: underline;
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

.form-input {
    width: 100%;
    padding: 13px 16px;
    border: 1.5px solid var(--border);
    border-radius: 12px;
    font-family: inherit;
    font-size: 15px;
    background: var(--bg);
    transition: var(--transition);
}

.form-input:focus {
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
    display: flex;
    align-items: center;
    gap: 4px;
}
</style>
