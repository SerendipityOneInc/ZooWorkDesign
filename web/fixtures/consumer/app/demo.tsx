'use client'

import { useState } from 'react'
import { BRAND_ASSETS, Button, Tabs, TabsList, TabsTrigger, TabsContent, FocusModalityProvider } from '@zooclaw/zooworkdesign'
import { ChatComposer, ChatUiProvider } from '@zooclaw/zooworkdesign-chat'
import { ComponentExamples } from './component-examples'

export default function Demo() {
  const [count, setCount] = useState(0)
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState('')
  return <FocusModalityProvider><ChatUiProvider>
    <img src={BRAND_ASSETS.logoDark} width="160" alt="ZooWork" />
    <Button data-testid="counter" onClick={() => setCount(count + 1)}>Count {count}</Button>
    <Tabs defaultValue="overview">
      <TabsList><TabsTrigger value="overview">Overview</TabsTrigger><TabsTrigger value="settings">Settings</TabsTrigger></TabsList>
      <TabsContent value="overview">Overview panel</TabsContent><TabsContent value="settings">Settings panel</TabsContent>
    </Tabs>
    <ChatComposer value={message} onChange={setMessage} inputAriaLabel="Message" onSubmit={({ value }) => { setSent(value); setMessage('') }} />
    <p role="status">{sent}</p>
    <ComponentExamples />
  </ChatUiProvider></FocusModalityProvider>
}
