import { useState } from 'react'
import './App.css'
import { Outlet } from 'react-router-dom'
import {NavigationLayout} from "../src/layouts/NavigationLayout"
function App() {

  return (
    <>
      <div>
        <div>
          <NavigationLayout/>
        </div>
      </div>
    </>
  )
}

export default App
