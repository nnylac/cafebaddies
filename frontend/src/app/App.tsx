import { useEffect, useState } from "react"
import type { User } from "firebase/auth"
import { onAuthStateChanged } from "firebase/auth"

import { auth } from "@/lib/firebase"
import { isAllowedEmail, loginWithGoogle, logout } from "@/features/auth/api"
import { createOrUpdateMemberFromGoogleUser } from "@/features/members/api"
import { LoginPage } from "@/features/login/pages/LoginPage"

function App() {
  const [user, setUser] = useState<User | null>(null)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const [isSigningIn, setIsSigningIn] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setError("")

      if (!currentUser?.email) {
        setUser(null)
        setIsCheckingAuth(false)
        return
      }

      try {
        const allowed = await isAllowedEmail(currentUser.email)

        if (!allowed) {
          await logout()
          setUser(null)
          setError("This Google account is not invited to this trip.")
          return
        }

        await createOrUpdateMemberFromGoogleUser({
          userId: currentUser.uid,
          email: currentUser.email,
          displayName: currentUser.displayName ?? "Friend",
          photoURL: currentUser.photoURL ?? "",
        })

        setUser(currentUser)
      } catch (err) {
        console.error(err)
        setUser(null)
        setError("Something went wrong while checking your access.")
      } finally {
        setIsCheckingAuth(false)
      }
    })

    return () => unsubscribe()
  }, [])

  async function handleGoogleLogin() {
    setIsSigningIn(true)
    setError("")

    try {
      const signedInUser = await loginWithGoogle()

      if (!signedInUser.email) {
        throw new Error("Unable to sign in because this Google account has no email.")
      }

      const allowed = await isAllowedEmail(signedInUser.email)

      if (!allowed) {
        await logout()
        setUser(null)
        throw new Error("This Google account is not invited to this trip.")
      }

      await createOrUpdateMemberFromGoogleUser({
        userId: signedInUser.uid,
        email: signedInUser.email,
        displayName: signedInUser.displayName ?? "Friend",
        photoURL: signedInUser.photoURL ?? "",
      })

      setUser(signedInUser)
    } catch (err) {
      console.error(err)

      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("Unable to sign in. Please try again.")
      }
    } finally {
      setIsSigningIn(false)
    }
  }

  async function handleLogout() {
    await logout()
    setUser(null)
  }

  return (
    <LoginPage
      user={user}
      isCheckingAuth={isCheckingAuth}
      isSigningIn={isSigningIn}
      error={error}
      onGoogleLogin={handleGoogleLogin}
      onLogout={handleLogout}
    />
  )
}

export default App