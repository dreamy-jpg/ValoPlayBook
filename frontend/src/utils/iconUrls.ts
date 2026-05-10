// iconUrls.ts (полный код)
/**
 * Возвращает URL иконки агента.
 * @param agentName - имя агента (например, "Jett")
 */
export function getAgentIconUrl(agentName: string): string {
  return `/agents/${agentName.toLowerCase()}/agent${agentName}.png`;
}

/**
 * Возвращает URL иконки способности.
 * @param agentName - имя агента
 * @param abilityName - название способности (пробелы заменяются на '_')
 */
export function getAbilityIconUrl(agentName: string, abilityName: string): string {
  return `/agents/${agentName.toLowerCase()}/abilities/${abilityName.replace(/\s+/g, '_')}.png`;
}

/**
 * Возвращает цвет фона для агента в зависимости от стороны.
 */
export function getAgentColor(side?: 'attack' | 'defense'): string {
  if (side === 'attack') return '#dc5252';
  if (side === 'defense') return '#50c8c8';
  return '#6b7280'; // нейтральный серый
}