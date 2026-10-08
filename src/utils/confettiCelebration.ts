import confetti from "canvas-confetti";

/**
 * Triggers a rich, multi-layered celebratory confetti explosion
 * tailored for Vale's birthday editorial color palette.
 */
export const triggerCelebrationConfetti = (reducedMotion = false) => {
  try {
    const colors = [
      "#C62E4E", // Burgundy / Crimson
      "#741C3C", // Deep Wine
      "#F7E7CE", // Champagne Gold
      "#E5B869", // Warm Golden
      "#C7A8DF", // Lavender / Violet
      "#FAF0F4", // Delicate Pearl White
      "#FF6B8B", // Celebratory Coral Pink
    ];

    if (reducedMotion) {
      confetti({
        particleCount: 30,
        spread: 60,
        origin: { x: 0.5, y: 0.7 },
        colors,
        zIndex: 9999,
        disableForReducedMotion: true,
      });
      return;
    }

    // Step 1: Left lateral cannon burst
    confetti({
      particleCount: 55,
      angle: 60,
      spread: 65,
      origin: { x: 0.12, y: 0.8 },
      colors,
      zIndex: 9999,
      scalar: 1.1,
    });

    // Step 2: Right lateral cannon burst
    confetti({
      particleCount: 55,
      angle: 120,
      spread: 65,
      origin: { x: 0.88, y: 0.8 },
      colors,
      zIndex: 9999,
      scalar: 1.1,
    });

    // Step 3: Golden champagne star and sparkle cascade from center
    setTimeout(() => {
      try {
        confetti({
          particleCount: 80,
          spread: 110,
          origin: { x: 0.5, y: 0.45 },
          colors: ["#F7E7CE", "#E5B869", "#FAF0F4", "#C7A8DF", "#C62E4E"],
          zIndex: 9999,
          scalar: 1.25,
          ticks: 320,
          gravity: 0.85,
        });
      } catch {}
    }, 280);

    // Step 4: Final celebratory rain shower
    setTimeout(() => {
      try {
        confetti({
          particleCount: 60,
          angle: 90,
          spread: 130,
          origin: { x: 0.5, y: 0.25 },
          colors,
          zIndex: 9999,
          scalar: 0.95,
          ticks: 380,
          gravity: 0.7,
        });
      } catch {}
    }, 620);
  } catch (err) {
    console.warn("Confetti execution error:", err);
  }
};
