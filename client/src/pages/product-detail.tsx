import { useQuery, useMutation } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Product } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, ShoppingCart, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function ProductDetail() {
  const [, params] = useRoute("/product/:id");
  const { user } = useAuth();
  const productId = params?.id;

  const { data: product, isLoading } = useQuery<Product>({
    queryKey: ["/api/products", productId],
    enabled: !!productId,
  });

  const addToCartMutation = useMutation({
    mutationFn: async (productId: string) => {
      const res = await apiRequest("POST", "/api/cart", {
        productId,
        quantity: 1,
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
    },
  });

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

  if (!product) {
    return (
      <div className="min-h-screen bg-retro-cream">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="font-retro text-2xl text-retro-charcoal mb-4">
            PRODUCT NOT FOUND
          </h1>
          <Link href="/">
            <Button className="retro-button bg-retro-teal hover:bg-retro-teal-dark text-retro-charcoal px-6 py-3 font-bold">
              <ArrowLeft className="w-4 h-4 mr-2" />
              BACK TO SHOP
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (user && productId) {
      addToCartMutation.mutate(productId);
    }
  };

  return (
    <div className="min-h-screen bg-retro-cream">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <Link href="/">
          <Button 
            variant="ghost" 
            className="mb-6 text-retro-charcoal hover:text-retro-teal"
            data-testid="button-back"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Shop
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="product-card bg-retro-cream p-6 retro-shadow">
            <img 
              src={product.imageUrl} 
              alt={product.name}
              className="w-full h-96 object-cover border-2 border-retro-charcoal"
              data-testid="img-product"
            />
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <Badge 
                className="bg-retro-mustard text-retro-charcoal mb-4 font-bold uppercase"
                data-testid="text-category"
              >
                {product.category}
              </Badge>
              <h1 className="font-retro text-3xl text-retro-charcoal mb-4" data-testid="text-product-name">
                {product.name}
              </h1>
              <p className="text-lg text-retro-charcoal opacity-80 leading-relaxed" data-testid="text-description">
                {product.description}
              </p>
            </div>

            <div className="flex items-center justify-between">
              <span className="font-retro text-3xl text-retro-teal" data-testid="text-price">
                ${product.price}
              </span>
              <span 
                className={`text-sm font-bold ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}
                data-testid="text-stock"
              >
                {product.stock > 0 ? `In Stock: ${product.stock}` : 'Out of Stock'}
              </span>
            </div>

            <div className="space-y-4">
              <Button
                className="retro-button bg-retro-pink hover:bg-retro-pink-dark text-white px-8 py-4 text-lg font-bold w-full"
                disabled={product.stock === 0 || !user || addToCartMutation.isPending}
                onClick={handleAddToCart}
                data-testid="button-add-to-cart"
              >
                {addToCartMutation.isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    ADDING TO CART...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    {product.stock === 0 ? 'OUT OF STOCK' : user ? 'ADD TO CART' : 'LOGIN TO PURCHASE'}
                  </>
                )}
              </Button>
              
              {!user && (
                <p className="text-center text-retro-charcoal opacity-70">
                  <Link href="/auth" className="text-retro-teal font-bold hover:text-retro-teal-dark">
                    Sign in
                  </Link> to add items to your cart
                </p>
              )}
            </div>

            {/* Product Details */}
            <div className="bg-retro-muted p-6 border-2 border-retro-charcoal">
              <h3 className="font-bold text-retro-charcoal mb-4 uppercase tracking-wide">
                Product Details
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Category:</span>
                  <span className="capitalize">{product.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Stock:</span>
                  <span>{product.stock} units</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Added:</span>
                  <span>{new Date(product.createdAt!).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
