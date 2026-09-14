import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
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
    console.error('Portal Error Caught by ErrorBoundary:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[70vh] flex items-center justify-center px-4 py-20 bg-[#F8FAFC]">
          <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-slate-200 shadow-xl text-center space-y-5">
            <div className="w-14 h-14 mx-auto rounded-full bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <div className="space-y-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#0284C7] bg-sky-50 px-3 py-1 rounded-full border border-sky-200 inline-block">
                SYSTEM RECOVERY
              </span>
              <h2 className="text-xl font-bold text-slate-900">Intake Portal Initialization Notice</h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                The secure client portal encountered an unexpected state. You can reload the page or return to the overview.
              </p>
            </div>

            {this.state.error && (
              <div className="text-left bg-slate-50 p-3 rounded-lg border border-slate-200 text-[11px] font-mono text-slate-500 overflow-x-auto max-h-24">
                {this.state.error.message}
              </div>
            )}

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={this.handleReload}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#0284C7] text-white text-xs font-mono font-bold hover:bg-[#0369A1] transition-all shadow-sm"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reload Portal</span>
              </button>
              <button
                onClick={this.handleGoHome}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-100 text-slate-700 text-xs font-mono font-bold hover:bg-slate-200 transition-all border border-slate-200"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Overview</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
