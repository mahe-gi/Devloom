import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { Search, Edit, LayoutDashboard, User, LogOut, Menu, X, ArrowUpRight } from "lucide-react";
import { authClient } from "../../lib/auth";
import { ThemeToggle } from "../ThemeToggle";
import { Avatar } from "../ui/Avatar";

interface EditorialNavProps {
  onOpenSearch: () => void;
}

export function EditorialNav({ onOpenSearch }: EditorialNavProps) {
  const { data: session } = authClient.useSession();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const isAuthenticated = !!session;
  const userName = session?.user?.name || session?.user?.email?.split("@")[0] || "Author";
  const userAvatar = session?.user?.image || undefined;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await authClient.signOut();
    localStorage.removeItem("token");
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate("/");
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          scrolled
            ? "py-3 bg-background/80 backdrop-blur-xl border-b border-border/40 shadow-sm"
            : "py-6 bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Logo Mark */}
          <Link to="/" className="flex items-center gap-3 group">
            <span className="font-sans font-black text-xl md:text-2xl tracking-tighter text-foreground group-hover:text-loom transition-colors">
              DEVLOOM
            </span>
            <span className="hidden sm:inline-block font-mono text-[10px] uppercase px-2 py-0.5 rounded border border-border text-muted-foreground tracking-widest">
              v2.0
            </span>
          </Link>

          {/* Desktop Links & Actions */}
          <div className="hidden md:flex items-center gap-8 font-sans text-xs font-semibold tracking-wider uppercase text-muted-foreground">
            <Link to="/blogs" className="hover:text-foreground transition-colors">
              Explore Stories
            </Link>
            <button
              onClick={onOpenSearch}
              className="flex items-center gap-2 hover:text-foreground transition-colors cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search</span>
              <kbd className="font-mono text-[9px] px-1.5 py-0.5 rounded border border-border bg-surface text-subtle-foreground">
                ⌘K
              </kbd>
            </button>

            <ThemeToggle />

            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <Link
                  to="/publish"
                  className="flex items-center gap-1.5 text-foreground hover:text-loom transition-colors"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Write</span>
                </Link>

                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 cursor-pointer focus:outline-none"
                  >
                    <Avatar src={userAvatar} fallback={userName.charAt(0).toUpperCase()} size="sm" />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-3 w-56 bg-surface rounded-xl border border-border/80 shadow-xl py-2 z-50 text-xs tracking-normal font-sans normal-case text-foreground">
                      <div className="px-4 py-2.5 border-b border-border/40">
                        <p className="font-semibold text-foreground truncate">{userName}</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">Contributor</p>
                      </div>
                      <Link
                        to="/dashboard"
                        className="flex items-center gap-2 px-4 py-2 hover:bg-surface-subtle transition"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <LayoutDashboard className="w-4 h-4 text-muted-foreground" />
                        Dashboard
                      </Link>
                      <Link
                        to="/dashboard/profile"
                        className="flex items-center gap-2 px-4 py-2 hover:bg-surface-subtle transition"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <User className="w-4 h-4 text-muted-foreground" />
                        Profile Settings
                      </Link>
                      <div className="border-t border-border/40 pt-1 mt-1">
                        <button
                          onClick={handleLogout}
                          className="flex w-full items-center gap-2 text-left px-4 py-2 text-red-500 hover:bg-red-500/10 transition cursor-pointer"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  to="/signin"
                  className="text-foreground hover:text-loom transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/signin"
                  className="px-4 py-2 rounded-full bg-foreground text-background font-bold hover:opacity-90 transition-all hover:scale-[1.02]"
                >
                  Start Writing →
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Actions */}
          <div className="flex items-center md:hidden gap-3">
            <button
              onClick={onOpenSearch}
              aria-label="Search articles"
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 text-foreground focus:outline-none"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Fullscreen Mobile Editorial Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[90] bg-background text-foreground flex flex-col justify-between p-8 md:p-12 font-sans overflow-y-auto animate-in fade-in duration-300">
          <div className="flex justify-between items-center border-b border-border/40 pb-6">
            <span className="font-black tracking-tighter text-xl">DEVLOOM</span>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Close menu"
            >
              <X className="w-7 h-7" />
            </button>
          </div>

          <div className="my-auto flex flex-col gap-6 py-8">
            <Link
              to="/blogs"
              onClick={() => setMobileMenuOpen(false)}
              className="text-4xl md:text-6xl font-serif font-light text-foreground hover:text-loom transition-colors flex items-center justify-between group border-b border-border/20 pb-4"
            >
              <span>Explore Stories</span>
              <ArrowUpRight className="w-8 h-8 opacity-40 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
            </Link>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenSearch();
              }}
              className="text-4xl md:text-6xl font-serif font-light text-foreground hover:text-loom transition-colors flex items-center justify-between group border-b border-border/20 pb-4 text-left"
            >
              <span>Search Library</span>
              <Search className="w-8 h-8 opacity-40 group-hover:opacity-100 transition-all" />
            </button>

            {isAuthenticated ? (
              <>
                <Link
                  to="/publish"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-4xl md:text-6xl font-serif font-light text-foreground hover:text-loom transition-colors flex items-center justify-between group border-b border-border/20 pb-4"
                >
                  <span>Start Writing</span>
                  <Edit className="w-8 h-8 opacity-40 group-hover:opacity-100 transition-all" />
                </Link>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-4xl md:text-6xl font-serif font-light text-foreground hover:text-loom transition-colors flex items-center justify-between group border-b border-border/20 pb-4"
                >
                  <span>Dashboard</span>
                  <LayoutDashboard className="w-8 h-8 opacity-40 group-hover:opacity-100 transition-all" />
                </Link>
              </>
            ) : (
              <Link
                to="/signin"
                onClick={() => setMobileMenuOpen(false)}
                className="text-4xl md:text-6xl font-serif font-light text-loom hover:text-foreground transition-colors flex items-center justify-between group border-b border-border/20 pb-4"
              >
                <span>Sign In / Register</span>
                <ArrowUpRight className="w-8 h-8 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
              </Link>
            )}
          </div>

          <div className="flex justify-between items-center border-t border-border/40 pt-6 font-mono text-xs text-muted-foreground">
            <span>DEVLOOM PUBLISHING PLATFORM</span>
            <span>&copy; {new Date().getFullYear()}</span>
          </div>
        </div>
      )}
    </>
  );
}
