import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter} from 'react-router-dom'
// AppContextProvider is the "house" that holds all your shared data (user info, login status, backend URL)
import { AppContextProvider } from './context/AppContext.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  {/* Wrap your app inside AppContextProvider
      This allows all components inside <App /> to access shared data
      via useContext(AppContent) */}
    <AppContextProvider>
      <App />
    </AppContextProvider>
  </BrowserRouter>,
)
