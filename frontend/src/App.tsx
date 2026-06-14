import { useEffect, useState } from "react"
import type { User } from "firebase/auth"
import { onAuthStateChanged } from "firebase/auth"
import { Coffee, LogOut } from "lucide-react"

import "./App.css"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { auth } from "@/lib/firebase"
import { isAllowedEmail, loginWithGoogle, logout } from "@/features/auth/api"
import { createOrUpdateMemberFromGoogleUser } from "@/features/members/api"

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

      await createOrUpdateMemberFromGoogleUser({
        userId: signedInUser.uid,
        email: signedInUser.email ?? "",
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

  if (isCheckingAuth) {
    return (
      <main className="signin-page">
        <section className="signin-panel">
          <Card className="signin-card">
            <CardHeader className="signin-card-header">
              <CardTitle>Loading CafeBuddies...</CardTitle>
              <CardDescription>
                Checking whether you are already signed in.
              </CardDescription>
            </CardHeader>
          </Card>
        </section>
      </main>
    )
  }

  if (user) {
    return (
      <main className="signin-page">
        <section className="signin-panel">
          <div className="brand-mark" aria-hidden="true">
            <Coffee className="size-6" />
          </div>

          <Card className="signin-card">
            <CardHeader className="signin-card-header">
              <CardTitle>Welcome to CafeBuddies</CardTitle>
              <CardDescription>
                You are signed in as {user.email}. The Korea workspace is ready.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Button className="signin-submit">
                Enter Korea Workspace
              </Button>
            </CardContent>

            <CardFooter className="signin-footer">
              <Button variant="ghost" type="button" onClick={handleLogout}>
                <LogOut className="size-4" />
                Sign out
              </Button>
            </CardFooter>
          </Card>
        </section>
      </main>
    )
  }

  return (
    <main className="signin-page">
      <section className="signin-panel" aria-labelledby="signin-title">
        <div className="brand-mark" aria-hidden="true">
          <Coffee className="size-6" />
        </div>

        <Card className="signin-card">
          <CardHeader className="signin-card-header">
            <CardTitle id="signin-title">Welcome back</CardTitle>
            <CardDescription>
              Sign in with your invited Google account to keep planning your
              Korea cafe routes.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="signin-form">
              <Button
                type="button"
                size="lg"
                className="signin-submit"
                onClick={handleGoogleLogin}
                disabled={isSigningIn}
              >
                {isSigningIn ? "Signing in..." : "Continue with Google"}
              </Button>

              {error && (
                <p
                  role="alert"
                  style={{
                    marginTop: "0.75rem",
                    color: "#dc2626",
                    fontSize: "0.875rem",
                    textAlign: "center",
                  }}
                >
                  {error}
                </p>
              )}
            </div>
          </CardContent>

          <CardFooter className="signin-footer">
            <span>Private trip workspace</span>
            <span>Invited Google accounts only</span>
          </CardFooter>
        </Card>
      </section>
    </main>
  )
}

export default App