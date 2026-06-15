import type { User } from "firebase/auth"
import { LogOut } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { GoogleLoginButton } from "@/features/login/components/GoogleLoginButton"

type LoginCardProps = {
  user: User | null
  isCheckingAuth: boolean
  isSigningIn: boolean
  error: string
  onGoogleLogin: () => void
  onLogout: () => void
}

export function LoginCard({
  user,
  isCheckingAuth,
  isSigningIn,
  error,
  onGoogleLogin,
  onLogout,
}: LoginCardProps) {
  if (isCheckingAuth) {
    return (
      <Card className="signin-card">
        <CardHeader className="signin-card-header">
          <CardTitle>Loading CafeBuddies...</CardTitle>
          <CardDescription>
            Checking whether you are already signed in.
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (user) {
    return (
      <Card className="signin-card">
        <CardHeader className="signin-card-header">
          <CardTitle>Welcome to CafeBuddies</CardTitle>
          <CardDescription>
            You are signed in as {user.email}. The Korea workspace is ready.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Button className="signin-submit">Enter Korea Workspace</Button>
        </CardContent>

        <CardFooter className="signin-footer">
          <Button variant="ghost" type="button" onClick={onLogout}>
            <LogOut className="size-4" />
            Sign out
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card className="signin-card">
      <CardHeader className="signin-card-header">
        <CardTitle id="signin-title">Welcome back</CardTitle>
        <CardDescription>
          Sign in with your invited Google account to keep planning your Korea
          cafe routes.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="signin-form">
          <GoogleLoginButton
            isSigningIn={isSigningIn}
            onClick={onGoogleLogin}
          />

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
  )
}