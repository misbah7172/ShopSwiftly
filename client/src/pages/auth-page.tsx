import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";

export default function AuthPage() {
  const { user, loginMutation, registerMutation } = useAuth();
  const [, setLocation] = useLocation();
  
  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });
  
  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    password: ""
  });

  // Redirect if already logged in
  if (user) {
    setLocation("/");
    return null;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(loginData, {
      onSuccess: () => setLocation("/")
    });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    registerMutation.mutate(registerData, {
      onSuccess: () => setLocation("/")
    });
  };

  return (
    <div className="min-h-screen bg-retro-cream flex">
      {/* Left side - Auth forms */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Card className="border-2 border-retro-charcoal retro-shadow bg-retro-cream">
            <CardHeader className="text-center">
              <CardTitle className="font-retro text-2xl text-retro-charcoal mb-4">
                RETROSHOP
              </CardTitle>
              <div className="w-16 h-1 bg-retro-teal mx-auto"></div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-retro-muted border-2 border-retro-charcoal">
                  <TabsTrigger 
                    value="login" 
                    className="font-bold uppercase tracking-wide data-[state=active]:bg-retro-teal data-[state=active]:text-retro-charcoal"
                    data-testid="tab-login"
                  >
                    Login
                  </TabsTrigger>
                  <TabsTrigger 
                    value="register" 
                    className="font-bold uppercase tracking-wide data-[state=active]:bg-retro-teal data-[state=active]:text-retro-charcoal"
                    data-testid="tab-register"
                  >
                    Sign Up
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="login" className="mt-6">
                  <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                      <Label className="block text-retro-charcoal font-bold mb-2 uppercase tracking-wide">
                        Email
                      </Label>
                      <Input
                        type="email"
                        value={loginData.email}
                        onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-4 py-3 border-2 border-retro-charcoal bg-retro-cream focus:outline-none focus:border-retro-teal transition-colors"
                        placeholder="Enter your email"
                        required
                        data-testid="input-email-login"
                      />
                    </div>
                    
                    <div>
                      <Label className="block text-retro-charcoal font-bold mb-2 uppercase tracking-wide">
                        Password
                      </Label>
                      <Input
                        type="password"
                        value={loginData.password}
                        onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                        className="w-full px-4 py-3 border-2 border-retro-charcoal bg-retro-cream focus:outline-none focus:border-retro-teal transition-colors"
                        placeholder="Enter your password"
                        required
                        data-testid="input-password-login"
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="retro-button bg-retro-teal hover:bg-retro-teal-dark text-retro-charcoal w-full py-3 font-bold"
                      disabled={loginMutation.isPending}
                      data-testid="button-login"
                    >
                      {loginMutation.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          LOGGING IN...
                        </>
                      ) : (
                        "LOGIN"
                      )}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="register" className="mt-6">
                  <form onSubmit={handleRegister} className="space-y-6">
                    <div>
                      <Label className="block text-retro-charcoal font-bold mb-2 uppercase tracking-wide">
                        Username
                      </Label>
                      <Input
                        type="text"
                        value={registerData.username}
                        onChange={(e) => setRegisterData(prev => ({ ...prev, username: e.target.value }))}
                        className="w-full px-4 py-3 border-2 border-retro-charcoal bg-retro-cream focus:outline-none focus:border-retro-teal transition-colors"
                        placeholder="Choose a username"
                        required
                        data-testid="input-username-register"
                      />
                    </div>
                    
                    <div>
                      <Label className="block text-retro-charcoal font-bold mb-2 uppercase tracking-wide">
                        Email
                      </Label>
                      <Input
                        type="email"
                        value={registerData.email}
                        onChange={(e) => setRegisterData(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-4 py-3 border-2 border-retro-charcoal bg-retro-cream focus:outline-none focus:border-retro-teal transition-colors"
                        placeholder="Enter your email"
                        required
                        data-testid="input-email-register"
                      />
                    </div>
                    
                    <div>
                      <Label className="block text-retro-charcoal font-bold mb-2 uppercase tracking-wide">
                        Password
                      </Label>
                      <Input
                        type="password"
                        value={registerData.password}
                        onChange={(e) => setRegisterData(prev => ({ ...prev, password: e.target.value }))}
                        className="w-full px-4 py-3 border-2 border-retro-charcoal bg-retro-cream focus:outline-none focus:border-retro-teal transition-colors"
                        placeholder="Create a password"
                        required
                        data-testid="input-password-register"
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="retro-button bg-retro-teal hover:bg-retro-teal-dark text-retro-charcoal w-full py-3 font-bold"
                      disabled={registerMutation.isPending}
                      data-testid="button-register"
                    >
                      {registerMutation.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          CREATING ACCOUNT...
                        </>
                      ) : (
                        "SIGN UP"
                      )}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Right side - Hero section */}
      <div className="flex-1 relative overflow-hidden hidden lg:flex">
        <div className="absolute inset-0 opacity-20">
          <div style={{ backgroundImage: "radial-gradient(circle, #4ECDC4 2px, transparent 2px)", backgroundSize: "30px 30px" }}></div>
        </div>
        
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40" 
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1560472355-536de3962603?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600')" }}
        />
        
        <div className="relative z-10 flex flex-col justify-center p-12 text-center">
          <h2 className="font-retro text-3xl text-retro-charcoal mb-6 animate-glow">
            WELCOME TO THE
            <span className="block text-retro-teal mt-2">RETRO REVOLUTION</span>
          </h2>
          <p className="text-lg text-retro-charcoal leading-relaxed max-w-md mx-auto">
            Join thousands of vintage enthusiasts discovering authentic retro treasures and nostalgic finds.
          </p>
        </div>
      </div>
    </div>
  );
}
