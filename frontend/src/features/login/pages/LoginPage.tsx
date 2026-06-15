import type { User } from "firebase/auth"
import { Coffee } from "lucide-react"

import loginIllustration from "@/assets/login-illustration.png"
import { LoginCard } from "@/features/login/components/LoginCard"

type LoginPageProps = {
  user: User | null
  isCheckingAuth: boolean
  isSigningIn: boolean
  error: string
  onGoogleLogin: () => void
  onLogout: () => void
}

export function LoginPage({
  user,
  isCheckingAuth,
  isSigningIn,
  error,
  onGoogleLogin,
  onLogout,
}: LoginPageProps) {
  return (
    <main className="signin-page">
      <section className="signin-layout">
        <section className="signin-panel" aria-labelledby="signin-title">
          {!isCheckingAuth && (
            <div className="brand-mark" aria-hidden="true">
              <Coffee className="size-6" />
            </div>
          )}

          <LoginCard
            user={user}
            isCheckingAuth={isCheckingAuth}
            isSigningIn={isSigningIn}
            error={error}
            onGoogleLogin={onGoogleLogin}
            onLogout={onLogout}
          />
        </section>

        <section className="signin-image-panel" aria-hidden="true">
          <img
            src={loginIllustration}
            alt=""
            className="signin-illustration"
          />
        </section>
      </section>
    </main>
  )
}