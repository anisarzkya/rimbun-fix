import { reactive } from "vue";
import apiService from "../services/api";

export const productStore = reactive({
  list: [],
  loading: false,
  error: null,

  async fetchAll() {
    this.loading = true;
    this.error = null;
    try {
      // Integrasi API
      this.list = await apiService.getProducts();
    } catch (e) {
      this.error = e.message;
    } finally {
      this.loading = false;
    }
  },

  getCategories() {
    const map = {};
    this.list.forEach((p) => {
      map[p.category] = (map[p.category] || 0) + 1;
    });
    return Object.entries(map).map(([name, count]) => ({ name, count }));
  },

  featured() {
    return this.list.filter((p) => p.tag === "bestseller").slice(0, 4);
  },
  newArrivals() {
    return this.list.filter((p) => p.tag === "new").slice(0, 4);
  },

  // CRUD Bunga: Tambah produk (integrasi API)
  async addProduct(payload) {
    this.loading = true;
    this.error = null;
    try {
      const created = await apiService.addProduct(payload);
      this.list.push(created);
      return created;
    } catch (e) {
      this.error = e.message;
      throw e;
    } finally {
      this.loading = false;
    }
  },

  // CRUD Bunga: Update produk (integrasi API)
  async updateProduct(id, payload) {
    this.loading = true;
    this.error = null;
    try {
      const updated = await apiService.updateProduct(id, payload);
      const idx = this.list.findIndex((p) => p.id === updated.id);
      if (idx > -1) this.list[idx] = updated;
      return updated;
    } catch (e) {
      this.error = e.message;
      throw e;
    } finally {
      this.loading = false;
    }
  },

  // CRUD Bunga: Hapus produk (integrasi API)
  async deleteProduct(id) {
    this.loading = true;
    try {
      await apiService.deleteProduct(id);
      this.list = this.list.filter((p) => p.id !== parseInt(id));
    } finally {
      this.loading = false;
    }
  },
});
