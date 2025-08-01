import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'

interface UserData {
  name: string
  age: number
}

const STORAGE_KEY = 'last-sunday-user'

function App() {
  const [user, setUser] = useState<UserData | null>(null)
  const [name, setName] = useState('')
  const [age, setAge] = useState<number | ''>('')

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as UserData
        setUser(parsed)
      } catch {
        // ignore parse errors
      }
    }
  }, [])

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!name || age === '' || age < 0) return
    const data = { name, age: Number(age) }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    setUser(data)
  }

  function handleReset() {
    localStorage.removeItem(STORAGE_KEY)
    setUser(null)
    setName('')
    setAge('')
  }

  if (!user) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-4 text-center">
        <h1 className="text-2xl font-semibold">The Last Sunday</h1>
        <form onSubmit={handleSubmit} className="mx-auto space-y-2">
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded border px-3 py-2 text-black"
            required
          />
          <input
            type="number"
            placeholder="Your age"
            min="0"
            value={age}
            onChange={(e) => setAge(e.target.valueAsNumber)}
            className="rounded border px-3 py-2 text-black"
            required
          />
          <div className="text-center">
            <Button type="submit">Save</Button>
          </div>
        </form>
      </div>
    )
  }

  const lifeExpectancy = 80
  const totalSundays = lifeExpectancy * 52
  const sundaysPassed = Math.round(user.age * 52)
  const sundaysLeft = Math.max(0, totalSundays - sundaysPassed)

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 p-4 text-center">
      <h1 className="text-2xl font-semibold">
        Hello {user.name}, you have {sundaysLeft} Sundays left
      </h1>
      <div
        className="mx-auto grid gap-1"
        style={{ gridTemplateColumns: 'repeat(52, minmax(0, 1fr))', width: '100%', maxWidth: '520px' }}
      >
        {Array.from({ length: totalSundays }).map((_, i) => (
          <div
            key={i}
            className={`h-2 w-2 rounded-sm ${i < sundaysPassed ? 'bg-primary/30' : 'bg-primary'}`}
          />
        ))}
      </div>
      <Button onClick={handleReset}>Change info</Button>
    </div>
  )
}

export default App
