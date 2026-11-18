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

document
  .querySelectorAll('.section, .flight-card, .easter, .leave-tip, .return-chip')
  .forEach((el) => {
    el.classList.add('scroll-fade')
    observer.observe(el)
  })

const variantButtons = [...document.querySelectorAll('[data-variant]')]
const variantPanels = [...document.querySelectorAll('[data-variant-panel]')]

function revealScrollFade(root) {
  if (!root) return
  if (root.classList.contains('scroll-fade')) {
    root.classList.add('is-visible')
  }
  root.querySelectorAll('.scroll-fade').forEach((el) => {
    el.classList.add('is-visible')
  })
}

function setVariant(variant) {
  variantButtons.forEach((btn) => {
    const selected = btn.dataset.variant === variant
    btn.setAttribute('aria-selected', selected ? 'true' : 'false')
    btn.tabIndex = selected ? 0 : -1
  })

  variantPanels.forEach((panel) => {
    const match = panel.dataset.variantPanel === variant
    panel.hidden = !match
    if (match) revealScrollFade(panel)
  })
}

variantButtons.forEach((btn) => {
  btn.addEventListener('click', () => setVariant(btn.dataset.variant))
  btn.addEventListener('keydown', (event) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
    event.preventDefault()
    const group = [
      ...(btn.closest('[role="tablist"]')?.querySelectorAll('[data-variant]') ||
        []),
    ]
    if (group.length === 0) return
    const index = group.indexOf(btn)
    const next =
      event.key === 'ArrowRight'
        ? group[(index + 1) % group.length]
        : group[(index - 1 + group.length) % group.length]
    setVariant(next.dataset.variant)
    next.focus()
  })
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

const lightboxes = new Map(
  [...document.querySelectorAll('.lightbox')].map((el) => [el.id, el]),
)

let lastTrigger = null

function getFocusable(root) {
  return [
    ...root.querySelectorAll(
      'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    ),
  ].filter((el) => !el.hasAttribute('disabled') && el.getAttribute('aria-hidden') !== 'true')
}

function openLightbox(id, trigger) {
  const dialog = lightboxes.get(id)
  if (!dialog || !dialog.hidden) return

  lastTrigger = trigger || document.activeElement
  dialog.hidden = false
  document.body.classList.add('lightbox-open')

  const closeBtn = dialog.querySelector('.lightbox__close')
  const focusTarget = closeBtn || dialog
  if (typeof focusTarget.focus === 'function') {
    try {
      focusTarget.focus({ preventScroll: true })
    } catch {
      focusTarget.focus()
    }
  }
}

function closeLightbox(dialog) {
  if (!dialog || dialog.hidden) return
  dialog.hidden = true
  document.body.classList.remove('lightbox-open')
  if (lastTrigger && typeof lastTrigger.focus === 'function') {
    lastTrigger.focus()
  }
  lastTrigger = null
}

document.querySelectorAll('[data-lightbox]').forEach((trigger) => {
  const id = `lightbox-${trigger.dataset.lightbox}`

  trigger.addEventListener('click', () => openLightbox(id, trigger))
  trigger.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      openLightbox(id, trigger)
    }
  })
})

document.querySelectorAll('[data-lightbox-close]').forEach((btn) => {
  btn.addEventListener('click', () => {
    closeLightbox(btn.closest('.lightbox'))
  })
})

document.addEventListener('keydown', (event) => {
  const open = [...lightboxes.values()].find((el) => !el.hidden)
  if (!open) return

  if (event.key === 'Escape') {
    event.preventDefault()
    closeLightbox(open)
    return
  }

  if (event.key !== 'Tab') return

  const focusable = getFocusable(open)
  if (focusable.length === 0) {
    event.preventDefault()
    return
  }

  const first = focusable[0]
  const last = focusable[focusable.length - 1]
  const active = document.activeElement

  if (event.shiftKey && active === first) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && active === last) {
    event.preventDefault()
    first.focus()
  }
})
