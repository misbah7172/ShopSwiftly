import { useQuery } from "@tanstack/react-query";
import { Product } from "@shared/schema";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ProductCard from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const filteredProducts = products?.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = category === "all" || product.category === category;
    return matchesSearch && matchesCategory;
  }) || [];

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return parseFloat(a.price) - parseFloat(b.price);
      case "price-high":
        return parseFloat(b.price) - parseFloat(a.price);
      case "newest":
      default:
        return new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime();
    }
  });

  const featuredProducts = sortedProducts.slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen flex items-center justify-center">
        <div className="absolute inset-0 bg-white/50"></div>
        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-heading font-bold text-gray-900 mb-6 leading-tight">
              Discover Premium
              <span className="block text-blue-600">Products</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-12 font-body leading-relaxed max-w-2xl mx-auto">
              Shop the latest collection of high-quality products with exceptional design and unmatched performance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-medium rounded-lg transition-all duration-200 hover:shadow-lg hover:-translate-y-1"
                onClick={() => window.location.href = '/shop'}
              >
                Shop Now
              </Button>
              <Button 
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-4 text-lg font-medium rounded-lg transition-all duration-200"
                onClick={() => document.getElementById('featured')?.scrollIntoView({ behavior: 'smooth' })}
              >
                View Featured
              </Button>
            </div>
          </div>
        </div>
        
        {/* Hero Image/Visual Element */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
          <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-bounce"></div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section id="featured" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-6">
              Featured Products
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-body">
              Handpicked selection of our most popular and highest-rated products
            </p>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              <span className="ml-3 text-gray-600 font-body">Loading featured products...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.map((product) => (
                <div key={product.id} className="group">
                  <ProductCard product={product} featured={true} />
                </div>
              ))}
            </div>
          )}
          
          <div className="text-center mt-12">
            <Button 
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-medium rounded-lg transition-all duration-200 hover:shadow-lg"
              onClick={() => window.location.href = '/shop'}
            >
              View All Products
            </Button>
          </div>
        </div>
      </section>
              FEATURED ITEMS
            </h2>
            <div className="w-24 h-1 bg-retro-teal mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-retro-cream p-6 retro-shadow border-2 border-retro-charcoal">
                  <div className="w-full h-48 bg-retro-muted animate-pulse mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-retro-muted animate-pulse rounded"></div>
                    <div className="h-3 bg-retro-muted animate-pulse rounded w-3/4"></div>
                    <div className="h-4 bg-retro-muted animate-pulse rounded w-1/2"></div>
                  </div>
                </div>
              ))
            ) : (
              featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} featured />
              ))
            )}
          </div>
        </div>
      </section>

      {/* Product Catalog */}
      <section id="shop" className="py-16 bg-retro-cream">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-retro text-2xl md:text-4xl text-retro-charcoal mb-4">
              ALL PRODUCTS
            </h2>
            <p className="text-retro-charcoal opacity-80 max-w-2xl mx-auto">
              Browse our complete collection of retro treasures and vintage finds
            </p>
          </div>

          {/* Filter and Search Bar */}
          <div className="flex flex-col md:flex-row gap-4 mb-8 max-w-4xl mx-auto">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 border-2 border-retro-charcoal bg-retro-cream focus:outline-none focus:border-retro-teal transition-colors"
                data-testid="input-search"
              />
            </div>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="px-4 py-3 border-2 border-retro-charcoal bg-retro-cream focus:outline-none focus:border-retro-teal transition-colors" data-testid="select-category">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="electronics">Electronics</SelectItem>
                <SelectItem value="accessories">Accessories</SelectItem>
                <SelectItem value="games">Games</SelectItem>
                <SelectItem value="decor">Decor</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="px-4 py-3 border-2 border-retro-charcoal bg-retro-cream focus:outline-none focus:border-retro-teal transition-colors" data-testid="select-sort">
                <SelectValue placeholder="Sort by Price" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {isLoading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-retro-cream p-4 retro-shadow border-2 border-retro-charcoal">
                  <div className="w-full h-40 bg-retro-muted animate-pulse mb-3"></div>
                  <div className="h-4 bg-retro-muted animate-pulse rounded mb-1"></div>
                  <div className="h-3 bg-retro-muted animate-pulse rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-retro-muted animate-pulse rounded w-1/2"></div>
                </div>
              ))
            ) : sortedProducts.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-retro-charcoal opacity-70 text-lg" data-testid="text-no-products">
                  No products found matching your criteria.
                </p>
              </div>
            ) : (
              sortedProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))
            )}
          </div>

          {!isLoading && sortedProducts.length > 0 && sortedProducts.length >= 12 && (
            <div className="text-center mt-12">
              <Button 
                className="retro-button bg-retro-teal hover:bg-retro-teal-dark text-retro-charcoal px-8 py-3 font-bold"
                data-testid="button-load-more"
              >
                LOAD MORE PRODUCTS
              </Button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
