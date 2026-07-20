import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import ShopView from "../views/ShopView.vue";
import ProductDetailView from "../views/ProductDetailView.vue";
import CartView from "../views/CartView.vue";
import AboutView from "../views/AboutView.vue";
import ContactView from "../views/ContactView.vue";
import LoginView from "../views/LoginView.vue";
import RegisterView from "../views/RegisterView.vue";
import AccountView from "../views/AccountView.vue";
import EditAccountView from "../views/EditAccountView.vue";
import ProdukListView from "../views/ProdukListView.vue";
import ProdukAddView from "../views/ProdukAddView.vue";
import ProdukEditView from "../views/ProdukEditView.vue";
import TransaksiView from "../views/TransaksiView.vue";
import { authStore } from "../stores/authStore";
import { toastStore } from "../stores/toastStore";

const routes = [
  { path: "/", name: "home", component: HomeView },
  { path: "/shop", name: "shop", component: ShopView },
  { path: "/product/:id", name: "product-detail", component: ProductDetailView, props: true },
  { path: "/cart", name: "cart", component: CartView, meta: { requiresAuth: true } },
  { path: "/about", name: "about", component: AboutView },
  { path: "/contact", name: "contact", component: ContactView },
  { path: "/login", name: "login", component: LoginView, meta: { guestOnly: true } },
  { path: "/register", name: "register", component: RegisterView, meta: { guestOnly: true } },
  { path: "/account", name: "account", component: AccountView, meta: { requiresAuth: true } },
  { path: "/account/edit", name: "account-edit", component: EditAccountView, meta: { requiresAuth: true } },
  { path: "/kelola-produk", name: "produk-list", component: ProdukListView, meta: { requiresAuth: true, requiresRole: "pemilik" } },
  { path: "/kelola-produk/tambah", name: "produk-add", component: ProdukAddView, meta: { requiresAuth: true, requiresRole: "pemilik" } },
  { path: "/kelola-produk/edit/:id", name: "produk-edit", component: ProdukEditView, meta: { requiresAuth: true, requiresRole: "pemilik" } },
  { path: "/transaksi", name: "transaksi", component: TransaksiView, meta: { requiresAuth: true } },
  { path: "/:pathMatch(.*)*", redirect: "/" },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0, behavior: "smooth" };
  },
});

// Route Guard: proteksi halaman yang butuh login, role tertentu (RBAC), dan halaman khusus tamu
router.beforeEach((to) => {
  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    return { path: "/login", query: { redirect: to.fullPath } };
  }
  if (to.meta.requiresRole && authStore.currentUser?.role !== to.meta.requiresRole) {
    toastStore.add("Halaman ini khusus untuk Pemilik Toko", "error");
    return { path: "/" };
  }
  if (to.meta.guestOnly && authStore.isLoggedIn) {
    return { path: "/account" };
  }
  return true;
});

export default router;
