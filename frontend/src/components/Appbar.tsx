import { Link, useNavigate } from "react-router";
import { Avatar } from "./ui/Avatar";
import { useState, useEffect } from "react";
import axios from "axios";
import { Menu, X, Edit, LayoutDashboard, Settings, BookOpen, LogOut } from "lucide-react";
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
    <header className="sticky top-0 z-50 w-full h-[68px] bg-surface border-b border-border flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex justify-between items-center h-full">
          <Link to="/blogs" className="flex items-center gap-2">
            <span className="font-serif text-2xl font-bold tracking-tight text-foreground hover:text-primary transition-colors">
              101dev
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
                    <Button variant="ghost" size="sm" className="gap-2">
                      <Edit size={16} />
                      Write
                    </Button>
                  </Link>
                )}

                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="focus:outline-none flex items-center cursor-pointer rounded-full ring-2 ring-transparent hover:ring-primary/20 transition-all"
                    title="Account menu"
                  >
                    <Avatar size="sm" fallback={userName.charAt(0).toUpperCase()} />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-surface rounded-xl border border-border shadow-lg py-2 z-50 text-sm text-foreground overflow-hidden">
                      <div className="px-4 py-3 border-b border-border bg-surface-secondary/50">
                        <p className="font-semibold text-foreground truncate">{userName}</p>
                        <p className="text-xs text-muted mt-0.5">Author</p>
                      </div>
                      <div className="py-1">
                        <Link
                          to="/dashboard"
                          className="flex items-center gap-2 px-4 py-2 hover:bg-surface-secondary transition"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <LayoutDashboard size={16} className="text-muted" />
                          Dashboard
                        </Link>
                        <Link
                          to="/dashboard/profile"
                          className="flex items-center gap-2 px-4 py-2 hover:bg-surface-secondary transition"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <Settings size={16} className="text-muted" />
                          Profile Settings
                        </Link>
                        <Link
                          to="/blogs"
                          className="flex items-center gap-2 px-4 py-2 hover:bg-surface-secondary transition"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <BookOpen size={16} className="text-muted" />
                          All Articles
                        </Link>
                      </div>
                      <div className="border-t border-border py-1">
                        <button
                          onClick={handleLogout}
                          className="flex w-full items-center gap-2 text-left px-4 py-2 hover:bg-destructive/10 text-destructive transition cursor-pointer"
                        >
                          <LogOut size={16} />
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
                  <Button variant="primary" size="sm">Create Account</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden gap-4">
             <ThemeToggle />
             {!val && isAuthenticated && (
               <Link to="/publish">
                 <Button variant="ghost" size="sm" className="px-2">
                   <Edit size={18} />
                 </Button>
               </Link>
             )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-foreground hover:text-primary transition-colors focus:outline-none p-2 -mr-2"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-surface border-b border-border absolute top-[68px] left-0 w-full shadow-lg z-40">
          <div className="px-4 pt-2 pb-6 space-y-1">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-3 px-3 py-4 mb-2 border-b border-border">
                  <Avatar size="md" fallback={userName.charAt(0).toUpperCase()} />
                  <div>
                    <p className="font-medium text-foreground">{userName}</p>
                    <p className="text-sm text-muted">Author</p>
                  </div>
                </div>
                <Link
                  to="/dashboard"
                  className="flex items-center gap-3 px-3 py-3 text-base font-medium text-foreground hover:bg-surface-secondary rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <LayoutDashboard size={20} className="text-muted" />
                  Dashboard
                </Link>
                <Link
                  to="/dashboard/profile"
                  className="flex items-center gap-3 px-3 py-3 text-base font-medium text-foreground hover:bg-surface-secondary rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Settings size={20} className="text-muted" />
                  Profile
                </Link>
                <Link
                  to="/blogs"
                  className="flex items-center gap-3 px-3 py-3 text-base font-medium text-foreground hover:bg-surface-secondary rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <BookOpen size={20} className="text-muted" />
                  All Articles
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 px-3 py-3 mt-2 text-base font-medium text-destructive hover:bg-destructive/10 rounded-lg text-left"
                >
                  <LogOut size={20} />
                  Sign out
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-3 px-3 py-4">
                <Link to="/signin" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full justify-center">Sign In</Button>
                </Link>
                <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" className="w-full justify-center">Create Account</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
