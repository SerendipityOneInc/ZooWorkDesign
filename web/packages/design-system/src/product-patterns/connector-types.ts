export type ConnectorProviderStatus = 'connected' | 'pending' | 'disconnected' | 'unavailable' | 'error'
export type ConnectorAction = 'connect' | 'enable' | 'disable' | 'disconnect' | 'refresh' | 'request'
export interface ConnectorProviderState {
  status: ConnectorProviderStatus
  enabled: boolean
}
export interface ConnectorLabels {
  connected: string
  pending: string
  disconnected: string
  unavailable: string
  error: string
  comingSoon: string
  disabled: string
  connect: string
  disconnect: string
  enable: string
  disable: string
}
export const defaultConnectorLabels: ConnectorLabels = {
  connected: 'Connected',
  pending: 'Pending',
  disconnected: 'Disconnected',
  unavailable: 'Unavailable',
  error: 'Error',
  comingSoon: 'Coming soon',
  disabled: 'Disabled',
  connect: 'Connect',
  disconnect: 'Disconnect',
  enable: 'Enable',
  disable: 'Disable',
}
