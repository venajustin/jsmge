import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './pages/Home'
import Editor from './pages/Editor'
import UserGamesTest from './pages/UserGamesTest'
import Login from './pages/Login'
import Register from './pages/Register'
import { useParams } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
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
const EditorWrapper = () => {
  const { appId } = useParams();
  return <Editor appid={appId} />;
};

  return (
    <Router>
      {/* <nav>
        <Link to="/">Home</Link> | <Link to="/editor">Editor</Link>
      </nav> */}
      <Routes>
        <Route path="/" element={<Home />} />
        {/* This editor is currently done in a very unsecure way as in anybody can access anyone's editor currently */}
        <Route path="/editor/:appId/*" element={<ProtectedRoute><EditorWrapper /></ProtectedRoute>} />
        <Route path="/UserGamesTest" element={<ProtectedRoute><UserGamesTest/></ProtectedRoute>} />
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>} />
      </Routes>
    </Router>
  )
}

export default App

