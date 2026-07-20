export default {
  mounted(el, binding) {
    const value = binding.value;
    el.textContent = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  },
  updated(el, binding) {
    const value = binding.value;
    el.textContent = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  },
};
