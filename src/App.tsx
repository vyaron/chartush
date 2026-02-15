import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { RootLayout } from './layouts'
import { HomePage, AboutPage, EditorPage, GalleryPage } from './pages'

const router = createBrowserRouter([
    {
        path: '/',
        element: <RootLayout />,
        children: [
            {
                index: true,
                element: <HomePage />
            },
            {
                path: 'about',
                element: <AboutPage />
            },
            {
                path: 'editor',
                element: <EditorPage />
            },
            {
                path: 'editor/:id',
                element: <EditorPage />
            },
            {
                path: 'gallery',
                element: <GalleryPage />
            }
        ]
    }
])

export function App() {
    return <RouterProvider router={router} />
}
