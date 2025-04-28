import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export default function Logout() {
    const navigate = useNavigate()

    useEffect(() => {
        const logout = async () => {
            try {
                const res = await fetch('/api/logout', {
                    method: 'POST',
                    credentials: 'include',
                })

                if (res.ok) {
                    toast.success('Logged out successfully')
                    setTimeout(() => navigate('/login'), 100) // Delay to let toast render
                } else {
                    toast.error('Logout failed. Please try again.')
                }
            } catch (e) {
                console.error('Failed to logout', e)
                toast.error('Logout failed. Please try again.')
            }
        }

        logout()
    }, [navigate])

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <Loader2 className="w-10 h-10 animate-spin text-gray-500" />
            <p className="mt-4 text-gray-600">Logging out...</p>
        </div>
    )
}
