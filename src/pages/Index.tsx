
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Dashboard from "@/components/Dashboard";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    // Hide welcome message after 3 seconds
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      {showWelcome && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 animate-fade-in">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md text-center">
            <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent flex items-center justify-center gap-2">
              <Sparkles className="h-6 w-6 text-primary" />
              Welcome to SassyStreak!
            </h2>
            <p className="mb-4">Your sassy habit tracker that keeps you accountable with a touch of humor.</p>
            <Button onClick={() => setShowWelcome(false)}>Get Started</Button>
          </div>
        </div>
      )}
      
      <main className="flex-1">
        <Dashboard />
      </main>
      
      <footer className="py-4 px-6 border-t border-border text-center text-sm text-muted-foreground">
        <p>© 2025 SassyStreak. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Index;
