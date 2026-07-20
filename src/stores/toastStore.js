import { reactive } from "vue";

export const toastStore = reactive({
  list: [],
  add(message, type = "success") {
    const id = Date.now() + Math.random();
    this.list.push({ id, message, type });
    setTimeout(() => this.remove(id), 3000);
  },
  remove(id) {
    const idx = this.list.findIndex((t) => t.id === id);
    if (idx > -1) this.list.splice(idx, 1);
  },
});
