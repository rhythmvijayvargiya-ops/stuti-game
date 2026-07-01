import { createFileRoute } from '@tanstack/react-router'
import { DeviGame } from '../components/DeviGame'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return <DeviGame />
}
