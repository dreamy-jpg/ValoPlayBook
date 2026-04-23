import { useState, useCallback, useRef, useEffect } from 'react';

interface UseDraggableOptions {
  onDragEnd?: (x: number, y: number) => void;
  disabled?: boolean;
}

export function useDraggable(initialX: number, initialY: number, options: UseDraggableOptions = {}) {
  const [position, setPosition] = useState({ x: initialX, y: initialY });
  const [isDragging, setIsDragging] = useState(false);

  const dragStartPos = useRef({ x: 0, y: 0 });
  const elementStartPos = useRef({ x: initialX, y: initialY });
  const currentPositionRef = useRef({ x: initialX, y: initialY });
  const svgRef = useRef<SVGSVGElement | null>(null);
  const isMountedRef = useRef(true);

  // Синхронизация с внешними пропсами, когда не идёт перетаскивание
  useEffect(() => {
    if (!isDragging) {
      setPosition({ x: initialX, y: initialY });
      currentPositionRef.current = { x: initialX, y: initialY };
    }
  }, [initialX, initialY, isDragging]);

  // Очистка при размонтировании
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (isDragging) {
        window.removeEventListener('mousemove', handleGlobalMouseMove);
        window.removeEventListener('mouseup', handleGlobalMouseUp);
      }
    };
  }, [isDragging]);

  const getSVGPoint = useCallback((svg: SVGSVGElement, clientX: number, clientY: number) => {
    const pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    const ctm = svg.getScreenCTM();
    return ctm ? pt.matrixTransform(ctm.inverse()) : pt;
  }, []);

  const handleGlobalMouseMove = useCallback((moveEvent: MouseEvent) => {
    if (!svgRef.current || !isMountedRef.current) return;
    const currentPoint = getSVGPoint(svgRef.current, moveEvent.clientX, moveEvent.clientY);
    const dx = currentPoint.x - dragStartPos.current.x;
    const dy = currentPoint.y - dragStartPos.current.y;
    const newX = elementStartPos.current.x + dx;
    const newY = elementStartPos.current.y + dy;

    currentPositionRef.current = { x: newX, y: newY };
    setPosition({ x: newX, y: newY });
  }, [getSVGPoint]);

  const handleGlobalMouseUp = useCallback(() => {
    if (!isMountedRef.current) return;

    setIsDragging(false);
    window.removeEventListener('mousemove', handleGlobalMouseMove);
    window.removeEventListener('mouseup', handleGlobalMouseUp);

    if (options.onDragEnd) {
      options.onDragEnd(currentPositionRef.current.x, currentPositionRef.current.y);
    }
  }, [handleGlobalMouseMove, options.onDragEnd]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (options.disabled) return;
    e.stopPropagation();
    e.preventDefault();

    const svg = e.currentTarget.closest('svg');
    if (!svg) return;
    svgRef.current = svg as SVGSVGElement;

    const point = getSVGPoint(svgRef.current, e.clientX, e.clientY);
    dragStartPos.current = { x: point.x, y: point.y };
    elementStartPos.current = { ...currentPositionRef.current };

    setIsDragging(true);

    window.addEventListener('mousemove', handleGlobalMouseMove);
    window.addEventListener('mouseup', handleGlobalMouseUp);
  }, [options.disabled, getSVGPoint, handleGlobalMouseMove, handleGlobalMouseUp]);

  return {
    position,
    isDragging,
    handleMouseDown,
  };
}