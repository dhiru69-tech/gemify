import { Navigate } from 'react-router-dom'
import useStore from '../store/useStore'

export default function ProtectedRoute({ children }) {
  const { isLoggedIn } = useStore()
  if (!isLoggedIn) return <Navigate to="/login" replace />
  return children
}
