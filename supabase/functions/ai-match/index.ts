import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { sneakerImage, preferences } = await req.json();

    if (!sneakerImage) {
      return new Response(
        JSON.stringify({ error: 'Sneaker image is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Extract colors from image (placeholder - integrate with AI service)
    const dominantColors = await extractColors(sneakerImage);
    
    // Get products from database
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select(`
        *,
        variants:product_variants(*)
      `)
      .eq('active', true);

    if (productsError) throw productsError;

    // Score and rank products based on color matching
    const scoredProducts = products.map(product => {
      const colorScore = calculateColorMatch(dominantColors, product.variants);
      const styleScore = calculateStyleMatch(preferences?.style || [], product.ai_tags);
      const matchScore = (colorScore * 0.7) + (styleScore * 0.3); // Weight color more heavily

      return {
        ...product,
        matchScore,
        colorScore,
        styleScore
      };
    });

    // Sort by match score and return top matches
    const topMatches = scoredProducts
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 12);

    return new Response(
      JSON.stringify({ matches: topMatches }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('AI Match Error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// Placeholder function - integrate with actual color extraction AI
async function extractColors(imageData: string): Promise<string[]> {
  // This would call an AI service like Clarifai, Google Vision, or custom model
  // For now, return placeholder colors
  return ['#FF0000', '#FFFFFF', '#000000'];
}

function calculateColorMatch(sneakerColors: string[], variants: any[]): number {
  if (!variants || variants.length === 0) return 0;

  const availableColors = variants.map(v => v.color_hex.toLowerCase());
  let matches = 0;

  for (const sneakerColor of sneakerColors) {
    for (const productColor of availableColors) {
      if (colorsAreSimilar(sneakerColor, productColor)) {
        matches++;
        break;
      }
    }
  }

  return (matches / sneakerColors.length) * 100;
}

function calculateStyleMatch(userStyles: string[], productTags: string[]): number {
  if (userStyles.length === 0) return 50; // Neutral score if no preferences
  
  const matches = userStyles.filter(style => 
    productTags.some(tag => tag.toLowerCase().includes(style.toLowerCase()))
  ).length;

  return (matches / userStyles.length) * 100;
}

function colorsAreSimilar(color1: string, color2: string): boolean {
  // Simple color similarity - in production, use proper color distance algorithm
  const c1 = hexToRgb(color1);
  const c2 = hexToRgb(color2);
  
  if (!c1 || !c2) return false;

  const distance = Math.sqrt(
    Math.pow(c1.r - c2.r, 2) +
    Math.pow(c1.g - c2.g, 2) +
    Math.pow(c1.b - c2.b, 2)
  );

  return distance < 100; // Threshold for similarity
}

function hexToRgb(hex: string): { r: number, g: number, b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}
