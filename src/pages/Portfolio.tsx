import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useNavigate } from 'react-router-dom'
import { Trash2, PlusCircle, Folder } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog'

interface Portfolio {
  id: number
  name: string
}

export default function PortfolioList() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([])
  const [error, setError] = useState('')
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [newPortfolioName, setNewPortfolioName] = useState('')
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    fetch('/api/portfolios')
        .then((res) => res.json())
        .then((data) => setPortfolios(data))
        .catch(() => setError('Failed to load portfolios'))
  }, [])

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`/api/portfolios/${id}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        setPortfolios(portfolios.filter((p) => p.id !== id))
        setDeletingId(null)
      } else {
        setError('Failed to delete portfolio')
      }
    } catch {
      setError('Failed to delete portfolio')
    }
  }

  const handleCreate = async () => {
    if (!newPortfolioName.trim()) {
      setError('Portfolio name is required')
      return
    }
    try {
      const res = await fetch('/api/portfolios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newPortfolioName.trim() })
      })
      if (res.ok) {
        const data = await res.json()
        setPortfolios([...portfolios, { id: data.portfolio_id, name: newPortfolioName.trim() }])
        setNewPortfolioName('')
        setShowCreateDialog(false)
        setError('')
      } else {
        setError('Failed to create portfolio')
      }
    } catch {
      setError('Failed to create portfolio')
    }
  }

  return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold flex items-center gap-2">
            <Folder className="w-6 h-6" /> Your Portfolios
          </h1>
          <AlertDialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <AlertDialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <PlusCircle className="w-4 h-4" /> New Portfolio
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Create New Portfolio</AlertDialogTitle>
              </AlertDialogHeader>
              <Input
                  placeholder="Portfolio Name"
                  value={newPortfolioName}
                  onChange={(e) => setNewPortfolioName(e.target.value)}
                  className="mt-4"
              />
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setNewPortfolioName('')}>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleCreate}>Create</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <div className="grid gap-4">
          {portfolios.map((p) => (
              <Card key={p.id} className="p-4 hover:shadow-lg">
                <div className="flex justify-between items-center">
                  <CardContent
                      className="cursor-pointer flex-1"
                      onClick={() => navigate(`/portfolios/${p.id}`)}
                  >
                    <h2 className="text-lg font-medium text-left">{p.name}</h2>
                  </CardContent>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                          variant="destructive"
                          onClick={() => setDeletingId(p.id)}
                          className="flex items-center gap-1"
                      >
                        <Trash2 className="w-4 h-4" /> Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => deletingId !== null && handleDelete(deletingId)}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </Card>
          ))}
          {portfolios.length === 0 && !error && <p className="text-gray-600">No portfolios found.</p>}
        </div>
      </div>
  )
}
