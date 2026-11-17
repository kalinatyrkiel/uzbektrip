const observer = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible')
        observer.unobserve(entry.target)
      }
    }
  },
  { threshold: 0.16, rootMargin: '0px 0px -8% 0px' },
)

document.querySelectorAll('.section, .flight-card, .easter').forEach((el) => {
  el.classList.add('scroll-fade')
  observer.observe(el)
})

const style = document.createElement('style')
style.textContent = `
  .scroll-fade {
    opacity: 0;
    transform: translateY(22px);
    transition: opacity 0.55s ease, transform 0.55s cubic-bezier(0.22, 1, 0.36, 1);
  }
  .scroll-fade.is-visible {
    opacity: 1;
    transform: translateY(0);
  }
  @media (prefers-reduced-motion: reduce) {
    .scroll-fade {
      opacity: 1;
      transform: none;
      transition: none;
    }
  }
`
document.head.appendChild(style)
