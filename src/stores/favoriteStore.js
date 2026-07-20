import { reactive } from "vue";

export const favoriteStore = reactive({
  ids: JSON.parse(localStorage.getItem("rimbun-favs") || "[]"),

  toggle(id) {
    const idx = this.ids.indexOf(id);
    if (idx > -1) this.ids.splice(idx, 1);
    else this.ids.push(id);
    localStorage.setItem("rimbun-favs", JSON.stringify(this.ids));
  },
  has(id) {
    return this.ids.includes(id);
  },
});
