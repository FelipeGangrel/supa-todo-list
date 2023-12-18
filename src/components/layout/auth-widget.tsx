'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { supabaseClientSide as supabase } from '@/lib/supabase'

import { useAuth } from '../providers/auth-provider'
import { Button } from '../ui/button'
import { Dialog } from '../ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form'
import { Input } from '../ui/input'
import { Spinner } from '../ui/spinner'
import { useToast } from '../ui/use-toast'

const form = z.object({
  email: z.string().email({ message: 'Invalid email' }),
})

type FormValues = z.infer<typeof form>

const AuthWidget = () => {
  const [open, setOpen] = useState(false)
  const [sendingEmail, setSendingEmail] = useState(false)

  const { user, loading } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  const signInForm = useForm<FormValues>({
    resolver: zodResolver(form),
    defaultValues: {
      email: '',
    },
  })

  const handleSignIn = useCallback(
    async (values: FormValues) => {
      setSendingEmail(true)
      const { error } = await supabase.auth.signInWithOtp({
        email: values.email,
        options: {
          shouldCreateUser: true,
          emailRedirectTo: `${location.origin}/auth/callback`,
        },
      })
      setSendingEmail(false)
      if (!error) {
        toast({
          title: 'Email sent',
          description: 'Check your email for the sign-in link',
        })
        setOpen(false)
      }
    },
    [toast]
  )

  const handleSignOut = useCallback(async () => {
    await supabase.auth.signOut()
    router.refresh()
  }, [router])

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
        <Button variant="link" size="default">
          <span>Sign In</span>
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal />
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>Sign in</Dialog.Title>
          <Dialog.Description>
            Just enter your email and we{"'"}ll send you a sign-in link
          </Dialog.Description>
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
              <Button type="submit" disabled={sendingEmail}>
                {sendingEmail ? 'Sending...' : 'Send me a sign-in link'}
              </Button>
            </Dialog.Footer>
          </form>
        </Form>
      </Dialog.Content>
    </Dialog.Root>
  )
}

export { AuthWidget }
