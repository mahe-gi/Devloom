import { Link } from "react-router";
import { useState } from "react";
import { SigninInput } from "@mahe-npm/common";
import { useNavigate } from "react-router";
import axios from "axios";
import { Button } from "../components/ui/Button";
import { FormField } from "../components/ui/FormField";
import { Input } from "../components/ui/Input";
import { Bounce, toast, ToastContainer } from "react-toastify";
import { ArrowRight } from "lucide-react";

function Signin() {
  const [signinInputData, setsigninInputData] = useState<SigninInput>({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handlePostRequest() {
    if (!signinInputData.username || !signinInputData.password) {
      toast.error("Please fill in both email and password", {
        position: "bottom-right",
        theme: "colored",
      });
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/signin`,
        signinInputData
      );

      if (response.status === 200 && response.data?.token) {
        const token = response.data.token;
        localStorage.setItem("token", "Bearer " + token);

        toast.success("Welcome back!", {
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
      const errorMessage = error?.response?.data?.error || error?.response?.data?.message || "Invalid credentials";
      toast.error(errorMessage, {
        position: "bottom-right",
        autoClose: 4000,
        theme: "colored",
        transition: Bounce,
      });
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen bg-background text-foreground">
      {/* Left side: Product message */}
      <div className="hidden lg:flex flex-col justify-center px-16 xl:px-24 bg-surface border-r border-border relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="relative z-10 max-w-lg">
          <Link to="/" className="inline-flex items-center gap-2 mb-12">
            <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xl leading-none">1</span>
            </div>
            <span className="text-xl font-bold tracking-tight">101dev</span>
          </Link>
          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-6">
            Welcome back to the community
          </h1>
          <p className="text-lg text-muted mb-8 font-serif leading-relaxed">
            Continue where you left off. Read the latest technical stories, share your knowledge, and connect with developers worldwide.
          </p>
          <div className="flex gap-4 items-center">
            <div className="flex -space-x-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className={`w-10 h-10 rounded-full border-2 border-surface bg-surface-subtle flex items-center justify-center text-xs font-medium text-muted z-${40-i*10}`}>
                  U{i}
                </div>
              ))}
            </div>
            <p className="text-sm text-muted font-medium">Join 10k+ developers</p>
          </div>
        </div>
      </div>

      {/* Right side: Focused form */}
      <div className="flex flex-col justify-center px-6 py-12 lg:px-24 xl:px-32 relative">
        <div className="absolute top-8 left-8 lg:hidden">
          <Link to="/" className="text-xl font-bold tracking-tight">101dev</Link>
        </div>
        
        <div className="w-full max-w-md mx-auto space-y-8">
          <div className="space-y-3 text-center lg:text-left">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Sign In
            </h2>
            <p className="text-muted text-base">
              Enter your email and password to access your account.
            </p>
          </div>

          <div className="space-y-6">
            <Button variant="outline" className="w-full h-11 text-base relative" type="button">
              Continue with Google
            </Button>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted font-medium">
                  Or continue with email
                </span>
              </div>
            </div>

            <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); handlePostRequest(); }}>
              <FormField label="Email Address" htmlFor="email">
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={signinInputData.username}
                  onChange={(e) => {
                    setsigninInputData({
                      ...signinInputData,
                      username: e.target.value,
                    });
                  }}
                />
              </FormField>

              <FormField label="Password" htmlFor="password">
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={signinInputData.password}
                  onChange={(e) => {
                    setsigninInputData({
                      ...signinInputData,
                      password: e.target.value,
                    });
                  }}
                />
              </FormField>

              <div className="pt-2">
                <Button
                  loading={loading}
                  onClick={handlePostRequest}
                  className="w-full h-11 text-base group"
                  type="submit"
                >
                  Sign In
                  {!loading && <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />}
                </Button>
              </div>
            </form>
            
            <p className="text-sm text-muted text-center font-medium pt-4">
              Don't have an account?{" "}
              <Link to="/signup" className="text-foreground hover:text-primary transition-colors underline underline-offset-4 decoration-border hover:decoration-primary">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}

export default Signin;
