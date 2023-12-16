'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

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
import { Database } from '@/types/supabase'

const formSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  content: z.string().min(1, { message: 'Content is required' }),
})

type UpdateTodoFormValues = z.infer<typeof formSchema>

type Todo = Database['public']['Tables']['todos']['Row']

type UpdateTodoProps = {
  todo: Todo
  onUpdate: (id: Todo['id'], values: UpdateTodoFormValues) => void
  onClose: () => void
}

const UpdateTodo: React.FC<UpdateTodoProps> = ({ onUpdate, todo, onClose }) => {
  const form = useForm<UpdateTodoFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: todo.title ?? '',
      content: todo.content ?? '',
    },
  })

  const onSubmit = useCallback(
    (values: UpdateTodoFormValues) => {
      if (values.content !== todo.content || values.title !== todo.title) {
        onUpdate(todo.id, values)
      }
    },
    [onUpdate, todo]
  )

  return (
    <Dialog.Root open={true} onOpenChange={() => onClose()}>
      <Dialog.Overlay />
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>Update todo</Dialog.Title>
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

export { UpdateTodo }
export type { UpdateTodoFormValues, UpdateTodoProps }
