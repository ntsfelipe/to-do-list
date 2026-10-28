import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [showForm, setShowForm] = useState(false)
  const [taskDescription, setTaskDescription] = useState('')
  const [editingTaskId, setEditingTaskId] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const [editDescription, setEditDescription] = useState('')
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

  async function updateTask(taskId, newTitle, newDescription) {
    const response = await fetch(`http://localhost:8080/tasks/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title: newTitle, description: newDescription }),
    })
    
    if (response.ok) {
      const updatedTask = await response.json()
      setTasks(
        tasks.map((task) =>
          task.id === taskId ? updatedTask : task
        )
      )
      setEditingTaskId(null)
    }
  }

 async function toggleTask(taskId) {
    const task = tasks.find((task) => task.id === taskId)

    if (!task) return

    const response = await fetch(`http://localhost:8080/tasks/${taskId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ completed: !task.completed }),
    })
    
    if (response.ok) {
      const updatedTask = await response.json()
      setTasks(
        tasks.map((task, taskIndex) =>
          task.id === taskId ? updatedTask : task
        )
      )
    }
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

        {editingTaskId !== null && (
          <form
            className="task-form"
            onSubmit={(event) => {
              event.preventDefault()
              updateTask(editingTaskId, editTitle, editDescription)
            }}
          >
            <input
              type="text"
              placeholder="Digite o nome da tarefa..."
              value={editTitle}
              onChange={(event) => setEditTitle(event.target.value)}
            />

            <textarea
              placeholder="Descreva sua tarefa..."
              value={editDescription}
              onChange={(event) => setEditDescription(event.target.value)}
            />

            <button type="submit" className="edit-save-button">
                Atualizar
              </button>

              <button
                type="button"
                className="edit-cancel-button"
                onClick={() => setEditingTaskId(null)}
              >
                Cancelar
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
              className="edit-button"
              onClick={() => {
                setEditingTaskId(task.id)
                setEditTitle(task.title)
                setEditDescription(task.description || '')
              }}
            >
              Editar
            </button>
            <button
              className={`task-name ${task.completed ? 'completed' : ''}`}
              onClick={() => toggleTask(task.id)}
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
