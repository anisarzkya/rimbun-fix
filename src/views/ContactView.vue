<template>
    <div class="container" style="padding: 50px 0 70px">
        <div class="section-head" style="margin-bottom: 40px">
            <span class="section-eyebrow">Hubungi Kami</span>
            <h1 class="section-title">Kami Siap Membantu</h1>
            <p class="section-sub">Punya pertanyaan atau butuh konsultasi bunga? Tim florist kami siap membantu Anda.
            </p>
        </div>

        <div class="contact-layout">
            <!-- INFO SECTION -->
            <div class="contact-info" v-fade-in>
                <h3>Mari Berbicara</h3>
                <p>Tim customer service kami siap membantu Anda setiap hari, 08.00 - 21.00 WIB.</p>

                <!-- List Rendering untuk Info Kontak -->
                <div class="contact-info-item" v-for="(item, i) in contactInfo" :key="i">
                    <div class="icon"><span class="material-icons">{{ item.icon }}</span></div>
                    <div>
                        <div class="label">{{ item.label }}</div>
                        <div class="value">{{ item.value }}</div>
                    </div>
                </div>

                <div class="social-links">
                    <a href="#" v-for="(s, i) in socials" :key="i" :aria-label="s.name">
                        <span class="material-icons">{{ s.icon }}</span>
                    </a>
                </div>
            </div>

            <!-- FORM SECTION -->
            <div class="contact-form-card" v-fade-in="{ delay: 100 }">
                <div v-if="submitted" class="empty-state" style="padding: 50px 20px">
                    <span class="material-icons icon" style="color:var(--primary)">mark_email_read</span>
                    <h3>Pesan Terkirim!</h3>
                    <p>Nomor tiket: <strong>{{ ticketId }}</strong><br />Tim kami akan merespons dalam 24 jam.</p>
                    <button class="btn btn-outline" @click="resetForm">Kirim Pesan Lain</button>
                </div>

                <!-- Form with Validation -->
                <form v-else @submit.prevent="submit">
                    <div class="form-grid">
                        <div class="form-group">
                            <label class="form-label">Nama Lengkap <span class="req">*</span></label>
                            <input v-model="form.name" class="form-input" :class="{ error: errors.name }"
                                placeholder="Nama Anda" />
                            <div v-if="errors.name" class="form-error"><span class="material-icons"
                                    style="font-size:14px">error</span> {{ errors.name }}</div>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Nomor Telepon <span class="req">*</span></label>
                            <input v-model="form.phone" class="form-input" :class="{ error: errors.phone }"
                                placeholder="08xxxxxxxxxx" />
                            <div v-if="errors.phone" class="form-error"><span class="material-icons"
                                    style="font-size:14px">error</span> {{ errors.phone }}</div>
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="form-label">Email <span class="req">*</span></label>
                        <input v-model="form.email" class="form-input" :class="{ error: errors.email }"
                            placeholder="email@contoh.com" />
                        <div v-if="errors.email" class="form-error"><span class="material-icons"
                                style="font-size:14px">error</span> {{ errors.email }}</div>
                    </div>

                    <div class="form-group">
                        <label class="form-label">Subjek</label>
                        <select v-model="form.subject" class="form-select">
                            <option>Pertanyaan Umum</option>
                            <option>Pesanan Custom</option>
                            <option>Kerjasama / Korporat</option>
                            <option>Keluhan Pesanan</option>
                            <option>Lainnya</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label class="form-label">Pesan <span class="req">*</span></label>
                        <textarea v-model="form.message" class="form-textarea" :class="{ error: errors.message }"
                            placeholder="Tulis pesan Anda di sini..."></textarea>
                        <div v-if="errors.message" class="form-error"><span class="material-icons"
                                style="font-size:14px">error</span> {{ errors.message }}</div>
                        <div class="form-hint">{{ form.message.length }} karakter</div>
                    </div>

                    <button type="submit" class="btn btn-primary btn-block btn-lg" :disabled="submitting">
                        <span v-if="submitting" class="material-icons"
                            style="animation: spin 0.8s linear infinite">refresh</span>
                        <span v-else class="material-icons">send</span>
                        {{ submitting ? 'Mengirim...' : 'Kirim Pesan' }}
                    </button>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { reactive, ref, onBeforeMount, onMounted } from 'vue'
import apiService from '../services/api'
import { toastStore } from '../stores/toastStore'

// Vue Object Cycles: onBeforeMount
onBeforeMount(() => {
    console.log('[ContactView] onBeforeMount: Persiapan sebelum render')
})

onMounted(() => {
    console.log('[ContactView] onMounted: Halaman Kontak dirender')
})

// State Management lokal menggunakan Reactive
const form = reactive({
    name: '', email: '', phone: '', subject: 'Pertanyaan Umum', message: ''
})
const errors = reactive({})
const submitting = ref(false)
const submitted = ref(false)
const ticketId = ref('')

// Data Arrays
const contactInfo = [
    { icon: 'location_on', label: 'Alamat Toko', value: 'Jl. Bunga Melati No. 12, Bandung, Jawa Barat 40123' },
    { icon: 'phone', label: 'Telepon / WhatsApp', value: '+62 812 3456 7890' },
    { icon: 'email', label: 'Email', value: 'halo@rimbun.id' },
    { icon: 'schedule', label: 'Jam Operasional', value: 'Senin - Minggu, 08.00 - 21.00 WIB' }
]

const socials = [
    { name: 'Instagram', icon: 'instagram' },
    { name: 'Facebook', icon: 'facebook' },
    { name: 'WhatsApp', icon: 'whatsapp' }
]

// Methods
const validate = () => {
    Object.keys(errors).forEach(k => delete errors[k])

    if (!form.name.trim()) errors.name = 'Nama harus diisi'

    if (!form.email.trim()) errors.email = 'Email harus diisi'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Format email tidak valid'

    if (!form.phone.trim()) errors.phone = 'Nomor telepon harus diisi'
    else if (!/^08\d{8,12}$/.test(form.phone.replace(/\s/g, ''))) errors.phone = 'Format nomor telepon tidak valid (contoh: 081234567890)'

    if (!form.message.trim()) errors.message = 'Pesan harus diisi'
    else if (form.message.trim().length < 10) errors.message = 'Pesan minimal 10 karakter'

    return Object.keys(errors).length === 0
}

// Integrasi API: Submit Contact Form
const submit = async () => {
    if (!validate()) {
        toastStore.add('Periksa kembali isian Anda', 'error')
        return
    }

    submitting.value = true
    try {
        // Memanggil Web Service apiService
        const res = await apiService.submitContact({ ...form })
        ticketId.value = res.ticketId
        submitted.value = true
        toastStore.add('Pesan berhasil dikirim!', 'success')
    } catch (e) {
        toastStore.add('Gagal mengirim pesan: ' + e.message, 'error')
    } finally {
        submitting.value = false
    }
}

const resetForm = () => {
    submitted.value = false
    Object.keys(form).forEach(k => form[k] = k === 'subject' ? 'Pertanyaan Umum' : '')
}
</script>

<style scoped>
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
    margin-bottom: 14px;
}

.section-sub {
    color: var(--text-muted);
    font-size: 17px;
}

.contact-layout {
    display: grid;
    grid-template-columns: 1fr 1.2fr;
    gap: 40px;
}

.contact-info {
    background: linear-gradient(135deg, var(--primary-dark), var(--primary));
    border-radius: var(--radius-lg);
    padding: 40px;
    color: white;
}

.contact-info h3 {
    font-family: 'Fraunces', serif;
    font-size: 28px;
    margin-bottom: 12px;
}

.contact-info>p {
    opacity: 0.9;
    margin-bottom: 28px;
}

.contact-info-item {
    display: flex;
    gap: 14px;
    margin-bottom: 22px;
}

.contact-info-item .icon {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.15);
    display: grid;
    place-items: center;
    flex-shrink: 0;
}

.contact-info-item .label {
    font-size: 13px;
    opacity: 0.8;
    margin-bottom: 2px;
}

.contact-info-item .value {
    font-weight: 600;
}

.social-links {
    display: flex;
    gap: 10px;
    margin-top: 24px;
}

.social-links a {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.15);
    display: grid;
    place-items: center;
    color: white;
    transition: var(--transition);
}

.social-links a:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-3px);
}

.contact-form-card {
    background: var(--surface);
    border-radius: var(--radius-lg);
    padding: 36px;
    border: 1px solid var(--border);
}

.form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 18px;
}

.form-group {
    margin-bottom: 18px;
}

.form-group.full {
    grid-column: 1 / -1;
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

.form-input,
.form-textarea,
.form-select {
    width: 100%;
    padding: 13px 16px;
    border: 1.5px solid var(--border);
    border-radius: 12px;
    font-family: inherit;
    font-size: 15px;
    background: var(--bg);
    transition: var(--transition);
}

.form-input:focus,
.form-textarea:focus,
.form-select:focus {
    outline: none;
    border-color: var(--primary);
    background: white;
    box-shadow: 0 0 0 4px var(--primary-soft);
}

.form-input.error,
.form-textarea.error {
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

.form-textarea {
    resize: vertical;
    min-height: 130px;
}

.form-hint {
    font-size: 13px;
    color: var(--text-muted);
    margin-top: 6px;
    text-align: right;
}

@media (max-width: 768px) {

    .contact-layout,
    .form-grid {
        grid-template-columns: 1fr;
    }
}
</style>