import { Link } from "react-router";
import { authClient } from "../lib/auth";
import { ToastContainer } from "react-toastify";
import { Button } from "../components/ui/Button";

function Signup() {
  async function handleGoogleLogin() {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: `${window.location.origin}/blogs`
    });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative text-foreground p-4 sm:p-8 font-sans">
      <div className="w-full max-w-[440px] bg-surface border border-border shadow-sm rounded-3xl p-8 sm:p-10">
        <div className="flex justify-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <span className="text-2xl font-extrabold tracking-tighter text-foreground">
              Devloom
            </span>
          </Link>
        </div>
        
        <div className="space-y-2 mb-8 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight">
            Create an Account
          </h2>
          <p className="text-foreground/60 text-sm font-medium">
            Join Devloom to share your knowledge.
          </p>
        </div>

        <div className="space-y-6">
          <Button 
            onClick={handleGoogleLogin}
            variant="outline" 
            className="w-full h-12 flex items-center justify-center gap-3 font-semibold rounded-xl hover:bg-muted/50 transition-colors" 
            type="button">
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
            Sign up with Google
          </Button>

          <p className="text-sm text-foreground/60 text-center font-medium pt-4">
            Already have an account?{" "}
            <Link to="/signin" className="text-primary hover:text-primary/80 font-bold transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded-sm">
              Sign in
            </Link>
          </p>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Signup;
