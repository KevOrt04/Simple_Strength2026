// Static exercise database.
// Replace image URLs with real exercise photos or GIFs when available.
// picsum.photos uses a seed so the same exercise always gets the same placeholder image.

export const EXERCISES = {
  chest: [
    {
      id: "bench-press",
      name: "Bench Press",
      muscles: ["Chest", "Triceps", "Front Deltoids"],
      description:
        "A foundational compound push exercise performed lying on a flat bench. You press a barbell or dumbbells upward from chest level and lower it back under control.",
      gymVariations: [
        "Barbell Flat Bench Press",
        "Dumbbell Bench Press",
        "Incline Barbell Press",
        "Incline Chest Press Machine",
      ],
      bodweightVariations: [
        "Standard Push-Up",
        "Wide-Grip Push-Up",
        "Decline Push-Up (feet elevated)",
        "Incline Push-Up (hands elevated)",
      ],
      image: "https://ik.imagekit.io/yuhonas/tr:w-250,h-180/Dumbbell_Bench_Press/0.jpg",
    },
    {
      id: "chest-fly",
      name: "Chest Fly",
      muscles: ["Chest (Pectoralis Major)", "Front Deltoids"],
      description:
        "An isolation movement that stretches and contracts the chest through a wide arc. Arms open out wide and then return together in a hugging motion, maximizing pectoral stretch and contraction.",
      gymVariations: [
        "Dumbbell Flat Fly",
        "Incline Dumbbell Fly",
        "Cable Crossover Fly",
        "Pec Deck Machine",
      ],
      bodweightVariations: [
        "Wide Push-Up",
      ],
      image: "https://ik.imagekit.io/yuhonas/tr:w-250,h-180/Butterfly/1.jpg",
    },
  ],

  back: [
    {
      id: "pull-up",
      name: "Pull-Up",
      muscles: ["Latissimus Dorsi", "Biceps", "Rear Deltoids", "Rhomboids"],
      description:
        "One of the best upper-body pulling exercises. You hang from a bar with an overhand grip and pull yourself up until your chin clears the bar. Builds a wide, strong back and serious grip strength.",
      gymVariations: [
        "Lat Pulldown Machine",
        "Assisted Pull-Up Machine",
      ],
      bodweightVariations: [
        "Pull-Up (overhand grip)",
        "Chin-Up (underhand grip)",
        "Negative Pull-Up (lower slowly)",
      ],
      image: "https://ik.imagekit.io/yuhonas/tr:w-250,h-180/Pullups/0.jpg",
    },
    {
      id: "barbell-row",
      name: "Bent-Over Row",
      muscles: ["Latissimus Dorsi", "Rhomboids", "Biceps", "Lower Back"],
      description:
        "A compound pulling exercise performed with a hip hinge. You pull a barbell or dumbbells toward your torso, building thickness and width across the entire back. A staple in every serious training program.",
      gymVariations: [
        "Barbell Bent-Over Row",
        "Dumbbell Row",
        "T-Bar Row",
      ],
      bodweightVariations: [
        "Inverted Row (under a sturdy table)",
        "Resistance Band Row",
      ],
      image: "https://ik.imagekit.io/yuhonas/tr:w-250,h-180/Lying_T-Bar_Row/0.jpg",
    },
    {
      id: "deadlift",
      name: "Deadlift",
      muscles: ["Lower Back (Erectors)", "Hamstrings", "Glutes", "Lats"],
      description:
        "The king of compound lifts. You pull a loaded barbell from the floor to hip height, engaging virtually every muscle in the posterior chain. No other movement builds total-body strength as efficiently.",
      gymVariations: [
        "Conventional Barbell Deadlift",
        "Romanian Deadlift (RDL)",
        "Sumo Deadlift",
        "Trap Bar Deadlift",
      ],
      bodweightVariations: [
        "Single-Leg Deadlift (bodyweight)",
        "Good Morning (bodyweight hip hinge)",
        "Glute Bridge",
      ],
      image: "https://ik.imagekit.io/yuhonas/tr:w-250,h-180/Clean_Deadlift/0.jpg",
    },
  ],

  biceps: [
    {
      id: "bicep-curl",
      name: "Bicep Curl",
      muscles: ["Biceps Brachii", "Brachialis", "Brachioradialis"],
      description:
        "The classic arm-building isolation exercise. You curl the forearm toward the shoulder against resistance, directly targeting the biceps. Can be performed with a barbell, dumbbells, cable, or resistance band.",
      gymVariations: [
        "Barbell Curl",
        "Dumbbell Alternating Curl",
        "Hammer Curl",
        "Preacher Curl",
        "Cable Curl",
      ],
      bodweightVariations: [
        "Chin-Up (underhand grip)",
        "Inverted Row (underhand grip)",
        "Resistance Band Curl",
      ],
      image: "https://ik.imagekit.io/yuhonas/tr:w-250,h-180/Barbell_Curl/1.jpg",
    },
  ],

  triceps: [
    {
      id: "tricep-dip",
      name: "Tricep Pushdown",
      muscles: ["Triceps (Long, medial, and lateral head)"],
      description:
        "A powerful compound movement where you lower and press your bodyweight using parallel bars or a bench. One of the best exercises for overall tricep mass and strength.",
      gymVariations: [
        "JM Press (hybrid of close-grip bench and skull crusher)",
        "Weighted Dip (belt or dumbbell between knees)",
        "Tricep Pushdown (Cable)",
        "Close-Grip Bench Press",
      ],
      bodweightVariations: [
        "Bench Dip",
        "Diamond Push-Up",
        "Parallel Bar Dip (bodyweight)",
      ],
      image: "https://ik.imagekit.io/yuhonas/tr:w-250,h-180/Triceps_Pushdown/0.jpg",
    },
    {
      id: "overhead-tricep-ext",
      name: "Overhead Tricep Extension",
      muscles: ["Triceps Long Head", "Triceps Medial Head"],
      description:
        "An isolation exercise where the arms extend overhead to fully stretch and contract the tricep. This position uniquely targets the long head, which makes up the largest portion of the tricep and creates that horseshoe appearance.",
      gymVariations: [
        "Cable Overhead Extension",
        "Dumbbell Overhead Extension",
        "EZ-Bar Skull Crusher",
      ],
      bodweightVariations: [
        "Diamond Push-Up",
        "Bench Dip",
        "Resistance Band Overhead Extension",
        "Pike Push-Up",
      ],
      image: "https://ik.imagekit.io/yuhonas/tr:w-250,h-180/Triceps_Overhead_Extension_with_Rope/0.jpg",
    },
  ],

  shoulders: [
    {
      id: "overhead-press",
      name: "Overhead Press",
      muscles: ["Anterior Deltoid", "Medial Deltoid", "Triceps", "Serratus"],
      description:
        "The primary compound movement for shoulder development. You press a barbell or dumbbells directly overhead from shoulder height, building size and strength in all three deltoid heads.",
      gymVariations: [
        "Barbell Overhead Press (Standing)",
        "Seated Dumbbell Press",
        "Arnold Press",
        "Machine Shoulder Press",
        "Push Press",
      ],
      bodweightVariations: [
        "Pike Push-Up",
        "Elevated Pike Push-Up (feet on a chair)",
        "Handstand Push-Up (against a wall)",
        "Resistance Band Shoulder Press",
      ],
      image: "https://ik.imagekit.io/yuhonas/tr:w-250,h-180/Dumbbell_Shoulder_Press/1.jpg",
    },
    {
      id: "lateral-raise",
      name: "Lateral Raise",
      muscles: ["Medial Deltoid (Side Delt)"],
      description:
        "An isolation exercise targeting the lateral deltoid. You raise your arms out to the sides to shoulder height, which creates the wide, capped shoulder look that adds breadth to the upper body. Keep a slight bend in the elbows throughout.",
      gymVariations: [
        "Dumbbell Lateral Raise",
        "Cable Lateral Raise",
        "Machine Lateral Raise",
      ],
      bodweightVariations: [
        "Resistance Band Lateral Raise",
        "Wall Handstand Hold",
        "Pike Push-Up",
      ],
      image: "https://ik.imagekit.io/yuhonas/tr:w-250,h-180/Side_Lateral_Raise/1.jpg",
    },
  ],

  legs: [
    {
      id: "squat",
      name: "Squat",
      muscles: ["Quadriceps", "Hamstrings", "Glutes", "Core", "Adductors"],
      description:
        "Often called the king of all exercises. You bend your knees and hips to lower your body under load, then drive through your heels to stand. Unmatched for lower-body strength, muscle mass, and athletic performance.",
      gymVariations: [
        "Barbell Squat",
        "Goblet Squat",
        "Hack Squat",
        "Leg Press",
      ],
      bodweightVariations: [
        "Bodyweight Squat",
        "Jump Squat",
        "Bulgarian Split Squat (rear foot elevated)",
        "Wall Sit",
        "Pistol Squat",
      ],
      image: "https://ik.imagekit.io/yuhonas/tr:w-250,h-180/Hack_Squat/1.jpg",
    },
    {
      id: "lunge",
      name: "Lunge",
      muscles: ["Quadriceps", "Glutes", "Hamstrings", "Hip Flexors"],
      description:
        "A unilateral lower-body exercise that works each leg independently. Stepping into a split stance and lowering the rear knee toward the floor builds strength, balance, and corrects side-to-side muscle imbalances.",
      gymVariations: [
        "Barbell Walking Lunge",
        "Dumbbell Reverse Lunge",
        "Bulgarian Split Squat",
        "Smith Machine Lunge",
      ],
      bodweightVariations: [
        "Bodyweight Forward Lunge",
        "Reverse Lunge",
        "Lateral Lunge",
        "Jump Lunge",
      ],
      image: "https://ik.imagekit.io/yuhonas/tr:w-250,h-180/One_Leg_Barbell_Squat/1.jpg",
    },
  ],

  core: [
    {
      id: "plank",
      name: "Plank",
      muscles: ["Transverse Abdominis", "Rectus Abdominis", "Obliques", "Glutes"],
      description:
        "A fundamental isometric core exercise. You hold your body in a rigid straight line supported by your forearms and toes. Builds deep core stability and endurance that directly improves performance on every other lift.",
      gymVariations: [
        "Weighted Plank",
        "Ab Rollout (ab wheel)",
        "Cable Crunch",
      ],
      bodweightVariations: [
        "Forearm Plank",
        "High Plank (push-up position)",
        "Side Plank",
        "Plank with Hip Dip",
        "Plank Shoulder Tap",
      ],
      image: "https://ik.imagekit.io/yuhonas/tr:w-250,h-180/Plank/1.jpg",
    },
    {
      id: "cable-crunch",
      name: "Cable Crunch",
      muscles: ["Rectus Abdominis", "Obliques", "Hip Flexors"],
      description:
        "A dynamic core exercise combining a crunch with a cycling leg motion. Alternating elbow-to-knee rotations simultaneously target the upper abs and obliques, making it one of the most efficient core movements per rep.",
      gymVariations: [
        "Hanging Leg Raise",
        "Cable Crunch",
        "Ab Machine Crunch",
        "Decline Crunch",
      ],
      bodweightVariations: [
        "Bicycle Crunch",
        "Reverse Crunch",
        "Mountain Climber",
        "V-Up",
        "Russian Twist",
      ],
      image: "https://ik.imagekit.io/yuhonas/tr:w-250,h-180/Cable_Crunch/1.jpg",
    },
  ],
};
