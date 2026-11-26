import { useId, useState } from 'react'
import { Button, ButtonGroup } from '@zooclaw/zooworkdesign'
import { usePreviewLocale } from './locale'

/** Color recipes extracted from the product, without its page or business flow. */
export function GradientRules() {
  const { t } = usePreviewLocale()
  const gradientId = useId()
  const [flat, setFlat] = useState(false)
  return (
    <div className="bv-gradients" id="color-gradients">
      <div className="bv-heading bv-subsection">
        <div>
          <p className="bv-eyebrow">{t('Gradients · Product recipes')}</p>
          <h3>{t('Atmosphere and activity')}</h3>
        </div>
      </div>
      <p className="pv-sd">
        {t(
          'Two existing product treatments, with different roles: a quiet creation backdrop and a left-to-right activity line.',
        )}
      </p>
      <div className="bv-gradient-grid">
        <article className="bv-gradient-recipe">
          <div className="bv-aura-sample">
            <div className="zw-creation-aura" aria-hidden="true" />
            <strong>{t('Create Agent')}</strong>
            <p>{t('Describe what you need. You can refine your Agent together in Build.')}</p>
          </div>
          <h4>{t('Creation aura')}</h4>
          <p>
            {t(
              'Two blurred ellipses blend into the panel surface. Use locally behind a creation or welcome heading, keeping fields and actions neutral.',
            )}
          </p>
          <dl className="bv-gradient-values">
            <div>
              <dt>{t('Violet layer')}</dt>
              <dd>
                <code>#5755C6 · 12%</code>
              </dd>
            </div>
            <div>
              <dt>{t('Green layer')}</dt>
              <dd>
                <code>#B9DEC5 · 35%</code> <span>{t('light')}</span>
                <br />
                <code>#3E674B · 35%</code> <span>{t('dark')}</span>
              </dd>
            </div>
            <div>
              <dt>{t('Geometry')}</dt>
              <dd>{t('160px height · 60% width each · 40px blur')}</dd>
            </div>
            <div>
              <dt>{t('Placement')}</dt>
              <dd>{t('Top −64px · outer sides −32px · clipped to panel')}</dd>
            </div>
          </dl>
          <p className="bv-note">
            {t(
              'Paper Focus values are shown. The green layer follows the theme’s success-border token, but this background does not signal success.',
            )}
          </p>
          <details>
            <summary>{t('Reuse recipe')}</summary>
            <pre>
              <code>{`<div style={{ position: 'relative', isolation: 'isolate' }}>
  <div className="zw-creation-aura" aria-hidden="true" />
  {/* Heading and content */}
</div>`}</code>
            </pre>
          </details>
          <p className="bv-gradient-source">
            {t('Source')} · <code>agents/components/CreateAgentDialog.tsx</code>
          </p>
        </article>
        <article className="bv-gradient-recipe">
          <div className="bv-activity-sample">
            <div className="bv-heading">
              <strong>{t('Activity · 14 days')}</strong>
              <ButtonGroup aria-label={t('Activity sample')}>
                <Button size="sm" variant="ghost" aria-pressed={!flat} onClick={() => setFlat(false)}>
                  {t('With activity')}
                </Button>
                <Button size="sm" variant="ghost" aria-pressed={flat} onClick={() => setFlat(true)}>
                  {t('Zero activity')}
                </Button>
              </ButtonGroup>
            </div>
            <svg
              viewBox="0 0 256 40"
              role="img"
              aria-label={t(flat ? 'Zero activity gradient line' : 'Activity gradient line, illustrative data')}
            >
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="100%" y2="0" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="var(--zw-activity-purple)" />
                  <stop offset="50%" stopColor="var(--zw-activity-teal)" />
                  <stop offset="100%" stopColor="var(--zw-activity-green)" />
                </linearGradient>
              </defs>
              <path
                d={
                  flat
                    ? 'M4 36 H252'
                    : 'M4 30 L23 30 L42 24 L61 28 L80 14 L99 22 L118 20 L137 8 L156 16 L175 12 L194 24 L213 16 L232 10 L252 5'
                }
                fill="none"
                stroke={`url(#${gradientId})`}
                strokeWidth="1.5"
              />
            </svg>
            <p>{t('Illustrative data · source line width 1.5px')}</p>
          </div>
          <h4>{t('Activity spectrum')}</h4>
          <p>
            {t(
              'A continuous series color, not a progress bar or a success scale. Color follows horizontal position; the line height carries the data.',
            )}
          </p>
          <div className="bv-gradient-strip" aria-hidden="true" />
          <div className="bv-gradient-stops">
            <span>
              <code>#7874D7</code>
              <small>0%</small>
            </span>
            <span>
              <code>#56B3AB</code>
              <small>50%</small>
            </span>
            <span>
              <code>#6BDC69</code>
              <small>100%</small>
            </span>
          </div>
          <p className="bv-note">
            {t(
              'Left to right · identical source stops in light and dark themes. Viewport coordinates keep the gradient visible when activity is zero.',
            )}
          </p>
          <details>
            <summary>{t('Reuse recipe')}</summary>
            <pre>
              <code>{`/* CSS swatch */
background: var(--zw-gradient-activity);

/* SVG line: use userSpaceOnUse + a unique gradient ID */
0%   var(--zw-activity-purple)
50%  var(--zw-activity-teal)
100% var(--zw-activity-green)`}</code>
            </pre>
          </details>
          <p className="bv-gradient-source">
            {t('Source')} · <code>agents/components/AgentActivityChart.tsx</code> +{' '}
            <code>AgentActivityChart.module.css</code>
          </p>
        </article>
      </div>
    </div>
  )
}
