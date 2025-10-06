import ProductCard from "./ProductCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

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
];

const FeaturedProducts = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="container px-4">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">
              Trending Products
            </h2>
            <p className="text-muted-foreground text-lg">
              Discover our most popular AI-matched clothing
            </p>
          </div>
          <Link to="/products">
            <Button variant="outline" className="hidden md:flex group">
              View All
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {MOCK_PRODUCTS.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>

        <div className="mt-8 flex justify-center md:hidden">
          <Link to="/products">
            <Button variant="outline" className="group">
              View All Products
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
