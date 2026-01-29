import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { DataContextProvider } from './data/DataContext'
import { AuthProvider } from './data/AuthContext'
import { BrowserRouter } from 'react-router-dom'
import React from 'react'

const container = document.getElementById('root');
if (container) {
    const root = createRoot(container);
    root.render(
        <BrowserRouter>
            <AuthProvider>
                <DataContextProvider>
                    <App />
                </DataContextProvider>
            </AuthProvider>
        </BrowserRouter>
    );
}
