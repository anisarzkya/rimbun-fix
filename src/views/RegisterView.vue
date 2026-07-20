<template>
    <div class="container auth-page">
        <div class="auth-card" v-fade-in>
            <div class="auth-head">
                <span class="material-icons icon">local_florist</span>
                <h1>Daftar Akun Rimbun</h1>
                <p>Sudah punya akun? <router-link to="/login" class="link">Masuk di sini</router-link></p>
            </div>

            <form @submit.prevent="submit">
                <div class="form-group">
                    <label class="form-label">Nama Lengkap <span class="req">*</span></label>
                    <input v-model="form.name" class="form-input" :class="{ error: errors.name }"
                        placeholder="Nama Anda" />
                    <div v-if="errors.name" class="form-error">
                        <span class="material-icons" style="font-size:14px">error</span> {{ errors.name }}
                    </div>
                </div>

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
                        :class="{ error: errors.password }" placeholder="Minimal 6 karakter" />
                    <div v-if="errors.password" class="form-error">
                        <span class="material-icons" style="font-size:14px">error</span> {{ errors.password }}
                    </div>
                </div>

                <div class="form-group">
                    <label class="form-label">Konfirmasi Password <span class="req">*</span></label>
                    <input v-model="form.confirmPassword" type="password" class="form-input"
                        :class="{ error: errors.confirmPassword }" placeholder="Ulangi password" />
                    <div v-if="errors.confirmPassword" class="form-error">
                        <span class="material-icons" style="font-size:14px">error</span> {{ errors.confirmPassword }}
                    </div>
                </div>

                <button type="submit" class="btn btn-primary btn-block btn-lg" :disabled="authStore.loading">
                    <span v-if="authStore.loading" class="material-icons" style="animation: spin 0.8s linear infinite">refresh</span>
                    <span v-else class="material-icons">person_add</span>
                    {{ authStore.loading ? 'Memproses...' : 'Daftar' }}
                </button>
            </form>
        </div>
    </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { authStore } from '../stores/authStore'
import { toastStore } from '../stores/toastStore'

const router = useRouter()

const form = reactive({ name: '', email: '', password: '', confirmPassword: '' })
const errors = reactive({})

const validate = () => {
    Object.keys(errors).forEach(k => delete errors[k])

    if (!form.name.trim()) errors.name = 'Nama harus diisi'

    if (!form.email.trim()) errors.email = 'Email harus diisi'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Format email tidak valid'

    if (!form.password) errors.password = 'Password harus diisi'
    else if (form.password.length < 6) errors.password = 'Password minimal 6 karakter'

    if (form.confirmPassword !== form.password) errors.confirmPassword = 'Konfirmasi password tidak cocok'

    return Object.keys(errors).length === 0
}

// Integrasi API: Register. Role TIDAK dipilih user — otomatis ditentukan
// dari email di authStore (hanya email pemilik yang dapat role 'pemilik').
const submit = async () => {
    if (!validate()) {
        toastStore.add('Periksa kembali isian Anda', 'error')
        return
    }
    try {
        const user = await authStore.register({
            name: form.name, email: form.email, password: form.password,
        })
        toastStore.add(`Selamat datang, ${user.name}! Akun berhasil dibuat.`, 'success')
        router.push('/')
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

.role-options {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
}

.role-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 6px;
    padding: 16px 12px;
    border: 1.5px solid var(--border);
    border-radius: 14px;
    cursor: pointer;
    transition: var(--transition);
    position: relative;
}

.role-card input {
    position: absolute;
    opacity: 0;
}

.role-card .material-icons {
    font-size: 26px;
    color: var(--text-muted);
}

.role-card strong {
    font-size: 14px;
}

.role-card p {
    font-size: 12px;
    color: var(--text-muted);
    margin: 0;
}

.role-card.active {
    border-color: var(--primary);
    background: var(--primary-soft);
}

.role-card.active .material-icons {
    color: var(--primary-dark);
}

@media (max-width: 420px) {
    .role-options {
        grid-template-columns: 1fr;
    }
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
