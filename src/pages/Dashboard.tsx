import { useNavigate } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LogOut, BarChart2, List, ClipboardList, Star, ThumbsUp } from 'lucide-react'

export default function Dashboard() {
  const navigate = useNavigate()

  const sections = [
    {
      title: 'Portfolio',
      description: 'View and manage your stock portfolios.',
      href: '/portfolios',
      icon: <List className="h-5 w-5" />,
    },
    {
      title: 'Predictions',
      description: 'Get stock price forecasts and insights.',
      href: '/predictions',
      icon: <BarChart2 className="h-5 w-5" />,
    },
    {
      title: 'Goals',
      description: 'Track savings goals for the future.',
      href: '/goals',
      icon: <Star className="h-5 w-5" />,
    },
    {
      title: 'Risk Profile',
      description: 'Set your risk tolerance and get recommendations.',
      href: '/risk-profile',
      icon: <ClipboardList className="h-5 w-5" />,
    },
    {
      title: 'Feedback',
      description: 'Give feedback or view user submissions.',
      href: '/feedback',
      icon: <ThumbsUp className="h-5 w-5" />,
    },
  ]

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button variant="destructive" onClick={() => navigate('/logout')}>
          <LogOut className="h-4 w-4 mr-2" /> Logout
        </Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map((s) => (
          <Card
            key={s.title}
            onClick={() => navigate(s.href)}
            className="hover:shadow-md cursor-pointer transition-shadow"
          >
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center space-x-2">
                {s.icon}
                <h2 className="text-lg font-semibold">{s.title}</h2>
              </div>
              <p className="text-sm text-muted-foreground">{s.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
