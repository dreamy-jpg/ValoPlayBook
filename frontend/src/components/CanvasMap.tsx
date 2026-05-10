// CanvasMap.tsx (полный код)
import { useEffect, useRef, useState, useCallback } from 'react';
import type { PositionDto, StepAbilityDto, AbilityDto } from '../types';
import { getAgentIconUrl, getAbilityIconUrl, getAgentColor } from '../utils/iconUrls';

interface CanvasMapProps {
  mapName: string;
  side: 'Attack' | 'Defense';
  positions: PositionDto[];
  abilities: StepAbilityDto[];
  agentAbilities: Record<number, AbilityDto[]>;
  editMode?: boolean;
  onPositionChange?: (positionId: number, x: number, y: number) => void;
  onAbilityChange?: (abilityId: number, x: number, y: number) => void;
}

const WORLD_SIZE = 1024;
const imageCache = new Map<string, HTMLImageElement>();

function loadImage(url: string): Promise<HTMLImageElement> {
  if (imageCache.has(url)) return Promise.resolve(imageCache.get(url)!);
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      imageCache.set(url, img);
      resolve(img);
    };
    img.onerror = reject;
    img.src = url;
  });
}

export default function CanvasMap({
  mapName,
  side,
  positions,
  abilities,
  editMode = false,
  onPositionChange,
  onAbilityChange,
}: CanvasMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mapImage, setMapImage] = useState<HTMLImageElement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [scale, setScale] = useState(1);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);

  const scaleRef = useRef(scale);
  const offsetXRef = useRef(offsetX);
  const offsetYRef = useRef(offsetY);
  useEffect(() => { scaleRef.current = scale; }, [scale]);
  useEffect(() => { offsetXRef.current = offsetX; }, [offsetX]);
  useEffect(() => { offsetYRef.current = offsetY; }, [offsetY]);

  const [isDraggingMap, setIsDraggingMap] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const [draggedItem, setDraggedItem] = useState<{ type: 'agent' | 'ability'; id: number; startWorldX: number; startWorldY: number } | null>(null);

  const [agentImages, setAgentImages] = useState<Map<number, HTMLImageElement>>(new Map());
  const [abilityImages, setAbilityImages] = useState<Map<string, HTMLImageElement>>(new Map());

  // Загрузка карты
  useEffect(() => {
    setLoading(true);
    setError(false);
    const suffix = side === 'Attack' ? 'attack' : 'defense';
    const mapUrl = `/maps/${mapName.toLowerCase()}/${mapName.toLowerCase()}_${suffix}.png`;
    loadImage(mapUrl)
      .then(img => {
        setMapImage(img);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [mapName, side]);

  // Предзагрузка иконок агентов
  useEffect(() => {
    const loadAgentIcons = async () => {
      const map = new Map<number, HTMLImageElement>();
      for (const pos of positions) {
        if (!map.has(pos.agentId)) {
          const url = getAgentIconUrl(pos.agentName);
          if (url) {
            try {
              const img = await loadImage(url);
              map.set(pos.agentId, img);
            } catch (e) {}
          }
        }
      }
      setAgentImages(map);
    };
    loadAgentIcons();
  }, [positions]);

  // Предзагрузка иконок способностей
  useEffect(() => {
    const loadAbilityIcons = async () => {
      const map = new Map<string, HTMLImageElement>();
      for (const ab of abilities) {
        const url = getAbilityIconUrl(ab.agentName, ab.abilityName);
        if (url && !map.has(url)) {
          try {
            const img = await loadImage(url);
            map.set(url, img);
          } catch (e) {}
        }
      }
      setAbilityImages(map);
    };
    loadAbilityIcons();
  }, [abilities]);

  const centerMap = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !mapImage) return;
    const container = canvas.parentElement;
    if (!container) return;
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    const newScale = scaleRef.current;
    const newOffsetX = (containerWidth - WORLD_SIZE * newScale) / 2;
    const newOffsetY = (containerHeight - WORLD_SIZE * newScale) / 2;
    setOffsetX(newOffsetX);
    setOffsetY(newOffsetY);
  }, [mapImage]);

  // Ранняя инициализация размеров и центрирование при монтировании
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    // Принудительно задаём размеры canvas сразу
    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;

    if (mapImage) centerMap();

    const resizeObserver = new ResizeObserver(() => {
      if (canvas.parentElement) {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;
        if (mapImage) centerMap();
        draw();
      }
    });
    resizeObserver.observe(parent);

    return () => resizeObserver.disconnect();
  }, [mapImage, centerMap]); // eslint-disable-line react-hooks/exhaustive-deps

  const worldToCanvas = useCallback((x: number, y: number) => ({
    x: x * scale + offsetX,
    y: y * scale + offsetY,
  }), [scale, offsetX, offsetY]);

  const canvasToWorld = useCallback((cx: number, cy: number) => ({
    x: (cx - offsetX) / scale,
    y: (cy - offsetY) / scale,
  }), [scale, offsetX, offsetY]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !mapImage) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(offsetX, offsetY);
    ctx.scale(scale, scale);
    ctx.drawImage(mapImage, 0, 0, WORLD_SIZE, WORLD_SIZE);
    ctx.restore();

    // Способности
    for (const ability of abilities) {
      if (ability.x == null || ability.y == null) continue;
      const { x: cx, y: cy } = worldToCanvas(ability.x, ability.y);
      const rotationRad = ((ability.rotation ?? 0) * Math.PI) / 180;
      const agentPos = positions.find(p => p.agentId === ability.agentId);
      const isAttacker = agentPos?.isAttacker ?? (side === 'Attack');
      const fillColor = isAttacker ? 'rgba(220, 80, 80, 0.25)' : 'rgba(80, 200, 200, 0.25)';
      const strokeColor = isAttacker ? 'rgba(220, 80, 80, 0.7)' : 'rgba(80, 200, 200, 0.7)';
      const lineColor = isAttacker ? 'rgba(220, 80, 80, 0.9)' : 'rgba(80, 200, 200, 0.9)';

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rotationRad);
      ctx.scale(scale, scale);
      switch (ability.zoneType) {
        case 'Circle':
          if (ability.radius) {
            ctx.beginPath();
            ctx.arc(0, 0, ability.radius, 0, 2 * Math.PI);
            ctx.fillStyle = fillColor;
            ctx.fill();
            ctx.strokeStyle = strokeColor;
            ctx.lineWidth = 2 / scale;
            ctx.stroke();
          }
          break;
        case 'Line':
          if (ability.length) {
            ctx.beginPath();
            ctx.moveTo(-ability.length / 2, 0);
            ctx.lineTo(ability.length / 2, 0);
            ctx.strokeStyle = lineColor;
            ctx.lineWidth = (ability.width ?? 4) / scale;
            ctx.stroke();
          }
          break;
        case 'Rectangle':
          if (ability.length && ability.width) {
            ctx.fillStyle = fillColor;
            ctx.fillRect(-ability.width / 2, -ability.length / 2, ability.width, ability.length);
            ctx.strokeStyle = strokeColor;
            ctx.lineWidth = 2 / scale;
            ctx.strokeRect(-ability.width / 2, -ability.length / 2, ability.width, ability.length);
          }
          break;
        case 'Cone':
          if (ability.length && ability.angle) {
            const halfAngle = (ability.angle * Math.PI) / 360;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.arc(0, 0, ability.length, -halfAngle, halfAngle);
            ctx.closePath();
            ctx.fillStyle = fillColor;
            ctx.fill();
            ctx.strokeStyle = strokeColor;
            ctx.lineWidth = 2 / scale;
            ctx.stroke();
          }
          break;
      }
      ctx.restore();

      const iconSize = 24;
      const iconX = cx - iconSize / 2;
      const iconY = cy - iconSize / 2;
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(iconX, iconY, iconSize, iconSize);
      const abilityUrl = getAbilityIconUrl(ability.agentName, ability.abilityName);
      const abilityImg = abilityImages.get(abilityUrl);
      if (abilityImg) {
        ctx.drawImage(abilityImg, iconX, iconY, iconSize, iconSize);
      } else {
        ctx.fillStyle = '#aaa';
        ctx.fillRect(iconX, iconY, iconSize, iconSize);
      }
    }

    // Агенты
    for (const pos of positions) {
      const { x: cx, y: cy } = worldToCanvas(pos.x, pos.y);
      const containerSize = 36;
      const iconSize = 36;
      const radius = 8;

      const bgColor = getAgentColor(pos.isAttacker ? 'attack' : 'defense');

      const x = cx - containerSize / 2;
      const y = cy - containerSize / 2;
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + containerSize - radius, y);
      ctx.quadraticCurveTo(x + containerSize, y, x + containerSize, y + radius);
      ctx.lineTo(x + containerSize, y + containerSize - radius);
      ctx.quadraticCurveTo(x + containerSize, y + containerSize, x + containerSize - radius, y + containerSize);
      ctx.lineTo(x + radius, y + containerSize);
      ctx.quadraticCurveTo(x, y + containerSize, x, y + containerSize - radius);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.closePath();
      ctx.fillStyle = bgColor;
      ctx.fill();

      const agentImg = agentImages.get(pos.agentId);
      const iconX = cx - iconSize / 2;
      const iconY = cy - iconSize / 2;
      if (agentImg) {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(iconX + 8, iconY);
        ctx.lineTo(iconX + iconSize - 8, iconY);
        ctx.quadraticCurveTo(iconX + iconSize, iconY, iconX + iconSize, iconY + 8);
        ctx.lineTo(iconX + iconSize, iconY + iconSize - 8);
        ctx.quadraticCurveTo(iconX + iconSize, iconY + iconSize, iconX + iconSize - 8, iconY + iconSize);
        ctx.lineTo(iconX + 8, iconY + iconSize);
        ctx.quadraticCurveTo(iconX, iconY + iconSize, iconX, iconY + iconSize - 8);
        ctx.lineTo(iconX, iconY + 8);
        ctx.quadraticCurveTo(iconX, iconY, iconX + 8, iconY);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(agentImg, iconX, iconY, iconSize, iconSize);
        ctx.restore();
      } else {
        ctx.fillStyle = '#fff';
        ctx.fillRect(iconX, iconY, iconSize, iconSize);
      }
    }
  }, [mapImage, positions, abilities, worldToCanvas, scale, offsetX, side, agentImages, abilityImages]);

  // Перерисовка при изменении draw
  useEffect(() => {
    draw();
  }, [draw]);

  // Дополнительная перерисовка после загрузки иконок (на случай, если первый вызов был до их загрузки)
  useEffect(() => {
    // Небольшая задержка, чтобы состояние точно обновилось
    const rafId = requestAnimationFrame(() => {
      draw();
    });
    return () => cancelAnimationFrame(rafId);
  }, [agentImages, abilityImages, draw]);

  // Обработка колеса мыши
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const onWheelHandler = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      let newScale = scale * delta;
      newScale = Math.min(5, Math.max(0.3, newScale));
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const newOffsetX = mouseX - (mouseX - offsetX) * (newScale / scale);
      const newOffsetY = mouseY - (mouseY - offsetY) * (newScale / scale);
      setScale(newScale);
      setOffsetX(newOffsetX);
      setOffsetY(newOffsetY);
    };

    canvas.addEventListener('wheel', onWheelHandler, { passive: false });
    return () => canvas.removeEventListener('wheel', onWheelHandler);
  }, [scale, offsetX, offsetY]);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!editMode) {
      setIsDraggingMap(true);
      setDragStart({ x: e.clientX, y: e.clientY });
      setDragOffset({ x: offsetX, y: offsetY });
      canvasRef.current?.setPointerCapture(e.pointerId);
      return;
    }
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const canvasX = e.clientX - rect.left;
    const canvasY = e.clientY - rect.top;
    const world = canvasToWorld(canvasX, canvasY);
    const clickedAgent = positions.find(p => {
      const { x: cx, y: cy } = worldToCanvas(p.x, p.y);
      const size = 48;
      return Math.hypot(canvasX - cx, canvasY - cy) <= size / 2;
    });
    if (clickedAgent) {
      setDraggedItem({ type: 'agent', id: clickedAgent.id, startWorldX: clickedAgent.x, startWorldY: clickedAgent.y });
      e.preventDefault();
      return;
    }
    const clickedAbility = abilities.find(a => {
      if (a.x == null || a.y == null) return false;
      const { x: cx, y: cy } = worldToCanvas(a.x, a.y);
      const size = 24;
      return Math.hypot(canvasX - cx, canvasY - cy) <= size / 2;
    });
    if (clickedAbility) {
      setDraggedItem({ type: 'ability', id: clickedAbility.id, startWorldX: clickedAbility.x, startWorldY: clickedAbility.y });
      e.preventDefault();
      return;
    }
    setIsDraggingMap(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setDragOffset({ x: offsetX, y: offsetY });
    canvasRef.current?.setPointerCapture(e.pointerId);
  }, [editMode, positions, abilities, worldToCanvas, canvasToWorld, offsetX, offsetY]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDraggingMap) {
      const dx = e.clientX - dragStart.x;
      const dy = e.clientY - dragStart.y;
      setOffsetX(dragOffset.x + dx);
      setOffsetY(dragOffset.y + dy);
    } else if (draggedItem) {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      const canvasX = e.clientX - rect.left;
      const canvasY = e.clientY - rect.top;
      const world = canvasToWorld(canvasX, canvasY);
      if (draggedItem.type === 'agent') {
        onPositionChange?.(draggedItem.id, world.x, world.y);
      } else {
        onAbilityChange?.(draggedItem.id, world.x, world.y);
      }
    }
  }, [isDraggingMap, dragStart, dragOffset, draggedItem, onPositionChange, onAbilityChange, canvasToWorld]);

  const handleMouseUp = useCallback(() => {
    setIsDraggingMap(false);
    setDraggedItem(null);
    canvasRef.current?.releasePointerCapture?.();
  }, []);

  if (loading) return <div className="w-full h-full flex items-center justify-center text-white bg-gray-900">Загрузка карты...</div>;
  if (error) return <div className="w-full h-full flex items-center justify-center text-red-400 bg-gray-900">Ошибка загрузки карты</div>;

  return (
    <canvas
      ref={canvasRef}
      style={{ width: '100%', height: '100%', display: 'block', cursor: isDraggingMap ? 'grabbing' : editMode ? 'grab' : 'default' }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    />
  );
}