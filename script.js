/* ============================================
   GOH JUN SIONG — Personal Portfolio
   Interactive JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ---- Language Toggle ---- //
    const langBtns = document.querySelectorAll('.lang-toggle-btn');
    langBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const isZh = document.body.classList.contains('lang-zh');
            if (isZh) {
                document.body.classList.replace('lang-zh', 'lang-en');
                langBtns.forEach(b => b.textContent = '中');
            } else {
                document.body.classList.replace('lang-en', 'lang-zh');
                langBtns.forEach(b => b.textContent = 'EN');
            }
        });
    });

    // ---- Preloader ---- //
    const preloader = document.getElementById('preloader');
    const counterNumber = document.getElementById('counter-number');
    const header = document.getElementById('header');
    let progress = 0;

    function animateCounter() {
        const interval = setInterval(() => {
            progress += Math.random() * 3 + 1;
            if (progress >= 100) {
                progress = 100;
                counterNumber.textContent = '100';
                clearInterval(interval);

                preloader.classList.add('revealing');

                setTimeout(() => {
                    preloader.classList.add('hidden');
                    header.classList.add('visible');
                    initHeroAnimations();
                    initScrollAnimations();
                }, 600);
            } else {
                counterNumber.textContent = String(Math.floor(progress)).padStart(2, '0');
            }
        }, 40);
    }

    animateCounter();

    // ---- Grain Canvas ---- //
    const grainCanvas = document.getElementById('grain-canvas');
    if (grainCanvas) {
        const ctx = grainCanvas.getContext('2d');
        let animFrame;

        function resizeGrain() {
            grainCanvas.width = window.innerWidth / 2;
            grainCanvas.height = window.innerHeight / 2;
        }

        function renderGrain() {
            const w = grainCanvas.width;
            const h = grainCanvas.height;
            const imageData = ctx.createImageData(w, h);
            const data = imageData.data;

            for (let i = 0; i < data.length; i += 4) {
                const v = Math.random() * 255;
                data[i] = v;
                data[i + 1] = v;
                data[i + 2] = v;
                data[i + 3] = 20;
            }

            ctx.putImageData(imageData, 0, 0);
            animFrame = requestAnimationFrame(renderGrain);
        }

        resizeGrain();
        renderGrain();
        window.addEventListener('resize', resizeGrain);
    }

    // ---- Floating Words ---- //
    function initHeroAnimations() {
        const heroName = document.getElementById('hero-name');
        const heroSubtitle = document.getElementById('hero-subtitle');
        const heroScroll = document.getElementById('hero-scroll');
        const floatingWords = document.querySelectorAll('.float-word');
        const floatingPhotos = document.querySelectorAll('.float-photo');

        // Position floating words randomly in the upper-middle area
        floatingWords.forEach((word, i) => {
            const x = 15 + Math.random() * 70; // 15% to 85% width
            const y = 5 + Math.random() * 35;  // 5% to 40% height (above the name which is at 50%)
            word.style.left = x + '%';
            word.style.top = y + '%';

            // Animate in with stagger
            setTimeout(() => {
                word.classList.add('visible');
            }, 200 + i * 80);
        });

        // Gentle floating animation for words
        floatingWords.forEach((word) => {
            const speed = 0.3 + Math.random() * 0.5;
            const amplitude = 5 + Math.random() * 15;
            const phase = Math.random() * Math.PI * 2;
            let startTime = performance.now();

            function float(time) {
                const elapsed = (time - startTime) / 1000;
                const offsetY = Math.sin(elapsed * speed + phase) * amplitude;
                const offsetX = Math.cos(elapsed * speed * 0.7 + phase) * (amplitude * 0.5);
                word.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
                requestAnimationFrame(float);
            }
            requestAnimationFrame(float);
        });

        // Show photo stack
        const photoStack = document.getElementById('photo-stack');
        if (photoStack) {
            setTimeout(() => {
                photoStack.classList.add('visible');
            }, 900);
        }

        // Show hero name
        setTimeout(() => {
            heroName.classList.add('visible');
        }, 300);

        setTimeout(() => {
            heroSubtitle.classList.add('visible');
        }, 600);

        setTimeout(() => {
            heroScroll.classList.add('visible');
        }, 1200);
    }

    // ---- Scroll Indicator ---- //
    const scrollIndicator = document.querySelector('.scroll-indicator');
    const scrollThumb = document.getElementById('scroll-thumb');

    function updateScrollIndicator() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = docHeight > 0 ? scrollTop / docHeight : 0;
        const thumbTravel = 90; // max translateY in vh

        scrollThumb.style.transform = `translateY(${scrollPercent * thumbTravel}vh)`;

        if (scrollTop > 100) {
            scrollIndicator.classList.add('visible');
        } else {
            scrollIndicator.classList.remove('visible');
        }
    }

    window.addEventListener('scroll', updateScrollIndicator, { passive: true });

    // ---- Scroll Reveal Animations ---- //
    function initScrollAnimations() {
        const revealElements = document.querySelectorAll('.manifesto-line, .section-title, .contact-title');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                }
            });
        }, {
            threshold: 0.2,
            rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach((el) => observer.observe(el));

        // Global Text Reveal for paragraphs, headings, etc.
        const textElements = document.querySelectorAll('p:not(.marquee-caption-title):not(.marquee-caption-role):not(.marquee-caption-desc), h1, h2:not(.section-title), h3, h4, h5, h6, li, .accordion-body-title, .footer-email, .hero-subtitle');
        textElements.forEach((el) => {
            // Exclude elements that are already part of another specific reveal logic
            if (!el.closest('.manifesto-line')) {
                el.classList.add('fade-up-text');
                observer.observe(el);
            }
        });
    }

    // ---- Active Navigation ---- //
    const sections = document.querySelectorAll('section[id], .hero');
    const navLinks = document.querySelectorAll('.nav-link');

    function updateActiveNav() {
        const scrollPos = window.scrollY + window.innerHeight / 3;

        // Map section IDs to nav link hrefs
        const sectionMap = {};
        sections.forEach((section) => {
            const id = section.id;
            if (id) {
                sectionMap[id] = {
                    top: section.offsetTop,
                    bottom: section.offsetTop + section.offsetHeight
                };
            }
        });

        navLinks.forEach((link) => {
            const href = link.getAttribute('href').replace('#', '');
            const section = sectionMap[href];
            if (section && scrollPos >= section.top && scrollPos < section.bottom) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav, { passive: true });

    // ---- Mobile Menu ---- //
    const burgerBtn = document.getElementById('burger-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-menu-link');

    if (burgerBtn) {
        burgerBtn.addEventListener('click', () => {
            const isOpen = burgerBtn.classList.toggle('open');
            mobileMenu.classList.toggle('open', isOpen);
            burgerBtn.setAttribute('aria-expanded', isOpen);
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });

        mobileLinks.forEach((link) => {
            link.addEventListener('click', () => {
                burgerBtn.classList.remove('open');
                mobileMenu.classList.remove('open');
                burgerBtn.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        });
    }

    // ---- Smooth Scroll for anchor links ---- //
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ---- Hero Canvas (dot grid) ---- //
    const heroCanvas = document.getElementById('hero-canvas');
    if (heroCanvas) {
        const hctx = heroCanvas.getContext('2d');
        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;

        function resizeHeroCanvas() {
            heroCanvas.width = window.innerWidth;
            heroCanvas.height = window.innerHeight;
        }

        function drawDotGrid() {
            hctx.clearRect(0, 0, heroCanvas.width, heroCanvas.height);

            const spacing = 40;
            const maxDist = 200;

            for (let x = spacing / 2; x < heroCanvas.width; x += spacing) {
                for (let y = spacing / 2; y < heroCanvas.height; y += spacing) {
                    const dx = x - mouseX;
                    const dy = y - mouseY;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    const influence = Math.max(0, 1 - dist / maxDist);

                    const baseSize = 1;
                    const size = baseSize + influence * 3;
                    const alpha = 0.06 + influence * 0.15;

                    hctx.beginPath();
                    hctx.arc(x, y, size, 0, Math.PI * 2);
                    hctx.fillStyle = `rgba(83, 83, 82, ${alpha})`;
                    hctx.fill();
                }
            }

            requestAnimationFrame(drawDotGrid);
        }

        resizeHeroCanvas();
        drawDotGrid();

        window.addEventListener('resize', resizeHeroCanvas);
        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });
    }

    // ---- Parallax on floating words (subtle) ---- //
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const hero = document.querySelector('.hero');
        if (hero && scrollY < window.innerHeight) {
            const progress = scrollY / window.innerHeight;
            const heroCenter = document.querySelector('.hero-center');
            if (heroCenter) {
                heroCenter.style.transform = `translate(-50%, calc(-50% + ${scrollY * 0.3}px))`;
                heroCenter.style.opacity = 1 - progress * 1.5;
            }
            const scrollHint = document.getElementById('hero-scroll');
            if (scrollHint) {
                scrollHint.style.opacity = Math.max(0, 0.4 - progress * 2);
            }
        }
    }, { passive: true });

    // ---- Toggle Academic Grids ---- //
    const toggleTitles = document.querySelectorAll('.toggle-title');
    toggleTitles.forEach(title => {
        title.addEventListener('click', () => {
            const targetId = title.getAttribute('data-target');
            const targetGrid = document.getElementById(targetId);
            if (targetGrid) {
                targetGrid.classList.toggle('expanded');
                title.classList.toggle('expanded');
            }
        });
    });

    // ---- Lightbox Gallery ---- //
    const masonryItems = document.querySelectorAll('.masonry-item');
    const lightboxModal = document.getElementById('lightbox-modal');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxNext = document.querySelector('.lightbox-nav.next');
    const lightboxPrev = document.querySelector('.lightbox-nav.prev');
    let currentImageIndex = 0;
    const galleryImages = Array.from(document.querySelectorAll('.gallery-img')).map(img => img.src);

    if (masonryItems.length > 0 && lightboxModal) {
        masonryItems.forEach((item, index) => {
            item.addEventListener('click', () => {
                currentImageIndex = index;
                openLightbox();
            });
        });

        lightboxClose.addEventListener('click', closeLightbox);
        
        lightboxModal.addEventListener('click', (e) => {
            if (e.target === lightboxModal) {
                closeLightbox();
            }
        });

        lightboxNext.addEventListener('click', showNextImage);
        lightboxPrev.addEventListener('click', showPrevImage);

        document.addEventListener('keydown', (e) => {
            if (!lightboxModal.classList.contains('active')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') showNextImage();
            if (e.key === 'ArrowLeft') showPrevImage();
        });
    }

    function openLightbox() {
        lightboxImg.src = galleryImages[currentImageIndex];
        lightboxModal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }

    function closeLightbox() {
        lightboxModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    function showNextImage() {
        currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
        lightboxImg.src = galleryImages[currentImageIndex];
    }

    function showPrevImage() {
        currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
        lightboxImg.src = galleryImages[currentImageIndex];
    }

});
