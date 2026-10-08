import React, { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  targetX: number | null;
  targetY: number | null;
  radius: number;
  glowCanvas: HTMLCanvasElement;
  baseAlpha: number;
  twinkleSpeed: number;
  twinklePhase: number;
  seedX: number;
  seedY: number;
}

interface TargetPoint {
  x: number;
  y: number;
}

// Convert hex color to rgba helper
function hexToRgba(hex: string, alpha: number): string {
  const clean = hex.replace("#", "");
  const num = parseInt(clean, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// Pre-render soft glow halo textures for each particle color
function createGlowTextures(): Record<string, HTMLCanvasElement> {
  const colors = ["#C7A8DF", "#F7E7CE", "#FAD2E1", "#C62E4E"];
  const textures: Record<string, HTMLCanvasElement> = {};

  colors.forEach((color) => {
    const c = document.createElement("canvas");
    c.width = 36;
    c.height = 36;
    const ctx = c.getContext("2d");
    if (ctx) {
      const grad = ctx.createRadialGradient(18, 18, 0, 18, 18, 18);
      grad.addColorStop(0, hexToRgba(color, 1.0));
      grad.addColorStop(0.25, hexToRgba(color, 0.85));
      grad.addColorStop(0.6, hexToRgba(color, 0.25));
      grad.addColorStop(1, hexToRgba(color, 0.0));
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(18, 18, 18, 0, Math.PI * 2);
      ctx.fill();
    }
    textures[color] = c;
  });

  return textures;
}

// Helper to draw a rounded rectangle
function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + width - r, y);
  ctx.arcTo(x + width, y, x + width, y + r, r);
  ctx.lineTo(x + width, y + height - r);
  ctx.arcTo(x + width, y + height, x + width - r, y + height, r);
  ctx.lineTo(x + r, y + height);
  ctx.arcTo(x, y + height, x, y + height - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

/**
 * Samples shape target points by drawing on an offscreen canvas in the upper half of the section
 */
function sampleShapeTargets(
  shapeType: "sitting_dog" | "heart" | "dog_face",
  width: number,
  height: number,
  targetCount: number
): TargetPoint[] {
  const offscreen = document.createElement("canvas");
  offscreen.width = width;
  offscreen.height = height;
  const ctx = offscreen.getContext("2d", { willReadFrequently: true });
  if (!ctx) return [];

  // Shapes are placed in the upper half
  const cx = width / 2;
  // Center Y in upper half (between 24% and 30% of total height, with safety padding)
  const cy = Math.max(90, Math.min(height * 0.28, height * 0.45));

  // Responsive scale factor
  const isMobile = width < 768;
  const s = isMobile
    ? Math.max(0.65, Math.min(width / 420, height / 700, 0.95))
    : Math.max(0.9, Math.min(width / 800, height / 850, 1.25));

  ctx.fillStyle = "#ffffff";
  ctx.strokeStyle = "#ffffff";

  if (shapeType === "sitting_dog") {
    // 1. Perrito sentado de perfil:
    // - cuerpo como elipse
    // - cabeza como circulo
    // - hocico como elipse pequena
    // - oreja caida como elipse rotada
    // - dos patas como rectangulos redondeados
    // - cola como una curva gruesa

    // Cuerpo (elipse)
    ctx.save();
    ctx.translate(cx + 8 * s, cy + 24 * s);
    ctx.rotate(-0.18);
    ctx.beginPath();
    ctx.ellipse(0, 0, 32 * s, 48 * s, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Cabeza (circulo)
    ctx.beginPath();
    ctx.arc(cx - 24 * s, cy - 36 * s, 26 * s, 0, Math.PI * 2);
    ctx.fill();

    // Hocico (elipse pequena)
    ctx.beginPath();
    ctx.ellipse(cx - 46 * s, cy - 30 * s, 17 * s, 11 * s, -0.06, 0, Math.PI * 2);
    ctx.fill();

    // Oreja caida (elipse rotada)
    ctx.save();
    ctx.translate(cx - 14 * s, cy - 25 * s);
    ctx.rotate(0.38);
    ctx.beginPath();
    ctx.ellipse(0, 0, 11 * s, 25 * s, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Pata delantera (rectangulo redondeado)
    drawRoundedRect(ctx, cx - 34 * s, cy + 26 * s, 14 * s, 48 * s, 7 * s);
    ctx.fill();

    // Pata trasera / anca (rectangulo redondeado / elipse)
    drawRoundedRect(ctx, cx + 4 * s, cy + 50 * s, 34 * s, 24 * s, 11 * s);
    ctx.fill();

    // Cola (curva gruesa)
    ctx.lineWidth = 11 * s;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(cx + 34 * s, cy + 44 * s);
    ctx.quadraticCurveTo(cx + 66 * s, cy + 26 * s, cx + 58 * s, cy - 8 * s);
    ctx.stroke();
  } else if (shapeType === "dog_face") {
    // 2. Cara de perrito de frente:
    // - circulo para la cabeza
    // - dos orejas caidas como elipses rotadas a los lados
    // - hocico como elipse
    // - nariz como un circulo pequeno

    // Cabeza (circulo)
    ctx.beginPath();
    ctx.arc(cx, cy, 50 * s, 0, Math.PI * 2);
    ctx.fill();

    // Oreja izquierda caida (elipse rotada)
    ctx.save();
    ctx.translate(cx - 52 * s, cy - 6 * s);
    ctx.rotate(-0.35);
    ctx.beginPath();
    ctx.ellipse(0, 0, 15 * s, 36 * s, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Oreja derecha caida (elipse rotada)
    ctx.save();
    ctx.translate(cx + 52 * s, cy - 6 * s);
    ctx.rotate(0.35);
    ctx.beginPath();
    ctx.ellipse(0, 0, 15 * s, 36 * s, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Hocico (elipse)
    ctx.beginPath();
    ctx.ellipse(cx, cy + 20 * s, 26 * s, 19 * s, 0, 0, Math.PI * 2);
    ctx.fill();

    // Nariz (circulo pequeno)
    ctx.beginPath();
    ctx.arc(cx, cy + 10 * s, 9 * s, 0, Math.PI * 2);
    ctx.fill();
  } else if (shapeType === "heart") {
    // 3. Un corazon
    const hSize = 58 * s;
    ctx.beginPath();
    ctx.moveTo(cx, cy + hSize * 0.88);
    ctx.bezierCurveTo(
      cx - hSize * 1.3,
      cy + hSize * 0.05,
      cx - hSize * 1.2,
      cy - hSize * 0.95,
      cx,
      cy - hSize * 0.38
    );
    ctx.bezierCurveTo(
      cx + hSize * 1.2,
      cy - hSize * 0.95,
      cx + hSize * 1.3,
      cy + hSize * 0.05,
      cx,
      cy + hSize * 0.88
    );
    ctx.fill();
  }

  // Sample pixel grid
  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;
  const validPixels: TargetPoint[] = [];

  // Determine search bounding box
  const minX = Math.max(0, Math.floor(cx - 160 * s));
  const maxX = Math.min(width, Math.ceil(cx + 160 * s));
  const minY = Math.max(0, Math.floor(cy - 140 * s));
  const maxY = Math.min(height, Math.ceil(cy + 140 * s));

  // Step through pixels
  const step = isMobile ? 3 : 2;
  for (let py = minY; py < maxY; py += step) {
    for (let px = minX; px < maxX; px += step) {
      const idx = (py * width + px) * 4;
      if (data[idx + 3] > 100) {
        validPixels.push({ x: px, y: py });
      }
    }
  }

  if (validPixels.length === 0) {
    return Array.from({ length: targetCount }, () => ({
      x: cx,
      y: cy,
    }));
  }

  // Evenly distribute target points across valid pixels
  const targets: TargetPoint[] = [];
  const total = validPixels.length;
  for (let i = 0; i < targetCount; i++) {
    const sampleIdx = Math.floor((i / targetCount) * total);
    const pt = validPixels[sampleIdx];
    targets.push({
      x: pt.x + (Math.random() - 0.5) * 1.5,
      y: pt.y + (Math.random() - 0.5) * 1.5,
    });
  }

  return targets;
}

export const ParticleField: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Setup glow textures
    const glowTextures = createGlowTextures();
    const colorKeys = ["#C7A8DF", "#F7E7CE", "#FAD2E1", "#C62E4E"];

    let width = parent.clientWidth || 360;
    let height = parent.clientHeight || 600;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let particleCount = width < 768 ? 450 : 900;
    let particles: Particle[] = [];

    // Shapes cache
    let sittingDogTargets: TargetPoint[] = [];
    let heartTargets: TargetPoint[] = [];
    let dogFaceTargets: TargetPoint[] = [];

    function initParticles(count: number, w: number, h: number) {
      particles = [];
      for (let i = 0; i < count; i++) {
        // Color distribution: #C7A8DF, #F7E7CE, #FAD2E1, and few in #C62E4E
        const rand = Math.random();
        let colorKey = "#C7A8DF";
        if (rand < 0.38) colorKey = "#C7A8DF";
        else if (rand < 0.72) colorKey = "#F7E7CE";
        else if (rand < 0.91) colorKey = "#FAD2E1";
        else colorKey = "#C62E4E"; // few in #C62E4E (~9%)

        // Points 1 to 2.5px
        const radius = 1 + Math.random() * 1.5;

        // Position initial anywhere in the section
        const px = Math.random() * w;
        const py = Math.random() * h;

        particles.push({
          x: px,
          y: py,
          vx: (Math.random() - 0.5) * 0.8,
          vy: (Math.random() - 0.5) * 0.8,
          targetX: null,
          targetY: null,
          radius,
          glowCanvas: glowTextures[colorKey],
          baseAlpha: 0.65 + Math.random() * 0.35,
          twinkleSpeed: 1.5 + Math.random() * 2.5,
          twinklePhase: Math.random() * Math.PI * 2,
          seedX: Math.random() * 100,
          seedY: Math.random() * 100,
        });
      }
    }

    function recomputeShapes(w: number, h: number, count: number) {
      sittingDogTargets = sampleShapeTargets("sitting_dog", w, h, count);
      heartTargets = sampleShapeTargets("heart", w, h, count);
      dogFaceTargets = sampleShapeTargets("dog_face", w, h, count);
    }

    function resize() {
      if (!parent || !canvas || !ctx) return;
      const rect = parent.getBoundingClientRect();
      width = Math.max(300, Math.floor(rect.width));
      height = Math.max(300, Math.floor(rect.height));

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const targetCount = width < 768 ? 450 : 900;
      if (targetCount !== particleCount || particles.length === 0) {
        particleCount = targetCount;
        initParticles(particleCount, width, height);
      }

      recomputeShapes(width, height, particleCount);

      // If reduced motion, just render the sitting dog stationary
      if (prefersReducedMotion) {
        particles.forEach((p, idx) => {
          const t = sittingDogTargets[idx] || { x: width / 2, y: height * 0.28 };
          p.x = t.x;
          p.y = t.y;
          p.vx = 0;
          p.vy = 0;
        });
        renderStaticFrame();
      }
    }

    // Cursor tracking
    let cursorX = -9999;
    let cursorY = -9999;
    let cursorActive = false;

    const handlePointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      cursorX = e.clientX - rect.left;
      cursorY = e.clientY - rect.top;
      cursorActive = true;
    };

    const handlePointerLeave = () => {
      cursorActive = false;
      cursorX = -9999;
      cursorY = -9999;
    };

    // Mobile touch interaction: particles near finger explode outward and regroup
    const handleTouch = (e: TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      for (let i = 0; i < e.touches.length; i++) {
        const touch = e.touches[i];
        const tx = touch.clientX - rect.left;
        const ty = touch.clientY - rect.top;

        particles.forEach((p) => {
          const dx = p.x - tx;
          const dy = p.y - ty;
          const dist = Math.hypot(dx, dy);
          if (dist < 110 && dist > 0.001) {
            const explode = (1 - dist / 110) * 10;
            p.vx += (dx / dist) * explode;
            p.vy += (dy / dist) * explode;
          }
        });
      }
    };

    parent.addEventListener("pointermove", handlePointerMove, { passive: true });
    parent.addEventListener("pointerleave", handlePointerLeave, { passive: true });
    parent.addEventListener("touchstart", handleTouch, { passive: true });
    parent.addEventListener("touchmove", handleTouch, { passive: true });

    // Cycle timing
    // Phases:
    // 0: FREE (2.5s)
    // 1: SITTING_DOG (4.0s)
    // 2: DISPERSE (1.5s)
    // 3: HEART (3.5s)
    // 4: DISPERSE (1.5s)
    // 5: DOG_FACE (4.0s)
    // 6: DISPERSE (1.5s) -> back to 1
    const PHASE_DURATIONS = [2500, 4000, 1500, 3500, 1500, 4000, 1500];
    let currentPhase = 0;
    let phaseStartTime = 0;
    let isVisible = false;
    let animId: number | null = null;
    let hasStarted = false;

    function applyImpulseOutward() {
      const cx = width / 2;
      const cy = Math.max(90, Math.min(height * 0.28, height * 0.45));
      particles.forEach((p) => {
        const angle = Math.atan2(p.y - cy, p.x - cx) + (Math.random() - 0.5) * 0.7;
        const speed = 2.5 + Math.random() * 4.5;
        p.vx += Math.cos(angle) * speed;
        p.vy += Math.sin(angle) * speed;
        p.targetX = null;
        p.targetY = null;
      });
    }

    function setTargetsForPhase(phase: number) {
      if (phase === 1) {
        // SITTING_DOG
        particles.forEach((p, idx) => {
          const t = sittingDogTargets[idx] || { x: width / 2, y: height * 0.28 };
          p.targetX = t.x;
          p.targetY = t.y;
        });
      } else if (phase === 3) {
        // HEART
        particles.forEach((p, idx) => {
          const t = heartTargets[idx] || { x: width / 2, y: height * 0.28 };
          p.targetX = t.x;
          p.targetY = t.y;
        });
      } else if (phase === 5) {
        // DOG_FACE
        particles.forEach((p, idx) => {
          const t = dogFaceTargets[idx] || { x: width / 2, y: height * 0.28 };
          p.targetX = t.x;
          p.targetY = t.y;
        });
      } else {
        // FREE or DISPERSE
        particles.forEach((p) => {
          p.targetX = null;
          p.targetY = null;
        });
      }
    }

    function renderStaticFrame() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = "lighter";

      particles.forEach((p) => {
        const haloSize = p.radius * 5.5;
        ctx.globalAlpha = p.baseAlpha;
        ctx.drawImage(
          p.glowCanvas,
          p.x - haloSize / 2,
          p.y - haloSize / 2,
          haloSize,
          haloSize
        );
      });
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;
    }

    function tick(now: number) {
      if (!ctx || !isVisible) {
        animId = null;
        return;
      }

      if (!hasStarted) {
        hasStarted = true;
        phaseStartTime = now;
      }

      // Check phase transition
      const elapsed = now - phaseStartTime;
      const duration = PHASE_DURATIONS[currentPhase];
      if (elapsed >= duration) {
        phaseStartTime = now;
        if (currentPhase === 0) {
          currentPhase = 1;
        } else if (currentPhase === 6) {
          currentPhase = 1;
        } else {
          currentPhase = (currentPhase + 1) % PHASE_DURATIONS.length;
        }

        // On disperse phases (2, 4, 6), apply outward impulse
        if (currentPhase === 2 || currentPhase === 4 || currentPhase === 6) {
          applyImpulseOutward();
        } else {
          setTargetsForPhase(currentPhase);
        }
      }

      // Clear canvas
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = "lighter";

      const timeSec = now * 0.001;

      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // 4. Physics:
        if (p.targetX !== null && p.targetY !== null) {
          // Spring force 0.04 and damping 0.88
          const ax = (p.targetX - p.x) * 0.04;
          const ay = (p.targetY - p.y) * 0.04;
          p.vx = (p.vx + ax) * 0.88;
          p.vy = (p.vy + ay) * 0.88;
        } else {
          // Free undulating slow motion
          p.vx += Math.sin(timeSec * 0.8 + p.seedX) * 0.025;
          p.vy += Math.cos(timeSec * 0.9 + p.seedY) * 0.025;
          p.vx *= 0.95;
          p.vy *= 0.95;
        }

        // 6. Interaction with cursor (desktop)
        if (cursorActive) {
          const dx = p.x - cursorX;
          const dy = p.y - cursorY;
          const dist = Math.hypot(dx, dy);
          if (dist < 110 && dist > 0.001) {
            const force = (1 - dist / 110) * 3.0;
            p.vx += (dx / dist) * force;
            p.vy += (dy / dist) * force;
          }
        }

        p.x += p.vx;
        p.y += p.vy;

        // Keep inside bounds softly
        if (p.x < 0) {
          p.x = 0;
          p.vx *= -0.5;
        } else if (p.x > width) {
          p.x = width;
          p.vx *= -0.5;
        }
        if (p.y < 0) {
          p.y = 0;
          p.vy *= -0.5;
        } else if (p.y > height) {
          p.y = height;
          p.vx *= -0.5;
        }

        // Twinkle softly by varying opacity
        const twinkle = 0.65 + 0.35 * Math.sin(timeSec * p.twinkleSpeed + p.twinklePhase);
        const currentAlpha = Math.max(0.15, Math.min(1.0, p.baseAlpha * twinkle));

        // Draw pre-rendered glow texture
        const haloSize = p.radius * 5.5;
        ctx.globalAlpha = currentAlpha;
        ctx.drawImage(
          p.glowCanvas,
          p.x - haloSize / 2,
          p.y - haloSize / 2,
          haloSize,
          haloSize
        );
      }

      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;

      animId = requestAnimationFrame(tick);
    }

    // Resize observer
    resize();
    const resizeObserver = new ResizeObserver(() => {
      resize();
    });
    resizeObserver.observe(parent);

    // Intersection observer
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          isVisible = true;
          if (!prefersReducedMotion && animId === null) {
            phaseStartTime = performance.now();
            animId = requestAnimationFrame(tick);
          }
        } else {
          isVisible = false;
          if (animId !== null) {
            cancelAnimationFrame(animId);
            animId = null;
          }
        }
      },
      { threshold: 0.05 }
    );
    intersectionObserver.observe(parent);

    return () => {
      if (animId !== null) cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      parent.removeEventListener("pointermove", handlePointerMove);
      parent.removeEventListener("pointerleave", handlePointerLeave);
      parent.removeEventListener("touchstart", handleTouch);
      parent.removeEventListener("touchmove", handleTouch);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
      aria-hidden="true"
    />
  );
};
