'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import {
  createClientComponentClient,
  User,
} from '@supabase/auth-helpers-nextjs'
import { useCallback, useEffect, useState } from 'react'
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

import { Spinner } from './ui/spinner'

const form = z.object({
  email: z.string().email({ message: 'Invalid email' }),
})

type FormValues = z.infer<typeof form>

const AuthButton = () => {
  const [open, setOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const supabase = createClientComponentClient<Database>()

  const signInForm = useForm<FormValues>({
    resolver: zodResolver(form),
    defaultValues: {
      email: '',
    },
  })

  const handleSignIn = useCallback(
    async (values: FormValues) => {
      const { error } = await supabase.auth.signInWithOtp({
        email: values.email,
        options: {
          shouldCreateUser: true,
          emailRedirectTo: `${location.origin}/auth/callback`,
        },
      })
      if (!error) {
        setOpen(false)
      }
    },
    [supabase.auth]
  )

  const handleSignOut = useCallback(async () => {
    await supabase.auth.signOut()
    setUser(null)
  }, [supabase.auth])

  const getUser = useCallback(async () => {
    const { data } = await supabase.auth.getUser()

    setUser(data.user)
    setLoading(false)
  }, [supabase.auth])

  useEffect(() => {
    getUser()
  }, [getUser])

  if (loading) {
    return (
      <Button variant="outline" size="icon" disabled>
        <Spinner />
      </Button>
    )
  }

  if (user) {
    return (
      <div className="flex items-center gap-2">
        hello, <span>{user.email}</span>
        <Button
          variant="link"
          onClick={handleSignOut}
          className="text-destructive"
        >
          <span>Sign Out</span>
        </Button>
      </div>
    )
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button variant="link" size="default">
          <span>Sign In</span>
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal />
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>Sign in</Dialog.Title>
        </Dialog.Header>
        <Form {...signInForm}>
          <form
            onSubmit={signInForm.handleSubmit(handleSignIn)}
            className="space-y-8"
          >
            <FormField
              control={signInForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Dialog.Footer>
              <Button type="submit">Sign in</Button>
            </Dialog.Footer>
          </form>
        </Form>
      </Dialog.Content>
    </Dialog.Root>
  )
}

export { AuthButton }
