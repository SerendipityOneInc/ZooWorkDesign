import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { InputGroup, InputGroupAddon, InputGroupInput } from '../components/input-group'

import { cn } from '../lib/cn'

export function PluginSearch({
  value,
  onChange,
  placeholder,
  className,
  testId,
  layout,
}: {
  value: string
  onChange: (value: string) => void
  placeholder: string
  className?: string
  testId?: string
  layout?: string
}) {
  return (
    <InputGroup data-layout={layout} className={cn('h-10 w-full sm:w-72', className)}>
      <InputGroupAddon>
        <MagnifyingGlassIcon className="size-4" />
      </InputGroupAddon>
      <InputGroupInput
        aria-label={placeholder}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        data-testid={testId}
      />
    </InputGroup>
  )
}
