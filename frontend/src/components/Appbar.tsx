import { Link, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import axios from "axios";
import { Menu, X, Edit, LayoutDashboard, Settings, BookOpen, LogOut } from "lucide-react";

import { Avatar } from "./ui/Avatar";
import { Button } from "./ui/Button";
import { ThemeToggle } from "./ThemeToggle";

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
    <header className="sticky top-0 z-50 w-full h-14 bg-background border-b border-border flex items-center transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex justify-between items-center h-full">
          <Link to="/blogs" className="flex items-center gap-2">
            <span className="font-serif text-2xl font-bold tracking-tight text-foreground hover:text-foreground/80 transition-colors">
              Devloom
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <ThemeToggle />
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="text-sm font-medium text-muted hover:text-foreground transition-colors">
                  Dashboard
                </Link>
                {!val && (
                  <Link to="/publish">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Edit className="w-4 h-4" />
                      Write
                    </Button>
                  </Link>
                )}

                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="focus:outline-none flex items-center cursor-pointer rounded-full ring-2 ring-transparent transition-all"
                    title="Account menu"
                  >
                    <Avatar fallback={userName.charAt(0).toUpperCase()} size="sm" />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-background rounded-xl border border-border shadow-sm py-2 z-50 text-sm text-foreground overflow-hidden">
                      <div className="px-4 py-3 border-b border-border bg-muted/10">
                        <p className="font-semibold text-foreground truncate">{userName}</p>
                        <p className="text-xs text-muted mt-0.5">Author</p>
                      </div>
                      <div className="py-1">
                        <Link
                          to="/dashboard"
                          className="flex items-center gap-2 px-4 py-2 hover:bg-muted/10 transition"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          Dashboard
                        </Link>
                        <Link
                          to="/dashboard/profile"
                          className="flex items-center gap-2 px-4 py-2 hover:bg-muted/10 transition"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <Settings className="w-4 h-4" />
                          Profile Settings
                        </Link>
                        <Link
                          to="/blogs"
                          className="flex items-center gap-2 px-4 py-2 hover:bg-muted/10 transition"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <BookOpen className="w-4 h-4" />
                          All Articles
                        </Link>
                      </div>
                      <div className="border-t border-border py-1">
                        <button
                          onClick={handleLogout}
                          className="flex w-full items-center gap-2 text-left px-4 py-2 hover:bg-red-50 dark:hover:bg-red-950/30 text-red-600 transition cursor-pointer"
                        >
                          <LogOut className="w-4 h-4" />
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
                  <Button variant="ghost" size="sm">Sign In</Button>
                </Link>
                <Link to="/signup">
                  <Button variant="primary" size="sm">Get Started</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden gap-4">
             <ThemeToggle />
             {!val && isAuthenticated && (
               <Link to="/publish">
                 <Button variant="outline" size="sm">
                   Write
                 </Button>
               </Link>
             )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-foreground hover:text-foreground/80 transition-colors focus:outline-none p-2 -mr-2 flex items-center justify-center"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-background border-b border-border absolute top-14 left-0 w-full shadow-sm z-40">
          <div className="px-4 pt-2 pb-6 space-y-1">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-3 px-3 py-4 mb-2 border-b border-border">
                  <Avatar fallback={userName.charAt(0).toUpperCase()} size="md" />
                  <div>
                    <p className="font-medium text-foreground">{userName}</p>
                    <p className="text-sm text-muted">Author</p>
                  </div>
                </div>
                <Link
                  to="/dashboard"
                  className="flex items-center gap-3 px-3 py-3 text-base font-medium text-foreground hover:bg-muted/10 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <LayoutDashboard className="w-5 h-5 text-muted" />
                  Dashboard
                </Link>
                <Link
                  to="/dashboard/profile"
                  className="flex items-center gap-3 px-3 py-3 text-base font-medium text-foreground hover:bg-muted/10 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Settings className="w-5 h-5 text-muted" />
                  Profile
                </Link>
                <Link
                  to="/blogs"
                  className="flex items-center gap-3 px-3 py-3 text-base font-medium text-foreground hover:bg-muted/10 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <BookOpen className="w-5 h-5 text-muted" />
                  All Articles
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 px-3 py-3 mt-2 text-base font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg text-left"
                >
                  <LogOut className="w-5 h-5" />
                  Sign out
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-3 px-3 py-4">
                <Link to="/signin" onClick={() => setMobileMenuOpen(false)} className="w-full">
                  <Button variant="outline" className="w-full justify-center">Sign In</Button>
                </Link>
                <Link to="/signup" onClick={() => setMobileMenuOpen(false)} className="w-full">
                  <Button variant="primary" className="w-full justify-center">Get Started</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
