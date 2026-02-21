/**
 * Builds the Higgsfield image generation prompt from vote results.
 * Maps silhouette, mood, and setting keys to rich descriptive prompts.
 */
export function buildImagePrompt(
  silhouette: string,
  mood: string,
  setting: string,
  brandName?: string
): string {
  const silhouetteDesc: Record<string, string> = {
    oversized: 'oversized tailoring, voluminous silhouettes, exaggerated proportions, architectural cuts',
    fluid: 'fluid draping, flowing fabrics, soft movement, elegant cascading lines',
    sculptural: 'sculptural structure, bold geometric shapes, avant-garde forms, architectural fashion',
  };

  const moodDesc: Record<string, string> = {
    quiet: 'quiet luxury aesthetic, understated elegance, minimalist sophistication, refined restraint',
    provocative: 'provocative edge, bold statement, daring and unconventional, fashion-forward',
    romantic: 'romantic sensibility, soft dreamy atmosphere, delicate and ethereal, poetic beauty',
  };

  const settingDesc: Record<string, string> = {
    tokyo: 'Tokyo at night, neon-lit urban landscape, cinematic cityscape, moody atmosphere',
    paris: 'Parisian rooftop at golden hour, Eiffel Tower in distance, romantic Paris skyline',
    desert: 'desert at golden hour, vast sand dunes, warm sunset light, cinematic landscape',
  };

  const s = silhouetteDesc[silhouette] || silhouette;
  const m = moodDesc[mood] || mood;
  const set = settingDesc[setting] || setting;

  const brandPart = brandName ? `for ${brandName}, ` : '';

  return `Luxury fashion editorial photograph, ${brandPart}${s}, ${m}, setting: ${set}. Professional fashion photography, Vogue Italia editorial style, high-end campaign, 4K, portrait orientation, cinematic lighting, editorial quality.`;
}
