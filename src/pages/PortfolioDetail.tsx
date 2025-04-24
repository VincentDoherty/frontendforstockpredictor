import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Trash2, Pencil } from 'lucide-react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'

interface Portfolio {
  id: number
  name: string
}

interface Stock {
  id: number
  stock_symbol: string
  purchase_price: number
  current_price: number
  profit_loss: number
  purchase_date: string
  shares?: number
}

export default function PortfolioManager() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([])
  const [selectedId, setSelectedId] = useState<string>('')
  const [selectedName, setSelectedName] = useState<string>('')
  const [stocks, setStocks] = useState<Stock[]>([])
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    stock_symbol: '',
    purchase_price: '',
    purchase_date: '',
  })
  const [editStockId, setEditStockId] = useState<number | null>(null)

  useEffect(() => {
    fetch('/api/portfolios')
        .then((res) => res.json())
        .then((data) => {
          setPortfolios(data)
          if (data.length > 0) {
            setSelectedId(String(data[0].id))
            setSelectedName(data[0].name)
          }
        })
        .catch(() => setError('Failed to load portfolios'))
  }, [])

  useEffect(() => {
    if (selectedId) {
      const p = portfolios.find((p) => String(p.id) === selectedId)
      setSelectedName(p?.name || '')
      fetch(`/api/portfolios/${selectedId}`)
          .then((res) => res.json())
          .then((data) => setStocks(data))
          .catch(() => setError('Failed to load stocks'))
    }
  }, [selectedId])

  const refreshPortfolio = async () => {
    const data = await fetch(`/api/portfolios/${selectedId}`).then((res) => res.json())
    setStocks(data)
  }

  const handleAddStock = async (e: React.FormEvent) => {
    e.preventDefault()
    const response = await fetch(`/api/portfolios/${selectedId}/stocks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        stock_symbol: form.stock_symbol,
        purchase_price: parseFloat(form.purchase_price),
        purchase_date: form.purchase_date,
      }),
    })
    if (response.ok) {
      refreshPortfolio()
      setForm({ stock_symbol: '', purchase_price: '', purchase_date: '' })
    } else {
      setError('Failed to add stock')
    }
  }

  const handleDeleteStock = async (id: number) => {
    await fetch(`/api/portfolios/${selectedId}/stocks/${id}`, { method: 'DELETE' })
    refreshPortfolio()
  }

  const handleEditStock = async () => {
    if (editStockId === null) return
    await fetch(`/api/portfolios/${selectedId}/stocks/${editStockId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        purchase_price: parseFloat(form.purchase_price),
        purchase_date: form.purchase_date,
      }),
    })
    refreshPortfolio()
    setEditStockId(null)
    setForm({ stock_symbol: '', purchase_price: '', purchase_date: '' })
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28CF0', '#E74C3C']
  const pieData = stocks.map((s) => ({
    name: s.stock_symbol,
    value: (s.shares || 1) * s.current_price,
  }))

  return (
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Select Portfolio</h1>
          <Select value={selectedId} onValueChange={setSelectedId}>
            <SelectTrigger className="w-60">
              <SelectValue placeholder="Choose a portfolio" />
            </SelectTrigger>
            <SelectContent>
              {portfolios.map((p) => (
                  <SelectItem key={p.id} value={String(p.id)}>
                    {p.name}
                  </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {error && <div className="text-red-500">{error}</div>}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4 space-y-2">
              {stocks.length === 0 ? (
                  <p>Portfolio content for "{selectedName}" would appear here.</p>
              ) : (
                  <ul className="space-y-2">
                    {stocks.map((stock) => (
                        <li key={stock.id} className="flex justify-between items-center border p-2 rounded">
                          <div className="flex flex-col">
                            <span className="font-medium">{stock.stock_symbol}</span>
                            <span className="text-xs text-gray-500">
                        Buy: ${stock.purchase_price} | Current: ${stock.current_price} | P/L: ${stock.profit_loss}
                      </span>
                          </div>
                          <div className="flex gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => {
                                      setEditStockId(stock.id)
                                      setForm({
                                        stock_symbol: stock.stock_symbol,
                                        purchase_price: String(stock.purchase_price),
                                        purchase_date: stock.purchase_date,
                                      })
                                    }}
                                >
                                  <Pencil className="w-4 h-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Edit Stock</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-3">
                                  <Input
                                      name="purchase_price"
                                      type="number"
                                      value={form.purchase_price}
                                      onChange={(e) => setForm({ ...form, purchase_price: e.target.value })}
                                  />
                                  <Input
                                      name="purchase_date"
                                      type="date"
                                      value={form.purchase_date}
                                      onChange={(e) => setForm({ ...form, purchase_date: e.target.value })}
                                  />
                                </div>
                                <DialogFooter>
                                  <Button onClick={handleEditStock}>Save</Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteStock(stock.id)}>
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </div>
                        </li>
                    ))}
                  </ul>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <h2 className="font-semibold mb-2">Stock Allocation</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={100} label>
                    {pieData.map((_, i) => (
                        <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="p-4 space-y-4">
            <h2 className="text-lg font-semibold">Add Stock</h2>
            <form onSubmit={handleAddStock} className="grid grid-cols-3 gap-4">
              <Input
                  name="stock_symbol"
                  placeholder="Symbol (e.g. AAPL)"
                  value={form.stock_symbol}
                  onChange={(e) => setForm({ ...form, stock_symbol: e.target.value })}
                  required
              />
              <Input
                  name="purchase_price"
                  type="number"
                  placeholder="Purchase Price"
                  value={form.purchase_price}
                  onChange={(e) => setForm({ ...form, purchase_price: e.target.value })}
                  required
              />
              <Input
                  name="purchase_date"
                  type="date"
                  value={form.purchase_date}
                  onChange={(e) => setForm({ ...form, purchase_date: e.target.value })}
                  required
              />
              <Button type="submit" className="col-span-3">
                Add Stock
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h2 className="font-semibold mb-2">Portfolio Growth</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                  data={stocks.map((s) => ({
                    name: s.stock_symbol,
                    value: parseFloat(s.current_price as never),
                  }))}
              >
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
  )
}