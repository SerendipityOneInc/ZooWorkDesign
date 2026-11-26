import { Button, DESIGN_SYSTEM_VERSION } from '@zooclaw/zooworkdesign'
import Demo from './demo'

// A server component imports the public barrel without a blanket use-client wrapper.
export default function Page() {
  return <><h1>SSR {DESIGN_SYSTEM_VERSION}</h1><Button>Server-rendered button</Button><Demo /></>
}
