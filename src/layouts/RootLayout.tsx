import { NavLink, Outlet } from 'react-router-dom'

export function RootLayout() {
    return (
        <>
            <header className="main-layout">
                <nav className="flex-between">
                    <h2>My App</h2>
                    <ul className="flex">
                        <li><NavLink to="/">Home</NavLink></li>
                        <li><NavLink to="/about">About</NavLink></li>
                    </ul>
                </nav>
            </header>
            <main>
                <Outlet />
            </main>
        </>
    )
}
