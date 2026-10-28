import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [showForm, setShowForm] = useState(false)
  const [taskDescription, setTaskDescription] = useState('')
  const [taskName, setTaskName] = useState('')
  useEffect(() => {
    async function fetchTasks() {
      const response = await fetch('http://localhost:8080/tasks')
      const data = await response.json()
      setTasks(data)
    }

    fetchTasks()
  }, [])
  const [tasks, setTasks] = useState([])

  function deleteTask(indexToDelete) {
  setTasks(
    tasks.filter((task, index) => index !== indexToDelete)
  )
  }

  function toggleTask(indexToToggle) {
    setTasks(
      tasks.map((task, index) => {
        if (index === indexToToggle) {
          return { ...task, completed: !task.completed }
        }
        return task
      })
    )
  }

  const completedTasks = tasks.filter(task => task.completed).length

  const progress = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0


  async function createTask(event) {
    event.preventDefault()

    if (taskName.trim() === '') return

      const newTask = {
        title: taskName,
        description: taskDescription,
      }

    const response = await fetch('http://localhost:8080/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newTask),
    })

    if (response.ok) {
      const createdTask = await response.json()
      setTasks([...tasks, createdTask])
      setTaskName('')
      setTaskDescription('')
      setShowForm(false)
    } else {
      console.error('Erro ao criar a tarefa')
    }
  }

  async function deleteTask(indexToDelete) {
    const taskToDelete = tasks[indexToDelete]
    
    const response = await fetch(`http://localhost:8080/tasks/${taskToDelete.id}`, {
      method: 'DELETE',
    })

    if (response.ok) {
      setTasks(tasks.filter((task, index) => index !== indexToDelete))
    }
  }

  return (
    <div className="app">
      <header className="topbar">
        <h1>TaskFlow</h1>
      </header>

      <main className="main-content">
        <section className="tasks-header">
          <div>
            <h2>Minhas tarefas</h2>
            <p>
              {completedTasks} de {tasks.length} tarefas concluídas
            </p>
            {tasks.length > 0 && (
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}
          </div>

          <button
            className="add-button"
            onClick={() => setShowForm(!showForm)}
          >
            + Nova tarefa
          </button>
        </section>

        {showForm && (
          <form
            className="task-form"
            onSubmit={createTask}
          >
            <input
              type="text"
              placeholder="Digite o nome da tarefa..."
              value={taskName}
              onChange={(event) => setTaskName(event.target.value)}
            />

            <textarea
              placeholder="Descreva sua tarefa..."
              value={taskDescription}
              onChange={(event) => setTaskDescription(event.target.value)}
            />

            <button type="submit" className="add-button">
              Adicionar
            </button>
          </form>
        )}

     <section className="tasks-container">
        {tasks.length === 0 ? (
          <p className="empty-message">
            Você ainda não tem tarefas.
          </p>
        ) : (
          <ul>
            {tasks.map((task, index) => (
              <li key={index}>
          <div className="task-info">
              <h3>{task.title}</h3>
              <p>{task.description}</p>
            </div>

            <button
              className={`task-name ${task.completed ? 'completed' : ''}`}
              onClick={() => toggleTask(index)}
            >
              {task.completed ? 'Desmarcar' : 'Concluir'}
            </button>
                <button onClick={() => deleteTask(index)} className="delete-button">
                  Excluir
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
      </main>
    </div>
  )
}

export default App
