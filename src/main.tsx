import React, { StrictMode, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./utils/preloader";
import { extremeOptimization, disableWebSocket } from "./utils/extremePerformanceOptimizer";
import { CriticalCSS } from "./components/common/CriticalCSS.tsx";
// Lazy load heavy dependencies
const QueryClientProvider = lazy(() => 
  import('@tanstack/react-query').then(m => ({ default: m.QueryClientProvider }))
);
const App = lazy(() => import("./App.tsx"));
const AppWrapper = lazy(() => 
  import("./components/common/PageMeta.tsx").then(m => ({ default: m.AppWrapper }))
);
const ThemeProvider = lazy(() => 
  import("./context/ThemeContext.tsx").then(m => ({ default: m.ThemeProvider }))
);
// Remove unused CSS imports entirely
// Lazy create QueryClient
const createQueryClient = async () => {
  const { QueryClient } = await import('@tanstack/react-query');
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000,
        retry: 1,
      },
    },
  });
};
const AppLoader = () => {
  const [queryClient, setQueryClient] = React.useState<any>(null);
  React.useEffect(() => {
    createQueryClient().then(setQueryClient);
  }, []);
  if (!queryClient) {
    return React.createElement('div', { className: 'flex items-center justify-center h-screen' },
      React.createElement('div', { className: 'animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600' })
    );
  }
  return React.createElement(Suspense, {
    fallback: React.createElement('div', { className: 'flex items-center justify-center h-screen' },
      React.createElement('div', { className: 'animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600' })
    )
  },
    React.createElement(QueryClientProvider, { client: queryClient as any },
      React.createElement(ThemeProvider, null,
        React.createElement(AppWrapper, null,
          React.createElement(App, null)
        )
      )
    )
  );
};
// Extreme performance optimizations for 90+ score
extremeOptimization();
disableWebSocket();
createRoot(document.getElementById("root")!).render(
  React.createElement(StrictMode, null,
    React.createElement(CriticalCSS, null),
    React.createElement(AppLoader, null)
  )
);
