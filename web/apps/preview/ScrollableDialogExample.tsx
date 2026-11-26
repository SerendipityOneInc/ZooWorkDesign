import { useId, useState } from 'react'
import { Button, Dialog, DialogBody, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, Input, Label } from '@zooclaw/zooworkdesign'
import { usePreviewLocale } from './locale'

/** Exercises the exported dialog scroll contract without any application APIs. */
export function ScrollableDialogExample() {
  const { t } = usePreviewLocale()
  const [open, setOpen] = useState(false)
  const id = useId()
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button variant="outline">{t('Open long form')}</Button></DialogTrigger>
      <DialogContent scrollable closeLabel={t('Close')}>
        <DialogHeader>
          <DialogTitle>{t('Long form')}</DialogTitle>
          <DialogDescription>{t('Scroll the fields. The title and actions stay visible.')}</DialogDescription>
        </DialogHeader>
        <DialogBody>
          <form id={id} className="space-y-5" onSubmit={(event) => { event.preventDefault(); setOpen(false) }}>
            {Array.from({ length: 12 }, (_, index) => (
              <div className="space-y-2" key={index}>
                <Label htmlFor={`${id}-${index}`}>{t('Field {number}', { number: index + 1 })}</Label>
                <Input id={`${id}-${index}`} autoComplete="off" />
              </div>
            ))}
          </form>
        </DialogBody>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>{t('Cancel')}</Button>
          <Button type="submit" form={id}>{t('Save changes')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
