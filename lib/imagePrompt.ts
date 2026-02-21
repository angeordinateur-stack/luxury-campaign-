/**
 * HIGGSFIELD PROMPT SYSTEM — Optimized for Luxury Fashion Editorial
 * Structure: [Medium] → [Subject & Clothing] → [Pose] → [Mood & Color] → [Setting] → [Lighting] → [Style] → [Quality]
 */

type Silhouette = 'oversized' | 'fluid' | 'sculptural';
type Mood = 'quiet' | 'provocative' | 'romantic';
type Setting = 'tokyo' | 'paris' | 'desert';

const SILHOUETTE_PROMPTS: Record<Silhouette, { clothing: string; pose: string }> = {
  oversized: {
    clothing:
      'wearing an oversized double-breasted wool coat with exaggerated dropped shoulders, wide-leg trousers pooling at the feet, voluminous layered fabrics in muted tones, deconstructed tailoring with raw-edge seams',
    pose: 'standing with one hand in pocket, weight shifted to one leg, chin slightly raised, powerful stance, full body visible',
  },
  fluid: {
    clothing:
      'wearing a floor-length silk charmeuse gown with bias-cut draping, fabric cascading in liquid folds catching the light, sheer layered panels revealing movement, delicate chain details at the neckline',
    pose: 'captured mid-stride with fabric billowing behind, one arm extended, body turning slightly, hair caught in motion, full body visible',
  },
  sculptural: {
    clothing:
      'wearing a structured neoprene and bonded-leather ensemble with geometric paneling, sharp angular shoulders, molded bodice with architectural pleats, asymmetric hemline cutting at the knee',
    pose: 'standing in a rigid contrapposto pose, arms at geometric angles, face in three-quarter profile, statuesque and commanding, full body visible',
  },
};

const MOOD_PROMPTS: Record<Mood, { atmosphere: string; color: string; expression: string }> = {
  quiet: {
    atmosphere: 'understated elegance, hushed stillness, restrained sophistication',
    color: 'desaturated palette of ivory, stone, warm grey, and muted camel, low contrast, soft tonal gradation',
    expression: 'serene closed-mouth expression, gaze slightly past camera, composed and distant',
  },
  provocative: {
    atmosphere: 'raw intensity, magnetic tension, unapologetic boldness, fashion-forward edge',
    color: 'high contrast with deep blacks, electric highlights, saturated accent of crimson or cobalt, punchy color grading',
    expression: 'direct confrontational gaze into camera, sharp jawline, slightly parted lips, defiant confidence',
  },
  romantic: {
    atmosphere: 'dreamlike softness, poetic intimacy, ethereal delicacy, tender nostalgia',
    color: 'soft warm palette of blush, dusty rose, champagne gold, and lavender, gentle color bleed at edges',
    expression: 'eyes half-closed looking downward, gentle vulnerability, windswept hair partially covering face',
  },
};

const SETTING_PROMPTS: Record<Setting, { environment: string; lighting: string }> = {
  tokyo: {
    environment:
      'Tokyo Shibuya side street at night, wet asphalt reflecting neon signs in Japanese kanji, steam rising from a grate, blurred taxi lights in the background, narrow urban canyon between concrete buildings',
    lighting:
      'neon-lit with pink and blue color spill on skin, harsh overhead fluorescent mixing with warm street-level glow, cinematic night photography lighting, visible light sources reflected in wet ground',
  },
  paris: {
    environment:
      'zinc rooftop terrace in Paris 7th arrondissement at golden hour, Haussmann chimney pots in mid-ground, Eiffel Tower soft-focused in far distance, wrought-iron railing partially visible, stone balustrade',
    lighting:
      'golden hour directional sunlight from the left, warm honey-toned key light on face, long shadows, backlit hair creating a rim-light halo, natural magic hour cinematography',
  },
  desert: {
    environment:
      'vast Saharan sand dunes at sunset, rippled sand textures in foreground, infinite horizon line, single set of footprints leading away, clear sky graduating from amber to deep violet',
    lighting:
      'low-angle sunset casting long warm shadows, golden rim light outlining the silhouette, warm fill bounce from sand below, dramatic chiaroscuro, cinematic desert light',
  },
};

const STYLE_SUFFIX =
  'shot on medium format Hasselblad, 80mm lens, shallow depth of field, editorial fashion photography in the style of Peter Lindbergh meets Mario Sorrenti, Vogue Italia campaign aesthetic, film grain texture, professional retouching, 3:4 portrait aspect ratio';

const QUALITY_TAGS =
  'ultra high resolution, 8K detail, photorealistic skin texture, fabric texture visible, luxury fashion campaign, editorial quality, no text, no watermark, no logo';

const DEFAULT_SILHOUETTE: Silhouette = 'oversized';
const DEFAULT_MOOD: Mood = 'quiet';
const DEFAULT_SETTING: Setting = 'tokyo';

function asSilhouette(s: string): Silhouette {
  return SILHOUETTE_PROMPTS[s as Silhouette] ? (s as Silhouette) : DEFAULT_SILHOUETTE;
}
function asMood(m: string): Mood {
  return MOOD_PROMPTS[m as Mood] ? (m as Mood) : DEFAULT_MOOD;
}
function asSetting(s: string): Setting {
  return SETTING_PROMPTS[s as Setting] ? (s as Setting) : DEFAULT_SETTING;
}

export function buildImagePrompt(
  silhouette: string,
  mood: string,
  setting: string,
  brandName?: string
): string {
  const sKey = asSilhouette(silhouette);
  const mKey = asMood(mood);
  const eKey = asSetting(setting);

  const s = SILHOUETTE_PROMPTS[sKey];
  const m = MOOD_PROMPTS[mKey];
  const e = SETTING_PROMPTS[eKey];

  const brandPart = brandName ? ` for ${brandName}` : '';
  const parts = [
    `High-end luxury fashion editorial photograph${brandPart}, single model`,
    s.clothing,
    s.pose,
    m.expression,
    `${m.atmosphere}, ${m.color}`,
    e.environment,
    e.lighting,
    STYLE_SUFFIX,
    QUALITY_TAGS,
  ];

  return parts.join(', ');
}
