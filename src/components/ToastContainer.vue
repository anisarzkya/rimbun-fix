<template>
    <div class="toast-container">
        <div v-for="t in toast.list" :key="t.id" class="toast" :class="t.type">
            <span class="material-icons">{{ t.type === 'success' ? 'check_circle' : t.type === 'error' ? 'error' :
                'info' }}</span>
            <span>{{ t.message }}</span>
        </div>
    </div>
</template>

<script setup>
import { toastStore } from '../stores/toastStore'
const toast = toastStore
</script>

<style scoped>
.toast-container {
    position: fixed;
    top: 24px;
    right: 24px;
    z-index: 1000;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.toast {
    background: white;
    padding: 14px 20px;
    border-radius: 12px;
    box-shadow: var(--shadow-lg);
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 280px;
    border-left: 4px solid var(--primary);
    animation: slideIn 0.3s ease;
}

.toast.success {
    border-left-color: var(--primary);
}

.toast.success .material-icons {
    color: var(--primary);
}

.toast.error {
    border-left-color: var(--secondary);
}

.toast.error .material-icons {
    color: var(--secondary);
}

.toast.info {
    border-left-color: var(--accent);
}

.toast.info .material-icons {
    color: var(--accent);
}
</style>