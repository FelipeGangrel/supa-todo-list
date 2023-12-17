'use client'

import { useCallback, useEffect, useState } from 'react'

import {
  CreateTodo,
  type CreateTodoFormValues,
} from '@/components/todos/create-todo'
import { TodosList } from '@/components/todos/todos-list'
import {
  UpdateTodo,
  type UpdateTodoFormValues,
} from '@/components/todos/update-todo'
import { supabaseClientSide } from '@/lib/supabase'
import { Database } from '@/types/supabase'

type Todo = Database['public']['Tables']['todos']['Row']

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null)

  const handleCreateTodo = useCallback(async (values: CreateTodoFormValues) => {
    const {
      data: { user },
    } = await supabaseClientSide.auth.getUser()

    if (!user?.id) {
      return Promise.reject(new Error('User not found'))
    }

    const { data: todos, error } = await supabaseClientSide
      .from('todos')
      .insert([
        {
          title: values.title ?? null,
          content: values.content ?? null,
        },
      ])
      .select()

    if (error) {
      return Promise.reject(error)
    }
    setTodos((prevTodos) => [...prevTodos, todos[0]])
  }, [])

  const handleReadTodos = useCallback(async () => {
    const { data: todos, error } = await supabaseClientSide
      .from('todos')
      .select()

    if (error) {
      return Promise.reject(error)
    }

    setTodos(todos)
  }, [])

  const handleUpdateTodo = useCallback(
    async (id: Todo['id'], values: UpdateTodoFormValues): Promise<void> => {
      const { data: todos, error } = await supabaseClientSide
        .from('todos')
        .update({
          title: values.title ?? null,
          content: values.content ?? null,
        })
        .eq('id', id)
        .select()

      if (error) {
        return Promise.reject(error)
      }

      setTodos((prevTodos) => {
        const prevCopy = [...prevTodos]

        const index = prevCopy.findIndex((todo) => todo.id === id)
        prevCopy[index] = todos[0]

        return prevCopy
      })

      setSelectedTodo(null)
    },
    []
  )

  const handleDeleteTodo = useCallback(
    async (id: Todo['id']): Promise<void> => {
      const { error } = await supabaseClientSide
        .from('todos')
        .delete()
        .eq('id', id)

      if (error) {
        return Promise.reject(error)
      }

      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id))
    },
    []
  )

  useEffect(() => {
    handleReadTodos()
  }, [handleReadTodos])

  return (
    <main className="flex min-h-screen flex-col justify-between py-4">
      <div className="container space-y-8">
        <CreateTodo onCreate={handleCreateTodo} />
        <TodosList
          todos={todos}
          onDelete={handleDeleteTodo}
          onSelectTodo={setSelectedTodo}
        />
      </div>
      {selectedTodo && (
        <UpdateTodo
          todo={selectedTodo}
          onUpdate={handleUpdateTodo}
          onClose={() => setSelectedTodo(null)}
        />
      )}
    </main>
  )
}
