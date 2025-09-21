import { useQuery, useMutation } from "@tanstack/react-query";
import { Cart, Product } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
import { Link } from "wouter";

type CartItemWithProduct = Cart & { product: Product };

export default function CartPage() {
  const { user } = useAuth();

  const { data: cartItems, isLoading } = useQuery<CartItemWithProduct[]>({
    queryKey: ["/api/cart"],
    enabled: !!user,
  });

  const updateCartMutation = useMutation({
    mutationFn: async ({ productId, quantity }: { productId: string; quantity: number }) => {
      const res = await apiRequest("PUT", `/api/cart/${productId}`, { quantity });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
    },
  });

  const removeItemMutation = useMutation({
    mutationFn: async (productId: string) => {
      await apiRequest("DELETE", `/api/cart/${productId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
    },
  });

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    updateCartMutation.mutate({ productId, quantity: newQuantity });
  };

  const handleRemoveItem = (productId: string) => {
    removeItemMutation.mutate(productId);
  };

  const subtotal = cartItems?.reduce((sum, item) => {
    return sum + (parseFloat(item.product.price) * item.quantity);
  }, 0) || 0;

  const shipping = subtotal > 100 ? 0 : 9.99;
  const total = subtotal + shipping;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-retro-cream">
        <Navbar />
        <div className="container mx-auto px-4 py-16 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-retro-teal" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-retro-cream">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="font-retro text-2xl md:text-4xl text-retro-charcoal mb-4">
            SHOPPING CART
          </h1>
          <div className="w-24 h-1 bg-retro-teal mx-auto"></div>
        </div>

        {!cartItems || cartItems.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingBag className="w-16 h-16 text-retro-charcoal opacity-50 mx-auto mb-4" />
            <h2 className="font-retro text-xl text-retro-charcoal mb-4">
              YOUR CART IS EMPTY
            </h2>
            <p className="text-retro-charcoal opacity-80 mb-6">
              Looks like you haven't added any retro treasures yet!
            </p>
            <Link href="/">
              <Button 
                className="retro-button bg-retro-teal hover:bg-retro-teal-dark text-retro-charcoal px-8 py-3 font-bold"
                data-testid="button-continue-shopping"
              >
                START SHOPPING
              </Button>
            </Link>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="space-y-4 mb-8">
              {cartItems.map((item) => (
                <div 
                  key={item.id} 
                  className="bg-retro-cream border-2 border-retro-charcoal p-4 retro-shadow flex flex-col md:flex-row items-center gap-4"
                  data-testid={`cart-item-${item.productId}`}
                >
                  <img 
                    src={item.product.imageUrl} 
                    alt={item.product.name} 
                    className="w-20 h-20 object-cover border-2 border-retro-charcoal"
                    data-testid={`img-product-${item.productId}`}
                  />
                  
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="font-bold text-retro-charcoal" data-testid={`text-name-${item.productId}`}>
                      {item.product.name}
                    </h3>
                    <p className="text-retro-charcoal opacity-70" data-testid={`text-price-${item.productId}`}>
                      ${item.product.price}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Button
                      className="retro-button bg-retro-pink hover:bg-retro-pink-dark text-white w-8 h-8 text-lg font-bold p-0"
                      onClick={() => handleQuantityChange(item.productId, Math.max(0, item.quantity - 1))}
                      disabled={updateCartMutation.isPending}
                      data-testid={`button-decrease-${item.productId}`}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span 
                      className="font-retro text-retro-charcoal w-12 text-center"
                      data-testid={`text-quantity-${item.productId}`}
                    >
                      {item.quantity}
                    </span>
                    <Button
                      className="retro-button bg-retro-teal hover:bg-retro-teal-dark text-retro-charcoal w-8 h-8 text-lg font-bold p-0"
                      onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                      disabled={updateCartMutation.isPending}
                      data-testid={`button-increase-${item.productId}`}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="text-right">
                    <p 
                      className="font-retro text-retro-teal text-lg"
                      data-testid={`text-total-${item.productId}`}
                    >
                      ${(parseFloat(item.product.price) * item.quantity).toFixed(2)}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-retro-pink hover:text-retro-pink-dark font-bold"
                      onClick={() => handleRemoveItem(item.productId)}
                      disabled={removeItemMutation.isPending}
                      data-testid={`button-remove-${item.productId}`}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      REMOVE
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Cart Summary */}
            <div className="bg-retro-cream border-2 border-retro-charcoal p-6 retro-shadow">
              <div className="flex justify-between items-center mb-4">
                <span className="font-bold text-retro-charcoal text-lg">SUBTOTAL:</span>
                <span className="font-retro text-retro-teal text-xl" data-testid="text-subtotal">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="font-bold text-retro-charcoal text-lg">SHIPPING:</span>
                <span className="font-retro text-retro-charcoal text-xl" data-testid="text-shipping">
                  {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              {shipping === 0 && (
                <p className="text-retro-teal text-sm mb-4">
                  🎉 Free shipping on orders over $100!
                </p>
              )}
              <div className="border-t-2 border-retro-charcoal pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="font-retro text-retro-charcoal text-xl">TOTAL:</span>
                  <span className="font-retro text-retro-teal text-2xl" data-testid="text-total">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/" className="flex-1">
                  <Button 
                    className="retro-button bg-retro-pink hover:bg-retro-pink-dark text-white px-6 py-3 font-bold w-full"
                    data-testid="button-continue-shopping"
                  >
                    CONTINUE SHOPPING
                  </Button>
                </Link>
                <Link href="/checkout" className="flex-1">
                  <Button 
                    className="retro-button bg-retro-teal hover:bg-retro-teal-dark text-retro-charcoal px-6 py-3 font-bold w-full"
                    data-testid="button-checkout"
                  >
                    PROCEED TO CHECKOUT
                  </Button>
                </Link>
              </div>
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}
