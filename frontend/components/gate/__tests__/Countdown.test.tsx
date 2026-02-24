import { render, screen } from '@testing-library/react'
import Countdown from '../Countdown'

describe('Countdown', () => {
  it('renders without crashing', () => {
    render(<Countdown timeRemaining={60000} />)
  })

  it('correctly displays hours, minutes, and seconds for a known value', () => {
    // 3723000ms = 1 hour, 2 minutes, 3 seconds
    render(<Countdown timeRemaining={3723000} />)
    expect(screen.getByText('01:02:03')).toBeInTheDocument()
  })

  it('renders 00:00:00 when given 0', () => {
    render(<Countdown timeRemaining={0} />)
    expect(screen.getByText('00:00:00')).toBeInTheDocument()
  })
})
