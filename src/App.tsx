import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Portfolio from './pages/Portfolio'
import Feedback from './pages/Feedback'
import Admin from './pages/Admin'
import NotFound from './pages/NotFound.tsx'
import PortfolioDetailLayout from '@/pages/PortfolioDetail.tsx'
import PredictionsPage from "@/pages/Predictions.tsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="portfolios" element={<Portfolio />} />
        <Route path="portfolios/:id" element={<PortfolioDetailLayout />} />
        <Route path="predictions" element={<PredictionsPage />} />
        <Route path="feedback" element={<Feedback />} />
        <Route path="admin" element={<Admin />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
