'use client'

import { useEffect, useId, useImperativeHandle, useRef, useState } from 'react'
import { CheckIcon, CpuChipIcon, UserIcon } from '@heroicons/react/24/outline'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Popover,
  PopoverAnchor,
  PopoverContent,
  findMentionQuery,
  replaceMentionRange,
  validMentions,
  type MentionOption,
  type MentionsLabels,
  type MentionsValue,
} from '@zooclaw/zooworkdesign'
import { RichTextInput, type RichTextInputProps } from './editor/RichTextInput'
import { editorCaretRect, editorSelection, setEditorSelection } from './editor/mention-dom'

const defaultLabels: MentionsLabels = {
  suggestions: 'Mention an agent or teammate',
  agents: 'Agents',
  people: 'Teammates',
  empty: 'No matches found.',
  loading: 'Loading suggestions…',
  retry: 'Retry',
  selected: 'Mentioned',
  hint: '↑ ↓ Navigate · Enter Select · Esc Close',
}
const emptyValue: MentionsValue = { text: '', mentions: [] }
const identity = (option: Pick<MentionOption, 'kind' | 'id'>) => JSON.stringify([option.kind, option.id])

export type ChatMentionsInputProps = Omit<RichTextInputProps, 'value' | 'onChange'> & {
  value?: MentionsValue
  defaultValue?: MentionsValue
  onValueChange?: (value: MentionsValue) => void
  options: readonly MentionOption[]
  onSearch?: (query: string | null) => void
  filterOption?: false | ((query: string, option: MentionOption) => boolean)
  loading?: boolean
  error?: string
  onRetry?: () => void
  placement?: 'top' | 'bottom'
  labels?: Partial<MentionsLabels>
  maxLength?: number
}

/** ChatComposer editor slot: the production rich editor with atomic mention chips. */
export function ChatMentionsInput({
  value: controlled,
  defaultValue = emptyValue,
  onValueChange,
  options,
  onSearch,
  filterOption,
  loading = false,
  error,
  onRetry,
  placement = 'bottom',
  labels: overrides,
  maxLength,
  disabled,
  inputRef: forwardedRef,
  ...props
}: ChatMentionsInputProps) {
  const [internal, setInternal] = useState(defaultValue)
  const value = controlled ?? internal
  const labels = { ...defaultLabels, ...overrides }
  const input = useRef<HTMLDivElement>(null)
  const valueRef = useRef(value)
  valueRef.current = value
  useImperativeHandle(forwardedRef, () => input.current as HTMLDivElement)
  const composing = useRef(false)
  const caretAnchor = useRef({ getBoundingClientRect: () => editorCaretRect(input.current) })
  const history = useRef<{ past: MentionsValue[]; future: MentionsValue[]; last: MentionsValue }>({
    past: [],
    future: [],
    last: value,
  })
  const [query, setQuery] = useState<ReturnType<typeof findMentionQuery>>(null)
  const [activeKey, setActiveKey] = useState<string | null>(null)
  const listId = `mentions-${useId().replace(/:/g, '')}`
  const selected = new Set(validMentions(value).map(identity))
  const filter =
    typeof filterOption === 'function'
      ? filterOption
      : (search: string, option: MentionOption) =>
          [option.label, option.description, ...(option.keywords ?? [])].some((text) =>
            text?.toLocaleLowerCase().includes(search.toLocaleLowerCase().trim()),
          )
  // Deduplicate API results by identity, while retaining genuinely different people with the same name.
  const seen = new Set<string>()
  const matches = options
    .filter((option) => {
      const key = identity(option)
      if (!option.id || !option.label || /[\r\n@]/u.test(option.label) || seen.has(key)) return false
      seen.add(key)
      return filterOption === false || filter(query?.query ?? '', option)
    })
    .sort((a, b) => Number(a.kind === 'person') - Number(b.kind === 'person'))
  const unavailable = (option: MentionOption) =>
    option.disabled ||
    (maxLength !== undefined &&
      query !== null &&
      value.text.length - (query.end - query.start) + option.label.length + 2 > maxLength)
  const enabled = loading || error ? [] : matches.filter((option) => !unavailable(option))
  const active = enabled.find((option) => identity(option) === activeKey) ?? enabled[0]
  const open = query !== null && !disabled
  const optionId = (option: MentionOption) => `${listId}-${matches.indexOf(option)}`
  const search = open ? query.query : null
  useEffect(() => {
    onSearch?.(search)
  }, [onSearch, search])
  useEffect(() => {
    if (history.current.last !== value) history.current = { past: [], future: [], last: value }
  }, [value])
  useEffect(() => {
    if (open && active) document.getElementById(optionId(active))?.scrollIntoView?.({ block: 'nearest' })
  })
  const publish = (next: MentionsValue, record = true) => {
    if (record) {
      history.current.past = [...history.current.past.slice(-99), value]
      history.current.future = []
    }
    history.current.last = next
    valueRef.current = next
    if (controlled === undefined) setInternal(next)
    onValueChange?.(next)
  }
  const caret = (position: number) =>
    requestAnimationFrame(() => {
      if (input.current) {
        input.current.focus()
        setEditorSelection(input.current, position)
      }
    })
  const dismissed = useRef<string | null>(null)
  const searchAt = (next = valueRef.current) => {
    const selection = input.current && editorSelection(input.current)
    const nextQuery =
      !composing.current && selection?.start === selection?.end && selection
        ? findMentionQuery(next, selection.start)
        : null
    const key = nextQuery && `${nextQuery.start}:${nextQuery.end}:${nextQuery.query}`
    if (key && key === dismissed.current) return
    dismissed.current = null
    if (nextQuery?.start === query?.start && nextQuery?.end === query?.end && nextQuery?.query === query?.query) return
    setQuery(nextQuery)
    setActiveKey(null)
  }
  const dismiss = () => {
    dismissed.current = query ? `${query.start}:${query.end}:${query.query}` : null
    setQuery(null)
  }
  const choose = (option: MentionOption) => {
    if (!query || unavailable(option) || loading || error) return
    const text = `@${option.label}`
    const next = replaceMentionRange(value, query.start, query.end, `${text} `)
    next.mentions = [
      ...next.mentions,
      { id: option.id, kind: option.kind, label: option.label, start: query.start, end: query.start + text.length },
    ].sort((a, b) => a.start - b.start)
    publish(next)
    setQuery(null)
    caret(query.start + text.length + 1)
  }
  const undo = (redo: boolean) => {
    const from = redo ? history.current.future : history.current.past
    const next = from.pop()
    if (!next) return
    const to = redo ? history.current.past : history.current.future
    to.push(value)
    publish(next, false)
    setQuery(null)
    caret(next.text.length)
  }

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        if (!next) dismiss()
      }}
    >
      <PopoverAnchor virtualRef={caretAnchor} />
      <RichTextInput
        {...props}
        inputRef={input}
        value={value.text}
        onChange={() => undefined}
        onKeyDown={(event) => {
          if (!composing.current && !event.nativeEvent.isComposing && event.keyCode !== 229) props.onKeyDown?.(event)
        }}
        disabled={disabled}
        mentionReferences={value.mentions}
        onMentionValueChange={(next) => {
          publish(next)
          searchAt(next)
        }}
        onSelectionChange={() => searchAt()}
        editorAttributes={{
          ...props.editorAttributes,
          role: 'combobox',
          'aria-autocomplete': 'list',
          'aria-haspopup': 'listbox',
          'aria-expanded': open,
          'aria-controls': open ? listId : undefined,
          'aria-activedescendant': open && active ? optionId(active) : undefined,
        }}
        onBlur={(event) => {
          props.onBlur?.(event)
          if (
            !(
              event.relatedTarget instanceof Node &&
              document.getElementById(`${listId}-popup`)?.contains(event.relatedTarget)
            )
          )
            dismiss()
        }}
        onCompositionStart={() => {
          composing.current = true
          setQuery(null)
          props.onCompositionStart?.()
        }}
        onCompositionEnd={() => {
          composing.current = false
          searchAt()
          props.onCompositionEnd?.()
        }}
        onBeforeKeyDown={(event) => {
          if (composing.current || event.nativeEvent.isComposing || event.keyCode === 229) return
          if (!disabled) {
            if ((event.metaKey || event.ctrlKey) && !event.altKey && ['z', 'y'].includes(event.key.toLowerCase())) {
              event.preventDefault()
              undo(event.key.toLowerCase() === 'y' || event.shiftKey)
              return
            }
            if (open && ['ArrowDown', 'ArrowUp'].includes(event.key)) {
              event.preventDefault()
              if (enabled.length)
                setActiveKey(
                  identity(
                    enabled[
                      (enabled.indexOf(active) + (event.key === 'ArrowDown' ? 1 : -1) + enabled.length) % enabled.length
                    ],
                  ),
                )
              return
            }
            if (open && event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault()
              if (!loading && error) onRetry?.()
              else if (active) choose(active)
              return
            }
            if (open && event.key === 'Escape') {
              event.preventDefault()
              event.stopPropagation()
              dismiss()
              return
            }
            if (event.key === 'Tab') dismiss()
            const selection = editorSelection(event.currentTarget)
            if (selection && selection.start === selection.end && ['Backspace', 'Delete'].includes(event.key)) {
              const target = validMentions(value).find((mention) =>
                event.key === 'Backspace' ? mention.end === selection.start : mention.start === selection.start,
              )
              if (target) {
                event.preventDefault()
                publish(replaceMentionRange(value, target.start, target.end, ''))
                setQuery(null)
                caret(target.start)
                return
              }
            }
          }
        }}
      />
      <PopoverContent
        id={`${listId}-popup`}
        side={placement}
        align="start"
        sideOffset={6}
        collisionPadding={8}
        updatePositionStrategy="always"
        className="zc-mentions-popup gap-0 p-1.5"
        aria-label={labels.suggestions}
        onOpenAutoFocus={(event) => event.preventDefault()}
        onCloseAutoFocus={(event) => event.preventDefault()}
        onInteractOutside={(event) => {
          if (event.target instanceof Node && input.current?.contains(event.target)) event.preventDefault()
        }}
      >
        <div
          id={listId}
          role="listbox"
          aria-label={labels.suggestions}
          aria-busy={loading}
          className="zc-mentions-list"
        >
          {!loading &&
            !error &&
            (['agent', 'person'] as const).map((kind) => {
              const group = matches.filter((option) => option.kind === kind)
              return group.length ? (
                <div role="group" aria-label={kind === 'agent' ? labels.agents : labels.people} key={kind}>
                  <div className="zc-mentions-group" aria-hidden="true">
                    {kind === 'agent' ? labels.agents : labels.people}
                  </div>
                  {group.map((option) => (
                    <div
                      key={identity(option)}
                      id={optionId(option)}
                      role="option"
                      aria-selected={active === option}
                      aria-disabled={unavailable(option) || undefined}
                      className="zc-mentions-option"
                      onPointerMove={() => {
                        if (!unavailable(option)) setActiveKey(identity(option))
                      }}
                      onPointerDown={(event) => {
                        if (event.button === 0) event.preventDefault()
                      }}
                      onClick={() => choose(option)}
                    >
                      <Avatar>
                        <AvatarImage src={option.avatar} alt="" />
                        <AvatarFallback>{kind === 'agent' ? <CpuChipIcon /> : <UserIcon />}</AvatarFallback>
                      </Avatar>
                      <span className="zc-mentions-option-copy">
                        <span>{option.label}</span>
                        {option.description && <small>{option.description}</small>}
                      </span>
                      {selected.has(identity(option)) && (
                        <CheckIcon aria-label={labels.selected} className="size-4 shrink-0" />
                      )}
                    </div>
                  ))}
                </div>
              ) : null
            })}
        </div>
        {(loading || error || !matches.length) && (
          <div className="zc-mentions-message" role="status">
            {loading ? labels.loading : error || labels.empty}
            {!loading && error && onRetry && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  onRetry()
                  input.current?.focus()
                }}
              >
                {labels.retry}
              </Button>
            )}
          </div>
        )}
        <div className="zc-mentions-hint">{!loading && error && onRetry ? `Enter · ${labels.retry}` : labels.hint}</div>
      </PopoverContent>
    </Popover>
  )
}
