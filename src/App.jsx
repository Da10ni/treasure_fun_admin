import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import Dashboard from './pages/Dashboard'
import UserPage from './pages/UserPage'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<MainLayout />} />
        <Route index element={
          <MainLayout>
            <Dashboard />
          </MainLayout>} />
        <Route path='/users' element={
          <MainLayout>
          <UserPage/>
          </MainLayout>} />
        <Route path='withdraw' element={
          <MainLayout>
            <div>withdraw</div>
          </MainLayout>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
