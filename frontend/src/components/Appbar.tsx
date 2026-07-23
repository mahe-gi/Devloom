import { Link, useNavigate } from "react-router";

import { useState, useEffect } from "react";
import axios from "axios";

interface AppbarProps {
  val?: boolean;
}

export function Appbar({ val }: AppbarProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>("Author");
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
      // Fetch user profile info
      axios
        .post(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/me`,
          {},
          {
            headers: {
              Authorization: token.startsWith("Bearer ") ? token : `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          if (res.data?.user?.name) {
            setUserName(res.data.user.name);
          } else if (res.data?.user?.username) {
            setUserName(res.data.user.username);
          }
        })
        .catch(() => {
          // Token invalid or expired
        });
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full h-[68px] bg-white border-b border-gray-200 flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex justify-between items-center h-full">
          <Link to="/blogs" className="flex items-center gap-2">
            <span className="font-serif text-2xl font-bold tracking-tight text-gray-900 hover:text-gray-600 transition-colors">
              101dev
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                  Dashboard
                </Link>
                {!val && (
                  <Link to="/publish">
                    <button className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors">
                      Write
                    </button>
                  </Link>
                )}

                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="focus:outline-none flex items-center cursor-pointer rounded-full ring-2 ring-transparent transition-all"
                    title="Account menu"
                  >
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-bold">
                      {userName.charAt(0).toUpperCase()}
                    </div>
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl border border-gray-200 shadow-lg py-2 z-50 text-sm text-gray-900 overflow-hidden">
                      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                        <p className="font-semibold text-gray-900 truncate">{userName}</p>
                        <p className="text-xs text-gray-500 mt-0.5">Author</p>
                      </div>
                      <div className="py-1">
                        <Link
                          to="/dashboard"
                          className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 transition"
                          onClick={() => setDropdownOpen(false)}
                        >
                          Dashboard
                        </Link>
                        <Link
                          to="/dashboard/profile"
                          className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 transition"
                          onClick={() => setDropdownOpen(false)}
                        >
                          Profile Settings
                        </Link>
                        <Link
                          to="/blogs"
                          className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 transition"
                          onClick={() => setDropdownOpen(false)}
                        >
                          All Articles
                        </Link>
                      </div>
                      <div className="border-t border-gray-200 py-1">
                        <button
                          onClick={handleLogout}
                          className="flex w-full items-center gap-2 text-left px-4 py-2 hover:bg-red-50 text-red-600 transition cursor-pointer"
                        >
                          Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/signin">
                  <button className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 font-medium">Sign In</button>
                </Link>
                <Link to="/signup">
                  <button className="px-4 py-2 text-sm bg-gray-900 text-white rounded-md hover:bg-gray-800 font-medium">Create Account</button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden gap-4">
             {!val && isAuthenticated && (
               <Link to="/publish">
                 <button className="px-2 py-1 text-sm bg-gray-100 text-gray-700 rounded-md">
                   Write
                 </button>
               </Link>
             )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-900 hover:text-gray-600 transition-colors focus:outline-none p-2 -mr-2"
              aria-label="Toggle menu"
            >
              Menu
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 absolute top-[68px] left-0 w-full shadow-lg z-40">
          <div className="px-4 pt-2 pb-6 space-y-1">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-3 px-3 py-4 mb-2 border-b border-gray-200">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-bold">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{userName}</p>
                    <p className="text-sm text-gray-500">Author</p>
                  </div>
                </div>
                <Link
                  to="/dashboard"
                  className="flex items-center gap-3 px-3 py-3 text-base font-medium text-gray-900 hover:bg-gray-50 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/dashboard/profile"
                  className="flex items-center gap-3 px-3 py-3 text-base font-medium text-gray-900 hover:bg-gray-50 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Profile
                </Link>
                <Link
                  to="/blogs"
                  className="flex items-center gap-3 px-3 py-3 text-base font-medium text-gray-900 hover:bg-gray-50 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  All Articles
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 px-3 py-3 mt-2 text-base font-medium text-red-600 hover:bg-red-50 rounded-lg text-left"
                >
                  Sign out
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-3 px-3 py-4">
                <Link to="/signin" onClick={() => setMobileMenuOpen(false)}>
                  <button className="w-full justify-center px-4 py-2 border border-gray-300 rounded-md">Sign In</button>
                </Link>
                <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                  <button className="w-full justify-center px-4 py-2 bg-gray-900 text-white rounded-md">Create Account</button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
