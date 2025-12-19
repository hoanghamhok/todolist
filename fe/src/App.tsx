import { useState,useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import type { Task } from './api/tasks.types'
import { createTask, fetchTasks } from './api/tasks.api'

function App() {
  const [count, setCount] = useState(0)
  const [tasks,setTasks] = useState<Task[]>([])
  const [loading,setLoading] = useState(true)
  const [error,setError] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  })
  //fetchTasks
  const loadTasks = async () =>{
    setLoading(true)
    try{
      const res = await fetchTasks()
      setTasks(res.data as Task[])
    }catch(error){
       console.error('Error loading Tasks:',error)
       setTasks([])
    }
  }
  useEffect(()=>{
    loadTasks()
  },[])
  //createButton
  const handleCreate = async (e:any) => {
    e.preventDefault();
    setError('');
  
    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }
  
    setLoading(true);
    try {
      await createTask(formData.title.trim(), formData.description?.trim() || '');
      await loadTasks(); // load() lại sau khi tạo xong
      setFormData({ title: '', description: '' }); // optional: clear form
    } catch (err) {
      console.error('Error creating task:', err);
      setError('Create task failed');
    } finally {
      setLoading(false);
    }
  };

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
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
