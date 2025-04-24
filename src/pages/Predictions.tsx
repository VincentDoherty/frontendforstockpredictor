import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Brush,
    CartesianGrid,
    Legend,
} from 'recharts'
import { Loader2 } from 'lucide-react'

export default function PredictionsPage() {
    const [symbol, setSymbol] = useState('AAPL')
    const [history, setHistory] = useState<{ date: string; close: number }[]>([])
    const [predictions, setPredictions] = useState<{ date: string; price: number }[]>([])
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [searchParams, setSearchParams] = useSearchParams()

    useEffect(() => {
        const querySymbol = searchParams.get('symbol')
        if (querySymbol) {
            setSymbol(querySymbol.toUpperCase())
            fetchData(querySymbol.toUpperCase())
        }
    }, [])

    const fetchData = async (sym: string) => {
        setLoading(true)
        try {
            const historyRes = await fetch(`/api/stock/${sym}/history`)
            const historyData = await historyRes.json()
            if (historyRes.ok) setHistory(historyData.history)

            const predRes = await fetch(`/api/stock/${sym}/predictions`)
            if (predRes.status === 404) {
                const genRes = await fetch(`/api/stock`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ stock_symbol: sym })
                })
                if (!genRes.ok) throw new Error('Failed to generate predictions')
                const genData = await genRes.json()
                setPredictions(genData.predicted_prices.map((price: number, i: number) => ({
                    date: genData.predicted_dates[i],
                    price
                })))
                setHistory(genData.actual_dates.map((date: string, i: number) => ({
                    date,
                    close: genData.actual_prices[i]
                })))
            } else {
                const predData = await predRes.json()
                setPredictions(predData.predicted)
            }
        } catch (e) {
            setError('Failed to fetch predictions')
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSearchParams({ symbol })
        fetchData(symbol)
    }

    const getMinMax = (data: { close?: number; price?: number }[]) => {
        const values = data.map(d => d.close ?? d.price ?? 0)
        const min = Math.min(...values)
        const max = Math.max(...values)
        return [min, max]
    }

    const [minHistory, maxHistory] = getMinMax(history)
    const [minPred, maxPred] = getMinMax(predictions)

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-6">
            <form onSubmit={handleSubmit} className="flex gap-2">
                <Input value={symbol} onChange={(e) => setSymbol(e.target.value.toUpperCase())} placeholder="Enter Stock Symbol (e.g. AAPL)" />
                <Button type="submit">Get Predictions</Button>
            </form>

            {error && <div className="text-red-500">{error}</div>}

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="w-10 h-10 animate-spin text-gray-500" />
                </div>
            ) : (
                <>
                    <Card>
                        <CardContent className="p-4">
                            <h2 className="text-lg font-semibold mb-2">Stock History</h2>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={history} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                                    <XAxis dataKey="date" />
                                    <YAxis domain={[minHistory, maxHistory]} />
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="close" stroke="#82ca9d" strokeWidth={2} dot={false} />
                                    <Brush dataKey="date" height={30} stroke="#8884d8" />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <h2 className="text-lg font-semibold mb-2">Predicted Prices</h2>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={predictions} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                                    <XAxis dataKey="date" />
                                    <YAxis domain={[minPred, maxPred]} />
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="price" stroke="#8884d8" strokeWidth={2} dot={false} />
                                    <Brush dataKey="date" height={30} stroke="#82ca9d" />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </>
            )}
        </div>
    )
}
