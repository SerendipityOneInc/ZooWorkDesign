export type ToolLabelKey =
  | 'stepSearch'
  | 'stepFetch'
  | 'stepBrowse'
  | 'stepImageSearch'
  | 'stepRead'
  | 'stepCommand'
  | 'stepCommandFailed'
  | 'stepProcess'
  | 'stepWrite'
  | 'stepPlan'
  | 'stepAnalyzeImage'
  | 'stepAnalyzeDocument'
  | 'stepGenerateImage'
  | 'stepImageStatus'
  | 'stepImageModels'
  | 'stepSpeech'
  | 'stepMemory'
  | 'stepSession'
  | 'stepInspectSession'
  | 'stepDelegate'
  | 'stepInspectSubtasks'
  | 'stepWait'
  | 'stepMessage'
  | 'stepSchedule'
  | 'stepPublish'
  | 'stepSaveWorkspace'
  | 'stepIntegration'
  | 'stepDatabase'
  | 'stepProfile'
  | 'stepGoal'
  | 'stepCatalog'
  | 'stepComputer'
  | 'stepSkill'

export function toolLabelKey(
  toolName: string,
  itemKind?: string,
  action?: string,
  phase?: 'running' | 'done' | 'error' | 'cancelled',
): ToolLabelKey | null {
  if (itemKind === 'command') return phase === 'error' ? 'stepCommandFailed' : 'stepCommand'
  if (itemKind === 'patch') return 'stepWrite'
  if (itemKind === 'plan') return 'stepPlan'

  const name = normalizeToolName(toolName)
  const normalizedAction = action?.trim().toLowerCase()
  if (['web_search', 'websearch', 'search'].includes(name)) return 'stepSearch'
  if (['web_fetch', 'webfetch', 'fetch'].includes(name)) return 'stepFetch'
  if (['browser', 'browser_task'].includes(name) || name.startsWith('browser_')) return 'stepBrowse'
  if (name === 'web_image_search') return 'stepImageSearch'
  if (['read', 'file_read', 'file_fetch', 'dir_fetch', 'dir_list'].includes(name)) return 'stepRead'
  if (['exec', 'bash', 'shell', 'run', 'command'].includes(name)) {
    return phase === 'error' ? 'stepCommandFailed' : 'stepCommand'
  }
  if (name === 'process') return 'stepProcess'
  if (['write', 'file_write', 'edit', 'apply_patch'].includes(name)) return 'stepWrite'
  if (name === 'update_plan' || name === 'plan') return 'stepPlan'
  if (['image', 'read_media'].includes(name)) return 'stepAnalyzeImage'
  if (name === 'pdf') return 'stepAnalyzeDocument'
  if (['image_generate', 'generate'].includes(name)) {
    if (normalizedAction === 'status') return 'stepImageStatus'
    if (normalizedAction === 'list') return 'stepImageModels'
    return 'stepGenerateImage'
  }
  if (['tts', 'tts_voices'].includes(name)) return 'stepSpeech'
  if (name.startsWith('memory_')) return 'stepMemory'
  if (name === 'sessions_history') return 'stepInspectSession'
  if (['sessions_list', 'session_status'].includes(name)) return 'stepSession'
  if (name === 'sessions_yield') return 'stepWait'
  if (name === 'subagents' && normalizedAction === 'list') return 'stepInspectSubtasks'
  if (['sessions_spawn', 'subagents', 'agents_list'].includes(name)) return 'stepDelegate'
  if (['message', 'sessions_send'].includes(name)) return 'stepMessage'
  if (['cron', 'heartbeat_respond', 'qqbot_remind'].includes(name)) return 'stepSchedule'
  if (name === 'media_materialize') return 'stepSaveWorkspace'
  if (['artifact_publish', 'attachment_publish'].includes(name)) return 'stepPublish'
  if (['composio_tools', 'composio_execute'].includes(name) || name.startsWith('mcp_')) {
    return 'stepIntegration'
  }
  if (name === 'agent_db') return 'stepDatabase'
  if (['persona_doc_update', 'bootstrap_complete'].includes(name)) return 'stepProfile'
  if (['create_goal', 'get_goal', 'update_goal'].includes(name)) return 'stepGoal'
  if (['tool_search', 'tool_describe'].includes(name)) return 'stepCatalog'
  if (['desktop', 'nodes'].includes(name)) return 'stepComputer'
  if (name === 'skill_workshop') return 'stepSkill'
  return null
}

export function toolIdentityDetail(toolName: string): string | undefined {
  const trimmed = toolName.trim()
  if (trimmed.slice(0, 5).toLowerCase() !== 'mcp__') return undefined
  const identity = trimmed.slice(5)
  const separator = identity.indexOf('__')
  if (separator <= 0 || separator >= identity.length - 2 || /\s/.test(identity)) return undefined
  return `MCP · ${identity.slice(0, separator)} · ${identity.slice(separator + 2)}`
}

function normalizeToolName(toolName: string): string {
  return trimEdgeSeparators(toolName.toLowerCase().replace(/[^a-z0-9]+/g, '_'))
}

function trimEdgeSeparators(value: string): string {
  let start = 0
  let end = value.length
  while (start < end && value[start] === '_') start += 1
  while (end > start && value[end - 1] === '_') end -= 1
  return value.slice(start, end)
}
