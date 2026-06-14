import { Coffee, LockKeyhole, Mail } from "lucide-react"

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
import { Input } from "@/components/ui/input"

function App() {
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
              Sign in to keep planning your Korea cafe routes.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form className="signin-form">
              <div className="field-group">
                <label htmlFor="email">Email</label>
                <div className="input-shell">
                  <Mail className="size-4" aria-hidden="true" />
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div className="field-group">
                <div className="label-row">
                  <label htmlFor="password">Password</label>
                  <a href="/forgot-password">Forgot?</a>
                </div>
                <div className="input-shell">
                  <LockKeyhole className="size-4" aria-hidden="true" />
                  <Input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="Enter your password"
                  />
                </div>
              </div>

              <Button type="submit" size="lg" className="signin-submit">
                Sign in
              </Button>
            </form>
          </CardContent>

          <CardFooter className="signin-footer">
            <span>New here?</span>
            <a href="/signup">Create an account</a>
          </CardFooter>
        </Card>
      </section>
    </main>
  )
}

export default App
