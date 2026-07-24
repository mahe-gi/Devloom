import { Link, useNavigate } from "react-router";
import { useState } from "react";
import { Menu, X, Edit, LayoutDashboard, Settings, BookOpen, LogOut } from "lucide-react";

import { Avatar } from "./ui/Avatar";
import { Button } from "./ui/Button";
import { ThemeToggle } from "./ThemeToggle";

import { authClient } from "../lib/auth";

interface AppbarProps {
  val?: boolean;
}

export function Appbar({ val }: AppbarProps) {
  const { data: session } = authClient.useSession();
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  const isAuthenticated = !!session;
  const userName = session?.user?.name || session?.user?.email?.split('@')[0] || "Author";

  const handleLogout = async () => {
    await authClient.signOut();
    localStorage.removeItem("token");
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate("/");
  };

  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl h-14 rounded-2xl bg-white/70 dark:bg-black/50 backdrop-blur-xl border border-white/10 dark:border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex items-center transition-all duration-300">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 w-full">
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
        <div className="md:hidden bg-background/95 backdrop-blur-xl border-x border-b border-white/10 dark:border-white/5 rounded-b-2xl absolute top-12 left-0 w-full shadow-lg z-40 overflow-hidden">
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
