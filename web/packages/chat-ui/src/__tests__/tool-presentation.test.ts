import { describe, expect, it } from 'vitest'

import { toolIdentityDetail, toolLabelKey, type ToolLabelKey } from '../tools/tool-presentation'

describe('v2 tool presentation inventory', () => {
  const cases: Array<[string, ToolLabelKey]> = [
    ['read', 'stepRead'],
    ['write', 'stepWrite'],
    ['edit', 'stepWrite'],
    ['exec', 'stepCommand'],
    ['process', 'stepProcess'],
    ['apply_patch', 'stepWrite'],
    ['web_search', 'stepSearch'],
    ['web_fetch', 'stepFetch'],
    ['web_image_search', 'stepImageSearch'],
    ['image', 'stepAnalyzeImage'],
    ['pdf', 'stepAnalyzeDocument'],
    ['image_generate', 'stepGenerateImage'],
    ['tts', 'stepSpeech'],
    ['tts_voices', 'stepSpeech'],
    ['read_media', 'stepAnalyzeImage'],
    ['media_materialize', 'stepSaveWorkspace'],
    ['memory_create', 'stepMemory'],
    ['memory_search', 'stepMemory'],
    ['memory_update', 'stepMemory'],
    ['memory_delete', 'stepMemory'],
    ['sessions_list', 'stepSession'],
    ['sessions_history', 'stepInspectSession'],
    ['session_status', 'stepSession'],
    ['sessions_spawn', 'stepDelegate'],
    ['sessions_yield', 'stepWait'],
    ['subagents', 'stepDelegate'],
    ['agents_list', 'stepDelegate'],
    ['message', 'stepMessage'],
    ['cron', 'stepSchedule'],
    ['heartbeat_respond', 'stepSchedule'],
    ['artifact_publish', 'stepPublish'],
    ['attachment_publish', 'stepPublish'],
    ['composio_tools', 'stepIntegration'],
    ['composio_execute', 'stepIntegration'],
    ['agent_db', 'stepDatabase'],
    ['persona_doc_update', 'stepProfile'],
    ['bootstrap_complete', 'stepProfile'],
    ['tool_search', 'stepCatalog'],
    ['tool_describe', 'stepCatalog'],
    ['update_plan', 'stepPlan'],
    ['create_goal', 'stepGoal'],
    ['get_goal', 'stepGoal'],
    ['update_goal', 'stepGoal'],
    ['sessions_send', 'stepMessage'],
    ['browser_task', 'stepBrowse'],
    ['desktop', 'stepComputer'],
    ['dir_fetch', 'stepRead'],
    ['dir_list', 'stepRead'],
    ['file_fetch', 'stepRead'],
    ['file_write', 'stepWrite'],
    ['nodes', 'stepComputer'],
    ['qqbot_remind', 'stepSchedule'],
    ['skill_workshop', 'stepSkill'],
    ['mcp__google_drive__search_files', 'stepIntegration'],
  ]

  it.each(cases)('maps %s to %s', (toolName, key) => {
    expect(toolLabelKey(toolName)).toBe(key)
  })

  it('keeps V1 history aliases readable', () => {
    expect(toolLabelKey('browser')).toBe('stepBrowse')
    expect(toolLabelKey('search')).toBe('stepSearch')
    expect(toolLabelKey('shell')).toBe('stepCommand')
    expect(toolLabelKey('memory_get')).toBe('stepMemory')
  })

  it('lets the trusted item kind override a legacy name', () => {
    expect(toolLabelKey('legacy_runtime_item', 'command')).toBe('stepCommand')
    expect(toolLabelKey('legacy_runtime_item', 'patch')).toBe('stepWrite')
    expect(toolLabelKey('legacy_runtime_item', 'plan')).toBe('stepPlan')
  })

  it.each([
    ['image_generate', 'generate', 'done', 'stepGenerateImage'],
    ['image_generate', 'status', 'done', 'stepImageStatus'],
    ['image_generate', 'list', 'done', 'stepImageModels'],
    ['subagents', 'list', 'done', 'stepInspectSubtasks'],
    ['exec', undefined, 'error', 'stepCommandFailed'],
  ] as const)('uses action and terminal result for %s/%s/%s', (name, action, phase, key) => {
    expect(toolLabelKey(name, undefined, action, phase)).toBe(key)
  })

  it('keeps conservative labels when historical action data is missing', () => {
    expect(toolLabelKey('image_generate')).toBe('stepGenerateImage')
    expect(toolLabelKey('subagents')).toBe('stepDelegate')
  })

  it('extracts only dynamic MCP server and tool identity', () => {
    expect(toolIdentityDetail('mcp__google_drive__search_files')).toBe(
      'MCP · google_drive · search_files',
    )
    expect(toolIdentityDetail('mcp__drive__search__files')).toBe('MCP · drive · search__files')
    expect(toolIdentityDetail('mcp__drive__search files')).toBeUndefined()
    expect(toolIdentityDetail('company_internal_tool')).toBeUndefined()
  })

  it('normalizes long separator runs without changing known aliases', () => {
    expect(toolLabelKey(`${'_'.repeat(20_000)}web___search${'_'.repeat(20_000)}`)).toBe('stepSearch')
  })

  it('does not guess a category for an unknown tool', () => {
    expect(toolLabelKey('company_internal_tool')).toBeNull()
  })
})
