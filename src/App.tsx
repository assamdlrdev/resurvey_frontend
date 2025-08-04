// import { useState } from 'react'
import './App.css'
import React from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'

function App() {

  return (
    <>
    {/* <React.StrictMode> */}
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Navigate to='/login' replace />} />
          <Route path='/login' element={<Login />} />
          <Route path='/dashboard' element={<Dashboard  />} />
        </Routes>
      </BrowserRouter>
    {/* </React.StrictMode> */}
    </>
  )
}

export default App
