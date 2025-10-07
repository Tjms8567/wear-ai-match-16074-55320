import { ShoppingCart, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { Link } from "react-router-dom";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  colors?: string[];
}

const ProductCard = ({ id, name, price, image, category, colors = [] }: ProductCardProps) => {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <Link to={`/product/${id}`}>
      <Card className="group relative overflow-hidden border-2 border-border hover:border-primary transition-all duration-300 hover:shadow-card-hover animate-fade-in cursor-pointer">
        <div className="relative aspect-square overflow-hidden bg-secondary/20">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-3 right-3 bg-background/80 backdrop-blur-sm hover:bg-background"
            onClick={(e) => {
              e.preventDefault();
              setIsLiked(!isLiked);
            }}
          >
            <Heart
              className={`h-5 w-5 transition-colors ${
                isLiked ? "fill-destructive text-destructive" : ""
              }`}
            />
          </Button>
          <div className="absolute bottom-3 left-3">
            <span className="inline-flex items-center rounded-full bg-primary/90 backdrop-blur-sm px-3 py-1 text-xs font-medium text-primary-foreground">
              {category}
            </span>
          </div>
        </div>

        <div className="p-4 space-y-3">
          <div>
            <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
              {name}
            </h3>
            <p className="text-2xl font-display font-bold mt-1">
              ${price.toFixed(2)}
            </p>
          </div>

          {colors.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Colors:</span>
              <div className="flex gap-1">
                {colors.slice(0, 4).map((color, idx) => (
                  <div
                    key={idx}
                    className="w-5 h-5 rounded-full border-2 border-background shadow-sm"
                    style={{ backgroundColor: color }}
                  />
                ))}
                {colors.length > 4 && (
                  <span className="text-xs text-muted-foreground ml-1">
                    +{colors.length - 4}
                  </span>
                )}
              </div>
            </div>
          )}

          <Button 
            className="w-full group/btn" 
            size="sm"
            onClick={(e) => e.preventDefault()}
          >
            <ShoppingCart className="mr-2 h-4 w-4 group-hover/btn:rotate-12 transition-transform" />
            View Details
          </Button>
        </div>
      </Card>
    </Link>
  );
};

export default ProductCard;
