'use client'

import { Pencil1Icon, TrashIcon } from '@radix-ui/react-icons'
import React, { useEffect } from 'react'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { supabase } from '@/lib/supabase'

type FetchedTodo = Awaited<ReturnType<typeof fetchTodos>>[number]

async function fetchTodos() {
  const { data: todos, error } = await supabase
    .from('todos')
    .select('id, title, content, created_at')

  if (error) {
    return Promise.reject(error)
  }

  return Promise.resolve(todos)
}

export default function Home() {
  const [todos, setTodos] = React.useState<FetchedTodo[]>([])

  const loadTodos = React.useCallback(async (): Promise<void> => {
    const todos = await fetchTodos()
    setTodos(todos)
  }, [])

  React.useEffect(() => {
    loadTodos()
  }, [loadTodos])

  return (
    <main className="flex min-h-screen flex-col items-center justify-between py-4">
      <h1>Home page</h1>
      <div className="container">
        {todos?.map((todo) => (
          <Card.Root key={todo.id} className="w-full">
            <Card.Header>
              <Card.Title>{todo.title}</Card.Title>
            </Card.Header>
            <Card.Content>
              <Card.Description>{todo.content}</Card.Description>
            </Card.Content>
            <Card.Footer className="gap-2">
              <Button variant="secondary" size="icon" className="ml-auto">
                <Pencil1Icon />
                <span className="sr-only">Edit</span>
              </Button>
              <Button variant="destructive" size="icon">
                <TrashIcon />
                <span className="sr-only">Delete</span>
              </Button>
            </Card.Footer>
          </Card.Root>
        ))}
      </div>
    </main>
  )
}
