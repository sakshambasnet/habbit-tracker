import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles } from "lucide-react";

const Auth = () => {
  const { user, signIn, signUp, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [demoemail, setDemoemail] = useState("demo@gmail.com");
  const [demopassword, setdemopassword] = useState("password123");
  const [authType, setAuthType] = useState<"login" | "signup">("login");

  // New demo login handler
  const handleDemoLogin = async (e: React.MouseEvent) => {
    e.preventDefault();
    setEmail(demoemail);
    setPassword(demopassword);
    await signIn(demoemail, demopassword);
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();

    if (authType === "login") {
      await signIn(email, password);
    } else {
      await signUp(email, password);
    }
  };

  // Redirect if already logged in
  if (user) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            <Sparkles className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">SassyStreak</CardTitle>
          <CardDescription>Your sassy habit tracker</CardDescription>
        </CardHeader>

        <Tabs
          value={authType}
          onValueChange={(v) => setAuthType(v as "login" | "signup")}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <form onSubmit={handleAuth}>
              <CardContent className="space-y-4 pt-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="youremail@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium">
                    Password
                  </label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </CardContent>

              <CardFooter>
                <Button
                  className="w-full"
                  type="submit"
                  disabled={loading || !email || !password}
                >
                  {loading ? "Logging in..." : "Log In"}
                </Button>
                <Button
                  className="w-full ml-2"
                  type="button" // Changed from submit to button
                  onClick={handleDemoLogin} // Updated to new handler
                  disabled={loading}
                >
                  Demo Login
                </Button>
              </CardFooter>
            </form>
          </TabsContent>

          <TabsContent value="signup">
            <form onSubmit={handleAuth}>
              <CardContent className="space-y-4 pt-4">
                <div className="space-y-2">
                  <label htmlFor="signup-email" className="text-sm font-medium">
                    Email
                  </label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="youremail@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="signup-password"
                    className="text-sm font-medium"
                  >
                    Password
                  </label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Password must be at least 6 characters
                  </p>
                </div>
              </CardContent>

              <CardFooter>
                <Button
                  className="w-full"
                  type="submit"
                  disabled={loading || !email || !password}
                >
                  {loading ? "Creating Account..." : "Create Account"}
                </Button>
              </CardFooter>
            </form>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default Auth;
