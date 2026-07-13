import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import AssetDetailPage from './pages/AssetDetailPage'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="asset/:assetId" element={<AssetDetailPage />} />
      </Route>
    </Routes>
  )
}

export default App
