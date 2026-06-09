import { useState, useEffect } from 'react'
import { register, login, getMe } from './api/auth'
import WeekPlanner from './components/WeekPlanner'
import './App.css'

function App() {
  const [isLogin, setIsLogin] = useState(true)  // true = форма входа, false = регистрация
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'))
  const [user, setUser] = useState<any>(null)

  // При загрузке, если есть токен — получаем данные пользователя
  useEffect(() => {
    if (token) {
      getMe(token)
        .then(userData => {
          setUser(userData)
          setMessage(`Добро пожаловать, ${userData.name || userData.email}`)
          console.log('message state:', message) //проверка
        })
        .catch(() => {
          localStorage.removeItem('token')
          setToken(null)
        })
    }
  }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')

    try {
      if (isLogin) {
        const data = await login(email, password)
        localStorage.setItem('token', data.token)
        setToken(data.token)
        setUser(data.user)
        setMessage(`С возвращением, ${data.user.name || data.user.email}`)
      } else {
        const data = await register(email, password, name)
        setMessage(`Зарегистрирован: ${data.email}. Теперь войдите.`)
        setIsLogin(true)  // переключаем на форму логина
        setEmail('')
        setPassword('')
        setName('')
      }
    } catch (error: any) {
      setMessage(error.response?.data?.error || 'Ошибка')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
    setMessage('Вы вышли из системы')
  }

  if (user) {
    return (
      <div className="app-container">
        <div className="header">
          <h1>Планер</h1>
          <div className="user-info">
            <div className="user-details">
              {user.name && <span className="user-name">{user.name}</span>}
              <span className="user-email">{user.email}</span>
            </div>
            <button onClick={handleLogout} className="logout-btn">Выйти</button>
          </div>
        </div>
        <WeekPlanner />
      </div>
    )
  }

  return (
    <div className="auth-container">
      <h1>{isLogin ? 'Вход' : 'Регистрация'}</h1>
      <form className="auth-form" onSubmit={handleSubmit}>
        {!isLogin && (
          <input
            type="text"
            placeholder="Имя"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">{isLogin ? 'Войти' : 'Зарегистрироваться'}</button>
      </form>
      <button onClick={() => setIsLogin(!isLogin)} className="switch-btn">
        {isLogin ? 'Нет аккаунта? Зарегистрироваться' : 'Уже есть аккаунт? Войти'}
      </button>
      {message && <p className="message">{message}</p>}
    </div>
  )
}

export default App