// Responsive Navbar with Hamburger
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false)

    return (
        <nav className="bg-gray-800 text-white p-4">
            <div className="flex items-center justify-between max-w-7xl mx-auto">
                <Link to="/" className="text-xl font-bold">S.P.M</Link>
                <button
                    className="md:hidden"
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
                <div className={`flex-col md:flex md:flex-row md:items-center md:gap-6 ${menuOpen ? 'flex' : 'hidden'} md:flex`}>
                    <Link to={"/"} className="block mt-2 md:mt-0">Home</Link>
                    <Link to={"/dashboard"} className="block mt-2 md:mt-0">Dashboard</Link>
                    <Link to={"/risk-profile"} className="block mt-2 md:mt-0">Risk Profile</Link>
                    <Link to={"/portfolios"} className="block mt-2 md:mt-0">Portfolio</Link>
                    <Link to={"/predictions"} className="block mt-2 md:mt-0">Predictions</Link>
                    <Link to={"/goals"} className="block mt-2 md:mt-0">Goals</Link>
                    <Link to={"/feedback"} className="block mt-2 md:mt-0">Feedback</Link>
                    <Link to={"/logout"} className="block mt-2 md:mt-0">Logout</Link>
                </div>
            </div>
        </nav>
    )
}
