import { createContext, useContext, useState, useEffect } from 'react'

interface AuthContextType {
    isAuthenticated: boolean
    login: () => void
    logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    useEffect(() => {
        fetch('/api/check-session')
            .then((res) => res.json())
            .then((data) => {
                if (data.authenticated) setIsAuthenticated(true)
                else setIsAuthenticated(false)
            })
            .catch(() => setIsAuthenticated(false))
    }, [])

    const login = () => setIsAuthenticated(true)
    const logout = () => setIsAuthenticated(false)

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) throw new Error('useAuth must be used inside AuthProvider')
    return context
}
