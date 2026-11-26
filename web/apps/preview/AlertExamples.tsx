import { useRef, useState } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { Alert, AlertAction, AlertDescription, AlertTitle, Button, GlobalAlert, NativeSelect,
  type AlertStatus, type GlobalAlertPlacement } from '@zooclaw/zooworkdesign'
import { usePreviewLocale } from './locale'

function useCopy() {
  const { locale } = usePreviewLocale()
  return (en: string, zh: string) => locale === 'en' ? en : zh
}

export function AlertExamples() {
  const c = useCopy()
  const [visible, setVisible] = useState(true)
  const [retried, setRetried] = useState(false)
  const states: { status: AlertStatus; title: string; description: string }[] = [
    { status: 'default', title: c('Workspace notice', '工作区提示'), description: c('Your draft is saved locally.', '草稿已在本地保存。') },
    { status: 'info', title: c('A new version is available', '有新版本可用'), description: c('Review the changes before updating.', '更新前可以先查看版本变更。') },
    { status: 'success', title: c('Import complete', '导入完成'), description: c('All files are ready to use.', '所有文件已就绪，可以开始使用。') },
    { status: 'warning', title: c('Some files need attention', '部分文件需要关注'), description: c('Two files could not be imported. Your other files are available.', '两个文件未能导入，其余文件可以正常使用。') },
    { status: 'danger', title: c('Connection interrupted', '连接已中断'), description: c('Your draft is safe. Reconnect to continue.', '草稿已保留，重新连接后可以继续。') },
  ]
  return <section className="pv-section" id="alert">
    <h2>{c('Alert', '信息提示 Alert')}</h2>
    <p className="pv-sd">{c('Persistent information within the page. Status, icon, title, description and optional actions work together; reserve global placement for messages that affect the whole workspace.',
      '放在页面内容中的持续提示。状态、图标、标题、说明和可选操作共同表达信息；影响整个工作区的信息使用全局通知。')}</p>
    <div className="pv-alert-grid">{states.map(({ status, title, description }) => <Alert key={status} status={status}>
      <AlertTitle>{title}</AlertTitle><AlertDescription>{description}</AlertDescription>
    </Alert>)}</div>
    <div className="pv-alert-actions-example">
      <h3>{c('Actions and dismissal', '操作与关闭')}</h3>
      {visible ? <Alert status={retried ? 'success' : 'warning'}>
        <AlertTitle>{retried ? c('Connection restored', '连接已恢复') : c('Connection needs attention', '连接需要处理')}</AlertTitle>
        <AlertDescription>{retried ? c('You can continue working.', '可以继续工作。') : c('Reconnect without losing your current work.', '重新连接，保留当前工作。')}
          {!retried && <div className="mt-3"><Button variant="outline" size="sm" onClick={() => setRetried(true)}>{c('Retry connection', '重新连接')}</Button></div>}
        </AlertDescription>
        <AlertAction><Button size="icon-sm" variant="ghost" aria-label={c('Dismiss inline alert', '关闭页面提示')} onClick={() => setVisible(false)}><XMarkIcon /></Button></AlertAction>
      </Alert> : <Button variant="outline" onClick={() => { setVisible(true); setRetried(false) }}>{c('Restore inline alert', '恢复页面提示')}</Button>}
    </div>
    <pre className="pv-api-example"><code>{'<Alert status="warning">\n  <AlertTitle>Some files need attention</AlertTitle>\n  <AlertDescription>Review the failed imports.</AlertDescription>\n</Alert>'}</code></pre>
  </section>
}

export function GlobalAlertExamples() {
  const c = useCopy()
  const [status, setStatus] = useState<AlertStatus>('warning')
  const [placement, setPlacement] = useState<GlobalAlertPlacement>('top')
  const [canvas, setCanvas] = useState<HTMLDivElement | null>(null)
  const [sampleOpen, setSampleOpen] = useState(true)
  const [liveOpen, setLiveOpen] = useState(false)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const trigger = useRef<HTMLButtonElement>(null)
  const labels = {
    default: c('Workspace notice', '工作区通知'), info: c('A new version is available', '有新版本可用'),
    success: c('Connection restored', '连接已恢复'), warning: c('Scheduled maintenance', '计划维护'), danger: c('Unable to connect', '无法连接'),
  }
  const descriptions = {
    default: c('This message stays visible until you close it.', '此通知会持续显示，直到你主动关闭。'),
    info: c('You can continue working and update when ready.', '可以继续工作，准备好后再更新。'),
    success: c('Your workspace is connected again.', '工作区已重新连接。'),
    warning: c('The workspace will be read-only during maintenance. Save your changes before continuing.', '维护期间工作区将切换为只读。请先保存当前更改。'),
    danger: c('Your work is preserved. Retry when your connection is available.', '当前工作已保留，网络恢复后可以重试。'),
  }
  const actions = status === 'danger'
    ? <Button size="sm" variant="outline" onClick={() => setStatus('success')}>{c('Retry connection', '重新连接')}</Button>
    : <Button size="sm" variant="outline" aria-expanded={detailsOpen} onClick={() => setDetailsOpen(!detailsOpen)}>
      {detailsOpen ? c('Hide notice details', '收起通知详情') : c('View notice details', '查看通知详情')}</Button>
  const description = <>{descriptions[status]}{detailsOpen && <span className="mt-2 block">
    {c('Notice details: this preview affects this page only. You can dismiss it and continue working.',
      '通知详情：此示例只影响当前预览页，可以关闭通知并继续操作。')}
  </span>}</>
  const offset = placement.startsWith('top') ? 72 : 16
  return <section className="pv-section" id="global-alert">
    <h2>{c('Global notice', '全局固定通知')}</h2>
    <p className="pv-sd">{c('Pinned to the viewport and visible while the page scrolls. No automatic timeout. Use it for maintenance, connection problems or a workspace-wide announcement; it does not block interaction.',
      '固定在视口中，滚动页面仍可见，不会自动消失。适用于维护、连接异常或影响整个工作区的公告；不阻断页面操作。')}</p>
    <div className="pv-platform-toolbar">
      <label>{c('Notice status', '通知状态')}<NativeSelect value={status} onChange={event => setStatus(event.target.value as AlertStatus)}>
        {Object.entries(labels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
      </NativeSelect></label>
      <label>{c('Notice position', '通知位置')}<NativeSelect value={placement} onChange={event => setPlacement(event.target.value as GlobalAlertPlacement)}>
        <option value="top">{c('Top banner', '顶部横幅')}</option><option value="bottom">{c('Bottom banner', '底部横幅')}</option>
        <option value="top-right">{c('Top right', '右上角')}</option><option value="bottom-right">{c('Bottom right', '右下角')}</option>
      </NativeSelect></label>
      <Button ref={trigger} onClick={() => setLiveOpen(true)}>{c('Show on this page', '在当前页面显示')}</Button>
      <Button variant="outline" onClick={() => setSampleOpen(true)}>{c('Restore canvas notice', '恢复画布通知')}</Button>
    </div>
    <div className="pv-notice-canvas" ref={setCanvas}>
      <div className="pv-notice-canvas-header">{c('Workspace header · 56px', '工作区顶部栏 · 56px')}</div>
      <div className="pv-notice-canvas-content"><p>{c('Scroll this canvas', '滚动画布体验')}</p>
        {Array.from({ length: 6 }, (_, i) => <p key={i}>{c('Workspace content', '工作区内容')} · {i + 1}</p>)}
      </div>
      {canvas && <GlobalAlert container={canvas} open={sampleOpen} status={status} placement={placement} offset={offset}
        title={labels[status]} description={description} actions={actions}
        closeLabel={c('Close canvas notice', '关闭画布通知')} onClose={() => setSampleOpen(false)} />}
    </div>
    <GlobalAlert open={liveOpen} status={status} placement={placement} offset={offset}
      title={labels[status]} description={description} actions={actions}
      closeLabel={c('Close global notice', '关闭全局通知')} onClose={() => { setLiveOpen(false); trigger.current?.focus() }} />
    <div className="pv-platform-table-wrap"><table className="pv-platform-rules">
      <thead><tr><th>{c('Feedback', '反馈类型')}</th><th>{c('Position', '位置')}</th><th>{c('Lifetime', '持续时间')}</th><th>{c('Use for', '使用场景')}</th></tr></thead>
      <tbody>
        <tr><td>Alert</td><td>{c('Within content', '页面内容内')}</td><td>{c('Until resolved or dismissed', '处理完成或主动关闭')}</td><td>{c('Contextual instructions and warnings', '局部说明与警告')}</td></tr>
        <tr><td>{c('Global notice', '全局通知')}</td><td>{c('Fixed to viewport', '固定于视口')}</td><td>{c('Explicit dismissal; no timeout', '主动关闭，不自动消失')}</td><td>{c('Workspace-wide information', '影响整个工作区的信息')}</td></tr>
        <tr><td>Toast</td><td>{c('Corner stack', '角落堆叠')}</td><td>{c('Brief; follows the operation', '短暂显示，跟随操作')}</td><td>{c('Saved, copied, completed', '保存、复制、完成反馈')}</td></tr>
      </tbody>
    </table></div>
    <p className="pv-platform-note">{c('16px edge spacing; top samples use a 72px offset to clear the header. One workspace-wide notice at a time. No focus stealing; ordinary messages use polite announcements and errors use assertive announcements.',
      '距边缘 16px；顶部示例偏移 72px 以避开顶栏。工作区级通知同一时间展示一条。不抢占焦点；普通通知温和播报，错误通知即时播报。')}</p>
    <pre className="pv-api-example"><code>{'<GlobalAlert open={open} status="warning" placement="top" offset={72}\n  title="Scheduled maintenance" description="Save your changes before continuing."\n  closeLabel="Close notice" onClose={() => setOpen(false)} />'}</code></pre>
  </section>
}
