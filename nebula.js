/**
 * Charting nebula — background for #ₛ
 */
(function () {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function boot() {
        const canvas = document.getElementById('nums-nebula');
        if (!canvas) return;
        const ctx = canvas.getContext('2d', { alpha: true });
        if (!ctx) return;

        let w = 0, h = 0, dpr = 1, raf = 0;
        const stars = [];
        const dust = [];
        const clouds = [];

        function resize() {
            dpr = Math.min(window.devicePixelRatio || 1, 2);
            w = window.innerWidth;
            h = window.innerHeight;
            canvas.width = Math.floor(w * dpr);
            canvas.height = Math.floor(h * dpr);
            canvas.style.width = w + 'px';
            canvas.style.height = h + 'px';
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        }

        function seed() {
            stars.length = 0; dust.length = 0; clouds.length = 0;
            const nStars = Math.floor((w * h) / 9000);
            for (let i = 0; i < nStars; i++) {
                stars.push({
                    x: Math.random() * w, y: Math.random() * h,
                    r: Math.random() * 1.4 + 0.2,
                    a: Math.random() * 0.7 + 0.15,
                    tw: Math.random() * Math.PI * 2,
                    sp: 0.004 + Math.random() * 0.012
                });
            }
            const nDust = Math.floor((w * h) / 14000);
            for (let i = 0; i < nDust; i++) {
                dust.push({
                    x: Math.random() * w, y: Math.random() * h,
                    vx: (Math.random() - 0.5) * 0.18,
                    vy: (Math.random() - 0.4) * 0.12,
                    r: Math.random() * 2.2 + 0.4,
                    gold: Math.random() > 0.55
                });
            }
            clouds.push(
                { x: w * 0.28, y: h * 0.32, r: Math.max(w, h) * 0.42, c: [209, 171, 91], a: 0.09 },
                { x: w * 0.72, y: h * 0.62, r: Math.max(w, h) * 0.48, c: [184, 58, 68], a: 0.1 },
                { x: w * 0.5, y: h * 0.18, r: Math.max(w, h) * 0.36, c: [72, 42, 110], a: 0.12 },
                { x: w * 0.18, y: h * 0.78, r: Math.max(w, h) * 0.34, c: [28, 70, 92], a: 0.1 }
            );
        }

        function drawClouds(t) {
            clouds.forEach((cl, i) => {
                const ox = Math.sin(t * 0.00008 + i) * 28;
                const oy = Math.cos(t * 0.00007 + i * 1.3) * 22;
                const g = ctx.createRadialGradient(cl.x + ox, cl.y + oy, 0, cl.x + ox, cl.y + oy, cl.r);
                g.addColorStop(0, 'rgba(' + cl.c.join(',') + ',' + cl.a + ')');
                g.addColorStop(0.45, 'rgba(' + cl.c.join(',') + ',' + (cl.a * 0.35) + ')');
                g.addColorStop(1, 'rgba(0,0,0,0)');
                ctx.fillStyle = g;
                ctx.beginPath();
                ctx.arc(cl.x + ox, cl.y + oy, cl.r, 0, Math.PI * 2);
                ctx.fill();
            });
        }

        function drawRing(t) {
            const cx = w * 0.5;
            const cy = h * 0.46;
            const R = Math.min(w, h) * 0.38;
            ctx.save();
            ctx.translate(cx, cy);
            ctx.rotate(t * 0.00004);
            ctx.strokeStyle = 'rgba(209,171,91,0.14)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(0, 0, R, 0, Math.PI * 2);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(0, 0, R * 0.72, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(184,58,68,0.1)';
            ctx.stroke();
            for (let i = 0; i < 12; i++) {
                const a = (i / 12) * Math.PI * 2;
                ctx.beginPath();
                ctx.moveTo(Math.cos(a) * R * 0.72, Math.sin(a) * R * 0.72);
                ctx.lineTo(Math.cos(a) * R, Math.sin(a) * R);
                ctx.strokeStyle = 'rgba(244,240,232,0.08)';
                ctx.stroke();
            }
            ctx.restore();
        }

        function frame(t) {
            ctx.fillStyle = '#070707';
            ctx.fillRect(0, 0, w, h);
            drawClouds(t);
            drawRing(t);
            stars.forEach((s) => {
                const tw = 0.45 + Math.sin(t * s.sp + s.tw) * 0.55;
                ctx.fillStyle = 'rgba(244,240,232,' + (s.a * tw) + ')';
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
                ctx.fill();
            });
            dust.forEach((p) => {
                p.x += p.vx; p.y += p.vy;
                if (p.x < -8) p.x = w + 8;
                if (p.x > w + 8) p.x = -8;
                if (p.y < -8) p.y = h + 8;
                if (p.y > h + 8) p.y = -8;
                ctx.fillStyle = p.gold ? 'rgba(209,171,91,0.35)' : 'rgba(184,58,68,0.28)';
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fill();
            });
            raf = requestAnimationFrame(frame);
        }

        function still() {
            ctx.fillStyle = '#070707';
            ctx.fillRect(0, 0, w, h);
            drawClouds(0);
            drawRing(0);
            stars.forEach((s) => {
                ctx.fillStyle = 'rgba(244,240,232,' + s.a + ')';
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
                ctx.fill();
            });
        }

        resize();
        seed();
        window.addEventListener('resize', () => {
            resize(); seed();
            if (reduced) still();
        });
        if (reduced) still();
        else raf = requestAnimationFrame(frame);
        window.addEventListener('pagehide', () => cancelAnimationFrame(raf));
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
    else boot();
})();
