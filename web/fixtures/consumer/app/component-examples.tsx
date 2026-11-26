'use client'

import { useState } from 'react'
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
  Alert, AlertDescription, AlertTitle, Avatar, AvatarFallback,
  Badge, Button, Card, CardContent, CardHeader, CardTitle, Checkbox,
  Dialog, DialogBody, DialogClose, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
  Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle,
  Input, Label, Popover, PopoverContent, PopoverTrigger,
  RadioGroup, RadioGroupItem, Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue, Separator, Switch,
  Tabs, TabsContent, TabsList, TabsTrigger, Textarea,
  Tooltip, TooltipContent, TooltipTrigger,
} from '@zooclaw/zooworkdesign'

// example: Button
export function ButtonExample() {
  const [saved, setSaved] = useState(false)
  return <Button type="button" variant="outline" onClick={() => setSaved(true)}>
    {saved ? 'Saved example' : 'Save example'}
  </Button>
}

// example: Input
export function InputExample() {
  const [value, setValue] = useState('')
  const invalid = value.length > 0 && value.length < 3
  return <div><Label htmlFor="example-name">Project name</Label>
    <Input id="example-name" value={value} onChange={e => setValue(e.target.value)}
      aria-invalid={invalid} aria-describedby="example-name-help" />
    <p id="example-name-help">{invalid ? 'Use at least 3 characters.' : 'Choose a project name.'}</p>
  </div>
}

// example: Textarea
export function TextareaExample() {
  const [value, setValue] = useState('')
  return <div><Label htmlFor="example-description">Description</Label>
    <Textarea id="example-description" value={value} onChange={e => setValue(e.target.value)} rows={3} />
  </div>
}

// example: Label
export function LabelExample() {
  return <div><Label htmlFor="example-email">Contact email</Label>
    <Input id="example-email" type="email" autoComplete="email" />
  </div>
}

// example: Checkbox
export function CheckboxExample() {
  const [checked, setChecked] = useState(false)
  return <div className="flex items-center gap-3">
    <Checkbox id="example-agree" checked={checked} onCheckedChange={v => setChecked(v === true)} />
    <Label htmlFor="example-agree">Receive updates</Label>
  </div>
}

// example: Switch
export function SwitchExample() {
  const [checked, setChecked] = useState(false)
  return <div className="flex items-center gap-3">
    <Switch id="example-notify" checked={checked} onCheckedChange={setChecked} size="sm" />
    <Label htmlFor="example-notify">Enable notifications</Label>
  </div>
}

// example: RadioGroup
export function RadioGroupExample() {
  const [value, setValue] = useState('daily')
  return <RadioGroup aria-label="Update frequency" value={value} onValueChange={setValue}>
    <div className="flex items-center gap-3"><RadioGroupItem id="example-daily" value="daily" /><Label htmlFor="example-daily">Daily</Label></div>
    <div className="flex items-center gap-3"><RadioGroupItem id="example-weekly" value="weekly" /><Label htmlFor="example-weekly">Weekly</Label></div>
  </RadioGroup>
}

// example: Select
export function SelectExample() {
  const [value, setValue] = useState('viewer')
  return <div><Label htmlFor="example-role">Project role</Label>
    <Select value={value} onValueChange={setValue}>
      <SelectTrigger id="example-role"><SelectValue placeholder="Choose a role" /></SelectTrigger>
      <SelectContent><SelectItem value="viewer">Viewer</SelectItem><SelectItem value="editor">Editor</SelectItem></SelectContent>
    </Select>
  </div>
}

// example: Dialog
export function DialogExample() {
  const [open, setOpen] = useState(false)
  return <Dialog open={open} onOpenChange={setOpen}>
    <DialogTrigger asChild><Button type="button">Edit example project</Button></DialogTrigger>
    <DialogContent scrollable closeLabel="Close project editor">
      <DialogHeader><DialogTitle>Edit project</DialogTitle><DialogDescription>Update the example settings.</DialogDescription></DialogHeader>
      <DialogBody><Label htmlFor="example-dialog-title">Title</Label><Input id="example-dialog-title" defaultValue="Sample project" /></DialogBody>
      <DialogFooter><DialogClose asChild><Button type="button" variant="outline">Cancel editing</Button></DialogClose></DialogFooter>
    </DialogContent>
  </Dialog>
}

// example: DropdownMenu
export function DropdownMenuExample() {
  const [action, setAction] = useState('No action selected')
  return <div><DropdownMenu>
    <DropdownMenuTrigger asChild><Button type="button" variant="outline">Example actions</Button></DropdownMenuTrigger>
    <DropdownMenuContent><DropdownMenuItem onSelect={() => setAction('Example duplicated')}>Duplicate example</DropdownMenuItem></DropdownMenuContent>
  </DropdownMenu><p aria-live="polite">{action}</p></div>
}

// example: Tooltip
export function TooltipExample() {
  return <Tooltip><TooltipTrigger asChild><Button type="button" variant="outline">Preview help</Button></TooltipTrigger>
    <TooltipContent>Examples use local demonstration data.</TooltipContent>
  </Tooltip>
}

// example: Popover
export function PopoverExample() {
  return <Popover><PopoverTrigger asChild><Button type="button" variant="outline">Example filters</Button></PopoverTrigger>
    <PopoverContent aria-label="Example filters"><Label htmlFor="example-filter">Filter by name</Label><Input id="example-filter" /></PopoverContent>
  </Popover>
}

// example: Tabs
export function TabsExample() {
  const [value, setValue] = useState('design')
  return <Tabs value={value} onValueChange={setValue}>
    <TabsList variant="line" aria-label="Example documentation"><TabsTrigger value="design">Design</TabsTrigger><TabsTrigger value="api">API</TabsTrigger></TabsList>
    <TabsContent value="design">Design guidance</TabsContent><TabsContent value="api">API guidance</TabsContent>
  </Tabs>
}

// example: Accordion
export function AccordionExample() {
  return <Accordion type="single" collapsible defaultValue="install">
    <AccordionItem value="install"><AccordionTrigger>How do I start?</AccordionTrigger>
      <AccordionContent>Install the package and import its Tailwind entry.</AccordionContent>
    </AccordionItem>
  </Accordion>
}

// example: Card
export function CardExample() {
  return <Card size="sm"><CardHeader><CardTitle>Example project</CardTitle></CardHeader>
    <CardContent>Project information belongs here.</CardContent>
  </Card>
}

// example: Avatar
export function AvatarExample() {
  return <Avatar size="lg" aria-label="Example user"><AvatarFallback>EX</AvatarFallback></Avatar>
}

// example: Badge
export function BadgeExample() {
  return <Badge variant="success">Ready</Badge>
}

// example: Alert
export function AlertExample() {
  return <Alert status="info"><AlertTitle>Example information</AlertTitle><AlertDescription>Your changes stay in this demo.</AlertDescription></Alert>
}

// example: Empty
export function EmptyExample() {
  const [created, setCreated] = useState(false)
  return created ? <p role="status">Example project created</p> : <Empty>
    <EmptyHeader><EmptyTitle>No projects</EmptyTitle><EmptyDescription>Create a project to get started.</EmptyDescription></EmptyHeader>
    <EmptyContent><Button type="button" onClick={() => setCreated(true)}>Create example project</Button></EmptyContent>
  </Empty>
}

// example: Separator
export function SeparatorExample() {
  return <div><p>Project details</p><Separator /><p>Project activity</p></div>
}

export const componentExamples = {
  Button: ButtonExample, Input: InputExample, Textarea: TextareaExample,
  Label: LabelExample, Checkbox: CheckboxExample, Switch: SwitchExample,
  RadioGroup: RadioGroupExample, Select: SelectExample, Dialog: DialogExample,
  DropdownMenu: DropdownMenuExample, Tooltip: TooltipExample, Popover: PopoverExample,
  Tabs: TabsExample, Accordion: AccordionExample, Card: CardExample,
  Avatar: AvatarExample, Badge: BadgeExample, Alert: AlertExample,
  Empty: EmptyExample, Separator: SeparatorExample,
}

export function ComponentExamples() {
  return <section aria-label="Component documentation examples" className="mt-8 grid gap-6">
    {Object.entries(componentExamples).map(([name, Example]) => <section key={name} aria-label={`${name} example`} className="grid gap-2">
      <h2>{name}</h2><Example />
    </section>)}
  </section>
}
