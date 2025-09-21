import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Cart, Product } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { ShoppingCart, User, Menu, X } from "lucide-react";

type CartItemWithProduct = Cart & { product: Product };

export default function Navbar() {
  const [location] = useLocation();
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { data: cartItems } = useQuery<CartItemWithProduct[]>({
    queryKey: ["/api/cart"],
    enabled: !!user,
  });

  const cartItemCount = cartItems?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const isActive = (path: string) => {
    return location === path;
  };

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    closeMobileMenu();
  }, [location]);

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <nav className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <div className="flex items-center space-x-2 cursor-pointer">
                <div className="text-2xl font-bold text-gray-900 tracking-tight">
                  ShopSwiftly
                </div>
              </div>
            </Link>

            <div className="hidden md:flex items-center space-x-8">
              <Link href="/">
                <span className="relative font-medium text-gray-700 hover:text-gray-900 transition-colors duration-200 cursor-pointer">
                  Home
                </span>
              </Link>
              
              <Link href="/shop">
                <span className="relative font-medium text-gray-700 hover:text-gray-900 transition-colors duration-200 cursor-pointer">
                  Shop
                </span>
              </Link>

              {user && (
                <Link href="/cart">
                  <span className="relative font-medium text-gray-700 hover:text-gray-900 transition-colors duration-200 cursor-pointer flex items-center space-x-1">
                    <ShoppingCart className="w-5 h-5" />
                    <span>Cart</span>
                    {cartItemCount > 0 && (
                      <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                        {cartItemCount}
                      </span>
                    )}
                  </span>
                </Link>
              )}

              {user ? (
                <>
                  <Link href="/profile">
                    <span className="relative font-medium text-gray-700 hover:text-gray-900 transition-colors duration-200 cursor-pointer">
                      Profile
                    </span>
                  </Link>
                  
                  {user.isAdmin === 1 && (
                    <Link href="/admin">
                      <span className="relative font-medium text-gray-700 hover:text-gray-900 transition-colors duration-200 cursor-pointer">
                        Admin
                      </span>
                    </Link>
                  )}
                  
                  <Button 
                    onClick={() => {
                      // Add logout functionality here
                      fetch('/api/logout', { method: 'POST' })
                        .then(() => window.location.href = '/');
                    }}
                    variant="outline" 
                    className="border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 px-6 py-2 font-medium rounded-lg transition-all duration-200"
                  >
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/auth">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 font-medium rounded-lg transition-all duration-200 hover:shadow-lg">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/auth">
                    <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-2 font-medium rounded-lg transition-all duration-200">
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </div>

            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMobileMenu}
                className="p-2 hover:bg-gray-100"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6 text-gray-700" />
                ) : (
                  <Menu className="w-6 h-6 text-gray-700" />
                )}
              </Button>
            </div>
          </div>
        </nav>
      </header>

      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={closeMobileMenu}
        />
      )}

      <div 
        className={`fixed top-0 right-0 h-screen w-80 max-w-[85vw] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out md:hidden overflow-hidden ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50">
          <h2 className="text-xl font-bold text-gray-900">Menu</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={closeMobileMenu}
            className="p-2 hover:bg-gray-200 rounded-full"
          >
            <X className="w-5 h-5 text-gray-600" />
          </Button>
        </div>

        <div className="flex flex-col h-full">
          <div className="flex-1 p-4 overflow-y-auto">
            <nav className="space-y-2">
              <Link href="/" onClick={closeMobileMenu}>
                <div className="flex items-center space-x-4 p-4 rounded-xl hover:bg-gray-100 cursor-pointer">
                  <span className="text-lg font-medium">Home</span>
                </div>
              </Link>
              
              <Link href="/shop" onClick={closeMobileMenu}>
                <div className="flex items-center space-x-4 p-4 rounded-xl hover:bg-gray-100 cursor-pointer">
                  <span className="text-lg font-medium">Shop</span>
                </div>
              </Link>

              {user && (
                <Link href="/cart" onClick={closeMobileMenu}>
                  <div className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-100 cursor-pointer">
                    <div className="flex items-center space-x-4">
                      <ShoppingCart className="w-6 h-6" />
                      <span className="text-lg font-medium">Cart</span>
                    </div>
                    {cartItemCount > 0 && (
                      <span className="bg-blue-600 text-white text-sm rounded-full w-7 h-7 flex items-center justify-center font-bold">
                        {cartItemCount}
                      </span>
                    )}
                  </div>
                </Link>
              )}

              {user && (
                <Link href="/profile" onClick={closeMobileMenu}>
                  <div className="flex items-center space-x-4 p-4 rounded-xl hover:bg-gray-100 cursor-pointer">
                    <User className="w-6 h-6" />
                    <span className="text-lg font-medium">Profile</span>
                  </div>
                </Link>
              )}
              
              {user?.isAdmin === 1 && (
                <Link href="/admin" onClick={closeMobileMenu}>
                  <div className="flex items-center space-x-4 p-4 rounded-xl hover:bg-gray-100 cursor-pointer">
                    <span className="text-lg font-medium">Admin</span>
                  </div>
                </Link>
              )}

              {/* Authentication Section - Always Visible */}
              <div className="pt-6 mt-6 border-t border-gray-200">
                <div className="px-4 pb-2">
                  <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Account</span>
                </div>
                {user ? (
                  <div className="space-y-2">
                    <Button 
                      onClick={() => {
                        fetch('/api/logout', { method: 'POST' })
                          .then(() => {
                            closeMobileMenu();
                            window.location.href = '/';
                          });
                      }}
                      className="w-full bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 hover:border-red-300 py-3 text-lg font-medium rounded-xl transition-all duration-200"
                    >
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link href="/auth" onClick={closeMobileMenu}>
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white py-3 font-medium rounded-xl w-full text-lg transition-all duration-200 shadow-lg hover:shadow-xl">
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/auth" onClick={closeMobileMenu}>
                      <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50 py-3 font-medium rounded-xl w-full text-lg transition-all duration-200">
                        Sign Up
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
}
