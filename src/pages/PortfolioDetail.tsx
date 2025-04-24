// Full React component using grouped API instead of flat stocks
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
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
import { Trash2, Pencil, ChevronDown, ChevronUp } from 'lucide-react'
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

interface StockLot {
  id: number
  purchase_price: number
  purchase_date: string
  shares: number
  current_price: number
  current_value: number
  invested_value: number
  profit_loss: number
}

interface GroupedStock {
  symbol: string
  total_shares: number
  total_invested: number
  total_current: number
  total_pl: number
  lots: StockLot[]
}

export default function PortfolioManager() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([])
  const [selectedId, setSelectedId] = useState<string>('')
  const [selectedName, setSelectedName] = useState<string>('')
  const [stocks, setStocks] = useState<GroupedStock[]>([])
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    stock_symbol: '',
    purchase_price: '',
    purchase_date: '',
  })
  const [editStockId, setEditStockId] = useState<number | null>(null)
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})
  const [growthData, setGrowthData] = useState<{ date: string; value: number }[]>([])
  const navigate = useNavigate()
  const { id } = useParams()

  useEffect(() => {
    if (selectedId) {
      fetch(`/api/portfolio/${selectedId}/growth`)
          .then((res) => res.json())
          .then((data) => setGrowthData(data))
          .catch(() => setError('Failed to load growth data'))
    }
  }, [selectedId])

  useEffect(() => {
    fetch('/api/portfolios')
        .then((res) => res.json())
        .then((data) => {
          setPortfolios(data)

          const exists = data.find((p: { id: never }) => String(p.id) === id)
          const fallback = data[0]

          if (!selectedId && exists) {
            setSelectedId(String(exists.id))
            setSelectedName(exists.name)
          } else if (!selectedId && fallback) {
            setSelectedId(String(fallback.id))
            setSelectedName(fallback.name)
            navigate(`/portfolios/${fallback.id}`)
          }
        })
        .catch(() => setError('Failed to load portfolios'))
  }, [id, navigate, selectedId])


  useEffect(() => {
    if (selectedId) {
      const p = portfolios.find((p) => String(p.id) === selectedId)
      setSelectedName(p?.name || '')
      fetch(`/api/portfolios/${selectedId}/stocks/grouped`)
          .then((res) => res.json())
          .then((data) => setStocks(data))
          .catch(() => setError('Failed to load stocks'))
    }
  }, [portfolios, selectedId])

  const refreshPortfolio = async () => {
    const data = await fetch(`/api/portfolios/${selectedId}/stocks/grouped`).then((res) => res.json())
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
        stock_symbol: form.stock_symbol,
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
    name: s.symbol,
    value: s.total_current,
  }))

  const toggleExpand = (symbol: string) => {
    setExpanded((prev) => ({ ...prev, [symbol]: !prev[symbol] }))
  }

  return (
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Select Portfolio</h1>
          <Select value={selectedId} onValueChange={(val) => {
            setSelectedId(val)
            navigate(`/portfolios/${val}`)
          }}>
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
            <CardContent className="p-4 space-y-2 max-h-[400px] overflow-y-auto">
              {stocks.length === 0 ? (
                  <p>Portfolio content for "{selectedName}" would appear here.</p>
              ) : (
                  stocks.map((group) => (
                      <div key={group.symbol} className="border rounded p-2">
                        <div className="flex justify-between cursor-pointer" onClick={() => toggleExpand(group.symbol)}>
                          <div>
                            <span className="font-bold">{group.symbol}</span>
                            <span className="ml-2 text-sm text-gray-600">
                        Shares: {group.total_shares} | Current: ${group.total_current.toFixed(2)} | P/L: ${group.total_pl.toFixed(2)}
                      </span>
                          </div>
                          {expanded[group.symbol] ? <ChevronUp /> : <ChevronDown />}
                        </div>
                        {expanded[group.symbol] && (
                            <ul className="mt-2 space-y-2 text-sm">
                              {group.lots.map((lot) => (
                                  <li key={lot.id} className="border-t pt-2">
                                    <div>
                                      Buy on {lot.purchase_date} → {lot.shares} shares @ ${lot.purchase_price}
                                    </div>
                                    <div className="text-gray-600">
                                      Current share price: ${lot.current_price.toFixed(2)}| Buy: ${lot.purchase_price.toFixed(2)} | Value: ${lot.current_value.toFixed(2)} | P/L: ${lot.profit_loss.toFixed(2)}
                                    </div>
                                    <div className="flex gap-2 mt-1">
                                      <Dialog>
                                        <DialogTrigger asChild>
                                          <Button
                                              variant="ghost"
                                              size="icon"
                                              onClick={() => {
                                                setEditStockId(lot.id)
                                                setForm({
                                                  stock_symbol: group.symbol,
                                                  purchase_price: String(lot.purchase_price),
                                                  purchase_date: lot.purchase_date,
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
                                      <Button variant="ghost" size="icon" onClick={() => handleDeleteStock(lot.id)}>
                                        <Trash2 className="w-4 h-4 text-red-500" />
                                      </Button>
                                    </div>
                                  </li>
                              ))}
                            </ul>
                        )}
                      </div>
                  ))
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
              <LineChart data={growthData}>
                <XAxis dataKey="date" />
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