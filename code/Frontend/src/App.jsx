import React from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { Layout, Menu } from 'antd'
import Login from './pages/Login'
import Signup from './pages/Signup'
import CompaneyList from './pages/Companey/CompaneyList'
import CompaneyForm from './pages/Companey/CompaneyForm'
import ProtectedRoute from './routes/ProtectedRoute'
import './App.css'

const { Header, Content } = Layout

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Content style={{ padding: '24px' }}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/companey" element={<CompaneyList />} />
              <Route path="/companey/form" element={<CompaneyForm />} />
              <Route path="/companey/:id/edit" element={<CompaneyForm />} />
            </Route>

            <Route path="/" element={<Login />} />
          </Routes>
        </Content>
      </Layout>
    </BrowserRouter>
  )
}

export default App
