import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import Dashboard from './pages/Dashboard'
import Deposits from './pages/Deposits'
import Withdrawals from './pages/Withdrawals'
import Users from './pages/Users'
import Packages from './pages/Packages'
import Refferals from './pages/Refferals'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<MainLayout />} />
        <Route index element={
          <MainLayout>
            <Dashboard />
          </MainLayout>} />
        <Route path='deposits' element={
          <MainLayout>
            <Deposits />
          </MainLayout>} />
        <Route path='withdrawals' element={
          <MainLayout>
            <Withdrawals />
          </MainLayout>} />
        <Route path='users' element={
          <MainLayout>
            <Users />
          </MainLayout>} />
        <Route path='packages' element={
          <MainLayout>
            <Packages />
          </MainLayout>} />
        <Route path='referrals' element={
          <MainLayout>
            <Refferals />
          </MainLayout>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
