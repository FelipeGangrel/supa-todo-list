'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { PlusIcon } from '@radix-ui/react-icons'
import { User } from '@supabase/auth-helpers-nextjs'
import { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { Alert } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { supabaseClientSide as supabase } from '@/lib/supabase'

const formSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  content: z.string().min(1, { message: 'Content is required' }),
})

type CreateTodoFormValues = z.infer<typeof formSchema>

type CreateTodoProps = {
  onCreate: (values: CreateTodoFormValues) => void
}

const CreateTodo: React.FC<CreateTodoProps> = ({ onCreate }) => {
  const [open, setOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const form = useForm<CreateTodoFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      content: '',
    },
  })

  const onSubmit = useCallback(
    (values: CreateTodoFormValues) => {
      setOpen(false)
      form.reset()
      onCreate(values)
    },
    [form, onCreate]
  )

  const getUser = useCallback(async () => {
    const { data } = await supabase.auth.getUser()

    setUser(data.user)
    setLoading(false)
  }, [])

  useEffect(() => {
    getUser()
  }, [getUser])

  if (loading) {
    return <Spinner />
  }

  if (!user) {
    return (
      <Alert.Root variant="destructive">
        <Alert.Title>Not signed in</Alert.Title>
        <Alert.Description>
          You must be signed in to create a todo.
        </Alert.Description>
      </Alert.Root>
    )
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button variant="outline">
          <PlusIcon />
          <span>Create todo</span>
        </Button>
      </Dialog.Trigger>
      <Dialog.Overlay />
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>Create todo</Dialog.Title>
        </Dialog.Header>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Input placeholder="Content" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Dialog.Footer>
              <Button onClick={() => form.reset()} variant="secondary">
                Reset
              </Button>
              <Button type="submit">Submit</Button>
            </Dialog.Footer>
          </form>
        </Form>
      </Dialog.Content>
    </Dialog.Root>
  )
}

export { CreateTodo }
export type { CreateTodoFormValues, CreateTodoProps }
