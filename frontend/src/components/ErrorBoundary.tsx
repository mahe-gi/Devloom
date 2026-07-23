import { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";
import { Button } from "./ui/Button";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-6">
          <div className="max-w-md w-full bg-surface p-8 rounded-2xl border border-border shadow-sm text-center space-y-6">
            <div className="mx-auto w-16 h-16 bg-destructive/10 text-destructive rounded-full flex items-center justify-center">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground tracking-tight">Something went wrong</h2>
              <p className="text-muted mt-2 text-sm">
                We apologize for the inconvenience. An unexpected error has occurred.
              </p>
            </div>
            {this.state.error && (
              <div className="bg-surface-subtle p-4 rounded-lg overflow-auto text-left text-xs text-muted font-mono whitespace-pre-wrap max-h-32">
                {this.state.error.toString()}
              </div>
            )}
            <Button onClick={this.handleReset} className="w-full flex items-center justify-center gap-2">
              <RefreshCcw className="w-4 h-4" />
              Reload Page
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
