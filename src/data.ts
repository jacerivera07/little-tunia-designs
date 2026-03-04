export interface Product {
  id: string;
  title: string;
  description: string;
  whatsInside?: string[];
  perfectFor?: string[];
  price: number;
  category: 'Educational' | 'Design Services';
  image: string;
  features: string[];
}

export const products: Product[] = [
  {
    id: '1',
    title: 'Cursive Mastery for Intermediate Learners Workbook - PRINTABLE',
    description: 'Take your cursive writing to the next level! This workbook is designed for intermediate learners who already know the basics and are ready to refine their skills. Packed with engaging exercises, practice sheets, and tips, it helps improve speed, consistency, and style in your handwriting. Whether for school, personal notes, or creative projects, this workbook makes mastering cursive both fun and effective. Perfect for learners who want to write beautifully and confidently!',
    whatsInside: ['Printable PDF file (delivered after payment)', 'Step-by-step practice for intermediate level', 'Creative and practical writing exercises', 'Focus on fluidity, neatness, and style', 'Ideal for self-paced learning'],
    price: 300,
    category: 'Educational',
    image: '/Product images/Cursive Mastery for Intermediate Learners Workbook - PRINTABLE.png',
    features: ['90+ pages', 'Letter, A4, and A5 sizes', 'PDF format (32MB)']
  },
  {
    id: '2',
    title: 'Printable Tracing Book for Kids – Alphabet, Numbers & Shapes',
    description: 'Help your child build strong writing foundations with this fun and engaging tracing book! Designed for preschoolers and early learners, this print-style tracing workbook includes uppercase & lowercase letters, numbers 1–20, and basic shapes – all in a clear, beginner-friendly format.',
    whatsInside: ['A-Z Alphabet (Uppercase & Lowercase)', 'Numbers 1–20', 'Basic Shapes (Circle, Square, Triangle, etc.)', 'Large tracing lines and guided strokes', 'Fun illustrations to keep kids engaged'],
    perfectFor: ['Toddlers and preschoolers', 'Homeschool and classroom use', 'Developing fine motor skills', 'Printable learning gift packs'],
    price: 300,
    category: 'Educational',
    image: '/Product images/Printable Tracing Book for Kids – Alphabet, Numbers & Shapes.png',
    features: ['90+ pages', 'Letter, A4, and A5 sizes', 'PDF format (74MB)', 'Digital Product – PDF File Only', 'Print as many copies as you need for personal use', 'No physical item will be shipped']
  },
  {
    id: '3',
    title: 'Printable Cursive Tracing Book',
    description: 'Help learners master beautiful cursive handwriting with this downloadable and printable tracing workbook. Designed to be engaging and easy to use, this PDF file is ready to print on US Letter, A4, or A5 size paper – just download, print, and start tracing!',
    whatsInside: ['A-Z uppercase & lowercase cursive letters', 'Cursive words and sentence practice', 'Beginner-friendly layout', 'Clean, high-contrast tracing lines', 'Ideal for daily handwriting practice'],
    perfectFor: ['Kids learning cursive', 'Homeschoolers and tutors', 'Adults improving handwriting', 'Great for printable gift bundles'],
    price: 300,
    category: 'Educational',
    image: '/Product images/Printable Cursive Tracing Book.png',
    features: ['70+ pages', 'Letter, A4, and A5 sizes', 'PDF format (80MB)', 'Digital Download Only – PDF File', 'Print as many copies as you like for personal use', 'No physical product will be shipped']
  },
  {
    id: '4',
    title: "Teacher's Planner PRINTABLE SY 2025-2026 - Floral Themed",
    description: "Teach with confidence and stay organized using this Printable Teacher's Planner, thoughtfully designed for Filipino educators. This 23-page PDF includes all the essential planning tools you need, and you can simply reprint the daily lesson plan pages to complete each grading period. Reuse and print as many copies as you need! One planner file covers your needs for an entire school year when printed strategically.",
    whatsInside: ['2025 & 2026 Calendars', 'Curriculum Maps for 6 Subjects', 'Output Tracker', 'Daily Lesson Plan Template', 'Attendance Sheet', 'Grading Sheet', 'Printable in either A4 or A5 size'],
    perfectFor: ['Public & private school teachers', 'Subject teachers & class advisers', 'Those who want a minimal yet functional planner'],
    price: 300,
    category: 'Educational',
    image: "/Product images/Teacher's Planner PRINTABLE SY 2025-2026 - Floral Themed.png",
    features: ['23 pages', 'A4, A5, Letter sizes', 'PDF format (16.7MB)', '1 High-Resolution PDF File', 'Unlimited personal printing', 'Instant digital download – no physical product will be shipped']
  },
  {
    id: '5',
    title: 'PRINTABLE - Uppercase Letters Workbook for Ages 3-4-5',
    description: "Help your little one get ready for writing with this fun and easy-to-follow Lines and Letters Workbook! Perfect for preschoolers and early learners, this printable activity book introduces the basic lines that form every letter of the alphabet: Standing lines, Sleeping lines, Slanting lines, Curved lines, Wavy lines, and Round lines. Start your child's handwriting journey today with this engaging, skill-building workbook!",
    whatsInside: ['Standing lines', 'Sleeping lines', 'Slanting lines', 'Curved lines', 'Wavy lines', 'Round lines'],
    perfectFor: ['Parents teaching at home', 'Preschool & Kindergarten teachers', 'Homeschool activities', 'Early handwriting practice'],
    price: 300,
    category: 'Educational',
    image: '/Product images/PRINTABLE - Uppercase Letters Workbook for Ages 3-4-5.png',
    features: ['60 pages', 'PDF format', 'A4, A5, and Letter sizes', '1 PDF file (printable at home or school)', 'Unlimited printing for personal use']
  },
  {
    id: '6',
    title: "PRINTABLE - Bible Devotion Beginner's Workbook",
    description: "Pen. Paper. Prayer. is a beautifully designed workbook that offers a simple, meaningful path to Bible devotion, journaling, and honest reflection. Whether you're starting your faith journey, coming back after a dry season, or simply craving a more personal connection with God, this workbook is for you. No need to be a Bible expert. No perfect words required. Just show up — with your pen, paper, and an open heart. Printable on A4 or A5 paper sizes — perfect for binders, journals, or DIY devotion books. Start where you are. Let God meet you there.",
    whatsInside: ['Guided devotional pages', 'Creative journaling prompts', 'Space for prayer, reflection, and real conversations with God', 'Inner peace'],
    perfectFor: ['First-time journalers', 'Quiet time with God', 'Gifting to a friend who needs encouragement', 'Youth groups, small groups, and personal devotion'],
    price: 400,
    category: 'Educational',
    image: "/Product images/PRINTABLE - Bible Devotion Beginner's Workbook.png",
    features: ['64 pages', 'PDF format', 'A4, A5, and Letter sizes', 'Printable for binders, journals, or DIY devotion books']
  },
  {
    id: '7',
    title: "PRINTABLE - Teacher's Planner",
    description: "Teach with confidence and stay organized using this Printable Teacher's Planner, thoughtfully designed for Filipino educators. This 23-page PDF includes all the essential planning tools you need, and you can simply reprint the daily lesson plan pages to complete each grading period. Reuse and print as many copies as you need! One planner file covers your needs for an entire school year when printed strategically.",
    whatsInside: ['2025 & 2026 Calendars', 'Curriculum Maps for 6 Subjects', 'Output Tracker', 'Daily Lesson Plan Template', 'Attendance Sheet', 'Grading Sheet', 'Printable in either A4 or A5 size'],
    perfectFor: ['Public & private school teachers', 'Subject teachers & class advisers', 'Those who want a minimal yet functional planner'],
    price: 300,
    category: 'Educational',
    image: "/Product images/PRINTABLE - Teacher's Planner.png",
    features: ['23 pages', '1 High-Resolution PDF File', 'Unlimited personal printing', 'Instant digital download – no physical product will be shipped', 'PDF format (14MB)', 'A4, A5, and Letter sizes']
  }
];
