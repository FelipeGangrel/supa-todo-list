'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { User } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
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

const form = z.object({
  email: z.string().email({ message: 'Invalid email' }),
})

type FormValues = z.infer<typeof form>

const AuthButton = () => {
  const [open, setOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [emailSent, setEmailSent] = useState(false)

  const router = useRouter()

  const signInForm = useForm<FormValues>({
    resolver: zodResolver(form),
    defaultValues: {
      email: '',
    },
  })

  const handleSignIn = useCallback(async (values: FormValues) => {
    const { error } = await supabase.auth.signInWithOtp({
      email: values.email,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    })
    if (!error) {
      setEmailSent(true)
    }
  }, [])

  const handleSignOut = useCallback(async () => {
    await supabase.auth.signOut()
    router.refresh()
  }, [router])

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

  if (user) {
    return (
      <div className="flex items-center gap-2 text-sm">
        <span>Hello, {user.email}</span>
        <Button variant="link" onClick={handleSignOut}>
          <span>Sign Out</span>
        </Button>
      </div>
    )
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button
          variant="link"
          size="default"
          onClick={() => setEmailSent(false)}
        >
          <span>Sign In</span>
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal />
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>Sign in</Dialog.Title>
        </Dialog.Header>
        {emailSent ? (
          <Alert.Root>
            <Alert.Title>Check your email</Alert.Title>
            <Alert.Description>
              We sent a magic link to your email address.
            </Alert.Description>
          </Alert.Root>
        ) : (
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
        )}
      </Dialog.Content>
    </Dialog.Root>
  )
}

export { AuthButton }
