import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Filter } from "lucide-react";
import { toast } from "sonner";

const MOCK_PRODUCTS = [
  {
    id: "1",
    name: "Classic White T-Shirt",
    price: 29.99,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80",
    category: "T-Shirt",
    colors: ["#FFFFFF", "#000000", "#87CEEB", "#FFB6C1"],
  },
  {
    id: "2",
    name: "Urban Hoodie",
    price: 59.99,
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&q=80",
    category: "Hoodie",
    colors: ["#000000", "#87CEEB", "#808080"],
  },
  {
    id: "3",
    name: "Kids Fun Tee",
    price: 24.99,
    image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=500&q=80",
    category: "Kids T-Shirt",
    colors: ["#FFB6C1", "#87CEEB", "#FFFF00", "#90EE90"],
  },
  {
    id: "4",
    name: "Premium Sweatshirt",
    price: 49.99,
    image: "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=500&q=80",
    category: "Sweatshirt",
    colors: ["#000000", "#FFFFFF", "#87CEEB"],
  },
  {
    id: "5",
    name: "Long Sleeve Essential",
    price: 34.99,
    image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=500&q=80",
    category: "Long Sleeve",
    colors: ["#FFFFFF", "#000000", "#C0C0C0"],
  },
  {
    id: "6",
    name: "Athletic Tank Top",
    price: 24.99,
    image: "https://images.unsplash.com/photo-1622445275576-721325763afe?w=500&q=80",
    category: "Tank Top",
    colors: ["#000000", "#FFFFFF", "#87CEEB", "#FF6B6B"],
  },
  {
    id: "7",
    name: "Cozy Crop Top",
    price: 27.99,
    image: "https://images.unsplash.com/photo-1624206112918-1e0b0faef2cb?w=500&q=80",
    category: "Crop Top",
    colors: ["#FFB6C1", "#87CEEB", "#FFFFFF"],
  },
  {
    id: "8",
    name: "Premium Socks Set",
    price: 14.99,
    image: "https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=500&q=80",
    category: "Socks",
    colors: ["#000000", "#FFFFFF", "#87CEEB", "#FF69B4"],
  },
  {
    id: "9",
    name: "Kids Colorful Hoodie",
    price: 44.99,
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&q=80",
    category: "Kids Hoodie",
    colors: ["#FFB6C1", "#87CEEB", "#90EE90"],
  },
  {
    id: "10",
    name: "Kids Long Sleeve",
    price: 29.99,
    image: "https://images.unsplash.com/photo-1503342394128-c104d54dba01?w=500&q=80",
    category: "Kids Long Sleeve",
    colors: ["#FF6B6B", "#87CEEB", "#FFFF00"],
  },
  {
    id: "11",
    name: "Performance T-Shirt",
    price: 32.99,
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500&q=80",
    category: "T-Shirt",
    colors: ["#87CEEB", "#000000", "#808080"],
  },
  {
    id: "12",
    name: "Comfort Sweatshirt",
    price: 54.99,
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&q=80",
    category: "Sweatshirt",
    colors: ["#FFFFFF", "#FFB6C1", "#87CEEB"],
  },
];

interface Product {
  id: string;
  title: string;
  base_price: number;
  images: string[];
  product_type: string;
  gender: string;
}

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let query = supabase.from('products').select('*').eq('active', true);
        
        if (filter !== 'all') {
          query = query.eq('gender', filter === 'unisex' ? 'Unisex' : filter === 'mens' ? 'Mens' : 'Kids');
        }

        const { data, error } = await query;
        if (error) throw error;
        setProducts(data || []);
      } catch (error) {
        console.error('Error fetching products:', error);
        toast.error('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filter]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container px-4 py-8 md:py-12">
        <div className="mb-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-3">
            All Products
          </h1>
          <p className="text-muted-foreground">
            Browse our complete collection of AI-matched apparel
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <Tabs value={filter} onValueChange={setFilter} className="w-full">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="unisex">Unisex</TabsTrigger>
                <TabsTrigger value="mens">Men's</TabsTrigger>
                <TabsTrigger value="kids">Kids</TabsTrigger>
              </TabsList>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filters
              </Button>
            </div>
          </Tabs>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.title}
                price={product.base_price}
                image={product.images[0] || 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab'}
                category={product.product_type}
                colors={['#000000', '#FFFFFF', '#87CEEB']}
              />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Products;
