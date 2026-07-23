import { Link } from "react-router";

export function Footer() {
  return (
    <footer className="w-full py-6 border-t border-border bg-background mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="font-serif text-xl font-bold tracking-tight text-foreground">
            Devloom
          </span>
        </div>
        
        <p className="text-sm text-muted-foreground text-center md:text-left">
          &copy; {new Date().getFullYear()} Devloom. All rights reserved.
        </p>

        <div className="flex items-center gap-6">
          <Link to="/about" className="text-sm text-muted hover:text-foreground transition-colors">
            About
          </Link>
          <Link to="/privacy" className="text-sm text-muted hover:text-foreground transition-colors">
            Privacy
          </Link>
          <Link to="/terms" className="text-sm text-muted hover:text-foreground transition-colors">
            Terms
          </Link>
        </div>
      </div>
    </footer>
  );
}
