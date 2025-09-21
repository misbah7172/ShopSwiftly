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
    ? "bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 group cursor-pointer overflow-hidden"
    : "bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 group cursor-pointer overflow-hidden";

  const imageClasses = featured
    ? "w-full h-56 object-cover"
    : "w-full h-48 object-cover";

  return (
    <Link href={`/product/${product.id}`}>
      <div 
        className={cardClasses}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        data-testid={`product-card-${product.id}`}
      >
        {/* Product Image */}
        <div className="relative overflow-hidden bg-gray-100">
          <img 
            src={product.imageUrl} 
            alt={product.name}
            className={`${imageClasses} transition-transform duration-300 ${isHovered ? 'scale-105' : 'scale-100'}`}
            data-testid={`img-product-${product.id}`}
          />
          
          {/* Stock badge */}
          {product.stock === 0 && (
            <Badge className="absolute top-3 right-3 bg-red-500 text-white font-medium px-2 py-1 text-xs rounded-md">
              Out of Stock
            </Badge>
          )}
        </div>
        
        {/* Product Info */}
        <div className={`p-4 ${featured ? 'space-y-3' : 'space-y-2'}`}>
          <h3 className={`font-heading font-semibold text-gray-900 ${featured ? 'text-lg' : 'text-base'} line-clamp-2`} data-testid={`text-name-${product.id}`}>
            {product.name}
          </h3>
          
          <p className={`text-gray-600 font-body ${featured ? 'text-sm' : 'text-xs'} line-clamp-2`} data-testid={`text-description-${product.id}`}>
            {product.description}
          </p>
          
          <div className="flex items-center justify-between pt-2">
            <span className={`font-heading font-bold text-gray-900 ${featured ? 'text-xl' : 'text-lg'}`} data-testid={`text-price-${product.id}`}>
              ${product.price}
            </span>
            {featured && (
              <span className="text-sm text-gray-500 font-body" data-testid={`text-stock-${product.id}`}>
                {product.stock} in stock
              </span>
            )}
          </div>
          
          {/* Add to Cart Button */}
          <Button
            className={`w-full font-medium transition-all duration-200 mt-3 ${
              product.stock === 0 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-md'
            } ${featured ? 'py-3' : 'py-2'} rounded-lg`}
            disabled={product.stock === 0 || !user || addToCartMutation.isPending}
            onClick={handleAddToCart}
            data-testid={`button-add-to-cart-${product.id}`}
          >
            {addToCartMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Adding...
              </>
            ) : product.stock === 0 ? (
              'Out of Stock'
            ) : !user ? (
              'Sign In to Purchase'
            ) : (
              <>
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add to Cart
              </>
            )}
          </Button>
        </div>
      </div>
    </Link>
  );
}
