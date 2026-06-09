import { useState, useEffect } from 'react'
import { getTasks, createTask, updateTask, deleteTask } from '../api/tasks'
import './WeekPlanner.css'

// Вспомогательная функция для получения дат недели от понедельника
const getWeekDays = (): Date[] => {
  const today = new Date()
  const currentDay = today.getDay() // 0 - воскресенье, 1 - понедельник...
  const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay // сдвиг до понедельника
  const monday = new Date(today)
  monday.setDate(today.getDate() + mondayOffset)
  
  const week: Date[] = []
  for (let i = 0; i < 7; i++) {
    const day = new Date(monday)
    day.setDate(monday.getDate() + i)
    week.push(day)
  }
  return week
}

// Форматирование даты в YYYY-MM-DD
const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0]
}

// Названия дней недели
const dayNames = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС']

interface Task {
  id: string
  title: string
  isDone: boolean
  date: string
  order: number
}

const WeekPlanner = () => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [newTaskTitles, setNewTaskTitles] = useState<{ [key: string]: string }>({})
  
  const weekDays = getWeekDays()

  // Загружаем задачи для всех дней недели
  useEffect(() => {
    const fetchAllTasks = async () => {
      setLoading(true)
      const allTasks: Task[] = []
      for (const day of weekDays) {
        const dateStr = formatDate(day)
        const dayTasks = await getTasks(dateStr)
        allTasks.push(...dayTasks)
      }
      setTasks(allTasks)
      setLoading(false)
    }
    fetchAllTasks()
  }, [])

  // Получить задачи для конкретного дня
  const getTasksForDay = (date: Date): Task[] => {
    const dateStr = formatDate(date)
    return tasks.filter(task => task.date === dateStr).sort((a, b) => a.order - b.order)
  }

  // Создать новую задачу
  const handleCreateTask = async (date: Date) => {
    const dateStr = formatDate(date)
    const title = newTaskTitles[dateStr]?.trim()
    if (!title) return

    try {
      const maxOrder = Math.max(0, ...getTasksForDay(date).map(t => t.order))
      const newTask = await createTask({
        title,
        date: dateStr,
        type: 'once',
        order: maxOrder + 1
      })
      setTasks(prev => [...prev, newTask])
      setNewTaskTitles(prev => ({ ...prev, [dateStr]: '' }))
    } catch (error) {
      console.error('Ошибка создания задачи:', error)
    }
  }

  // Переключить статус задачи (выполнена/не выполнена)
  const handleToggleTask = async (task: Task) => {
    try {
      const updated = await updateTask(task.id, { isDone: !task.isDone })
      setTasks(prev => prev.map(t => t.id === task.id ? updated : t))
    } catch (error) {
      console.error('Ошибка обновления задачи:', error)
    }
  }

  // Удалить задачу
  const handleDeleteTask = async (id: string) => {
    try {
      await deleteTask(id)
      setTasks(prev => prev.filter(t => t.id !== id))
    } catch (error) {
      console.error('Ошибка удаления задачи:', error)
    }
  }

  if (loading) return <div className="loading">Загрузка...</div>

  return (
    <div className="week-planner">
      <h2>План на неделю</h2>
      <div className="week-grid">
        {weekDays.map((day, index) => {
          const dateStr = formatDate(day)
          const dayTasks = getTasksForDay(day)
          return (
            <div key={index} className="day-column">
              <div className="day-header">
                <strong>{dayNames[index]}</strong>
                <span className="date-small">{dateStr}</span>
              </div>
              <div className="tasks-list">
                {dayTasks.map(task => (
                  <div key={task.id} className="task-item">
                    <input
                      type="checkbox"
                      checked={task.isDone}
                      onChange={() => handleToggleTask(task)}
                    />
                    <span className={task.isDone ? 'completed' : ''}>{task.title}</span>
                    <button onClick={() => handleDeleteTask(task.id)} className="delete-btn">×</button>
                  </div>
                ))}
                <div className="add-task">
                  <input
                    type="text"
                    placeholder="+ Добавить задачу"
                    value={newTaskTitles[dateStr] || ''}
                    onChange={(e) => setNewTaskTitles(prev => ({ ...prev, [dateStr]: e.target.value }))}
                    onKeyPress={(e) => e.key === 'Enter' && handleCreateTask(day)}
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default WeekPlanner