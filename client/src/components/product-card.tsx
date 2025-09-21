import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { Product } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Loader2 } from "lucide-react";

interface ProductCardProps {
  product: Product;
  featured?: boolean;
}

export default function ProductCard({ product, featured = false }: ProductCardProps) {
  const { user } = useAuth();
  const [isHovered, setIsHovered] = useState(false);

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

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (user && product.stock > 0) {
      addToCartMutation.mutate(product.id);
    }
  };

  const cardClasses = featured 
    ? "product-card bg-retro-cream p-6 retro-shadow group cursor-pointer"
    : "product-card bg-retro-cream p-4 retro-shadow group cursor-pointer";

  const imageClasses = featured
    ? "w-full h-48 object-cover mb-4 border-2 border-retro-charcoal"
    : "w-full h-40 object-cover mb-3 border-2 border-retro-charcoal";

  return (
    <Link href={`/product/${product.id}`}>
      <div 
        className={cardClasses}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        data-testid={`product-card-${product.id}`}
      >
        {/* Product Image */}
        <div className="relative overflow-hidden">
          <img 
            src={product.imageUrl} 
            alt={product.name}
            className={`${imageClasses} transition-transform duration-300 ${isHovered ? 'scale-110' : 'scale-100'}`}
            data-testid={`img-product-${product.id}`}
          />
          
          {/* Stock badge */}
          {product.stock === 0 && (
            <Badge className="absolute top-2 right-2 bg-retro-pink text-white font-bold">
              OUT OF STOCK
            </Badge>
          )}
        </div>
        
        <div className={featured ? "space-y-2" : "space-y-1"}>
          <h3 className={`font-bold text-retro-charcoal ${featured ? 'text-lg' : ''}`} data-testid={`text-name-${product.id}`}>
            {product.name}
          </h3>
          
          <p className={`text-retro-charcoal opacity-80 ${featured ? '' : 'text-sm'}`} data-testid={`text-description-${product.id}`}>
            {featured ? product.description : product.description.slice(0, 50) + (product.description.length > 50 ? '...' : '')}
          </p>
          
          <div className="flex items-center justify-between">
            <span className={`font-retro text-retro-teal ${featured ? 'text-lg' : ''}`} data-testid={`text-price-${product.id}`}>
              ${product.price}
            </span>
            {featured && (
              <span className="text-sm text-retro-charcoal" data-testid={`text-stock-${product.id}`}>
                In Stock: {product.stock}
              </span>
            )}
          </div>
        </div>
        
        {/* Add to Cart Button */}
        <Button
          className={`retro-button w-full font-bold transition-opacity duration-300 ${
            featured 
              ? 'bg-retro-mustard hover:bg-retro-mustard-dark text-retro-charcoal mt-4 py-2 opacity-0 group-hover:opacity-100'
              : 'bg-retro-pink hover:bg-retro-pink-dark text-white mt-3 py-2 text-sm opacity-0 group-hover:opacity-100'
          }`}
          disabled={product.stock === 0 || !user || addToCartMutation.isPending}
          onClick={handleAddToCart}
          data-testid={`button-add-to-cart-${product.id}`}
        >
          {addToCartMutation.isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ADDING...
            </>
          ) : product.stock === 0 ? (
            'OUT OF STOCK'
          ) : !user ? (
            'LOGIN TO BUY'
          ) : (
            <>
              <ShoppingCart className="w-4 h-4 mr-2" />
              ADD TO CART
            </>
          )}
        </Button>
      </div>
    </Link>
  );
}
