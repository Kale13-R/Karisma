import { render, screen } from '@testing-library/react'
import Countdown from '../Countdown'

describe('Countdown', () => {
  it('renders without crashing', () => {
    render(<Countdown timeRemaining={60000} />)
    expect(screen.getByText(/DROP INCOMING/i)).toBeInTheDocument()
  })

  it('displays 01:02:03 for 3723000ms', () => {
    render(<Countdown timeRemaining={3723000} />)
    expect(screen.getByText('01:02:03')).toBeInTheDocument()
  })

  it('displays 00:00:00 for 0ms', () => {
    render(<Countdown timeRemaining={0} />)
    expect(screen.getByText('00:00:00')).toBeInTheDocument()
  })
})
