import traits from "@/assets/hippo/traits.json";
import specialSets from "@/assets/hippo/specialSets.json";

// Detailed trait aliases for improved image generation prompts
const traitAliases: { [key: string]: string } = {
  // Eyes
  sleepy: "drooping, half-closed sleepy eyes",
  wide: "large, round, wide-open eyes with surprise",
  wink: "one eye closed in a playful wink",
  "half-lidded": "half-lidded cartoon eyes showing quiet suspicion",
  angry: "cartoon eyes with heavy brows and an intense glare",
  happy: "bright wide eyes with a joyful expression",
  laser: "glowing red laser beams shooting from the eyes",
  stars: "star-shaped pupils with a sparkle of excitement",
  sunglasses: "cool dark sunglasses covering the eyes",
  spiral: "hypnotic spiral pattern swirling in the eyes",
  tears: "teary eyes with small droplets forming",
  mischievous: "narrowed, sly eyes with a hint of mischief",
  shocked: "wide-open shocked eyes with tiny pupils",
  glasses: "round intellectual glasses perched on the nose",
  crying: "large cartoon eyes with dramatic vertical tears streaming down",
  determined: "fierce cartoon eyes with thick brows, squinting slightly",
  sharingan: "stylized red and black ninja eyes with concentric circles",

  // Mouth
  smile: "a simple, pleasant smile",
  frown: "tight frown with clenched jaw and downturned corners",
  "open-mouth smile": "a wide, friendly cartoon smile with visible upper teeth",
  smirk: "a cocky, sideways smirk",
  pout: "a cute, pouty expression with slightly puffed cheeks",
  "grin with teeth": "a broad grin showing teeth",
  "tongue out": "playfully sticking its tongue out",
  surprised: "an O-shaped mouth expressing surprise",
  angry_mouth: "an angry grimace with clenched teeth",
  sad: "a downturned, quivering sad mouth",
  goofy: "a silly, asymmetrical goofy smile",
  neutral: "a straight, neutral expression",
  "sharp teeth": "a mouth revealing sharp, intimidating teeth",
  "lip bite": "biting its lower lip nervously",
  cigarette: "a cigarette dangling from the corner of its mouth",
  bubblegum: "blowing a large pink bubble from chewing gum",
  "vampire fangs": "vampire fangs protruding over the lower lip",
  braces: "metal braces visible on its teeth when smiling",
  drooling: "drooling slightly from the corner of its mouth",
  "gold tooth": "a smile revealing a shiny gold tooth",

  // Ears
  "regular ears": "standard hippo ears",
  "downturned ears": "droopy, downturned ears",
  "upturned ears": "ears perked up and angled slightly upward",
  "multiple piercings": "each ear decorated with silver rings and metal studs",
  headphones: "large over-ear headphones resting on the head",
  "headset mic":
    "wearing a large black gaming headset with an attached microphone on the left side",
  "bandaged ear": "right ear wrapped in white medical bandage",
  "cybernetic ear": "a futuristic cybernetic ear with glowing elements",
  "devil horns": "small red devil horns protruding from the top of the head",
  "radio comms earpiece": "a small black tactical earpiece in the left ear",

  // Clothes
  "red hoodie": "a bright red pullover hoodie with a front pocket",
  "blue varsity jacket":
    "blue and white varsity jacket with letter patches and striped cuffs",
  "black leather jacket": "a tough black leather jacket with metal zippers",
  "astronaut suit":
    "a white space suit with NASA-style insignia and oxygen tubes",
  "samurai armor":
    "traditional Japanese samurai armor with decorative plates and bindings",
  "superhero cape": "a flowing red superhero cape attached at the shoulders",
  "gold suit": "an ostentatious, shimmering gold three-piece suit",
  "tropical shirt":
    "a colorful button-up shirt with vibrant floral and palm leaf prints",
  "denim overalls": "blue denim farmer's overalls with metal clasps",
  "ninja outfit": "a black ninja garb with face mask and tight wrappings",
  "winter parka": "a thick, insulated winter parka with fur-lined hood",
  tuxedo:
    "a sleek black tuxedo with satin lapels, white pocket square, and a bow tie",
  "sports jersey":
    "a white sports jersey with orange shoulder stripes and the number 12 printed on the chest",
  "prisoner jumpsuit":
    "a bright orange cartoon-style prisoner jumpsuit with black trim and number 04 on the chest",
  "wizard robe":
    "a flowing purple wizard robe with silver star patterns and golden trim",
  "no clothes": "",

  // Accessories
  "gold chain": "a thick gold chain necklace around the neck",
  "silver chain": "a gleaming silver chain necklace",
  "peace medallion": "a round peace symbol medallion hanging from the neck",
  scarf: "a cozy knitted scarf wrapped around the neck",
  "lollipop (held)": "holding a colorful swirled lollipop in one hand",
  balloon: "holding a floating yellow party balloon on a string",
  "pocket watch": "a vintage gold pocket watch with chain",
  cigar: "a lit cigar emitting small puffs of smoke",
  "katana (back strap)":
    "a sheathed samurai katana strapped diagonally across the back, angled over the shoulder",
  "tiny hippo stuffed animal (held)":
    "holding a small plush hippo toy in one arm",
  jetpack: "a silver metallic jetpack mounted on its back",
  "floating crown":
    "a golden crown floating above the character's head, slightly tilted",
  "magic orb (floating)":
    "a glowing blue orb floating above its right shoulder",
  "4 star dragon ball (from Dragon Ball Z)":
    "an orange crystal sphere with four red stars floating nearby",
  "game controller": "holding a retro-style video game controller in its hands",
  "shoulder bird": "a small colorful bird perched on its shoulder",
  none: "",
};

interface Trait {
  name: string;
  weight: number;
}

interface TraitCategory {
  [key: string]: Trait[];
}

interface SpecialSet {
  name: string;
  inspiration: string;
  maxEditions: number;
  currentEditions: number;
  prompt?: string;
  traits: {
    [key: string]: string;
  };
}

interface TraitUsed {
  name: string;
  category: string;
  weight: number;
}

export interface CharacterMetadata {
  id: number;
  traits: {
    [key: string]: string;
  };
  isSpecial: boolean;
  specialSet: string | null;
  rarityScore: string;
  prompt: string;
  rerollAllowed: boolean;
  traitsUsed: TraitUsed[];
}

function weightedRandom(items: Trait[]): string {
  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
  let rand = Math.random() * totalWeight;
  for (const item of items) {
    if (rand < item.weight) return item.name;
    rand -= item.weight;
  }
  return items[items.length - 1].name;
}

function calculateRarityScore(combo: { [key: string]: string }): string {
  return Object.entries(combo)
    .reduce((acc, [key, value]) => {
      // Convert key to match the case in traits.json (first letter uppercase)
      const categoryKey =
        key.charAt(0).toUpperCase() + key.slice(1).toLowerCase();
      const traitList = (traits as TraitCategory)[categoryKey];
      if (!traitList) {
        console.warn(`No trait list found for category: ${categoryKey}`);
        return acc;
      }
      const found = traitList.find((t) => t.name === value);
      return acc + (found ? 1 / found.weight : 0);
    }, 0)
    .toFixed(4);
}

function buildPromptFromTraits(traits: { [key: string]: string }): string {
  const eyesDesc =
    traitAliases[traits.Eyes?.toLowerCase()] || `${traits.Eyes} eyes`;
  const mouthDesc =
    traitAliases[traits.Mouth?.toLowerCase()] || `${traits.Mouth} mouth`;
  const earsDesc = traitAliases[traits.Ears?.toLowerCase()] || `${traits.Ears}`;

  let clothesPhrase = "";
  if (
    traits.Clothes &&
    traits.Clothes.toLowerCase() !== "none" &&
    traits.Clothes.toLowerCase() !== "no clothes"
  ) {
    clothesPhrase = `wearing ${
      traitAliases[traits.Clothes?.toLowerCase()] || traits.Clothes
    }`;
  } else {
    clothesPhrase = "without any clothes";
  }

  let accessoriesPhrase = "";
  if (traits.Accessories && traits.Accessories.toLowerCase() !== "none") {
    accessoriesPhrase = `and ${
      traitAliases[traits.Accessories?.toLowerCase()] || traits.Accessories
    }`;
  } else {
    accessoriesPhrase = "without any accessories";
  }

  return `A bright cartoon-style blue hippo character in the same pose and proportions as the input image. With ${eyesDesc}, ${mouthDesc}, and ${earsDesc}. ${clothesPhrase}, ${accessoriesPhrase}. Lines are clean and bold with flat shaded color and strong edge definition. Crisp cartoon outlines and high contrast between elements. Keep the style flat and outlined, consistent with the original base image. Generate a square image at 1024x1024 resolution. No background.`;
}

export function generateCharacter(id: number): CharacterMetadata {
  const specialSet = (specialSets as unknown as SpecialSet[]).find(
    (set) => set.currentEditions < set.maxEditions
  );
  let traitsSelected: { [key: string]: string } = {};
  let isSpecial = false;
  let setUsed: SpecialSet | null = null;

  if (specialSet && Math.random() < 0.2) {
    traitsSelected = specialSet.traits;
    specialSet.currentEditions += 1;
    isSpecial = true;
    setUsed = specialSet;
  } else {
    for (const category in traits) {
      // Keep the original case from traits.json
      traitsSelected[category] = weightedRandom(
        (traits as TraitCategory)[category]
      );
    }
  }

  const rarityScore = calculateRarityScore(traitsSelected);

  const prompt =
    isSpecial && setUsed?.prompt
      ? `${setUsed.prompt} Keep the style flat and outlined, consistent with the original base image. Generate a square image at 1024x1024 resolution. No background.`
      : buildPromptFromTraits(traitsSelected);

  return {
    id,
    traits: traitsSelected,
    isSpecial,
    specialSet: isSpecial ? setUsed?.name || null : null,
    rarityScore,
    prompt,
    rerollAllowed: !isSpecial,
    traitsUsed: [], // Can be expanded with trait rarity if needed
  };
}
