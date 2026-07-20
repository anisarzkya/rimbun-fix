import { reactive } from "vue";

export const cartStore = reactive({
  items: JSON.parse(localStorage.getItem("rimbun-cart") || "[]"),

  save() {
    localStorage.setItem("rimbun-cart", JSON.stringify(this.items));
  },

  get count() {
    return this.items.reduce((sum, i) => sum + i.qty, 0);
  },
  get subtotal() {
    return this.items.reduce((sum, i) => sum + i.price * i.qty, 0);
  },
  get shipping() {
    return this.subtotal > 500000 || this.subtotal === 0 ? 0 : 25000;
  },
  get total() {
    return this.subtotal + this.shipping;
  },

  add(product, qty = 1) {
    const existing = this.items.find((i) => i.id === product.id);
    if (existing) {
      existing.qty = Math.min(existing.qty + qty, product.stock);
    } else {
      this.items.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
        stock: product.stock,
        qty: Math.min(qty, product.stock),
      });
    }
    this.save();
  },
  updateQty(id, qty) {
    const item = this.items.find((i) => i.id === id);
    if (item) item.qty = Math.max(1, Math.min(qty, item.stock));
    this.save();
  },
  remove(id) {
    const idx = this.items.findIndex((i) => i.id === id);
    if (idx > -1) this.items.splice(idx, 1);
    this.save();
  },
  clear() {
    this.items.splice(0);
    this.save();
  },
});
