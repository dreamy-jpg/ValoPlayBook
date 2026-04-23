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