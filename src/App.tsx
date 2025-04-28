import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Portfolio from './pages/Portfolio'
import Feedback from './pages/Feedback'
import NotFound from './pages/NotFound.tsx'
import PortfolioDetailLayout from '@/pages/PortfolioDetail.tsx'
import PredictionsPage from "@/pages/Predictions.tsx";
import Goals from "@/pages/Goals.tsx";
import RiskProfile from "@/pages/RiskProfile.tsx";
import LandingPage from "@/pages/Landing.tsx";
import Logout from "@/pages/Logout.tsx";
import {Toaster} from "sonner";
import ProtectedRoute from '@/components/ProtectedRoute'



export default function App() {
  return (
      <><Toaster/><Routes>
        <Route path="/" element={<Layout/>}>
          <Route index element={<LandingPage/>}/>
          <Route path="dashboard" element={<ProtectedRoute><Dashboard/></ProtectedRoute>} />
          <Route path="login" element={<Login/>}/>
          <Route path="register" element={<Register/>}/>
          <Route path="portfolios" element={<ProtectedRoute><Portfolio/></ProtectedRoute>} />
          <Route path="portfolios/:id" element={<ProtectedRoute><PortfolioDetailLayout/></ProtectedRoute>} />
          <Route path="predictions" element={<ProtectedRoute><PredictionsPage/></ProtectedRoute>} />
          <Route path="risk-profile" element={<ProtectedRoute><RiskProfile/></ProtectedRoute>} />
          <Route path="goals" element={<ProtectedRoute><Goals/></ProtectedRoute>} />
          <Route path="feedback" element={<Feedback/>}/>
          <Route path="logout" element={<Logout/>}/>
          <Route path="*" element={<NotFound/>}/>
        </Route>
      </Routes></>
  )
}
