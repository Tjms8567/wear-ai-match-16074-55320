import { Button } from "@/components/ui/button";
import { ArrowRight, Upload } from "lucide-react";
import { Link } from "react-router-dom";
import heroBanner from "@/assets/hero-banner.jpg";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background to-secondary/20">
      <div className="container px-4 py-16 md:py-24">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="flex flex-col gap-6 animate-fade-in">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 w-fit">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span className="text-sm font-medium">AI-Powered Fashion</span>
            </div>
            
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Match Your Style with{" "}
              <span className="text-primary">AI Intelligence</span>
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-xl">
              Upload your favorite sneakers and let our AI find the perfect clothing matches. 
              Personalized recommendations for unisex, men's, and kids' fashion.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/ai-match">
                <Button size="lg" className="w-full sm:w-auto group shadow-card hover:shadow-card-hover transition-all">
                  <Upload className="mr-2 h-5 w-5" />
                  Try AI Match
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/products">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-2">
                  Browse Products
                </Button>
              </Link>
            </div>

            <div className="flex items-center gap-8 pt-4">
              <div>
                <p className="text-2xl font-bold font-display">10K+</p>
                <p className="text-sm text-muted-foreground">Matches Made</p>
              </div>
              <div className="h-12 w-px bg-border"></div>
              <div>
                <p className="text-2xl font-bold font-display">98%</p>
                <p className="text-sm text-muted-foreground">Satisfaction</p>
              </div>
              <div className="h-12 w-px bg-border"></div>
              <div>
                <p className="text-2xl font-bold font-display">500+</p>
                <p className="text-sm text-muted-foreground">Products</p>
              </div>
            </div>
          </div>

          <div className="relative animate-scale-in">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent rounded-3xl blur-3xl"></div>
            <div className="relative rounded-3xl overflow-hidden border-4 border-primary/30 shadow-3d">
              <img
                src={heroBanner}
                alt="Fashion matching showcase"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
