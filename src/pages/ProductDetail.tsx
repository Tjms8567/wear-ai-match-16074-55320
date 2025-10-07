import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '@/integrations/supabase/client';
import { useCart } from '@/contexts/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ShoppingCart, Heart, Share2 } from 'lucide-react';
import { toast } from 'sonner';

interface Product {
  id: string;
  title: string;
  description: string | null;
  product_type: string;
  gender: string;
  base_price: number;
  images: string[];
  ai_tags: string[];
}

interface Variant {
  id: string;
  size: string;
  color_name: string;
  color_hex: string;
  stock_quantity: number;
}

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      if (!isSupabaseConfigured || !supabase) {
        setLoading(false);
        return;
      }
      try {
        const { data: productData, error: productError } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();

        if (productError) throw productError;

        const { data: variantsData, error: variantsError } = await supabase
          .from('product_variants')
          .select('*')
          .eq('product_id', id)
          .gt('stock_quantity', 0);

        if (variantsError) throw variantsError;

        setProduct(productData);
        setVariants(variantsData || []);
        
        if (variantsData && variantsData.length > 0) {
          setSelectedSize(variantsData[0].size);
          setSelectedColor(variantsData[0].color_name);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        toast.error('Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    const selectedVariant = variants.find(
      (v) => v.size === selectedSize && v.color_name === selectedColor
    );

    if (!selectedVariant) {
      toast.error('Please select size and color');
      return;
    }

    setAdding(true);
    try {
      await addToCart(product!.id, selectedVariant.id, 1);
    } finally {
      setAdding(false);
    }
  };

  const availableSizes = [...new Set(variants.map((v) => v.size))];
  const availableColors = variants
    .filter((v) => v.size === selectedSize)
    .map((v) => ({ name: v.color_name, hex: v.color_hex }));

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-12 flex items-center justify-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    if (!isSupabaseConfigured) {
      return (
        <div className="min-h-screen bg-background">
          <Header />
          <div className="container py-12 text-center">
            <h1 className="text-2xl font-bold mb-4">Cloud Backend Not Configured</h1>
            <p className="text-muted-foreground mb-6">
              Product details require Cloud to be enabled. Please enable Cloud in your project settings.
            </p>
            <Button onClick={() => navigate('/products')}>Back to Products</Button>
          </div>
          <Footer />
        </div>
      );
    }
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <Button onClick={() => navigate('/products')}>Browse Products</Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container px-4 py-8 md:py-12">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          <div className="space-y-4">
            <div className="aspect-square rounded-lg overflow-hidden border">
              <img
                src={product.images[selectedImage] || 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab'}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === idx ? 'border-primary' : 'border-transparent'
                    }`}
                  >
                    <img src={img} alt={`${product.title} ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary">{product.product_type}</Badge>
                <Badge variant="outline">{product.gender}</Badge>
              </div>
              <h1 className="font-display text-3xl font-bold mb-2">{product.title}</h1>
              <p className="text-2xl font-bold text-primary">${product.base_price.toFixed(2)}</p>
            </div>

            {product.description && (
              <p className="text-muted-foreground">{product.description}</p>
            )}

            <div className="space-y-4">
              <div>
                <Label className="text-base font-semibold mb-3 block">Select Size</Label>
                <RadioGroup value={selectedSize} onValueChange={setSelectedSize}>
                  <div className="grid grid-cols-4 gap-2">
                    {availableSizes.map((size) => (
                      <div key={size}>
                        <RadioGroupItem value={size} id={`size-${size}`} className="peer sr-only" />
                        <Label
                          htmlFor={`size-${size}`}
                          className="flex items-center justify-center rounded-md border-2 border-muted bg-background px-3 py-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary cursor-pointer"
                        >
                          {size}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label className="text-base font-semibold mb-3 block">Select Color</Label>
                <RadioGroup value={selectedColor} onValueChange={setSelectedColor}>
                  <div className="flex flex-wrap gap-2">
                    {availableColors.map((color) => (
                      <div key={color.name}>
                        <RadioGroupItem value={color.name} id={`color-${color.name}`} className="peer sr-only" />
                        <Label
                          htmlFor={`color-${color.name}`}
                          className="flex items-center gap-2 rounded-md border-2 border-muted bg-background px-4 py-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary cursor-pointer"
                        >
                          <div
                            className="w-4 h-4 rounded-full border"
                            style={{ backgroundColor: color.hex }}
                          />
                          {color.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                className="flex-1"
                size="lg"
                onClick={handleAddToCart}
                disabled={adding || !selectedSize || !selectedColor}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                {adding ? 'Adding...' : 'Add to Cart'}
              </Button>
              <Button variant="outline" size="lg">
                <Heart className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>

            {product.ai_tags.length > 0 && (
              <Card className="p-4">
                <h3 className="font-semibold mb-2">Style Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {product.ai_tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </Card>
            )}

            <Card className="p-4 space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="font-semibold">🚚</span>
                <span>Free shipping on orders over $50</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">🔄</span>
                <span>30-day return policy</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">💳</span>
                <span>Secure payment processing</span>
              </div>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;
