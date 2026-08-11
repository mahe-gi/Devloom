// Lightweight, zero-dependency animation & scroll trigger helper
export const animateElement = (
  element: HTMLElement,
  keyframes: Keyframe[] | PropertyIndexedKeyframes,
  options?: KeyframeAnimationOptions
) => {
  if (typeof window === "undefined" || !element) return;
  return element.animate(keyframes, {
    duration: 600,
    easing: "cubic-bezier(0.16, 1, 0.3, 1)",
    fill: "forwards",
    ...options,
  });
};

export const createScrollObserver = (
  callback: (entry: IntersectionObserverEntry) => void,
  options?: IntersectionObserverInit
) => {
  if (typeof window === "undefined") return null;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => callback(entry));
  }, options);
  return observer;
};
