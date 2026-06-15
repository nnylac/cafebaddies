import { Button } from "@/components/ui/button"

type GoogleLoginButtonProps = {
  isSigningIn: boolean
  onClick: () => void
}

export function GoogleLoginButton({
  isSigningIn,
  onClick,
}: GoogleLoginButtonProps) {
  return (
    <Button
      type="button"
      size="lg"
      className="signin-submit"
      onClick={onClick}
      disabled={isSigningIn}
    >
      {isSigningIn ? "Signing in..." : "Continue with Google"}
    </Button>
  )
}