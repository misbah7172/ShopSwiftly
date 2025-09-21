import { useQuery } from "@tanstack/react-query";
import { Order, OrderItem, Product } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, User, Package, Calendar } from "lucide-react";

type OrderWithItems = Order & { 
  orderItems: (OrderItem & { product: Product })[] 
};

export default function ProfilePage() {
  const { user, logoutMutation } = useAuth();

  const { data: orders, isLoading } = useQuery<OrderWithItems[]>({
    queryKey: ["/api/orders"],
    enabled: !!user,
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

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
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="font-retro text-2xl md:text-4xl text-retro-charcoal mb-4">
            YOUR PROFILE
          </h1>
          <div className="w-24 h-1 bg-retro-teal mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* User Info */}
          <Card className="border-2 border-retro-charcoal retro-shadow bg-retro-cream">
            <CardHeader>
              <CardTitle className="font-retro text-xl text-retro-charcoal flex items-center gap-2">
                <User className="w-5 h-5" />
                USER INFO
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-retro-charcoal font-bold mb-1 uppercase tracking-wide text-sm">
                  Username
                </label>
                <p className="text-retro-charcoal" data-testid="text-username">
                  {user?.username}
                </p>
              </div>
              <div>
                <label className="block text-retro-charcoal font-bold mb-1 uppercase tracking-wide text-sm">
                  Email
                </label>
                <p className="text-retro-charcoal" data-testid="text-email">
                  {user?.email}
                </p>
              </div>
              <div>
                <label className="block text-retro-charcoal font-bold mb-1 uppercase tracking-wide text-sm">
                  Member Since
                </label>
                <p className="text-retro-charcoal" data-testid="text-member-since">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </p>
              </div>
              {user?.isAdmin === 1 && (
                <Badge className="bg-retro-mustard text-retro-charcoal font-bold">
                  ADMIN
                </Badge>
              )}
              <div className="pt-4">
                <Button
                  onClick={handleLogout}
                  className="retro-button bg-retro-pink hover:bg-retro-pink-dark text-white w-full py-2 font-bold"
                  disabled={logoutMutation.isPending}
                  data-testid="button-logout"
                >
                  {logoutMutation.isPending ? "LOGGING OUT..." : "LOGOUT"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Order History */}
          <div className="lg:col-span-2">
            <Card className="border-2 border-retro-charcoal retro-shadow bg-retro-cream">
              <CardHeader>
                <CardTitle className="font-retro text-xl text-retro-charcoal flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  ORDER HISTORY
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!orders || orders.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="w-12 h-12 text-retro-charcoal opacity-50 mx-auto mb-4" />
                    <p className="text-retro-charcoal opacity-80" data-testid="text-no-orders">
                      No orders yet. Start shopping to see your order history!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div 
                        key={order.id} 
                        className="border border-retro-charcoal border-opacity-30 p-4 bg-retro-muted"
                        data-testid={`order-${order.id}`}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Calendar className="w-4 h-4 text-retro-charcoal" />
                              <span className="text-sm text-retro-charcoal opacity-80">
                                {new Date(order.createdAt!).toLocaleDateString()}
                              </span>
                            </div>
                            <Badge 
                              className={`${
                                order.status === 'pending' 
                                  ? 'bg-retro-mustard text-retro-charcoal' 
                                  : 'bg-retro-teal text-retro-charcoal'
                              } font-bold`}
                              data-testid={`status-${order.id}`}
                            >
                              {order.status.toUpperCase()}
                            </Badge>
                          </div>
                          <span 
                            className="font-retro text-retro-teal text-lg"
                            data-testid={`total-${order.id}`}
                          >
                            ${order.totalAmount}
                          </span>
                        </div>
                        
                        <div className="space-y-2">
                          {order.orderItems.map((item) => (
                            <div 
                              key={item.id} 
                              className="flex items-center gap-3 text-sm"
                              data-testid={`item-${item.id}`}
                            >
                              <img 
                                src={item.product.imageUrl} 
                                alt={item.product.name}
                                className="w-10 h-10 object-cover border border-retro-charcoal"
                              />
                              <span className="flex-1 text-retro-charcoal">
                                {item.product.name} × {item.quantity}
                              </span>
                              <span className="text-retro-teal font-bold">
                                ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
