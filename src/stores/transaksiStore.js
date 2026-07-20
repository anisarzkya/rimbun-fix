import { reactive } from "vue";

const TRANSAKSI_KEY = "rimbun-transaksi";

function loadTransaksi() {
  try {
    return JSON.parse(localStorage.getItem(TRANSAKSI_KEY) || "[]");
  } catch {
    return [];
  }
}

export const transaksiStore = reactive({
  list: loadTransaksi(),

  save() {
    localStorage.setItem(TRANSAKSI_KEY, JSON.stringify(this.list));
  },

  // Dipanggil setelah checkout berhasil (dari CartView) untuk mencatat transaksi
  addTransaksi({ orderId, items, customer, subtotal, shipping, total, userEmail }) {
    const transaksi = {
      id: Date.now(),
      orderId,
      items: JSON.parse(JSON.stringify(items)),
      customer,
      subtotal,
      shipping,
      total,
      status: "Diproses",
      userEmail: userEmail || null,
      createdAt: new Date().toISOString(),
    };
    this.list.unshift(transaksi);
    this.save();
    return transaksi;
  },

  // Fitur Update status pesanan (khusus Pemilik Toko)
  updateStatus(id, status) {
    const t = this.list.find((t) => t.id === id);
    if (t) {
      t.status = status;
      this.save();
    }
  },

  // Fitur Hapus riwayat transaksi (pola sama seperti deleteUser() di modul 17)
  deleteTransaksi(id) {
    this.list = this.list.filter((t) => t.id !== id);
    this.save();
  },

  // Riwayat milik user yang sedang login (kalau tidak login, tampilkan semua sebagai riwayat lokal)
  byUser(userEmail) {
    if (!userEmail) return this.list;
    return this.list.filter((t) => t.userEmail === userEmail);
  },
});
