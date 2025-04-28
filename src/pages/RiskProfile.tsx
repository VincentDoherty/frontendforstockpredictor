import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Loader2 } from 'lucide-react'

export default function RiskProfile() {
    const [score, setScore] = useState<number>(50)
    const [loading, setLoading] = useState<boolean>(false)
    const [saving, setSaving] = useState<boolean>(false)
    const [success, setSuccess] = useState('')
    const [error, setError] = useState('')
    const [recommendations, setRecommendations] = useState<string[]>([])

    const loadProfile = async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/risk-profile')
            if (res.ok) {
                const data = await res.json()
                if (data.score !== null) setScore(data.score)
                fetchRecommendations()
            }
        } catch (e) {
            console.error('Failed to load risk profile', e)
        } finally {
            setLoading(false)
        }
    }

    const saveProfile = async (customScore?: number) => {
        setSaving(true)
        setError('')
        setSuccess('')
        try {
            const res = await fetch('/api/risk-profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ score: customScore !== undefined ? customScore : score })
            })
            if (res.ok) {
                setSuccess('Risk profile saved')
                fetchRecommendations()
            } else setError('Failed to save risk profile')
        } catch {
            setError('Failed to save risk profile')
        } finally {
            setSaving(false)
        }
    }

    const resetScore = () => {
        setScore(50)
        setRecommendations([])
        saveProfile(50)
    }

    const fetchRecommendations = async () => {
        try {
            const res = await fetch('/api/recommendations')
            if (res.ok) {
                const data = await res.json()
                setRecommendations(data.recommendation)
            }
        } catch (e) {
            console.error('Failed to fetch recommendations', e)
        }
    }

    useEffect(() => {
        loadProfile()
    }, [])

    return (
        <div className="p-6 max-w-3xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold">Risk Profile</h1>

            {loading ? (
                <div className="flex justify-center items-center h-40">
                    <Loader2 className="w-10 h-10 animate-spin text-gray-500" />
                </div>
            ) : (
                <Card>
                    <CardContent className="p-6 space-y-6">
                        <div>
                            <h2 className="text-lg font-semibold mb-2">Select Your Risk Level</h2>
                            <p className="text-sm text-gray-600 mb-4">Higher risk usually means higher potential returns but more volatility.</p>
                            <Slider min={0} max={100} value={[score]} onValueChange={(v) => setScore(v[0])} />
                            <p className="mt-2 text-center font-bold">{score}</p>
                        </div>

                        <div className="flex gap-4">
                            <Button onClick={() => saveProfile()} disabled={saving}>
                                {saving ? 'Saving...' : 'Save'}
                            </Button>
                            <Button variant="outline" onClick={resetScore}>
                                Reset
                            </Button>
                        </div>

                        {success && <p className="text-green-600 text-sm mt-2">{success}</p>}
                        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

                        {recommendations.length > 0 && (
                            <div className="mt-6">
                                <h3 className="text-md font-semibold mb-2">Recommended Stocks:</h3>
                                <ul className="list-disc list-inside text-sm text-gray-700">
                                    {recommendations.map((stock) => (
                                        <li key={stock}>{stock}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
