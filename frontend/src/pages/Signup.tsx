import { Link } from "react-router";
import { useState } from "react";
import { SignupInput } from "@mahe-npm/common";
import { useNavigate } from "react-router";
import axios from "axios";
import { Button } from "../components/ui/Button";
import { FormField } from "../components/ui/FormField";
import { Input } from "../components/ui/Input";
import { Bounce, toast, ToastContainer } from "react-toastify";
import { ArrowRight } from "lucide-react";

function Signup() {
  const [postSignupData, setPostSignupData] = useState<SignupInput>({
    username: "",
    password: "",
    name: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handlePostSignup() {
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
            Join the developer network
          </h1>
          <p className="text-lg text-muted mb-8 font-serif leading-relaxed">
            Create an account to start publishing your technical stories. Connect with other developers, share your knowledge, and grow your audience.
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
              Create an Account
            </h2>
            <p className="text-muted text-base">
              Enter your details to get started with 101dev.
            </p>
          </div>

          <div className="space-y-6">
            <Button variant="outline" className="w-full h-11 text-base relative" type="button">
              Sign up with Google
            </Button>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted font-medium">
                  Or sign up with email
                </span>
              </div>
            </div>

            <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); handlePostSignup(); }}>
              <FormField label="Full Name" htmlFor="name">
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
                />
              </FormField>

              <FormField label="Email Address" htmlFor="email">
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
                />
              </FormField>

              <FormField label="Password" htmlFor="password">
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={postSignupData.password}
                  onChange={(e) => {
                    setPostSignupData({
                      ...postSignupData,
                      password: e.target.value,
                    });
                  }}
                />
              </FormField>

              <div className="pt-2">
                <Button
                  loading={loading}
                  onClick={handlePostSignup}
                  className="w-full h-11 text-base group"
                  type="submit"
                >
                  Create Account
                  {!loading && <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />}
                </Button>
              </div>
            </form>
            
            <p className="text-sm text-muted text-center font-medium pt-4">
              Already have an account?{" "}
              <Link to="/signin" className="text-foreground hover:text-primary transition-colors underline underline-offset-4 decoration-border hover:decoration-primary">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}

export default Signup;
