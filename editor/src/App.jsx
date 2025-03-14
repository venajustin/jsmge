import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [containers, setContainers] = useState([])

  useEffect(() => {
    fetch('/api/container')
    .then(response => response.text())
    .then(data => {
      setContainers(data)
    })
    .catch(error => console.error('Error fetching containers', error))

  }, [])

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
        <p>
          kunal was here
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <h2>Active Containers</h2>
      <div style={{ border: '5px solid black', maxWidth: '600px', padding: '10px' }} id="machine-list">
          <div dangerouslySetInnerHTML={{ __html: containers }} />
        </div>
    </>
  )
}

export default App
