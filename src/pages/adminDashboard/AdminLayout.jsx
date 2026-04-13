import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import AdminNav from './components/AdminNav'

const AdminLayout = () => {
  return (
     <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Right side content */}
      <div className="flex-1">
        {/* <Navbar /> */}
       <div className='sticky top-0 z-50'>
         <AdminNav/>
       </div>
        <main className="flex-1 bg-gray-50 p-6 overflow-y-auto">
          <Outlet />
        </main>
        {/* <Footer /> */}
      </div>
    </div>
  )
}

export default AdminLayout