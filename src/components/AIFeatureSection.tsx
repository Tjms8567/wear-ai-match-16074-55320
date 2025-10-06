import { Sparkles, Palette, TrendingUp, Target } from "lucide-react";
import { Card } from "@/components/ui/card";
import aiIcon from "@/assets/ai-icon.png";

const features = [
  {
    icon: Sparkles,
    title: "AI-Powered Matching",
    description: "Upload your sneakers and get instant clothing recommendations using advanced AI algorithms.",
  },
  {
    icon: Palette,
    title: "Perfect Color Harmony",
    description: "Our AI analyzes colors and suggests matching apparel that complements your footwear perfectly.",
  },
  {
    icon: TrendingUp,
    title: "Trend Analysis",
    description: "Stay ahead with recommendations based on current fashion trends and seasonal collections.",
  },
  {
    icon: Target,
    title: "Personalized Results",
    description: "Filters for unisex, men's, and kids' categories ensure relevant matches for everyone.",
  },
];

const AIFeatureSection = () => {
  return (
    <section className="py-16 md:py-24 bg-secondary/30">
      <div className="container px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 mb-6">
            <img src={aiIcon} alt="AI Technology" className="w-12 h-12" />
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            How Our AI Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Advanced technology that understands fashion and matches your style instantly
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="p-6 border-2 border-border hover:border-primary transition-all duration-300 hover:shadow-card-hover animate-fade-in group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex flex-col items-center text-center gap-4">
                <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AIFeatureSection;
