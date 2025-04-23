import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './pages/Home'
import Editor from './pages/Editor'

function App() {
  const [count, setCount] = useState(0)
  const [containers, setContainers] = useState([])

  // useEffect(() => {
  //   fetch('/api/container')
  //   .then(response => response.text())
  //   .then(data => {
  //     setContainers(data)
  //   })
  //   .catch(error => console.error('Error fetching containers', error))

  // }, [])

  return (
    <Router>
      {/* <nav>
        <Link to="/">Home</Link> | <Link to="/editor">Editor</Link>
      </nav> */}
      <Routes>
        <Route path="/engine/" element={<Home />} />
        <Route path="/engine/editor" element={<Editor />} />
      </Routes>
    </Router>
  )
}

export default App
