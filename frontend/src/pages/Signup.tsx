import { Link, useNavigate } from "react-router";
import { useState } from "react";
import { SignupInput } from "@mahe-npm/common";
import axios from "axios";
import { Bounce, toast, ToastContainer } from "react-toastify";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { Mail, Lock, User, ArrowRight, Eye, EyeOff } from "lucide-react";

function Signup() {
  const [postSignupData, setPostSignupData] = useState<SignupInput>({
    username: "",
    password: "",
    name: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  async function handlePostSignup(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!postSignupData.username || !postSignupData.password || !postSignupData.name) {
      toast.error("Please fill in all fields", {
        position: "bottom-right",
        theme: "colored",
      });
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/signup`,
        postSignupData
      );

      const token = response.data?.token;

      if (token) {
        localStorage.setItem("token", "Bearer " + token);
        toast.success("Account created successfully!", {
          position: "bottom-right",
          autoClose: 2000,
          theme: "colored",
          transition: Bounce,
        });

        setTimeout(() => {
          navigate("/blogs");
        }, 500);
      }
    } catch (error: any) {
      setLoading(false);
      const errorMessage = error?.response?.data?.error || error?.response?.data?.message || "Registration failed. Try again.";
      toast.error(errorMessage, {
        position: "bottom-right",
        autoClose: 4000,
        theme: "colored",
        transition: Bounce,
      });
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-4 sm:p-8">
      <div className="w-full max-w-[440px] bg-surface border border-border rounded-2xl p-6 sm:p-8">
        <div className="flex justify-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 rounded-md focus-visible:ring-2 focus-visible:outline-none">
            <div className="w-8 h-8 bg-foreground rounded flex items-center justify-center">
              <span className="text-background font-bold text-xl leading-none">D</span>
            </div>
            <span className="text-xl font-bold tracking-tight">Devloom</span>
          </Link>
        </div>
        
        <div className="space-y-2 mb-8 text-center">
          <h2 className="text-2xl font-extrabold tracking-tight">
            Create an Account
          </h2>
          <p className="text-foreground-muted text-sm">
            Enter your details to get started with Devloom.
          </p>
        </div>

        <div className="space-y-6">
          <Button variant="outline" className="w-full h-11 flex items-center justify-center gap-2 font-medium focus-visible:ring-2 focus-visible:ring-foreground focus-visible:outline-none" type="button">
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
            Sign up with GitHub
          </Button>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-3 text-foreground-muted font-semibold tracking-wider">
                Or sign up with email
              </span>
            </div>
          </div>

          <form className="space-y-5" onSubmit={handlePostSignup}>
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-semibold text-foreground block">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-foreground-muted" />
                </div>
                <Input
                  id="name"
                  type="text"
                  placeholder="Alex Johnson"
                  value={postSignupData.name}
                  onChange={(e) => {
                    setPostSignupData({
                      ...postSignupData,
                      name: e.target.value,
                    });
                  }}
                  className="pl-10 h-11 bg-surface border-border focus:bg-transparent focus-visible:ring-2 focus-visible:ring-foreground focus-visible:outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-semibold text-foreground block">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-foreground-muted" />
                </div>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={postSignupData.username}
                  onChange={(e) => {
                    setPostSignupData({
                      ...postSignupData,
                      username: e.target.value,
                    });
                  }}
                  className="pl-10 h-11 bg-surface border-border focus:bg-transparent focus-visible:ring-2 focus-visible:ring-foreground focus-visible:outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-semibold text-foreground block">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-foreground-muted" />
                </div>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={postSignupData.password}
                  onChange={(e) => {
                    setPostSignupData({
                      ...postSignupData,
                      password: e.target.value,
                    });
                  }}
                  className="pl-10 pr-10 h-11 bg-surface border-border focus:bg-transparent focus-visible:ring-2 focus-visible:ring-foreground focus-visible:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-foreground-muted hover:text-foreground focus:outline-none"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <Button
              disabled={loading}
              className="w-full h-11 group mt-2 focus-visible:ring-2 focus-visible:ring-foreground focus-visible:outline-none"
              type="submit"
              size="lg"
            >
              {loading ? "Creating Account..." : (
                <>
                  Create Account
                  <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </Button>
          </form>
          
          <p className="text-sm text-foreground-muted text-center font-medium pt-2">
            Already have an account?{" "}
            <Link to="/signin" className="text-foreground hover:underline hover:underline-offset-4 font-semibold transition-all rounded-sm focus-visible:ring-2 focus-visible:ring-foreground focus-visible:outline-none">
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
