import { useEffect, useRef } from 'react';

/**
 * Отслеживает ширину SVG внутри контейнера и устанавливает
 * CSS-переменную --map-scale, равную отношению фактической ширины
 * к заданной ширине viewBox.
 */
export function useSvgScale(viewBoxWidth: number) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateScale = () => {
      const svg = container.querySelector('svg');
      if (!svg) return;
      const rect = svg.getBoundingClientRect();
      const scale = rect.width / viewBoxWidth;
      container.style.setProperty('--map-scale', scale.toString());
    };

    const observer = new ResizeObserver(updateScale);
    observer.observe(container);

    // Первоначальное вычисление
    updateScale();

    return () => observer.disconnect();
  }, [viewBoxWidth]);

  return containerRef;
}