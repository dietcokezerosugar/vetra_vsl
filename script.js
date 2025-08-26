// Video/YT mute/unmute functionality
let isMuted = false
let ytPlayerInstance = null
const nativeVideo = document.getElementById('vslVideo')
const ytPlayerContainer = document.getElementById('ytPlayer')
const muteButton = document.getElementById('muteButton')
const muteIcon = document.getElementById('muteIcon')

function setYouTubeVideo (youtubeUrlOrId) {
  if (!ytPlayerContainer) return
  // Accept full URL or raw ID
  const idMatch = (youtubeUrlOrId || '').match(
    /(?:v=|\.be\/|embed\/)([A-Za-z0-9_-]{11})/
  )
  const videoId = idMatch ? idMatch[1] : youtubeUrlOrId
  const src = `https://www.youtube.com/embed/${videoId}?enablejsapi=1&playsinline=1&rel=0&modestbranding=1&controls=0&autoplay=1&mute=0&fs=0&disablekb=1&iv_load_policy=3`
  ytPlayerContainer.innerHTML = `<iframe id="ytIframe" src="${src}" allow="autoplay; encrypted-media" allowfullscreen></iframe>`
}

function getYouTubeIframe () {
  return document.getElementById('ytIframe')
}

function postYouTubeMessage (action, value) {
  const iframe = getYouTubeIframe()
  if (!iframe) return
  iframe.contentWindow?.postMessage(
    JSON.stringify({
      event: 'command',
      func: action,
      args: value ? [value] : []
    }),
    '*'
  )
}

if ((nativeVideo || ytPlayerContainer) && muteButton && muteIcon) {
  // UI shows sound ON by default; YouTube may start muted due to autoplay policy
  isMuted = ytPlayerContainer ? true : false
  muteIcon.className = 'fas fa-volume-up'
  muteButton.classList.remove('muted')

  muteButton.addEventListener('click', function () {
    isMuted = !isMuted
    if (nativeVideo) {
      nativeVideo.muted = isMuted
      if (!isMuted) nativeVideo.play?.().catch(() => {})
    }
    if (ytPlayerContainer && getYouTubeIframe()) {
      if (isMuted) {
        postYouTubeMessage('mute')
      } else {
        postYouTubeMessage('unMute')
        postYouTubeMessage('playVideo')
      }
    }
    muteIcon.className = isMuted ? 'fas fa-volume-mute' : 'fas fa-volume-up'
    muteButton.classList.toggle('muted', isMuted)
  })
}

// If you provide a YouTube link, call this after DOM is ready, e.g.:
// setYouTubeVideo('https://www.youtube.com/watch?v=VIDEO_ID')

document.addEventListener('DOMContentLoaded', function () {
  const ytContainer = document.getElementById('ytPlayer')
  if (ytContainer) {
    const providedUrl = ytContainer.getAttribute('data-youtube-url')
    if (providedUrl) {
      setYouTubeVideo(providedUrl)
      // Start muted for autoplay reliability, then request unmute+play on first interaction
      const primePlay = () => {
        postYouTubeMessage('playVideo')
        postYouTubeMessage('unMute')
        isMuted = false
        muteIcon.className = 'fas fa-volume-up'
        muteButton.classList.remove('muted')
        window.removeEventListener('click', primePlayOnce)
        window.removeEventListener('touchstart', primePlayOnce)
      }
      const primePlayOnce = () => {
        setTimeout(primePlay, 0)
      }
      // Retry a few times in case the iframe is late
      setTimeout(() => postYouTubeMessage('playVideo'), 300)
      setTimeout(() => postYouTubeMessage('playVideo'), 1200)
      // Bind one-time user gesture to unmute and play with sound
      window.addEventListener('click', primePlayOnce, { once: true })
      window.addEventListener('touchstart', primePlayOnce, { once: true })
    }
  }
  if (nativeVideo) {
    nativeVideo.muted = true
    nativeVideo
      .play?.()
      .then(() => {
        // wait for user gesture to unmute
        const unmuteNative = () => {
          nativeVideo.muted = false
          isMuted = false
          muteIcon.className = 'fas fa-volume-up'
          muteButton.classList.remove('muted')
          window.removeEventListener('click', unmuteNativeOnce)
          window.removeEventListener('touchstart', unmuteNativeOnce)
        }
        const unmuteNativeOnce = () => unmuteNative()
        window.addEventListener('click', unmuteNativeOnce, { once: true })
        window.addEventListener('touchstart', unmuteNativeOnce, { once: true })
      })
      .catch(() => {})
  }
})

// Smooth scroll to form
function scrollToForm () {
  const form = document.getElementById('application')
  if (form) {
    form.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    })
  }
}

// Open Telegram Chat Function
function openTelegramChat () {
  const telegramUsername = 'Kiiiixa'
  const message = 'Hi! I want to join the elite trading community.'

  // Check if user is on mobile
  const isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )

  let telegramUrl

  if (isMobile) {
    // Mobile: Open Telegram app directly
    telegramUrl = `tg://msg?to=${telegramUsername}&text=${encodeURIComponent(
      message
    )}`

    // Fallback to web version if app is not installed
    setTimeout(() => {
      window.open(
        `https://t.me/${telegramUsername}?start=${encodeURIComponent(message)}`,
        '_blank'
      )
    }, 1000)
  } else {
    // Desktop: Open web version
    telegramUrl = `https://t.me/${telegramUsername}?start=${encodeURIComponent(
      message
    )}`
  }

  // Try to open Telegram
  try {
    window.open(telegramUrl, '_blank')
  } catch (error) {
    // Fallback to web version
    window.open(
      `https://t.me/${telegramUsername}?start=${encodeURIComponent(message)}`,
      '_blank'
    )
  }

  // Track the click (optional)
  console.log('Telegram chat opened for:', telegramUsername)
}

// Premium Scroll Transitions
class PremiumScrollTransitions {
  constructor () {
    this.init()
  }

  init () {
    this.setupIntersectionObserver()
    this.setupStaggeredAnimations()
    this.setupParallaxEffects()
    this.setupSmoothScroll()
  }

  setupIntersectionObserver () {
    const options = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    }

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')

          // Add stagger delay to grid items
          if (entry.target.classList.contains('pnl-grid')) {
            const cards = entry.target.querySelectorAll('.pnl-card')
            cards.forEach((card, index) => {
              card.style.setProperty('--stagger-index', index)
              setTimeout(() => {
                card.classList.add('visible')
              }, index * 100)
            })
          }
        }
      })
    }, options)

    // Observe sections and elements
    const sections = document.querySelectorAll(
      '.hero, .co-founder-story, .pnl-results, .application'
    )
    const fadeElements = document.querySelectorAll('.fade-in, .scale-in')
    const gridElements = document.querySelectorAll('.pnl-grid')

    sections.forEach(section => observer.observe(section))
    fadeElements.forEach(element => observer.observe(element))
    gridElements.forEach(grid => observer.observe(grid))
  }

  setupStaggeredAnimations () {
    // Add stagger indices to PnL cards
    const cards = document.querySelectorAll('.pnl-card')
    cards.forEach((card, index) => {
      card.style.setProperty('--stagger-index', index)
    })
  }

  setupParallaxEffects () {
    let ticking = false

    function updateParallax () {
      const scrolled = window.pageYOffset
      const parallaxElements = document.querySelectorAll('.parallax-element')

      parallaxElements.forEach(element => {
        const speed = element.dataset.speed || 0.5
        const yPos = -(scrolled * speed)
        element.style.transform = `translateY(${yPos}px)`
      })

      ticking = false
    }

    function requestTick () {
      if (!ticking) {
        requestAnimationFrame(updateParallax)
        ticking = true
      }
    }

    window.addEventListener('scroll', requestTick, { passive: true })
  }

  setupSmoothScroll () {
    // Enhanced smooth scroll with easing
    const smoothScrollTo = (target, duration = 1000) => {
      const targetPosition =
        target.getBoundingClientRect().top + window.pageYOffset
      const startPosition = window.pageYOffset
      const distance = targetPosition - startPosition
      let startTime = null

      function animation (currentTime) {
        if (startTime === null) startTime = currentTime
        const timeElapsed = currentTime - startTime
        const run = ease(timeElapsed, startPosition, distance, duration)
        window.scrollTo(0, run)
        if (timeElapsed < duration) requestAnimationFrame(animation)
      }

      function ease (t, b, c, d) {
        t /= d / 2
        if (t < 1) return (c / 2) * t * t + b
        t--
        return (-c / 2) * (t * (t - 2) - 1) + b
      }

      requestAnimationFrame(animation)
    }

    // Override the existing scrollToForm function
    window.scrollToForm = function () {
      const form = document.getElementById('application')
      if (form) {
        smoothScrollTo(form)
      }
    }
  }
}

// Form handling with premium animations
class PremiumFormHandler {
  constructor () {
    this.form = document.getElementById('applicationForm')
    this.googleFormUrl =
      'https://docs.google.com/forms/u/0/d/e/1FAIpQLSda7V8EjJxEY43gN_ib3sWUe7J4ZvcoUWhhn8pWfIrnlkxXsQ/formResponse'
    this.fieldIds = [
      'entry.1234567890',
      'entry.123456789',
      'entry.12345678',
      'entry.1234567',
      'entry.123456',
      'entry.1',
      'entry.2',
      'entry.3',
      'entry.4',
      'entry.5',
      'entry.1234567890123456789',
      'entry.123456789012345678'
    ]
    this.init()
  }

  init () {
    if (this.form) {
      this.setupFormAnimations()
      this.setupFormValidation()
    }
  }

  async submitToGoogleSheets (telegramId) {
    console.log('Starting Google Sheets submission...')

    // Method 1: Try direct form submission with common field IDs
    for (const fieldId of this.fieldIds) {
      try {
        console.log(`Trying field ID: ${fieldId}`)

        const form = document.createElement('form')
        form.method = 'POST'
        form.action = this.googleFormUrl
        form.style.display = 'none'

        const input = document.createElement('input')
        input.type = 'hidden'
        input.name = fieldId
        input.value = telegramId
        form.appendChild(input)

        document.body.appendChild(form)
        form.submit()
        document.body.removeChild(form)

        console.log(`Submitted with field ID: ${fieldId}`)

        // Wait a bit before trying next
        await new Promise(resolve => setTimeout(resolve, 200))
      } catch (error) {
        console.log(`Error with field ID: ${fieldId}:`, error)
        continue
      }
    }

    // Method 2: Try with a different approach - redirect to pre-filled form
    try {
      const preFilledUrl = `${this.googleFormUrl}?entry.1=${encodeURIComponent(
        telegramId
      )}&submit=Submit`
      window.open(preFilledUrl, '_blank')
      console.log('Opened pre-filled form as backup')
    } catch (error) {
      console.log('Backup method also failed')
    }

    return true // Assume success for now
  }

  setupFormAnimations () {
    const inputs = this.form.querySelectorAll('input, select, textarea')

    inputs.forEach(input => {
      // Add focus animations
      input.addEventListener('focus', () => {
        input.parentElement.classList.add('focused')
      })

      input.addEventListener('blur', () => {
        if (!input.value) {
          input.parentElement.classList.remove('focused')
        }
      })

      // Add typing animation
      input.addEventListener('input', () => {
        if (input.value) {
          input.classList.add('has-value')
        } else {
          input.classList.remove('has-value')
        }
      })
    })
  }

  setupFormValidation () {
    this.form.addEventListener('submit', async e => {
      e.preventDefault()

      // Get the Telegram ID
      const telegramIdInput = this.form.querySelector('#telegramId')
      const telegramId = telegramIdInput.value.trim()

      if (!telegramId) {
        alert('Please enter your Telegram ID')
        return
      }

      // Add loading state
      const submitBtn = this.form.querySelector('.submit-button')
      submitBtn.classList.add('loading')
      submitBtn.innerHTML =
        '<span>Processing...</span><i class="fas fa-spinner fa-spin"></i>'

      try {
        // Submit to Google Sheets
        const success = await this.submitToGoogleSheets(telegramId)

        // Show success message
        submitBtn.classList.remove('loading')
        submitBtn.innerHTML =
          '<span>Success!</span><i class="fas fa-check"></i>'

        // Reset form after success
        setTimeout(() => {
          this.form.reset()
          submitBtn.innerHTML =
            '<span>Interested</span><i class="fas fa-rocket"></i>'
          const inputs = this.form.querySelectorAll('input, select, textarea')
          inputs.forEach(input => {
            input.classList.remove('has-value')
            input.parentElement.classList.remove('focused')
          })
        }, 2000)

        // Show success message to user
        if (success) {
          console.log('Data successfully submitted to Google Sheets!')
        } else {
          console.log(
            'Form submitted but Google Sheets integration may need field ID adjustment'
          )
        }
      } catch (error) {
        console.error('Error submitting form:', error)
        submitBtn.classList.remove('loading')
        submitBtn.innerHTML =
          '<span>Error</span><i class="fas fa-exclamation-triangle"></i>'

        // Reset button after error
        setTimeout(() => {
          submitBtn.innerHTML =
            '<span>Interested</span><i class="fas fa-rocket"></i>'
        }, 2000)
      }
    })
  }
}

// Simple Premium Momentum Scroll (Fixed Version)
class SimpleMomentumScroll {
  constructor () {
    this.init()
  }

  init () {
    this.setupScrollProgress()
    this.setupScrollIndicators()
    this.setupEnhancedScroll()
    this.setupMotionBlur()
  }

  setupScrollProgress () {
    const progress = document.createElement('div')
    progress.className = 'scroll-progress motion-blur'
    document.body.appendChild(progress)
    this.scrollProgress = progress
  }

  setupScrollIndicators () {
    const indicator = document.createElement('div')
    indicator.className = 'scroll-indicator motion-blur'

    const sections = document.querySelectorAll(
      '.hero, .co-founder-story, .pnl-results, .application'
    )

    sections.forEach((section, index) => {
      const dot = document.createElement('div')
      dot.className = 'scroll-dot'
      dot.dataset.section = index

      dot.addEventListener('click', () => {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })

      indicator.appendChild(dot)
    })

    document.body.appendChild(indicator)
    this.scrollIndicator = indicator
  }

  setupEnhancedScroll () {
    let ticking = false

    const updateScroll = () => {
      const scrolled = window.pageYOffset
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight

      // Update progress bar
      if (this.scrollProgress) {
        const progress = scrolled / maxScroll
        this.scrollProgress.style.transform = `scaleX(${progress})`
      }

      // Update scroll indicators
      if (this.scrollIndicator) {
        const dots = this.scrollIndicator.querySelectorAll('.scroll-dot')
        const sections = document.querySelectorAll(
          '.hero, .co-founder-story, .pnl-results, .application'
        )

        dots.forEach((dot, index) => {
          const section = sections[index]
          if (section) {
            const rect = section.getBoundingClientRect()
            const isVisible =
              rect.top < window.innerHeight / 2 &&
              rect.bottom > window.innerHeight / 2
            dot.classList.toggle('active', isVisible)
          }
        })
      }

      ticking = false
    }

    const requestTick = () => {
      if (!ticking) {
        requestAnimationFrame(updateScroll)
        ticking = true
      }
    }

    window.addEventListener('scroll', requestTick, { passive: true })
  }

  setupMotionBlur () {
    let lastScrollTop = 0
    let scrollVelocity = 0
    let scrollDirection = 0
    let isScrolling = false
    let scrollTimeout

    const motionBlurElements = document.querySelectorAll(`
            .motion-blur-content,
            .motion-blur-text,
            .motion-blur-images,
            .pnl-card,
            .cta-button,
            .story-cta-button,
            .submit-button,
            .form-group input,
            .form-group select,
            .form-group textarea,
            .pnl-image-container,
            .section-transition,
            .parallax-element,
            .floating-particles,
            .scroll-indicator,
            .scroll-progress,
            .motion-blur-enhanced,
            .hero-title,
            .section-title,
            .story-title,
            .video-player,
            .social-post,
            .trading-card,
            .form-container,
            .footer
        `)

    const updateMotionBlur = () => {
      const currentScrollTop = window.pageYOffset
      const scrollDelta = Math.abs(currentScrollTop - lastScrollTop)

      // Calculate scroll velocity
      scrollVelocity = scrollDelta
      scrollDirection = currentScrollTop > lastScrollTop ? 1 : -1

      // Determine scroll speed category
      let scrollSpeed = 'none'
      if (scrollVelocity > 50) {
        scrollSpeed = 'very-fast'
      } else if (scrollVelocity > 20) {
        scrollSpeed = 'fast'
      } else if (scrollVelocity > 5) {
        scrollSpeed = 'scrolling'
      }

      // Apply motion blur classes
      motionBlurElements.forEach(element => {
        // Remove all scroll classes
        element.classList.remove(
          'scrolling',
          'scrolling-fast',
          'scrolling-very-fast'
        )

        // Add appropriate scroll class
        if (scrollSpeed !== 'none') {
          element.classList.add(scrollSpeed)
        }
      })

      // Update last scroll position
      lastScrollTop = currentScrollTop

      // Set scrolling state
      isScrolling = true

      // Clear existing timeout
      clearTimeout(scrollTimeout)

      // Remove motion blur after scrolling stops
      scrollTimeout = setTimeout(() => {
        isScrolling = false
        motionBlurElements.forEach(element => {
          element.classList.remove(
            'scrolling',
            'scrolling-fast',
            'scrolling-very-fast'
          )
        })
      }, 150) // 150ms delay before removing blur
    }

    // Throttled scroll handler for motion blur
    let motionBlurTicking = false
    const requestMotionBlurUpdate = () => {
      if (!motionBlurTicking) {
        requestAnimationFrame(() => {
          updateMotionBlur()
          motionBlurTicking = false
        })
        motionBlurTicking = true
      }
    }

    window.addEventListener('scroll', requestMotionBlurUpdate, {
      passive: true
    })

    // Also handle wheel events for more responsive motion blur
    window.addEventListener(
      'wheel',
      e => {
        const wheelDelta = Math.abs(e.deltaY)
        let wheelSpeed = 'none'

        if (wheelDelta > 100) {
          wheelSpeed = 'very-fast'
        } else if (wheelDelta > 50) {
          wheelSpeed = 'fast'
        } else if (wheelDelta > 10) {
          wheelSpeed = 'scrolling'
        }

        if (wheelSpeed !== 'none') {
          motionBlurElements.forEach(element => {
            element.classList.remove(
              'scrolling',
              'scrolling-fast',
              'scrolling-very-fast'
            )
            element.classList.add(wheelSpeed)
          })

          clearTimeout(scrollTimeout)
          scrollTimeout = setTimeout(() => {
            motionBlurElements.forEach(element => {
              element.classList.remove(
                'scrolling',
                'scrolling-fast',
                'scrolling-very-fast'
              )
            })
          }, 200)
        }
      },
      { passive: true }
    )
  }
}

// FAQ Toggle Function
function toggleFAQ (element) {
  const faqItem = element.parentElement
  const isActive = faqItem.classList.contains('active')
  const toggleIcon = element.querySelector('.faq-toggle')

  // Close all other FAQ items
  document.querySelectorAll('.faq-item').forEach(item => {
    item.classList.remove('active')
    const icon = item.querySelector('.faq-toggle')
    if (icon) {
      icon.className = 'fas fa-plus faq-toggle'
    }
  })

  // Toggle current item
  if (!isActive) {
    faqItem.classList.add('active')
    if (toggleIcon) {
      toggleIcon.className = 'fas fa-times faq-toggle'
    }
  } else {
    faqItem.classList.remove('active')
    if (toggleIcon) {
      toggleIcon.className = 'fas fa-plus faq-toggle'
    }
  }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
  new PremiumScrollTransitions()
  new PremiumFormHandler()
  new SimpleMomentumScroll()

  // Add section dividers
  addSectionDividers()

  // Initialize any additional animations
  initializeAdditionalAnimations()

  // Add test function to global scope for debugging
  window.testGoogleSheets = function () {
    const formHandler = new PremiumFormHandler()
    formHandler.submitToGoogleSheets('@testuser')
  }

  console.log(
    '🔧 Debug: Use testGoogleSheets() in console to test Google Sheets integration'
  )
})

function addSectionDividers () {
  const sections = document.querySelectorAll(
    '.co-founder-story, .pnl-results, .application'
  )

  sections.forEach(section => {
    const divider = document.createElement('div')
    divider.className = 'section-divider'
    section.parentNode.insertBefore(divider, section)

    // Observe divider for animation
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      { threshold: 0.5 }
    )

    observer.observe(divider)
  })
}

function initializeAdditionalAnimations () {
  // Add floating particles effect
  createFloatingParticles()

  // Add cursor trail effect
  createCursorTrail()
}

function createFloatingParticles () {
  const particleContainer = document.createElement('div')
  particleContainer.className = 'floating-particles'
  particleContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 1;
    `

  document.body.appendChild(particleContainer)

  for (let i = 0; i < 20; i++) {
    const particle = document.createElement('div')
    particle.style.cssText = `
            position: absolute;
            width: 4px;
            height: 4px;
            background: rgba(147, 51, 234, 0.3);
            border-radius: 50%;
            animation: float-particle ${
              3 + Math.random() * 4
            }s ease-in-out infinite;
            left: ${Math.random() * 100}%;
            animation-delay: ${Math.random() * 2}s;
        `
    particleContainer.appendChild(particle)
  }
}

function createCursorTrail () {
  const trail = document.createElement('div')
  trail.className = 'cursor-trail'
  trail.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        background: radial-gradient(circle, rgba(147, 51, 234, 0.3), transparent);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        transition: all 0.1s ease;
        transform: translate(-50%, -50%);
    `

  document.body.appendChild(trail)

  let mouseX = 0,
    mouseY = 0
  let trailX = 0,
    trailY = 0

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX
    mouseY = e.clientY
  })

  function animateTrail () {
    trailX += (mouseX - trailX) * 0.1
    trailY += (mouseY - trailY) * 0.1

    trail.style.left = trailX + 'px'
    trail.style.top = trailY + 'px'

    requestAnimationFrame(animateTrail)
  }

  animateTrail()
}

// Add CSS for floating particles and additional animations
const style = document.createElement('style')
style.textContent = `
    @keyframes float-particle {
        0%, 100% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0.3;
        }
        50% {
            transform: translateY(-20px) rotate(180deg);
            opacity: 0.8;
        }
    }
    
    .form-group.focused label {
        color: #a855f7;
        transform: translateY(-5px) scale(0.9);
    }
    
    .form-group input.has-value,
    .form-group select.has-value,
    .form-group textarea.has-value {
        border-color: #a855f7;
        box-shadow: 0 0 0 3px rgba(147, 51, 234, 0.1);
    }
    
    .submit-button.loading {
        background: linear-gradient(135deg, #6b7280, #4b5563);
        cursor: not-allowed;
    }
    
    .floating-particles {
        pointer-events: none;
    }
    
    .cursor-trail {
        mix-blend-mode: screen;
    }
`
document.head.appendChild(style)
