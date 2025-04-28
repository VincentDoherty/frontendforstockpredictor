import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Trash2, Pencil } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog'

interface Goal {
    id: number;
    name: string;
    target_amount: number;
    target_date: string;
}

export default function Goals() {
    const [goals, setGoals] = useState<Goal[]>([])
    const [name, setName] = useState('')
    const [amount, setAmount] = useState('')
    const [date, setDate] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [editingGoal, setEditingGoal] = useState<Goal | null>(null)
    const [deletingGoalId, setDeletingGoalId] = useState<number | null>(null)

    const loadGoals = async () => {
        try {
            const res = await fetch('/api/goals')
            if (res.ok) {
                const data = await res.json()
                setGoals(data)
            }
        } catch (e) {
            console.error('Failed to load goals', e)
        }
    }

    useEffect(() => {
        loadGoals()
    }, [])

    const submitGoal = async () => {
        setError('')
        setSuccess('')
        const payload = { name, target_amount: parseFloat(amount), target_date: date }

        const res = await fetch('/api/goals', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })

        if (res.ok) {
            setName('')
            setAmount('')
            setDate('')
            setSuccess('Goal added')
            loadGoals()
        } else {
            setError('Failed to create goal')
        }
    }

    const deleteGoal = async (id: number) => {
        const res = await fetch(`/api/goals/${id}`, { method: 'DELETE' })
        if (res.ok) loadGoals()
    }

    const updateGoal = async () => {
        if (!editingGoal) return

        const res = await fetch(`/api/goals/${editingGoal.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: editingGoal.name,
                target_amount: editingGoal.target_amount,
                target_date: editingGoal.target_date
            })
        })

        if (res.ok) {
            setEditingGoal(null)
            loadGoals()
        }
    }

    return (
        <div className="p-6 max-w-3xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold">Your Goals</h1>

            {error && <div className="text-red-500">{error}</div>}
            {success && <div className="text-green-600">{success}</div>}

            <Card>
                <CardContent className="p-4 space-y-3">
                    <h2 className="font-semibold">Create New Goal</h2>
                    <Input placeholder="Goal Name" value={name} onChange={(e) => setName(e.target.value)} />
                    <Input placeholder="Target Amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
                    <Input placeholder="Target Date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                    <Button onClick={submitGoal}>Submit</Button>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-4 space-y-4">
                    <h2 className="font-semibold">Your Saved Goals</h2>
                    {goals.length === 0 ? (
                        <p className="text-sm text-gray-500">No goals yet. Add one!</p>
                    ) : (
                        <div className="space-y-3">
                            {goals.map(goal => (
                                <div key={goal.id} className="border p-3 rounded shadow-sm bg-white flex justify-between items-center">
                                    <div>
                                        <p className="font-semibold">{goal.name}</p>
                                        <p className="text-sm">Target: ${goal.target_amount.toFixed(2)} by {goal.target_date}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button size="icon" variant="ghost" onClick={() => setEditingGoal(goal)}>
                                            <Pencil className="w-4 h-4" />
                                        </Button>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button size="icon" variant="ghost" onClick={() => setDeletingGoalId(goal.id)}>
                                                    <Trash2 className="w-4 h-4 text-red-500" />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => { if (deletingGoalId !== null) { deleteGoal(deletingGoalId); setDeletingGoalId(null); } }}>Delete</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {editingGoal && (
                <Dialog open={true} onOpenChange={() => setEditingGoal(null)}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit Goal</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-3">
                            <Input
                                value={editingGoal.name}
                                onChange={(e) => setEditingGoal({ ...editingGoal, name: e.target.value })}
                            />
                            <Input
                                type="number"
                                value={editingGoal.target_amount}
                                onChange={(e) => setEditingGoal({ ...editingGoal, target_amount: parseFloat(e.target.value) })}
                            />
                            <Input
                                type="date"
                                value={editingGoal.target_date}
                                onChange={(e) => setEditingGoal({ ...editingGoal, target_date: e.target.value })}
                            />
                        </div>
                        <DialogFooter>
                            <Button onClick={updateGoal}>Save Changes</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    )
}
