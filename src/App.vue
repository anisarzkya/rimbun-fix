<template>
  <div class="app-shell">
    <!-- Component: Navbar -->
    <Navbar />

    <!-- Routing: Router View -->
    <main>
      <router-view v-slot="{ Component }">
        <transition name="route" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <!-- Component: Footer -->
    <Footer />

    <!-- Component: ToastContainer -->
    <ToastContainer />
  </div>
</template>

<script setup>
// Vue Object Cycles (Lifecycle Hooks)
import { onBeforeMount, onMounted, onUpdated } from 'vue'
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'
import ToastContainer from './components/ToastContainer.vue'
import { productStore } from './stores/productStore'

onBeforeMount(() => {
  console.log('[App] onBeforeMount: Aplikasi siap dimuat')
})

onMounted(async () => {
  console.log('[App] onMounted: Aplikasi berhasil di-render')
  // Integrasi API: Fetch awal saat aplikasi di-mount
  await productStore.fetchAll()
})

onUpdated(() => {
  // Trigger setiap kali DOM mengalami perubahan/update
})
</script>