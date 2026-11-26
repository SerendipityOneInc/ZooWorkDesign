import { useState } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import {
  Button, Drawer, DrawerBody, DrawerClose, DrawerContent,
  DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger,
} from '@zooclaw/zooworkdesign'
import { usePreviewLocale } from './locale'

/** A mobile primitive demonstration, not a product settings screen. */
export function MobileDrawerExample() {
  const { t } = usePreviewLocale()
  const [container, setContainer] = useState<HTMLDivElement | null>(null)
  return (
    <div className="pv-mobile-drawer-stage" ref={setContainer}>
      {container && (
        <Drawer container={container} noBodyStyles disablePreventScroll={false} repositionInputs={false}>
          <div className="pv-mobile-drawer-launcher">
            <span className="text-muted-foreground text-sm">{t('Mobile preview · 390px')}</span>
            <DrawerTrigger asChild>
              <Button variant="outline">{t('Open Drawer')}</Button>
            </DrawerTrigger>
          </div>
          <DrawerContent>
            <DrawerHeader>
              <div className="flex items-center justify-between gap-4">
                <DrawerTitle>{t('Mobile bottom sheet')}</DrawerTitle>
                <DrawerClose asChild>
                  <Button variant="ghost" size="icon-sm" aria-label={t('Close')}>
                    <XMarkIcon />
                  </Button>
                </DrawerClose>
              </div>
              <DrawerDescription>{t('Drag down, press Escape, or tap the backdrop to close.')}</DrawerDescription>
            </DrawerHeader>
            <DrawerBody>
              <p className="text-muted-foreground mb-5 text-sm">
                {t('Use for short mobile interactions. Use Sheet for desktop side panels.')}
              </p>
              <DrawerClose asChild>
                <Button className="w-full">{t('Done')}</Button>
              </DrawerClose>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      )}
    </div>
  )
}
