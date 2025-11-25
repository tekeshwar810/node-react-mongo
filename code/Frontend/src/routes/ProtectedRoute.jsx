import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import AppHeader from '../components/AppHeader'

const ProtectedRoute = ({ redirectTo = '/login' }) => {
  const userData = localStorage.getItem('userData')
  const location = useLocation()
  if (!userData || userData === 'undefined') {
    return <Navigate to={redirectTo} state={{ from: location }} replace />
  }
  return (
    <>
      <AppHeader />
      <Outlet />
    </>
  )
}

export default ProtectedRoute
