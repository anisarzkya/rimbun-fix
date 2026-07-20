<template>
    <div class="container auth-page" v-if="authStore.currentUser">
        <div class="auth-card" v-fade-in>
            <div class="auth-head">
                <span class="material-icons icon">edit</span>
                <h1>Edit Profil</h1>
                <p>Perbarui nama dan email akun kamu</p>
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

                <button type="submit" class="btn btn-primary btn-block btn-lg" :disabled="authStore.loading">
                    <span v-if="authStore.loading" class="material-icons" style="animation: spin 0.8s linear infinite">refresh</span>
                    <span v-else class="material-icons">save</span>
                    {{ authStore.loading ? 'Menyimpan...' : 'Update' }}
                </button>
                <router-link to="/account" class="btn btn-outline btn-block" style="margin-top: 10px">
                    Batal
                </router-link>
            </form>
        </div>
    </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { authStore } from '../stores/authStore'
import { toastStore } from '../stores/toastStore'

const router = useRouter()

const form = reactive({ name: '', email: '' })
const errors = reactive({})

// Pola sama seperti onMounted di EditUser.vue (modul 17): ambil data existing dulu
onMounted(() => {
    if (authStore.currentUser) {
        form.name = authStore.currentUser.name
        form.email = authStore.currentUser.email
    }
})

const validate = () => {
    Object.keys(errors).forEach(k => delete errors[k])

    if (!form.name.trim()) errors.name = 'Nama harus diisi'

    if (!form.email.trim()) errors.email = 'Email harus diisi'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Format email tidak valid'

    return Object.keys(errors).length === 0
}

// Integrasi API: updateUser (pola sama seperti updateUser() di modul 17)
const submit = async () => {
    if (!validate()) {
        toastStore.add('Periksa kembali isian Anda', 'error')
        return
    }
    try {
        await authStore.updateProfile({ name: form.name, email: form.email })
        toastStore.add('Profil berhasil diperbarui', 'success')
        router.push('/account')
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
