// src/components/input-otp.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from './input-otp'

describe('InputOTP', () => {
  it('renders OTPInput with data-slot="input-otp"', () => {
    const { container } = render(
      <InputOTP maxLength={6} aria-label="One-time code">
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
        </InputOTPGroup>
      </InputOTP>,
    )
    expect(container.querySelector('[data-slot="input-otp"]')).toBeInTheDocument()
  })

  it('renders InputOTPGroup with data-slot="input-otp-group"', () => {
    const { container } = render(
      <InputOTP maxLength={4} aria-label="Code">
        <InputOTPGroup>
          <InputOTPSlot index={0} />
        </InputOTPGroup>
      </InputOTP>,
    )
    expect(container.querySelector('[data-slot="input-otp-group"]')).toBeInTheDocument()
  })

  it('renders InputOTPSlot with data-slot="input-otp-slot"', () => {
    const { container } = render(
      <InputOTP maxLength={2} aria-label="Code">
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
        </InputOTPGroup>
      </InputOTP>,
    )
    const slots = container.querySelectorAll('[data-slot="input-otp-slot"]')
    expect(slots).toHaveLength(2)
  })

  it('renders InputOTPSeparator with role="separator"', () => {
    render(<InputOTPSeparator />)
    expect(screen.getByRole('separator')).toBeInTheDocument()
  })

  it('renders separator with data-slot="input-otp-separator"', () => {
    const { container } = render(<InputOTPSeparator />)
    expect(container.querySelector('[data-slot="input-otp-separator"]')).toBeInTheDocument()
  })

  it('forwards containerClassName to OTPInput container wrapper', () => {
    const { container } = render(
      <InputOTP maxLength={4} aria-label="Code" containerClassName="my-custom-class">
        <InputOTPGroup>
          <InputOTPSlot index={0} />
        </InputOTPGroup>
      </InputOTP>,
    )
    // containerClassName applies to the div wrapping the OTPInput, not the input itself
    expect(container.querySelector('.my-custom-class')).toBeInTheDocument()
  })
})
