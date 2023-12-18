'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { PlusIcon } from '@radix-ui/react-icons'
import { useCallback, useState } from 'react'
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
