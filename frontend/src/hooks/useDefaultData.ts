import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchDefaultById } from '../api/defaults';
import type { DefaultDto, StepDto } from '../types';

export function useDefaultData(id: string | undefined) {
  const [defaultData, setDefaultData] = useState<DefaultDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const currentIdRef = useRef<string | undefined>(id);

  const loadDefault = useCallback(async () => {
    // Проверка валидности ID
    const numericId = id ? Number(id) : NaN;
    if (isNaN(numericId) || !id) {
      setError('Неверный идентификатор дефолта');
      setLoading(false);
      return;
    }

    // Отмена предыдущего запроса
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const abortController = new AbortController();
    abortControllerRef.current = abortController;
    currentIdRef.current = id;

    setLoading(true);
    setError(null);

    try {
      const data = await fetchDefaultById(numericId, { signal: abortController.signal });
      // Проверяем, что ID не изменился за время запроса
      if (currentIdRef.current === id) {
        setDefaultData(data);
      }
    } catch (err: unknown) {
      // Игнорируем ошибку отмены запроса
      if (err instanceof DOMException && err.name === 'AbortError') {
        return;
      }
      // Проверяем актуальность ID
      if (currentIdRef.current === id) {
        const message = err instanceof Error ? err.message : 'Неизвестная ошибка';
        setError(message);
      }
    } finally {
      // Обновляем состояние загрузки только если ID не изменился
      if (currentIdRef.current === id) {
        setLoading(false);
      }
      if (abortControllerRef.current === abortController) {
        abortControllerRef.current = null;
      }
    }
  }, [id]);

  useEffect(() => {
    loadDefault();

    return () => {
      // Отмена запроса при размонтировании
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
    };
  }, [loadDefault]);

  const updateStepData = useCallback((stepId: number, updater: (step: StepDto) => StepDto) => {
    if (!defaultData) return;
    const newSteps = defaultData.steps.map(step =>
      step.id === stepId ? updater(step) : step
    );
    setDefaultData({ ...defaultData, steps: newSteps });
  }, [defaultData]);

  const reload = useCallback(() => {
    loadDefault();
  }, [loadDefault]);

  return {
    defaultData,
    loading,
    error,
    reload,
    updateStepData,
  };
}