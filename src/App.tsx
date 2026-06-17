import { AppRouter } from "@/processes/routing/ui/AppRouter";
import { useMenuStore } from "@/entities/menu/model/menu.store";
import { useAuthStore } from "@/entities/auth/model/auth.store";
import { useEffect } from "react";
import { Toaster } from "sonner";

function App() {
  const fetchMenus = useMenuStore((state) => state.fetchMenus);
  const { isAuthenticated, isLoading, initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      fetchMenus();
    }
  }, [isAuthenticated, isLoading, fetchMenus]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#1E1E1E] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <AppRouter />
      <Toaster
        position="top-center"
        richColors
        closeButton
        duration={4000}
        toastOptions={{
          style: {
            background: "#2A2A2A",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            color: "#fff",
          },
        }}
      />
    </>
  );
}

export default App;
