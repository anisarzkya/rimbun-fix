export default {
  mounted(el, binding) {
    el.classList.add("fade-in-element");
    const delay = binding.value?.delay || 0;
    if (delay) el.style.transitionDelay = delay + "ms";

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => el.classList.add("visible"), delay);
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.12 },
    );

    observer.observe(el);
    el._observer = observer;
  },
  unmounted(el) {
    if (el._observer) el._observer.disconnect();
  },
};
