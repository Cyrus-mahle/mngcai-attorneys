/* ==========================================================================
   M Ngcai Attorneys Inc. - Page behaviour (vanilla JS + Bootstrap 5 JS API)
   ========================================================================== */
(function () {
    'use strict';

    /* ---------- Dynamic copyright year ---------- */
    var yearEl = document.getElementById('currentYear');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    /* ---------- Logo fallback: show text if the image fails to load ---------- */
    document.querySelectorAll('img[data-fallback]').forEach(function (img) {
        function showFallback() {
            img.classList.add('d-none');
            var fallback = img.nextElementSibling;
            if (fallback) {
                fallback.classList.remove('d-none');
                fallback.classList.add('d-block');
            }
        }
        img.addEventListener('error', showFallback);
        if (img.complete && img.naturalWidth === 0) showFallback();
    });

    /* ---------- Canvas particle network animation ---------- */
    var canvas = document.getElementById('particleCanvas');
    if (canvas) {
        var ctx = canvas.getContext('2d');
        var particles = [];

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        function Particle() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.4;
            this.vy = (Math.random() - 0.5) * 0.4;
            this.radius = Math.random() * 1.8 + 0.5;
            this.alpha = Math.random() * 0.6 + 0.2;
        }
        Particle.prototype.update = function () {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        };
        Particle.prototype.draw = function () {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(212, 175, 55, ' + this.alpha + ')';
            ctx.fill();
        };

        function initParticles() {
            particles = [];
            var count = Math.min(Math.floor(window.innerWidth / 15), 80);
            for (var i = 0; i < count; i++) particles.push(new Particle());
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            for (var i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();

                for (var j = i + 1; j < particles.length; j++) {
                    var dx = particles[i].x - particles[j].x;
                    var dy = particles[i].y - particles[j].y;
                    var dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 120) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = 'rgba(212, 175, 55, ' + (0.15 * (1 - dist / 120)) + ')';
                        ctx.lineWidth = 0.6;
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(animateParticles);
        }

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
        initParticles();
        animateParticles();
    }

    /* ---------- Mobile menu (Bootstrap Collapse) ---------- */
    var mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenu) {
        var menuCollapse = bootstrap.Collapse.getOrCreateInstance(mobileMenu, { toggle: false });
        document.querySelectorAll('[data-close-menu]').forEach(function (el) {
            el.addEventListener('click', function () { menuCollapse.hide(); });
        });
    }

    /* ---------- Practice area modal (Bootstrap Modal) ---------- */
    var areaModalEl = document.getElementById('areaModal');
    var bookingModalEl = document.getElementById('bookingModal');

    if (areaModalEl) {
        areaModalEl.addEventListener('show.bs.modal', function (event) {
            var trigger = event.relatedTarget;
            if (!trigger) return;
            document.getElementById('modalTitle').textContent = trigger.getAttribute('data-title') || 'Practice Area';
            document.getElementById('modalDescription').textContent = trigger.getAttribute('data-description') || '';
        });

        // "Book Consultation" inside the area modal: close it, then open the booking modal
        var areaBookBtn = areaModalEl.querySelector('[data-open-booking]');
        if (areaBookBtn && bookingModalEl) {
            areaBookBtn.addEventListener('click', function () {
                areaModalEl.addEventListener('hidden.bs.modal', function () {
                    bootstrap.Modal.getOrCreateInstance(bookingModalEl).show();
                }, { once: true });
                bootstrap.Modal.getOrCreateInstance(areaModalEl).hide();
            });
        }
    }

    /* ---------- Form submission feedback ---------- */
    document.querySelectorAll('form[data-feedback]').forEach(function (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault();

            var feedback = document.getElementById(form.getAttribute('data-feedback'));
            if (!feedback) return;

            feedback.classList.remove('d-none');
            form.reset();

            setTimeout(function () {
                feedback.classList.add('d-none');

                var modalId = form.getAttribute('data-close-modal');
                if (modalId) {
                    var modalEl = document.getElementById(modalId);
                    var instance = modalEl && bootstrap.Modal.getInstance(modalEl);
                    if (instance) instance.hide();
                }
            }, 4000);
        });
    });
})();
