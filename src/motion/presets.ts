// Motion presets and easing curves for cinematic editorial experience

export const easeCinematic: [number, number, number, number] = [0.22, 1, 0.36, 1];
export const easeInOutExpo: [number, number, number, number] = [0.87, 0, 0.13, 1];
export const spring = {
  type: "spring" as const,
  stiffness: 120,
  damping: 20,
  mass: 0.8,
};

export const durations = {
  ui: 0.3,
  textReveal: 0.9,
  imageTransition: 1.4,
  kenBurns: 22,
  reducedMotion: 0.3,
};
