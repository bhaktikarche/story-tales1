import { Route, Routes } from 'react-router-dom'
import './App.css'
import CreatePost from './components/CreatePost'
import PostDashboard from './components/PostDashboard'

function App() {

  return (
    <>
       <Routes>
      <Route path="/" element={<PostDashboard/>} />
      <Route path="/create-trip" element={<CreatePost />} />
    </Routes>
    </>
  )
}

export default App
