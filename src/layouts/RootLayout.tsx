import { NavLink, Outlet } from 'react-router-dom'
import { useAppStore } from '../store'

export function RootLayout() {
    const { theme, toggleTheme } = useAppStore()

    return (
        <>
            <header className="main-layout">
                <nav className="flex-between">
                    <h2>My App</h2>
                    <ul className="flex">
                        <li><NavLink to="/">Home</NavLink></li>
                        <li><NavLink to="/editor">Editor</NavLink></li>
                        <li><NavLink to="/gallery">Gallery</NavLink></li>
                        <li><NavLink to="/about">About</NavLink></li>
                    </ul>
                    <button onClick={toggleTheme} aria-label="Toggle theme">
                        {theme === 'dark' ? '☀️' : '🌙'}
                    </button>
                </nav>
            </header>
            <main>
                <Outlet />
            </main>
        </>
    )
}
