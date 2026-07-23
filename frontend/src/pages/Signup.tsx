import { Link } from "react-router";
import { useState } from "react";
import { SignupInput } from "@mahe-npm/common";
import { useNavigate } from "react-router";
import axios from "axios";
import { Bounce, toast, ToastContainer } from "react-toastify";

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
    <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen bg-white text-gray-900">
      {/* Left side: Product message */}
      <div className="hidden lg:flex flex-col justify-center px-16 xl:px-24 bg-white border-r border-gray-200 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gray-100 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="relative z-10 max-w-lg">
          <Link to="/" className="inline-flex items-center gap-2 mb-12">
            <div className="w-8 h-8 bg-gray-900 rounded flex items-center justify-center">
              <span className="text-white font-bold text-xl leading-none">1</span>
            </div>
            <span className="text-xl font-bold tracking-tight">101dev</span>
          </Link>
          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-6">
            Join the developer network
          </h1>
          <p className="text-lg text-gray-600 mb-8 font-serif leading-relaxed">
            Create an account to start publishing your technical stories. Connect with other developers, share your knowledge, and grow your audience.
          </p>
          <div className="flex gap-4 items-center">
            <div className="flex -space-x-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className={`w-10 h-10 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-600 z-${40-i*10}`}>
                  U{i}
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-600 font-medium">Join 10k+ developers</p>
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
            <p className="text-gray-600 text-base">
              Enter your details to get started with 101dev.
            </p>
          </div>

          <div className="space-y-6">
            <button className="w-full h-11 text-base border border-gray-300 rounded-md bg-white text-gray-900 hover:bg-gray-50" type="button">
              Sign up with Google
            </button>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-600 font-medium">
                  Or sign up with email
                </span>
              </div>
            </div>

            <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); handlePostSignup(); }}>
              <div className="flex flex-col gap-2">
                <label htmlFor="name" className="text-sm font-medium text-gray-900">Full Name</label>
                <input
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
                  className="border border-gray-300 rounded-md p-2 w-full"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-900">Email Address</label>
                <input
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
                  className="border border-gray-300 rounded-md p-2 w-full"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-900">Password</label>
                <input
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
                  className="border border-gray-300 rounded-md p-2 w-full"
                />
              </div>

              <div className="pt-2">
                <button
                  disabled={loading}
                  onClick={handlePostSignup}
                  className="w-full h-11 text-base bg-gray-900 text-white rounded-md hover:bg-gray-800 disabled:opacity-50 flex justify-center items-center"
                  type="submit"
                >
                  {loading ? "Loading..." : "Create Account"}
                </button>
              </div>
            </form>
            
            <p className="text-sm text-gray-600 text-center font-medium pt-4">
              Already have an account?{" "}
              <Link to="/signin" className="text-gray-900 hover:text-gray-700 transition-colors underline underline-offset-4 decoration-gray-200 hover:decoration-gray-900">
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
