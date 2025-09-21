import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Cart, Product } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CreditCard, CheckCircle } from "lucide-react";
import { useLocation } from "wouter";

type CartItemWithProduct = Cart & { product: Product };

export default function CheckoutPage() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [orderPlaced, setOrderPlaced] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: user?.email || "",
    address: "",
    city: "",
    zipCode: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  const { data: cartItems, isLoading } = useQuery<CartItemWithProduct[]>({
    queryKey: ["/api/cart"],
    enabled: !!user,
  });

  const placeOrderMutation = useMutation({
    mutationFn: async (orderData: any) => {
      const res = await apiRequest("POST", "/api/orders", orderData);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      setOrderPlaced(true);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!cartItems || cartItems.length === 0) return;

    const orderItems = cartItems.map(item => ({
      productId: item.productId,
      quantity: item.quantity,
      price: item.product.price,
    }));

    placeOrderMutation.mutate({ items: orderItems });
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

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-retro-cream">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="font-retro text-2xl text-retro-charcoal mb-4">
            NO ITEMS TO CHECKOUT
          </h1>
          <Button 
            onClick={() => setLocation("/")}
            className="retro-button bg-retro-teal hover:bg-retro-teal-dark text-retro-charcoal px-8 py-3 font-bold"
          >
            START SHOPPING
          </Button>
        </div>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-retro-cream">
        <Navbar />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center">
            <Card className="border-2 border-retro-charcoal retro-shadow bg-retro-cream">
              <CardContent className="pt-8">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h1 className="font-retro text-2xl text-retro-charcoal mb-4">
                  ORDER PLACED!
                </h1>
                <p className="text-retro-charcoal mb-6">
                  Your retro treasures are on their way! Check your profile for order details.
                </p>
                <div className="space-y-4">
                  <Button 
                    onClick={() => setLocation("/profile")}
                    className="retro-button bg-retro-teal hover:bg-retro-teal-dark text-retro-charcoal px-8 py-3 font-bold w-full"
                    data-testid="button-view-orders"
                  >
                    VIEW YOUR ORDERS
                  </Button>
                  <Button 
                    onClick={() => setLocation("/")}
                    className="retro-button bg-retro-pink hover:bg-retro-pink-dark text-white px-8 py-3 font-bold w-full"
                    data-testid="button-continue-shopping"
                  >
                    CONTINUE SHOPPING
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-retro-cream">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="font-retro text-2xl md:text-4xl text-retro-charcoal mb-4">
            CHECKOUT
          </h1>
          <div className="w-24 h-1 bg-retro-teal mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Checkout Form */}
          <Card className="border-2 border-retro-charcoal retro-shadow bg-retro-cream">
            <CardHeader>
              <CardTitle className="font-retro text-xl text-retro-charcoal">
                SHIPPING & PAYMENT
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-bold text-retro-charcoal uppercase tracking-wide">
                    Shipping Information
                  </h3>
                  
                  <div>
                    <Label className="block text-retro-charcoal font-bold mb-2 uppercase tracking-wide">
                      Full Name
                    </Label>
                    <Input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-retro-charcoal bg-retro-cream focus:outline-none focus:border-retro-teal transition-colors"
                      required
                      data-testid="input-full-name"
                    />
                  </div>

                  <div>
                    <Label className="block text-retro-charcoal font-bold mb-2 uppercase tracking-wide">
                      Email
                    </Label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-retro-charcoal bg-retro-cream focus:outline-none focus:border-retro-teal transition-colors"
                      required
                      data-testid="input-email"
                    />
                  </div>

                  <div>
                    <Label className="block text-retro-charcoal font-bold mb-2 uppercase tracking-wide">
                      Address
                    </Label>
                    <Input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-retro-charcoal bg-retro-cream focus:outline-none focus:border-retro-teal transition-colors"
                      required
                      data-testid="input-address"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="block text-retro-charcoal font-bold mb-2 uppercase tracking-wide">
                        City
                      </Label>
                      <Input
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                        className="w-full px-4 py-3 border-2 border-retro-charcoal bg-retro-cream focus:outline-none focus:border-retro-teal transition-colors"
                        required
                        data-testid="input-city"
                      />
                    </div>
                    <div>
                      <Label className="block text-retro-charcoal font-bold mb-2 uppercase tracking-wide">
                        Zip Code
                      </Label>
                      <Input
                        type="text"
                        value={formData.zipCode}
                        onChange={(e) => setFormData(prev => ({ ...prev, zipCode: e.target.value }))}
                        className="w-full px-4 py-3 border-2 border-retro-charcoal bg-retro-cream focus:outline-none focus:border-retro-teal transition-colors"
                        required
                        data-testid="input-zip"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-bold text-retro-charcoal uppercase tracking-wide">
                    Payment Information
                  </h3>
                  
                  <div>
                    <Label className="block text-retro-charcoal font-bold mb-2 uppercase tracking-wide">
                      Card Number
                    </Label>
                    <Input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      value={formData.cardNumber}
                      onChange={(e) => setFormData(prev => ({ ...prev, cardNumber: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-retro-charcoal bg-retro-cream focus:outline-none focus:border-retro-teal transition-colors"
                      required
                      data-testid="input-card-number"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="block text-retro-charcoal font-bold mb-2 uppercase tracking-wide">
                        Expiry Date
                      </Label>
                      <Input
                        type="text"
                        placeholder="MM/YY"
                        value={formData.expiryDate}
                        onChange={(e) => setFormData(prev => ({ ...prev, expiryDate: e.target.value }))}
                        className="w-full px-4 py-3 border-2 border-retro-charcoal bg-retro-cream focus:outline-none focus:border-retro-teal transition-colors"
                        required
                        data-testid="input-expiry"
                      />
                    </div>
                    <div>
                      <Label className="block text-retro-charcoal font-bold mb-2 uppercase tracking-wide">
                        CVV
                      </Label>
                      <Input
                        type="text"
                        placeholder="123"
                        value={formData.cvv}
                        onChange={(e) => setFormData(prev => ({ ...prev, cvv: e.target.value }))}
                        className="w-full px-4 py-3 border-2 border-retro-charcoal bg-retro-cream focus:outline-none focus:border-retro-teal transition-colors"
                        required
                        data-testid="input-cvv"
                      />
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="retro-button bg-retro-teal hover:bg-retro-teal-dark text-retro-charcoal w-full py-4 font-bold text-lg"
                  disabled={placeOrderMutation.isPending}
                  data-testid="button-place-order"
                >
                  {placeOrderMutation.isPending ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      PLACING ORDER...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5 mr-2" />
                      PLACE ORDER
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card className="border-2 border-retro-charcoal retro-shadow bg-retro-cream">
            <CardHeader>
              <CardTitle className="font-retro text-xl text-retro-charcoal">
                ORDER SUMMARY
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center gap-4 pb-4 border-b border-retro-charcoal border-opacity-20">
                  <img 
                    src={item.product.imageUrl} 
                    alt={item.product.name} 
                    className="w-16 h-16 object-cover border-2 border-retro-charcoal"
                    data-testid={`img-summary-${item.productId}`}
                  />
                  <div className="flex-1">
                    <h4 className="font-bold text-retro-charcoal" data-testid={`text-summary-name-${item.productId}`}>
                      {item.product.name}
                    </h4>
                    <p className="text-retro-charcoal opacity-70">
                      Qty: {item.quantity} × ${item.product.price}
                    </p>
                  </div>
                  <span className="font-retro text-retro-teal" data-testid={`text-summary-total-${item.productId}`}>
                    ${(parseFloat(item.product.price) * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}

              <div className="space-y-2 pt-4">
                <div className="flex justify-between">
                  <span className="font-bold text-retro-charcoal">Subtotal:</span>
                  <span className="font-retro text-retro-teal" data-testid="text-summary-subtotal">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold text-retro-charcoal">Shipping:</span>
                  <span className="font-retro text-retro-charcoal" data-testid="text-summary-shipping">
                    {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="border-t-2 border-retro-charcoal pt-2">
                  <div className="flex justify-between">
                    <span className="font-retro text-retro-charcoal text-xl">Total:</span>
                    <span className="font-retro text-retro-teal text-xl" data-testid="text-summary-total">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}
