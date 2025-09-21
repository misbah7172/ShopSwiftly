import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Product, InsertProduct } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Plus, Edit, Trash2, Package } from "lucide-react";
import { useLocation } from "wouter";

export default function AdminPage() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [formData, setFormData] = useState<InsertProduct>({
    name: "",
    description: "",
    price: "0.00",
    stock: 0,
    imageUrl: "",
    category: "electronics",
  });

  // Redirect if not admin
  if (!user || !user.isAdmin) {
    setLocation("/");
    return null;
  }

  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const createProductMutation = useMutation({
    mutationFn: async (product: InsertProduct) => {
      const res = await apiRequest("POST", "/api/products", product);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      setIsDialogOpen(false);
      resetForm();
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: async ({ id, product }: { id: string; product: Partial<InsertProduct> }) => {
      const res = await apiRequest("PUT", `/api/products/${id}`, product);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      setIsDialogOpen(false);
      resetForm();
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "0.00",
      stock: 0,
      imageUrl: "",
      category: "electronics",
    });
    setEditingProduct(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingProduct) {
      updateProductMutation.mutate({ id: editingProduct.id, product: formData });
    } else {
      createProductMutation.mutate(formData);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      imageUrl: product.imageUrl,
      category: product.category,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      deleteProductMutation.mutate(id);
    }
  };

  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-retro-cream">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="font-retro text-2xl md:text-4xl text-retro-charcoal mb-4">
            ADMIN PANEL
          </h1>
          <div className="w-24 h-1 bg-retro-teal mx-auto"></div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-2 border-retro-charcoal retro-shadow bg-retro-cream">
            <CardContent className="p-6 text-center">
              <Package className="w-8 h-8 text-retro-teal mx-auto mb-2" />
              <h3 className="font-retro text-lg text-retro-charcoal">TOTAL PRODUCTS</h3>
              <p className="text-2xl font-bold text-retro-charcoal" data-testid="text-total-products">
                {products?.length || 0}
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-2 border-retro-charcoal retro-shadow bg-retro-cream">
            <CardContent className="p-6 text-center">
              <Package className="w-8 h-8 text-retro-mustard mx-auto mb-2" />
              <h3 className="font-retro text-lg text-retro-charcoal">IN STOCK</h3>
              <p className="text-2xl font-bold text-retro-charcoal" data-testid="text-in-stock">
                {products?.filter(p => p.stock > 0).length || 0}
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-2 border-retro-charcoal retro-shadow bg-retro-cream">
            <CardContent className="p-6 text-center">
              <Package className="w-8 h-8 text-retro-pink mx-auto mb-2" />
              <h3 className="font-retro text-lg text-retro-charcoal">OUT OF STOCK</h3>
              <p className="text-2xl font-bold text-retro-charcoal" data-testid="text-out-of-stock">
                {products?.filter(p => p.stock === 0).length || 0}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Add Product Button */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-retro text-xl text-retro-charcoal">PRODUCT MANAGEMENT</h2>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                onClick={openCreateDialog}
                className="retro-button bg-retro-teal hover:bg-retro-teal-dark text-retro-charcoal px-6 py-3 font-bold"
                data-testid="button-add-product"
              >
                <Plus className="w-4 h-4 mr-2" />
                ADD PRODUCT
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl bg-retro-cream border-2 border-retro-charcoal">
              <DialogHeader>
                <DialogTitle className="font-retro text-retro-charcoal">
                  {editingProduct ? "EDIT PRODUCT" : "ADD NEW PRODUCT"}
                </DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="block text-retro-charcoal font-bold mb-2 uppercase tracking-wide">
                      Product Name
                    </Label>
                    <Input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-retro-charcoal bg-retro-cream focus:outline-none focus:border-retro-teal transition-colors"
                      required
                      data-testid="input-product-name"
                    />
                  </div>
                  
                  <div>
                    <Label className="block text-retro-charcoal font-bold mb-2 uppercase tracking-wide">
                      Category
                    </Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                      <SelectTrigger className="px-4 py-3 border-2 border-retro-charcoal bg-retro-cream focus:outline-none focus:border-retro-teal transition-colors" data-testid="select-category">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="electronics">Electronics</SelectItem>
                        <SelectItem value="accessories">Accessories</SelectItem>
                        <SelectItem value="games">Games</SelectItem>
                        <SelectItem value="decor">Decor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label className="block text-retro-charcoal font-bold mb-2 uppercase tracking-wide">
                    Description
                  </Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-4 py-3 border-2 border-retro-charcoal bg-retro-cream focus:outline-none focus:border-retro-teal transition-colors"
                    rows={3}
                    required
                    data-testid="input-description"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="block text-retro-charcoal font-bold mb-2 uppercase tracking-wide">
                      Price ($)
                    </Label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.price}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-retro-charcoal bg-retro-cream focus:outline-none focus:border-retro-teal transition-colors"
                      required
                      data-testid="input-price"
                    />
                  </div>
                  
                  <div>
                    <Label className="block text-retro-charcoal font-bold mb-2 uppercase tracking-wide">
                      Stock
                    </Label>
                    <Input
                      type="number"
                      min="0"
                      value={formData.stock}
                      onChange={(e) => setFormData(prev => ({ ...prev, stock: parseInt(e.target.value) || 0 }))}
                      className="w-full px-4 py-3 border-2 border-retro-charcoal bg-retro-cream focus:outline-none focus:border-retro-teal transition-colors"
                      required
                      data-testid="input-stock"
                    />
                  </div>
                </div>

                <div>
                  <Label className="block text-retro-charcoal font-bold mb-2 uppercase tracking-wide">
                    Image URL
                  </Label>
                  <Input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                    className="w-full px-4 py-3 border-2 border-retro-charcoal bg-retro-cream focus:outline-none focus:border-retro-teal transition-colors"
                    required
                    data-testid="input-image-url"
                  />
                </div>

                <div className="flex gap-4">
                  <Button
                    type="button"
                    onClick={() => setIsDialogOpen(false)}
                    className="retro-button bg-retro-pink hover:bg-retro-pink-dark text-white px-6 py-3 font-bold flex-1"
                    data-testid="button-cancel"
                  >
                    CANCEL
                  </Button>
                  <Button
                    type="submit"
                    className="retro-button bg-retro-teal hover:bg-retro-teal-dark text-retro-charcoal px-6 py-3 font-bold flex-1"
                    disabled={createProductMutation.isPending || updateProductMutation.isPending}
                    data-testid="button-save-product"
                  >
                    {(createProductMutation.isPending || updateProductMutation.isPending) ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        SAVING...
                      </>
                    ) : (
                      editingProduct ? "UPDATE PRODUCT" : "CREATE PRODUCT"
                    )}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Products Table */}
        <Card className="border-2 border-retro-charcoal retro-shadow bg-retro-cream">
          <CardContent className="p-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-retro-teal" />
              </div>
            ) : !products || products.length === 0 ? (
              <div className="text-center py-8">
                <Package className="w-12 h-12 text-retro-charcoal opacity-50 mx-auto mb-4" />
                <p className="text-retro-charcoal opacity-80" data-testid="text-no-products">
                  No products found. Add your first product to get started!
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-retro-charcoal">
                      <th className="text-left py-3 font-retro text-retro-charcoal uppercase tracking-wide">Image</th>
                      <th className="text-left py-3 font-retro text-retro-charcoal uppercase tracking-wide">Name</th>
                      <th className="text-left py-3 font-retro text-retro-charcoal uppercase tracking-wide">Category</th>
                      <th className="text-left py-3 font-retro text-retro-charcoal uppercase tracking-wide">Price</th>
                      <th className="text-left py-3 font-retro text-retro-charcoal uppercase tracking-wide">Stock</th>
                      <th className="text-left py-3 font-retro text-retro-charcoal uppercase tracking-wide">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product, index) => (
                      <tr 
                        key={product.id} 
                        className={`border-b border-retro-charcoal border-opacity-20 ${index % 2 === 0 ? 'bg-retro-muted bg-opacity-30' : ''}`}
                        data-testid={`product-row-${product.id}`}
                      >
                        <td className="py-3">
                          <img 
                            src={product.imageUrl} 
                            alt={product.name}
                            className="w-12 h-12 object-cover border border-retro-charcoal"
                          />
                        </td>
                        <td className="py-3 font-bold text-retro-charcoal" data-testid={`product-name-${product.id}`}>
                          {product.name}
                        </td>
                        <td className="py-3 text-retro-charcoal capitalize" data-testid={`product-category-${product.id}`}>
                          {product.category}
                        </td>
                        <td className="py-3 font-retro text-retro-teal" data-testid={`product-price-${product.id}`}>
                          ${product.price}
                        </td>
                        <td className="py-3 text-retro-charcoal" data-testid={`product-stock-${product.id}`}>
                          <span className={product.stock === 0 ? 'text-red-600 font-bold' : ''}>
                            {product.stock}
                          </span>
                        </td>
                        <td className="py-3">
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleEdit(product)}
                              className="retro-button bg-retro-mustard hover:bg-retro-mustard-dark text-retro-charcoal px-3 py-1 font-bold"
                              data-testid={`button-edit-${product.id}`}
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleDelete(product.id)}
                              className="retro-button bg-retro-pink hover:bg-retro-pink-dark text-white px-3 py-1 font-bold"
                              disabled={deleteProductMutation.isPending}
                              data-testid={`button-delete-${product.id}`}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
