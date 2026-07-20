// Simulasi dataset awal dari backend (seed data)
const DEFAULT_PRODUCTS = [
  {
    id: 1,
    name: "Bouquet Mawar Merah Classics",
    category: "Bouquet",
    price: 285000,
    oldPrice: 350000,
    rating: 4.9,
    sold: 320,
    stock: 18,
    tag: "bestseller",
    description:
      "Rangkaian 12 tangkai mawar merah segar pilihan greenhouse, dibalut kraft paper premium.",
    image: "https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=600&q=80",
    color: "Merah",
    care: "Medium",
  },
  {
    id: 2,
    name: "Buket Bunga Matahari Ceria",
    category: "Bouquet",
    price: 195000,
    oldPrice: null,
    rating: 4.7,
    sold: 215,
    stock: 24,
    tag: "new",
    description: "Sembilan tangkai sunflower cerah dipadukan dengan daun eucaliptus.",
    image: "https://images.unsplash.com/photo-1593105544559-25b6d6b9f1c5?w=600&q=80",
    color: "Kuning",
    care: "Mudah",
  },
  {
    id: 3,
    name: "Rangkaian Tulip Pastel Dream",
    category: "Vas",
    price: 365000,
    oldPrice: 420000,
    rating: 4.8,
    sold: 158,
    stock: 12,
    tag: "bestseller",
    description: "Belasan tulip pastel (pink, lavender, krem) tersusun elegan di vas kaca.",
    image: "https://images.unsplash.com/photo-1520763185298-1b434c919102?w=600&q=80",
    color: "Pastel",
    care: "Medium",
  },
  {
    id: 4,
    name: "Vas Lily Putih Anggun",
    category: "Vas",
    price: 275000,
    oldPrice: null,
    rating: 4.6,
    sold: 98,
    stock: 15,
    tag: null,
    description: "Lily putih oriental dalam vas transparan, hadirkan ketenangan.",
    image: "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=600&q=80",
    color: "Putih",
    care: "Mudah",
  },
  {
    id: 5,
    name: "Bouquet Peony Pink Romance",
    category: "Bouquet",
    price: 425000,
    oldPrice: 480000,
    rating: 5.0,
    sold: 87,
    stock: 8,
    tag: "bestseller",
    description: "Peony pink premium bertekstur lembut, dipadukan baby breath.",
    image: "https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?w=600&q=80",
    color: "Pink",
    care: "Sulit",
  },
  {
    id: 6,
    name: "Bunga Papan Wedding Royale",
    category: "Papan",
    price: 1850000,
    oldPrice: null,
    rating: 4.9,
    sold: 42,
    stock: 5,
    tag: "new",
    description: "Papan bunga standing untuk pernikahan & acara korporat.",
    image: "https://images.unsplash.com/photo-1457269449834-928af64c684d?w=600&q=80",
    color: "Campur",
    care: "Professional",
  },
  {
    id: 7,
    name: "Buket Lavender Aromatik",
    category: "Bouquet",
    price: 175000,
    oldPrice: null,
    rating: 4.5,
    sold: 134,
    stock: 30,
    tag: null,
    description: "Lavender ungu kering dengan aroma menenangkan.",
    image: "https://images.unsplash.com/photo-1611867966136-3a2b5e5c9e98?w=600&q=80",
    color: "Ungu",
    care: "Mudah",
  },
  {
    id: 8,
    name: "Rangkaian Anggrek Premium",
    category: "Vas",
    price: 545000,
    oldPrice: 620000,
    rating: 4.9,
    sold: 64,
    stock: 9,
    tag: "bestseller",
    description: "Anggrek phalaenopsis putih dengan bunga pink di vas keramik.",
    image: "https://images.unsplash.com/photo-1567748157439-651aca2ff064?w=600&q=80",
    color: "Putih-Pink",
    care: "Sulit",
  },
];

const PRODUCTS_KEY = "rimbun-products";

// Muat dataset produk dari localStorage (biar hasil tambah/edit/hapus tersimpan),
// kalau belum ada, pakai seed data di atas.
function loadProducts() {
  try {
    const saved = localStorage.getItem(PRODUCTS_KEY);
    if (saved) return JSON.parse(saved);
  } catch {
    /* fallback ke default kalau data corrupt */
  }
  return JSON.parse(JSON.stringify(DEFAULT_PRODUCTS));
}

const apiService = {
  // BASE_URL: 'https://api.rimbun.com/v1', // Uncomment untuk produksi

  // Simulasi dataset dari backend (persist ke localStorage)
  _dataset: loadProducts(),

  _persist() {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(this._dataset));
  },

  async getProducts() {
    // Implementasi nyata: const res = await fetch(`${this.BASE_URL}/products`); return await res.json();
    return new Promise((resolve) => {
      setTimeout(() => resolve(JSON.parse(JSON.stringify(this._dataset))), 700);
    });
  },

  async getProductById(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const found = this._dataset.find((p) => p.id === parseInt(id));
        found
          ? resolve(JSON.parse(JSON.stringify(found)))
          : reject(new Error("Produk tidak ditemukan"));
      }, 500);
    });
  },

  // CRUD Bunga: Tambah produk baru (mirip pola submitUser() di modul 16)
  async addProduct(payload) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newId =
          this._dataset.length > 0 ? Math.max(...this._dataset.map((p) => p.id)) + 1 : 1;
        const newProduct = {
          id: newId,
          oldPrice: null,
          rating: 0,
          sold: 0,
          tag: null,
          ...payload,
        };
        this._dataset.push(newProduct);
        this._persist();
        resolve(JSON.parse(JSON.stringify(newProduct)));
      }, 600);
    });
  },

  // CRUD Bunga: Update produk (mirip pola updateUser() di modul 17)
  async updateProduct(id, payload) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const idx = this._dataset.findIndex((p) => p.id === parseInt(id));
        if (idx === -1) {
          reject(new Error("Produk tidak ditemukan"));
          return;
        }
        this._dataset[idx] = { ...this._dataset[idx], ...payload };
        this._persist();
        resolve(JSON.parse(JSON.stringify(this._dataset[idx])));
      }, 600);
    });
  },

  // CRUD Bunga: Hapus produk (mirip pola deleteUser() di modul 17)
  async deleteProduct(id) {
    return new Promise((resolve) => {
      setTimeout(() => {
        this._dataset = this._dataset.filter((p) => p.id !== parseInt(id));
        this._persist();
        resolve(true);
      }, 500);
    });
  },

  async submitContact(payload) {
    return new Promise((resolve) => {
      setTimeout(
        () => resolve({ success: true, ticketId: "RMB-" + Date.now().toString(36) }),
        1200,
      );
    });
  },

  async submitOrder(payload) {
    return new Promise((resolve) => {
      setTimeout(
        () => resolve({ success: true, orderId: "ORD-" + Date.now().toString(36) }),
        1400,
      );
    });
  },
};

export default apiService;
