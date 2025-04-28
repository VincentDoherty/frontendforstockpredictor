import { Button } from '@/components/ui/button'

export default function LandingPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-4 py-10 space-y-10 text-center">
            <div className="space-y-4">
                <h1 className="text-4xl font-bold">Stock Portfolio Manager</h1>
                <p className="text-gray-600 max-w-xl mx-auto">
                    Manage virtual stock portfolios, track growth, set investment goals, and receive basic stock predictions. This application is developed as part of a final year university project and is not intended as financial advice.
                </p>
                <div className="flex gap-4 justify-center mt-6">
                    <Button onClick={() => window.location.href = '/login'}>Login</Button>
                    <Button variant="outline" onClick={() => window.location.href = '/register'}>Register</Button>
                </div>
            </div>

            <div className="mt-16 space-y-8 max-w-3xl">
                <h2 className="text-2xl font-semibold">How It Works</h2>
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="border rounded-lg p-4">
                        <h3 className="font-bold text-lg mb-2">Create Portfolios</h3>
                        <p className="text-gray-600 text-sm">Easily create and manage multiple stock portfolios based on your preferences.</p>
                    </div>
                    <div className="border rounded-lg p-4">
                        <h3 className="font-bold text-lg mb-2">Track & Predict</h3>
                        <p className="text-gray-600 text-sm">Visualize historical data and get simple future price predictions using machine learning.</p>
                    </div>
                    <div className="border rounded-lg p-4">
                        <h3 className="font-bold text-lg mb-2">Set Goals</h3>
                        <p className="text-gray-600 text-sm">Plan your investment goals and monitor your journey towards achieving them.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
