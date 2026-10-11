/* =========================================================
   TomatoGuard AI - data.js
   Source: symptom_schema.csv + symptom_knowledge_table.csv
   Note: Yeh sample (symptom-based) dataset hai, real field data nahi.
   Baad mein yeh data Flask + MySQL se aayega.
   ========================================================= */


/* ================= SYMPTOMS (31) ================= */
// id: code mein use hota hai | group: section ka naam | label: user ko dikhta hai
const SYMPTOMS = [
  { id: "lower_leaves_affected", group: "Where it started", label: "Problem started on the lower (older) leaves" },
  { id: "upper_new_leaves_affected", group: "Where it started", label: "Problem started on the upper (new) growth" },
  { id: "yellowing", group: "Leaf", label: "Leaves turning yellow" },
  { id: "small_brown_spots", group: "Leaf", label: "Small brown spots on leaves" },
  { id: "large_brown_blotches", group: "Leaf", label: "Large brown patches on leaves" },
  { id: "concentric_rings", group: "Leaf", label: "Spots with ring-like (target) pattern" },
  { id: "tan_gray_centers", group: "Leaf", label: "Spots with tan or gray centers" },
  { id: "yellow_halo", group: "Leaf", label: "Yellow ring around the spots" },
  { id: "water_soaked_lesions", group: "Leaf", label: "Dark, water-soaked looking patches" },
  { id: "white_growth_under_leaf", group: "Leaf", label: "White fuzzy growth under leaves" },
  { id: "olive_brown_mold_under_leaf", group: "Leaf", label: "Olive-brown velvety mold under leaves" },
  { id: "yellow_patches_upper_surface", group: "Leaf", label: "Pale yellow patches on the top of leaves" },
  { id: "leaf_holes", group: "Leaf", label: "Small holes in leaves" },
  { id: "leaf_curling", group: "Leaf", label: "Leaves curling or cupping" },
  { id: "leaf_mottling", group: "Leaf", label: "Light and dark green mottled (mosaic) pattern" },
  { id: "leaf_distortion", group: "Leaf", label: "Narrow, twisted or fern-like leaves" },
  { id: "fine_webbing", group: "Leaf", label: "Fine webbing on leaves or stems" },
  { id: "tiny_pale_stippling", group: "Leaf", label: "Tiny pale dots (stippling) on leaves" },
  { id: "leaves_bronze_or_dry", group: "Leaf", label: "Leaves turning bronze, dry or crispy" },
  { id: "stem_lesions", group: "Stem", label: "Dark spots or streaks on the stem" },
  { id: "fruit_lesions", group: "Fruit", label: "Spots or sunken patches on fruit" },
  { id: "fruit_firm_brown_patches", group: "Fruit", label: "Large firm brown patches on fruit" },
  { id: "fruit_scabby_spots", group: "Fruit", label: "Raised, rough scabby spots on fruit" },
  { id: "leaf_wilting", group: "Whole plant", label: "Leaves wilting or drooping" },
  { id: "leaf_drop", group: "Whole plant", label: "Leaves falling off" },
  { id: "stunted_growth", group: "Whole plant", label: "Plant growing slowly or stunted" },
  { id: "reduced_fruit_set", group: "Whole plant", label: "Few fruits or flowers dropping" },
  { id: "humid_wet_weather", group: "Conditions", label: "Recent humid, rainy or wet weather" },
  { id: "hot_dry_weather", group: "Conditions", label: "Recent hot and dry weather" },
  { id: "poor_air_circulation", group: "Conditions", label: "Crowded plants, poor air flow or greenhouse" },
  { id: "whiteflies_present", group: "Conditions", label: "Whiteflies seen on the plants" }
];


/* ================= DISEASE PROFILES (10) =================
   p = har symptom ke dikhne ki probability (0 se 1 ke beech).
   Jaise 0.85 matlab is disease mein yeh symptom bahut common hai. */
const DISEASE_PROFILES = [
  {
    name: "Early Blight",
    p: {
      lower_leaves_affected: 0.85, upper_new_leaves_affected: 0.05, yellowing: 0.7,
      small_brown_spots: 0.45, large_brown_blotches: 0.55, concentric_rings: 0.85,
      tan_gray_centers: 0.1, yellow_halo: 0.65, water_soaked_lesions: 0.05,
      white_growth_under_leaf: 0.02, olive_brown_mold_under_leaf: 0.02, yellow_patches_upper_surface: 0.02,
      leaf_holes: 0.02, leaf_curling: 0.02, leaf_mottling: 0.02,
      leaf_distortion: 0.02, fine_webbing: 0.02, tiny_pale_stippling: 0.02,
      leaves_bronze_or_dry: 0.02, stem_lesions: 0.35, fruit_lesions: 0.35,
      fruit_firm_brown_patches: 0.02, fruit_scabby_spots: 0.02, leaf_wilting: 0.1,
      leaf_drop: 0.45, stunted_growth: 0.1, reduced_fruit_set: 0.02,
      humid_wet_weather: 0.55, hot_dry_weather: 0.1, poor_air_circulation: 0.2,
      whiteflies_present: 0.05
    }
  },
  {
    name: "Late Blight",
    p: {
      lower_leaves_affected: 0.4, upper_new_leaves_affected: 0.35, yellowing: 0.3,
      small_brown_spots: 0.1, large_brown_blotches: 0.8, concentric_rings: 0.03,
      tan_gray_centers: 0.02, yellow_halo: 0.05, water_soaked_lesions: 0.85,
      white_growth_under_leaf: 0.55, olive_brown_mold_under_leaf: 0.02, yellow_patches_upper_surface: 0.02,
      leaf_holes: 0.02, leaf_curling: 0.02, leaf_mottling: 0.02,
      leaf_distortion: 0.02, fine_webbing: 0.02, tiny_pale_stippling: 0.02,
      leaves_bronze_or_dry: 0.02, stem_lesions: 0.6, fruit_lesions: 0.35,
      fruit_firm_brown_patches: 0.6, fruit_scabby_spots: 0.02, leaf_wilting: 0.45,
      leaf_drop: 0.3, stunted_growth: 0.02, reduced_fruit_set: 0.02,
      humid_wet_weather: 0.9, hot_dry_weather: 0.03, poor_air_circulation: 0.2,
      whiteflies_present: 0.03
    }
  },
  {
    name: "Septoria Leaf Spot",
    p: {
      lower_leaves_affected: 0.9, upper_new_leaves_affected: 0.05, yellowing: 0.65,
      small_brown_spots: 0.95, large_brown_blotches: 0.05, concentric_rings: 0.05,
      tan_gray_centers: 0.85, yellow_halo: 0.5, water_soaked_lesions: 0.02,
      white_growth_under_leaf: 0.02, olive_brown_mold_under_leaf: 0.02, yellow_patches_upper_surface: 0.02,
      leaf_holes: 0.02, leaf_curling: 0.02, leaf_mottling: 0.02,
      leaf_distortion: 0.02, fine_webbing: 0.02, tiny_pale_stippling: 0.02,
      leaves_bronze_or_dry: 0.02, stem_lesions: 0.1, fruit_lesions: 0.02,
      fruit_firm_brown_patches: 0.02, fruit_scabby_spots: 0.02, leaf_wilting: 0.1,
      leaf_drop: 0.6, stunted_growth: 0.02, reduced_fruit_set: 0.02,
      humid_wet_weather: 0.75, hot_dry_weather: 0.05, poor_air_circulation: 0.3,
      whiteflies_present: 0.03
    }
  },
  {
    name: "Bacterial Spot",
    p: {
      lower_leaves_affected: 0.4, upper_new_leaves_affected: 0.35, yellowing: 0.35,
      small_brown_spots: 0.9, large_brown_blotches: 0.15, concentric_rings: 0.03,
      tan_gray_centers: 0.1, yellow_halo: 0.7, water_soaked_lesions: 0.55,
      white_growth_under_leaf: 0.02, olive_brown_mold_under_leaf: 0.02, yellow_patches_upper_surface: 0.02,
      leaf_holes: 0.5, leaf_curling: 0.02, leaf_mottling: 0.02,
      leaf_distortion: 0.02, fine_webbing: 0.02, tiny_pale_stippling: 0.02,
      leaves_bronze_or_dry: 0.02, stem_lesions: 0.15, fruit_lesions: 0.35,
      fruit_firm_brown_patches: 0.02, fruit_scabby_spots: 0.65, leaf_wilting: 0.02,
      leaf_drop: 0.3, stunted_growth: 0.02, reduced_fruit_set: 0.02,
      humid_wet_weather: 0.8, hot_dry_weather: 0.05, poor_air_circulation: 0.2,
      whiteflies_present: 0.03
    }
  },
  {
    name: "Leaf Mold",
    p: {
      lower_leaves_affected: 0.8, upper_new_leaves_affected: 0.1, yellowing: 0.6,
      small_brown_spots: 0.02, large_brown_blotches: 0.02, concentric_rings: 0.02,
      tan_gray_centers: 0.02, yellow_halo: 0.02, water_soaked_lesions: 0.02,
      white_growth_under_leaf: 0.1, olive_brown_mold_under_leaf: 0.9, yellow_patches_upper_surface: 0.95,
      leaf_holes: 0.02, leaf_curling: 0.25, leaf_mottling: 0.02,
      leaf_distortion: 0.02, fine_webbing: 0.02, tiny_pale_stippling: 0.02,
      leaves_bronze_or_dry: 0.02, stem_lesions: 0.02, fruit_lesions: 0.05,
      fruit_firm_brown_patches: 0.02, fruit_scabby_spots: 0.02, leaf_wilting: 0.1,
      leaf_drop: 0.4, stunted_growth: 0.02, reduced_fruit_set: 0.2,
      humid_wet_weather: 0.7, hot_dry_weather: 0.03, poor_air_circulation: 0.8,
      whiteflies_present: 0.03
    }
  },
  {
    name: "Spider Mites",
    p: {
      lower_leaves_affected: 0.7, upper_new_leaves_affected: 0.2, yellowing: 0.6,
      small_brown_spots: 0.1, large_brown_blotches: 0.02, concentric_rings: 0.02,
      tan_gray_centers: 0.02, yellow_halo: 0.02, water_soaked_lesions: 0.02,
      white_growth_under_leaf: 0.02, olive_brown_mold_under_leaf: 0.02, yellow_patches_upper_surface: 0.02,
      leaf_holes: 0.02, leaf_curling: 0.25, leaf_mottling: 0.02,
      leaf_distortion: 0.02, fine_webbing: 0.75, tiny_pale_stippling: 0.9,
      leaves_bronze_or_dry: 0.7, stem_lesions: 0.02, fruit_lesions: 0.02,
      fruit_firm_brown_patches: 0.02, fruit_scabby_spots: 0.02, leaf_wilting: 0.3,
      leaf_drop: 0.4, stunted_growth: 0.35, reduced_fruit_set: 0.2,
      humid_wet_weather: 0.05, hot_dry_weather: 0.8, poor_air_circulation: 0.15,
      whiteflies_present: 0.05
    }
  },
  {
    name: "Target Spot",
    p: {
      lower_leaves_affected: 0.6, upper_new_leaves_affected: 0.1, yellowing: 0.5,
      small_brown_spots: 0.6, large_brown_blotches: 0.4, concentric_rings: 0.8,
      tan_gray_centers: 0.3, yellow_halo: 0.6, water_soaked_lesions: 0.02,
      white_growth_under_leaf: 0.02, olive_brown_mold_under_leaf: 0.02, yellow_patches_upper_surface: 0.02,
      leaf_holes: 0.1, leaf_curling: 0.02, leaf_mottling: 0.02,
      leaf_distortion: 0.02, fine_webbing: 0.02, tiny_pale_stippling: 0.02,
      leaves_bronze_or_dry: 0.02, stem_lesions: 0.15, fruit_lesions: 0.45,
      fruit_firm_brown_patches: 0.02, fruit_scabby_spots: 0.15, leaf_wilting: 0.02,
      leaf_drop: 0.5, stunted_growth: 0.02, reduced_fruit_set: 0.02,
      humid_wet_weather: 0.75, hot_dry_weather: 0.05, poor_air_circulation: 0.4,
      whiteflies_present: 0.03
    }
  },
  {
    name: "Yellow Leaf Curl Virus",
    p: {
      lower_leaves_affected: 0.1, upper_new_leaves_affected: 0.85, yellowing: 0.8,
      small_brown_spots: 0.02, large_brown_blotches: 0.02, concentric_rings: 0.02,
      tan_gray_centers: 0.02, yellow_halo: 0.02, water_soaked_lesions: 0.02,
      white_growth_under_leaf: 0.02, olive_brown_mold_under_leaf: 0.02, yellow_patches_upper_surface: 0.02,
      leaf_holes: 0.02, leaf_curling: 0.95, leaf_mottling: 0.15,
      leaf_distortion: 0.6, fine_webbing: 0.02, tiny_pale_stippling: 0.02,
      leaves_bronze_or_dry: 0.02, stem_lesions: 0.02, fruit_lesions: 0.02,
      fruit_firm_brown_patches: 0.02, fruit_scabby_spots: 0.02, leaf_wilting: 0.05,
      leaf_drop: 0.1, stunted_growth: 0.85, reduced_fruit_set: 0.8,
      humid_wet_weather: 0.1, hot_dry_weather: 0.4, poor_air_circulation: 0.1,
      whiteflies_present: 0.85
    }
  },
  {
    name: "Mosaic Virus",
    p: {
      lower_leaves_affected: 0.15, upper_new_leaves_affected: 0.75, yellowing: 0.3,
      small_brown_spots: 0.02, large_brown_blotches: 0.02, concentric_rings: 0.02,
      tan_gray_centers: 0.02, yellow_halo: 0.02, water_soaked_lesions: 0.02,
      white_growth_under_leaf: 0.02, olive_brown_mold_under_leaf: 0.02, yellow_patches_upper_surface: 0.02,
      leaf_holes: 0.02, leaf_curling: 0.25, leaf_mottling: 0.95,
      leaf_distortion: 0.75, fine_webbing: 0.02, tiny_pale_stippling: 0.02,
      leaves_bronze_or_dry: 0.02, stem_lesions: 0.02, fruit_lesions: 0.1,
      fruit_firm_brown_patches: 0.02, fruit_scabby_spots: 0.02, leaf_wilting: 0.02,
      leaf_drop: 0.02, stunted_growth: 0.6, reduced_fruit_set: 0.45,
      humid_wet_weather: 0.1, hot_dry_weather: 0.1, poor_air_circulation: 0.1,
      whiteflies_present: 0.05
    }
  },
  {
    name: "Healthy",
    p: {
      lower_leaves_affected: 0.05, upper_new_leaves_affected: 0.02, yellowing: 0.08,
      small_brown_spots: 0.02, large_brown_blotches: 0.02, concentric_rings: 0.02,
      tan_gray_centers: 0.02, yellow_halo: 0.02, water_soaked_lesions: 0.02,
      white_growth_under_leaf: 0.02, olive_brown_mold_under_leaf: 0.02, yellow_patches_upper_surface: 0.02,
      leaf_holes: 0.02, leaf_curling: 0.02, leaf_mottling: 0.02,
      leaf_distortion: 0.02, fine_webbing: 0.02, tiny_pale_stippling: 0.02,
      leaves_bronze_or_dry: 0.02, stem_lesions: 0.02, fruit_lesions: 0.02,
      fruit_firm_brown_patches: 0.02, fruit_scabby_spots: 0.02, leaf_wilting: 0.02,
      leaf_drop: 0.05, stunted_growth: 0.02, reduced_fruit_set: 0.02,
      humid_wet_weather: 0.35, hot_dry_weather: 0.3, poor_air_circulation: 0.15,
      whiteflies_present: 0.05
    }
  }
];



/* ================= DISEASE INFO (10) =================
   Result aur Disease Information pages yahi text dikhayenge.
   Yeh general aur educational information hai. */
const DISEASE_INFO = {

  "Early Blight": {
    status: "disease",
    statusLabel: "Disease Detected",
    description: "Early blight is a common fungal disease of tomato plants. It usually starts on older, lower leaves and can slowly spread upward.",
    symptoms: [
      "Dark brown spots on older, lower leaves",
      "Ring-like (target) pattern inside the spots",
      "Yellowing around the spots",
      "Leaves may drop early in serious cases"
    ],
    causes: [
      "Fungal infection",
      "Warm and humid weather",
      "Infected plant debris left in the soil",
      "Leaves staying wet for long periods"
    ],
    prevention: [
      "Rotate crops every season",
      "Avoid wetting the leaves while watering",
      "Keep enough space between plants",
      "Clear fallen leaves and plant debris"
    ],
    care: [
      "Remove and dispose of badly affected leaves",
      "Improve air circulation around plants",
      "Ask a local agriculture expert about suitable treatment"
    ]
  },

  "Late Blight": {
    status: "disease",
    statusLabel: "Disease Detected",
    description: "Late blight is a serious disease that can spread very fast in cool, wet conditions and affect leaves, stems and fruits.",
    symptoms: [
      "Dark, water-soaked patches on leaves",
      "White fuzzy growth under leaves in humid weather",
      "Dark lesions on stems",
      "Large firm brown patches on fruits"
    ],
    causes: [
      "Infection by a water mold (not a true fungus)",
      "Cool temperatures with high humidity or rain",
      "Infected plants or nearby infected crops"
    ],
    prevention: [
      "Start with healthy seedlings",
      "Avoid overhead watering",
      "Remove leftover plants after harvest",
      "Keep enough space between plants"
    ],
    care: [
      "Remove badly infected plants quickly so it does not spread",
      "Do not compost infected plant material",
      "Contact a local agriculture expert as soon as possible"
    ]
  },

  "Septoria Leaf Spot": {
    status: "disease",
    statusLabel: "Disease Detected",
    description: "Septoria leaf spot is a fungal disease that causes many small spots on leaves, usually starting on the lower part of the plant.",
    symptoms: [
      "Many small brown spots with tan or gray centers",
      "Yellowing around the spots",
      "Lower leaves affected first",
      "Badly affected leaves may dry up and fall"
    ],
    causes: [
      "Fungal infection",
      "Water splashing from soil onto leaves",
      "Warm, wet and humid weather",
      "Infected plant debris"
    ],
    prevention: [
      "Water at the base of the plant",
      "Use mulch to reduce soil splash",
      "Rotate crops every season",
      "Clear plant debris after harvest"
    ],
    care: [
      "Remove affected lower leaves",
      "Avoid working among plants when they are wet",
      "Ask a local agriculture expert about suitable treatment"
    ]
  },

  "Bacterial Spot": {
    status: "disease",
    statusLabel: "Disease Detected",
    description: "Bacterial spot is caused by bacteria and creates small spots on leaves and fruits, especially in warm and wet weather.",
    symptoms: [
      "Small, dark spots on leaves, often with a yellow ring",
      "Small holes may appear where spots dry out",
      "Raised, rough scabby spots on fruits",
      "Leaves may turn yellow and drop"
    ],
    causes: [
      "Bacterial infection",
      "Warm, wet and windy weather",
      "Contaminated seeds or garden tools"
    ],
    prevention: [
      "Use clean, disease-free seeds and seedlings",
      "Clean garden tools regularly",
      "Avoid working in the field when plants are wet",
      "Rotate crops every season"
    ],
    care: [
      "Remove badly affected leaves",
      "Avoid overhead watering",
      "Ask a local agriculture expert about suitable management options"
    ]
  },

  "Leaf Mold": {
    status: "disease",
    statusLabel: "Disease Detected",
    description: "Leaf mold is a fungal disease that likes high humidity. It is common in crowded plants and greenhouses.",
    symptoms: [
      "Pale yellow patches on the top of leaves",
      "Olive-brown velvety mold under the same leaves",
      "Lower leaves usually affected first",
      "Leaves may curl, dry up or drop"
    ],
    causes: [
      "Fungal infection",
      "High humidity",
      "Poor air flow around plants",
      "Crowded plants or greenhouse conditions"
    ],
    prevention: [
      "Keep enough space between plants",
      "Improve ventilation and reduce humidity",
      "Water at the base of the plant",
      "Avoid keeping leaves wet overnight"
    ],
    care: [
      "Remove affected leaves",
      "Increase air flow around the plants",
      "Ask a local agriculture expert about suitable treatment"
    ]
  },

  "Spider Mites": {
    status: "pest",
    statusLabel: "Pest Problem Detected",
    description: "Spider mites are tiny pests, not a disease. They feed on leaves and are more common in hot, dry weather.",
    symptoms: [
      "Tiny pale dots (stippling) on leaves",
      "Fine webbing on leaves or stems",
      "Leaves turning bronze, dry or crispy",
      "Plant may grow slowly"
    ],
    causes: [
      "Hot and dry weather",
      "Dusty conditions",
      "Plants under water stress",
      "Mites spreading from nearby plants"
    ],
    prevention: [
      "Check the underside of leaves regularly",
      "Keep plants well watered",
      "Remove weeds around the plants",
      "Keep the growing area clean"
    ],
    care: [
      "Remove badly affected leaves",
      "Gently rinsing the underside of leaves with water may help reduce mites",
      "Ask a local agriculture expert about safe control options"
    ]
  },

  "Target Spot": {
    status: "disease",
    statusLabel: "Disease Detected",
    description: "Target spot is a fungal disease that creates brown spots with ring-like patterns on leaves and sometimes on fruits.",
    symptoms: [
      "Brown spots with ring-like (target) pattern",
      "Yellow ring around the spots",
      "Spots or sunken patches on fruits",
      "Leaves may drop early"
    ],
    causes: [
      "Fungal infection",
      "Warm and humid weather",
      "Dense leaves with poor air flow",
      "Infected plant debris"
    ],
    prevention: [
      "Keep enough space between plants",
      "Avoid wetting the leaves while watering",
      "Rotate crops every season",
      "Clear plant debris after harvest"
    ],
    care: [
      "Remove badly affected leaves",
      "Improve air circulation around plants",
      "Ask a local agriculture expert about suitable treatment"
    ]
  },

  "Yellow Leaf Curl Virus": {
    status: "disease",
    statusLabel: "Disease Detected",
    description: "Yellow leaf curl virus is a plant virus spread by whiteflies. It affects the growth and fruiting of tomato plants.",
    symptoms: [
      "Leaves curling upward or cupping",
      "Yellowing leaves, mostly on new growth",
      "Plant growing slowly or stunted",
      "Few fruits or flowers dropping"
    ],
    causes: [
      "Virus spread by whiteflies",
      "Hot weather with many whiteflies around",
      "Infected plants nearby"
    ],
    prevention: [
      "Control whiteflies around the plants",
      "Use healthy seedlings",
      "Ask about resistant tomato varieties",
      "Remove weeds that can host whiteflies"
    ],
    care: [
      "Infected plants usually cannot be cured, so remove them to protect others",
      "Keep checking nearby plants for whiteflies",
      "Contact a local agriculture expert for guidance"
    ]
  },

  "Mosaic Virus": {
    status: "disease",
    statusLabel: "Disease Detected",
    description: "Mosaic virus is a plant virus that causes a light and dark green mottled pattern on leaves and can slow plant growth.",
    symptoms: [
      "Light and dark green mottled (mosaic) leaves",
      "Narrow, twisted or fern-like leaves",
      "Plant growing slowly or stunted",
      "Fewer fruits"
    ],
    causes: [
      "Virus spread by touch, hands and garden tools",
      "Infected seeds or plants",
      "Nearby infected plants or weeds"
    ],
    prevention: [
      "Wash hands and clean tools after handling plants",
      "Use healthy seeds and seedlings",
      "Remove weeds around the plants",
      "Handle healthy plants before infected ones"
    ],
    care: [
      "Infected plants usually cannot be cured, so remove them to protect others",
      "Avoid touching healthy plants after handling infected ones",
      "Contact a local agriculture expert for guidance"
    ]
  },

  "Healthy": {
    status: "healthy",
    statusLabel: "Healthy Plant",
    description: "Your selected symptoms best match a healthy tomato plant. Keep monitoring the plant regularly for any changes.",
    symptoms: [
      "Even, deep green leaves",
      "No spots, patches or holes",
      "Firm leaves without curling or wilting",
      "Steady growth"
    ],
    causes: [
      "Balanced watering and sunlight",
      "Good soil nutrition",
      "Proper plant spacing and air flow"
    ],
    prevention: [
      "Water at the base of the plant",
      "Check plants regularly for early signs of problems",
      "Keep the garden clean of fallen leaves"
    ],
    care: [
      "Continue regular watering and feeding",
      "Remove weeds around the plants",
      "Keep monitoring the leaves every week"
    ]
  }

};