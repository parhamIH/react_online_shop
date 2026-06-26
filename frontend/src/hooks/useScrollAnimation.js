import { useEffect } from 'react';

export function useScrollAnimation() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in-up');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 },
    );

    document.querySelectorAll('[data-animate]').forEach((el) => {
      el.style.opacity = '0';
      observer.observe(el);
    });

    return () => observer.disconnect();
  });
}
