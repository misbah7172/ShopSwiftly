import { useState } from "react";
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
    return location === path ? 'text-retro-teal' : 'text-retro-charcoal hover:text-retro-teal';
  };

  return (
    <header className="sticky top-0 z-50 bg-retro-cream border-b-4 border-retro-charcoal">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" onClick={closeMobileMenu}>
            <div className="flex items-center space-x-2 cursor-pointer" data-testid="link-logo">
              <div className="text-2xl font-retro text-retro-teal animate-glow">
                RETROSHOP
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/">
              <span className={`${isActive('/')} transition-colors duration-200 font-medium uppercase tracking-wide cursor-pointer`} data-testid="link-home">
                Home
              </span>
            </Link>
            
            <Link href="/#shop">
              <span className="text-retro-charcoal hover:text-retro-teal transition-colors duration-200 font-medium uppercase tracking-wide cursor-pointer" data-testid="link-shop">
                Shop
              </span>
            </Link>

            {user && (
              <Link href="/cart">
                <span className={`${isActive('/cart')} transition-colors duration-200 font-medium uppercase tracking-wide relative cursor-pointer`} data-testid="link-cart">
                  Cart
                  {cartItemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-retro-pink text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold" data-testid="text-cart-count">
                      {cartItemCount}
                    </span>
                  )}
                </span>
              </Link>
            )}

            {user ? (
              <>
                <Link href="/profile">
                  <span className={`${isActive('/profile')} transition-colors duration-200 font-medium uppercase tracking-wide cursor-pointer`} data-testid="link-profile">
                    Profile
                  </span>
                </Link>
                
                {user.isAdmin === 1 && (
                  <Link href="/admin">
                    <span className={`${isActive('/admin')} transition-colors duration-200 font-medium uppercase tracking-wide cursor-pointer`} data-testid="link-admin">
                      Admin
                    </span>
                  </Link>
                )}
              </>
            ) : (
              <Link href="/auth">
                <Button className="retro-button bg-retro-mustard hover:bg-retro-mustard-dark text-retro-charcoal px-6 py-2 font-bold" data-testid="button-login">
                  LOGIN
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMobileMenu}
              className="p-2"
              data-testid="button-mobile-menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-retro-charcoal" />
              ) : (
                <Menu className="w-6 h-6 text-retro-charcoal" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed top-0 left-0 w-64 h-full bg-retro-cream border-r-4 border-retro-charcoal z-40 p-6 animate-slide-up">
            <div className="space-y-6 mt-16">
              <Link href="/" onClick={closeMobileMenu}>
                <span className="block text-retro-charcoal hover:text-retro-teal transition-colors duration-200 font-medium uppercase tracking-wide cursor-pointer" data-testid="mobile-link-home">
                  Home
                </span>
              </Link>
              
              <Link href="/#shop" onClick={closeMobileMenu}>
                <span className="block text-retro-charcoal hover:text-retro-teal transition-colors duration-200 font-medium uppercase tracking-wide cursor-pointer" data-testid="mobile-link-shop">
                  Shop
                </span>
              </Link>

              {user && (
                <Link href="/cart" onClick={closeMobileMenu}>
                  <span className="block text-retro-charcoal hover:text-retro-teal transition-colors duration-200 font-medium uppercase tracking-wide cursor-pointer" data-testid="mobile-link-cart">
                    Cart {cartItemCount > 0 && `(${cartItemCount})`}
                  </span>
                </Link>
              )}

              {user ? (
                <>
                  <Link href="/profile" onClick={closeMobileMenu}>
                    <span className="block text-retro-charcoal hover:text-retro-teal transition-colors duration-200 font-medium uppercase tracking-wide cursor-pointer" data-testid="mobile-link-profile">
                      Profile
                    </span>
                  </Link>
                  
                  {user.isAdmin === 1 && (
                    <Link href="/admin" onClick={closeMobileMenu}>
                      <span className="block text-retro-charcoal hover:text-retro-teal transition-colors duration-200 font-medium uppercase tracking-wide cursor-pointer" data-testid="mobile-link-admin">
                        Admin
                      </span>
                    </Link>
                  )}
                </>
              ) : (
                <Link href="/auth" onClick={closeMobileMenu}>
                  <Button className="retro-button bg-retro-mustard hover:bg-retro-mustard-dark text-retro-charcoal px-6 py-2 font-bold w-full" data-testid="mobile-button-login">
                    LOGIN
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div 
            className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
            onClick={closeMobileMenu}
          />
        )}
      </nav>
    </header>
  );
}
