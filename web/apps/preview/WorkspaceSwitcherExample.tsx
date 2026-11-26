import { ChartBarIcon, KeyIcon, PlusIcon } from '@heroicons/react/24/outline'
import {
  DropdownMenu, DropdownMenuAction, DropdownMenuContent, DropdownMenuLabel,
  DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger,
  PrimaryNavigation, PrimaryNavItem, PrimaryNavLogo, Segmented, WorkspaceMonogram, WorkspaceSwitcherTrigger,
} from '@zooclaw/zooworkdesign'
import { useState } from 'react'
import { LocalLink, PreviewAccount } from './NavigationExamples'
import { usePreviewLocale } from './locale'
import { previewAsset } from './preview-assets'

/** Local state exercises the public components without project or billing services. */
export function WorkspaceSwitcherExample() {
  const { t } = usePreviewLocale()
  const [projects, setProjects] = useState(['Default Project', 'Research', 'Operations'])
  const [selected, setSelected] = useState(projects[0])
  const [active, setActive] = useState('keys')
  const [actionVariant, setActionVariant] = useState('default')
  const projectName = (name: string) => name.startsWith('new-')
    ? t('New project {number}', { number: name.slice(4) }) : t(name)
  const createProject = () => {
    const name = `new-${projects.length - 2}`
    setProjects([...projects, name])
    setSelected(name)
  }
  return (
    <div className="pv-nav-example">
      <Segmented aria-label={t('Create action style')} value={actionVariant} onValueChange={setActionVariant}
        options={[{ value: 'default', label: t('Default') }, { value: 'outline', label: t('Outline') }]} />
      <div className="pv-primary-rail pv-nav-stage" data-app-shell data-nav-collapsed="false">
        <PrimaryNavigation
          className="relative"
          isCollapsed={false}
          isMobile={false}
          isMobileMenuOpen={false}
          label={t('Project navigation')}
          logo={<PrimaryNavLogo
            isCollapsed={false}
            isMobile={false}
            LinkComponent={LocalLink}
            lightLogoSrc={previewAsset('product-source/brand/zoowork-horizontal-navy.png')}
            collapsedLogoSrc={previewAsset('product-source/brand/zoowork-symbol.png')}
          />}
          footer={<PreviewAccount collapsed={false} onSettings={() => setActive('settings')} />}
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <WorkspaceSwitcherTrigger
                aria-label={t('Select project')}
                name={projectName(selected)}
                avatar={<WorkspaceMonogram name={projectName(selected)} />}
                hideNameOnMobile={false}
                layout="primary-nav"
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64 max-w-[calc(100vw-2rem)]">
              <DropdownMenuLabel>{t('Projects')}</DropdownMenuLabel>
              <DropdownMenuRadioGroup value={selected} onValueChange={setSelected}>
                {projects.map(project => <DropdownMenuRadioItem key={project} value={project} indicator="check">
                  <WorkspaceMonogram name={projectName(project)} />
                  {projectName(project)}
                </DropdownMenuRadioItem>)}
              </DropdownMenuRadioGroup>
              <DropdownMenuSeparator />
              <DropdownMenuAction variant={actionVariant === 'outline' ? 'outline' : 'default'} onSelect={createProject}>
                <PlusIcon aria-hidden="true" className="size-4" />{t('Create project')}
              </DropdownMenuAction>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="mt-5 space-y-0.5">
            {[
              { key: 'keys', label: 'API Keys', Icon: KeyIcon },
              { key: 'usage', label: 'Usage', Icon: ChartBarIcon },
            ].map(({ key, label, Icon }) => <PrimaryNavItem
              key={key}
              item={{ key, href: `#${key}`, label: t(label), icon: <Icon className="size-5" /> }}
              isCollapsed={false}
              isActive={active === key}
              onNavigate={() => setActive(key)}
              LinkComponent={LocalLink}
            />)}
          </div>
        </PrimaryNavigation>
      </div>
      <p className="pv-example-caption" role="status">
        {t('Selected project: {name}', { name: projectName(selected) })}
      </p>
    </div>
  )
}
