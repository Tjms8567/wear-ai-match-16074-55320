import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ShoppingBag, Minus, Plus, Trash2 } from "lucide-react";

const Cart = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container px-4 py-8 md:py-12">
        <h1 className="font-display text-3xl md:text-4xl font-bold mb-8">
          Shopping Cart
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <Card className="p-6 flex flex-col items-center justify-center gap-4 min-h-[400px]">
              <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center">
                <ShoppingBag className="w-10 h-10 text-muted-foreground" />
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-lg mb-2">Your cart is empty</h3>
                <p className="text-muted-foreground mb-6">
                  Start shopping to add items to your cart
                </p>
                <Button>Continue Shopping</Button>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <h2 className="font-display text-xl font-bold mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-semibold">$0.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-semibold">$0.00</span>
                </div>
                <div className="border-t pt-4 flex justify-between">
                  <span className="font-display font-bold text-lg">Total</span>
                  <span className="font-display font-bold text-lg">$0.00</span>
                </div>
              </div>

              <Button className="w-full mb-4" disabled>
                Proceed to Checkout
              </Button>

              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded bg-secondary flex items-center justify-center text-xs font-semibold">
                    💳
                  </div>
                  <span>Shop Pay, Apple Pay, PayPal accepted</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded bg-secondary flex items-center justify-center text-xs font-semibold">
                    🚚
                  </div>
                  <span>Free shipping on orders over $50</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded bg-secondary flex items-center justify-center text-xs font-semibold">
                    💰
                  </div>
                  <span>4 interest-free installments available</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Cart;
