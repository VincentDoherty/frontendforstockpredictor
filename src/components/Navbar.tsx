import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className="bg-gray-800 text-white p-4 flex gap-4">
      <Link to={"/dashboard"}>Dashboard</Link>
      <Link to={'/portfolios'}>Portfolio</Link>
      <Link to={'/feedback'}>Feedback</Link>
      <Link to={'/admin'}>Admin</Link>
    </nav>
  )
}
