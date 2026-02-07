// Writing Guide Content - Based on Mike's Teaching Method

export interface GuideSection {
  id: string;
  title: string;
  icon: string;
  description: string;
  content: ContentBlock[];
}

export interface ContentBlock {
  type: 'text' | 'heading' | 'tip' | 'warning' | 'example' | 'formula' | 'list' | 'comparison';
  content: string;
  items?: string[];
  good?: string;
  bad?: string;
}

// ============================================
// CSF FRAMEWORK
// ============================================

export const csfFramework: GuideSection = {
  id: 'csf',
  title: 'The CSF Framework',
  icon: '🎯',
  description: 'Context, Skill, Formula - The foundation of every CELPIP response',
  content: [
    {
      type: 'text',
      content: 'Before writing anything, you need to understand three things: what you need to know (Context), what the examiner wants (Skill), and your step-by-step approach (Formula).'
    },
    {
      type: 'heading',
      content: 'C - Context: What do I need to know?'
    },
    {
      type: 'text',
      content: 'From the question, identify two things:'
    },
    {
      type: 'list',
      content: '',
      items: [
        'THE WHAT: What is the problem or situation causing you to write?',
        'THE WHY: Why are you writing this letter/email?',
        'THE WHO: Who are you writing to? (This determines your opening)'
      ]
    },
    {
      type: 'example',
      content: 'Example: "You attended a community picnic. Some people have allergies but no one listed ingredients." → WHAT: Allergy problem at picnic. WHY: To suggest listing ingredients. WHO: Community picnic organizer.'
    },
    {
      type: 'heading',
      content: 'S - Skill: What does the examiner want?'
    },
    {
      type: 'text',
      content: 'The examiner is looking for two main things:'
    },
    {
      type: 'list',
      content: '',
      items: [
        'STRUCTURE: Do you know the correct format for an email/letter/opinion?',
        'REALISM: Does your response sound like a real person wrote it?'
      ]
    },
    {
      type: 'warning',
      content: 'A generic response gets a LOWER score than a realistic one. Even if your grammar is perfect, being too generic hurts your score.'
    },
    {
      type: 'heading',
      content: 'F - Formula: What is my step-by-step?'
    },
    {
      type: 'text',
      content: 'The formula is different from a template. A template uses the exact same words every time (bad). A formula guides your structure while you change the words (good).'
    },
    {
      type: 'tip',
      content: 'By the end of this guide, you will have a formula for both Task 1 and Task 2 that you can follow every time.'
    }
  ]
};

// ============================================
// MAKE IT REAL TECHNIQUE
// ============================================

export const makeItRealTechnique: GuideSection = {
  id: 'make-it-real',
  title: 'Make It Real',
  icon: '✨',
  description: 'The secret to high scores: add realistic, specific details',
  content: [
    {
      type: 'text',
      content: 'Generic responses get LOW scores. Realistic, specific responses get HIGH scores. The good news? You can INVENT details to make your writing feel real.'
    },
    {
      type: 'tip',
      content: 'The CELPIP test will never tell you the name of the person you\'re writing to. But YOU can decide to know their name. This makes your writing more realistic and improves your score.'
    },
    {
      type: 'heading',
      content: 'What can you invent?'
    },
    {
      type: 'list',
      content: '',
      items: [
        'NAMES: "Dear Mrs. Silva" instead of "To Whom It May Concern"',
        'PLACES: "Trinity Bellwoods Park" instead of "the park"',
        'PEOPLE: "My neighbor Nico brought a dish from Italy"',
        'NUMBERS: "$15,000 more expensive" or "10 minute walk"',
        'DATES: "Last Tuesday" instead of "recently"',
        'DETAILS: "The teenagers were playing loud music until 2am"'
      ]
    },
    {
      type: 'comparison',
      content: 'See the difference:',
      bad: 'I am writing about a problem at the picnic. Some people have allergies.',
      good: 'I am writing about the allergy situation at last Saturday\'s picnic at Trinity Bellwoods Park. I was devastated when I could not try a dish from Italy that our neighbor Nico brought, because I had no idea what ingredients he used.'
    },
    {
      type: 'warning',
      content: 'Only invent details that are REALISTIC. If the test says you have a nut allergy, don\'t say you have a gluten allergy instead - add it as an extra detail.'
    },
    {
      type: 'heading',
      content: 'When to Make It Real'
    },
    {
      type: 'list',
      content: '',
      items: [
        'Opening: Create a name for who you\'re writing to',
        'Introduction: Add how you know this person',
        'Body: Add specific examples with names, places, numbers',
        'Closing: Offer specific help ("Please let me know if you need help writing the ingredient list")'
      ]
    }
  ]
};

// ============================================
// TASK 1 FORMULA
// ============================================

export const task1Formula: GuideSection = {
  id: 'task1-formula',
  title: 'Task 1 Formula (Email/Letter)',
  icon: '✉️',
  description: 'The exact structure for a perfect Task 1 response',
  content: [
    {
      type: 'text',
      content: 'Task 1 is always an email or letter. You have 27 minutes and need to write 150-200 words. CELPIP will always give you a formal or semi-formal situation.'
    },
    {
      type: 'heading',
      content: 'The 5-Part Formula'
    },
    {
      type: 'formula',
      content: `1. OPENING LINE
   → Dear [Name] or Dear [Position] or To Whom It May Concern

2. INTRODUCTION (2 sentences MAX)
   → WHO: My name is [Name] and I am [relationship/context]
   → WHY: I am writing this email to [reason]

3. BODY (Answer ALL questions from the test)
   → First of all, [Point 1 + Story]
   → Second, [Point 2 + Story]  
   → Finally, [Point 3 + Story]

4. CLOSING
   → Call to Action (if needed): May I request/suggest...
   → Please let me know if [specific offer]

5. SIGN-OFF
   → Regards,
   → [Full Name]`
    },
    {
      type: 'heading',
      content: 'Opening Line Rules'
    },
    {
      type: 'list',
      content: 'Choose ONE of these options:',
      items: [
        'Dear Mr./Mrs./Ms. [Last Name] - If you know or create a name',
        'Dear [Position] - Example: "Dear Community Picnic Organizer"',
        'To Whom It May Concern - Only if you don\'t know name or position'
      ]
    },
    {
      type: 'tip',
      content: '"Dear Henry Street High School Principal" is BETTER than "Dear Principal" - it\'s more realistic!'
    },
    {
      type: 'heading',
      content: 'Introduction Rules'
    },
    {
      type: 'warning',
      content: 'Keep it SHORT! Maximum 2 sentences. If your introduction is too long, you lose points.'
    },
    {
      type: 'comparison',
      content: 'Introduction examples:',
      bad: 'My name is Mike and I am a person who went to your picnic last week and I really enjoyed it and I want to talk about something important.',
      good: 'My name is Mike, and we met at last week\'s Trinity Bellwoods Park picnic. I am writing to discuss the allergy concerns from the event.'
    },
    {
      type: 'heading',
      content: 'Body Paragraph Rules'
    },
    {
      type: 'text',
      content: 'CELPIP always gives you 3-4 things to address. Answer ALL of them, one paragraph each. Always use organization words:'
    },
    {
      type: 'list',
      content: '',
      items: [
        'First of all, / First, / Firstly,',
        'Second, / Secondly, / Additionally,',
        'Finally, / Third, / Moreover,'
      ]
    },
    {
      type: 'heading',
      content: 'Closing Rules'
    },
    {
      type: 'text',
      content: 'Always end with "Please let me know if..." - This is CRITICAL for a high score because it makes your email realistic and polite.'
    },
    {
      type: 'comparison',
      content: 'Closing examples:',
      bad: 'Please let me know if you need anything else.',
      good: 'Please let me know if you need assistance organizing the ingredient labels for next year\'s event.'
    }
  ]
};

// ============================================
// TASK 2 FORMULA (PRE)
// ============================================

export const task2Formula: GuideSection = {
  id: 'task2-formula',
  title: 'Task 2 Formula (Opinion Survey)',
  icon: '📝',
  description: 'The PRE technique for perfect arguments',
  content: [
    {
      type: 'text',
      content: 'Task 2 is always an opinion survey. You have 26 minutes and need to write 150-200 words. You will choose between two options and defend your choice.'
    },
    {
      type: 'warning',
      content: 'Task 2 is NOT like Task 1. You do NOT need "Dear..." or sign-off. It\'s a survey response, not an email.'
    },
    {
      type: 'heading',
      content: 'The PRE Technique'
    },
    {
      type: 'text',
      content: 'Every argument needs THREE parts. Without all three, your argument is incomplete:'
    },
    {
      type: 'formula',
      content: `P - POINT: Your direct answer/claim
   "Picnics should be allowed in parks"

R - REASON: WHY is this important?
   "They improve family health and community bonds"

E - EXAMPLE: A specific, realistic illustration
   "Every time I go to Trinity Bellwoods Park with my dad, we feel healthier and more connected"`
    },
    {
      type: 'heading',
      content: 'The Task 2 Structure'
    },
    {
      type: 'formula',
      content: `INTRODUCTION (1-2 sentences)
   → I would rather/recommend/suggest [OPINION]

BODY PARAGRAPH 1
   → First of all, [PRE #1]

BODY PARAGRAPH 2
   → Second, [PRE #2]

BODY PARAGRAPH 3
   → Finally, [PRE #3]

CONCLUSION (2-3 sentences)
   → In conclusion, [OPINION rephrased]
   → This is because [Point 1], [Point 2], and [Point 3]`
    },
    {
      type: 'heading',
      content: 'Introduction Openers'
    },
    {
      type: 'text',
      content: 'Use ONE of these structures to start. Notice the verb form after each:'
    },
    {
      type: 'list',
      content: '',
      items: [
        'I would rather [BASE VERB] → I would rather picnics BE allowed',
        'I recommend that [BASE VERB] → I recommend that picnics BE allowed',
        'I would suggest [BASE VERB] → I would suggest the city KEEP picnics',
        'In my opinion, I would prefer [BASE VERB]'
      ]
    },
    {
      type: 'warning',
      content: 'Never say "Option A" or "Option B" in your response! Paraphrase what the option says instead.'
    },
    {
      type: 'heading',
      content: 'Conclusion Formula'
    },
    {
      type: 'text',
      content: 'Your conclusion should: 1) Restate your opinion with DIFFERENT WORDS, 2) Summarize your 3 points.'
    },
    {
      type: 'example',
      content: 'In conclusion, having a gas vehicle is the best choice for most people because it is cheaper, it drives longer distances, and it is more stylish.'
    },
    {
      type: 'heading',
      content: 'Using the "Other Side" Argument'
    },
    {
      type: 'text',
      content: 'You CAN mention a benefit of the other option to show balanced thinking. But you must COUNTER it:'
    },
    {
      type: 'example',
      content: 'On the other hand, having an exam in class might help the teacher give us scores faster. However, we as students are not as worried about speed as we are about getting a good result.'
    }
  ]
};

// ============================================
// COMMON MISTAKES
// ============================================

export const commonMistakes: GuideSection = {
  id: 'mistakes',
  title: 'Common Mistakes',
  icon: '⚠️',
  description: 'Avoid these errors that hurt your score',
  content: [
    {
      type: 'heading',
      content: '❌ Contractions'
    },
    {
      type: 'text',
      content: 'NEVER use contractions in CELPIP writing. This is formal writing.'
    },
    {
      type: 'comparison',
      content: '',
      bad: "don't, can't, won't, I'm, they're, it's",
      good: 'do not, cannot (one word!), will not, I am, they are, it is'
    },
    {
      type: 'heading',
      content: '❌ Wrong Opening'
    },
    {
      type: 'comparison',
      content: '',
      bad: 'Dear Teacher, / Hello, / Hi, / To the manager,',
      good: 'Dear Mr. Smith, / Dear Professor Wilson, / Dear Customer Service Manager,'
    },
    {
      type: 'heading',
      content: '❌ "Option A/B"'
    },
    {
      type: 'comparison',
      content: 'In Task 2:',
      bad: 'I choose Option B because...',
      good: 'I would rather picnics be allowed in public parks because...'
    },
    {
      type: 'heading',
      content: '❌ No Organization'
    },
    {
      type: 'comparison',
      content: '',
      bad: 'Writing three paragraphs without First/Second/Finally',
      good: 'First of all... Second... Finally...'
    },
    {
      type: 'heading',
      content: '❌ Wrong Sign-off'
    },
    {
      type: 'comparison',
      content: '',
      bad: 'Best Regard (not a word!) / Thanks / Thank you for reading',
      good: 'Regards, / Best regards, / Kind regards,'
    },
    {
      type: 'heading',
      content: '❌ Introduction Too Long'
    },
    {
      type: 'comparison',
      content: '',
      bad: 'Writing 4-5 sentences explaining who you are and the whole situation',
      good: 'Maximum 2 sentences: WHO you are + WHY you\'re writing'
    },
    {
      type: 'heading',
      content: '❌ Missing "Please let me know if..."'
    },
    {
      type: 'text',
      content: 'Always include this before your sign-off. It makes your email polite and realistic.'
    },
    {
      type: 'heading',
      content: '❌ Generic Closing'
    },
    {
      type: 'comparison',
      content: '',
      bad: 'Please let me know if you need anything else.',
      good: 'Please let me know if you need help organizing the ingredient list for next year.'
    },
    {
      type: 'heading',
      content: '❌ Starting Task 2 with "Dear..."'
    },
    {
      type: 'text',
      content: 'Task 2 is a SURVEY, not an email. Don\'t use greetings or sign-offs.'
    },
    {
      type: 'heading',
      content: '❌ Not Using Context from the Question'
    },
    {
      type: 'comparison',
      content: 'If the question mentions "allergies such as nuts and seafood":',
      bad: 'Some people have allergies...',
      good: 'There are individuals, including myself, who have food allergies such as those related to nuts and seafood.'
    }
  ]
};

// ============================================
// CHECKLIST
// ============================================

export interface ChecklistItem {
  id: string;
  text: string;
  task: 'task1' | 'task2' | 'both';
  critical: boolean;
}

export const writingChecklist: ChecklistItem[] = [
  // Task 1 Specific
  { id: 'opening', text: 'Opening line: Dear [Name/Position] or To Whom It May Concern', task: 'task1', critical: true },
  { id: 'who', text: 'Introduction includes WHO you are', task: 'task1', critical: true },
  { id: 'why', text: 'Introduction includes WHY you\'re writing', task: 'task1', critical: true },
  { id: 'intro-short', text: 'Introduction is MAX 2 sentences', task: 'task1', critical: false },
  { id: 'please-let-me-know', text: 'Closing has "Please let me know if..."', task: 'task1', critical: true },
  { id: 'regards', text: 'Sign-off: Regards + Full Name', task: 'task1', critical: true },
  
  // Task 2 Specific
  { id: 'opinion-opener', text: 'Introduction uses: I would rather/recommend/suggest', task: 'task2', critical: true },
  { id: 'no-option-ab', text: 'Did NOT say "Option A" or "Option B"', task: 'task2', critical: true },
  { id: 'pre-complete', text: 'Each paragraph has Point + Reason + Example', task: 'task2', critical: true },
  { id: 'conclusion-restate', text: 'Conclusion restates opinion with different words', task: 'task2', critical: true },
  { id: 'conclusion-points', text: 'Conclusion summarizes all 3 points', task: 'task2', critical: false },
  { id: 'no-greeting', text: 'No "Dear..." or sign-off (it\'s a survey!)', task: 'task2', critical: true },
  
  // Both Tasks
  { id: 'no-contractions', text: 'No contractions (don\'t → do not)', task: 'both', critical: true },
  { id: 'organization', text: 'Used First/Second/Finally organization', task: 'both', critical: true },
  { id: 'all-questions', text: 'Answered ALL questions from the prompt', task: 'both', critical: true },
  { id: 'word-count', text: 'Word count: 150-200 words', task: 'both', critical: true },
  { id: 'realistic', text: 'Added realistic details (names, places, numbers)', task: 'both', critical: false },
  { id: 'spell-check', text: 'Checked spelling (look for red underlines)', task: 'both', critical: false },
];

// ============================================
// EXAMPLE TEMPLATES
// ============================================

export interface Template {
  id: string;
  name: string;
  task: 'task1' | 'task2';
  structure: string;
  example: string;
}

export const task1Template: Template = {
  id: 'task1-email',
  name: 'Formal Email Template',
  task: 'task1',
  structure: `Dear [Mr./Mrs. Last Name OR Position],

My name is [Your Name], and [WHO you are/how you know them]. I am writing this email to [WHY - brief reason].

First of all, [Point 1 from the question]. [Add realistic story/detail].

Second, [Point 2 from the question]. [Add realistic story/detail].

Finally, [Point 3 from the question - often a suggestion]. [Add realistic story/detail].

Please let me know if [specific offer related to the topic].

Regards,
[Your Full Name]`,
  example: `Dear Mrs. Silva,

My name is Michael Chen, and we met at last Saturday's community picnic at Trinity Bellwoods Park. I am writing this email to discuss the allergy concerns from the event.

First of all, I thoroughly enjoyed the picnic. The variety of dishes and the friendly atmosphere made it a wonderful community gathering.

Second, I noticed that most participants did not include ingredient lists with their dishes. As someone with severe nut and seafood allergies, I was devastated when I could not try my neighbor Nico's homemade pasta because I had no idea what ingredients he used.

Finally, I would like to suggest that for next year's event, all participants be requested to include a small ingredient card with their dishes. This simple addition would allow everyone to safely enjoy the potluck.

Please let me know if you need assistance creating a template for the ingredient cards.

Regards,
Michael Chen`
};

export const task2Template: Template = {
  id: 'task2-opinion',
  name: 'Opinion Survey Template',
  task: 'task2',
  structure: `[In my opinion,] I would rather/recommend/suggest [YOUR OPINION].

First of all, [POINT 1]. [REASON why this matters]. [EXAMPLE - realistic story].

Second, [POINT 2]. [REASON why this matters]. [EXAMPLE - realistic story].

Finally, [POINT 3]. [REASON why this matters]. [EXAMPLE - realistic story].

In conclusion, [OPINION restated with different words] because [Point 1], [Point 2], and [Point 3].`,
  example: `In my opinion, I would rather the city continue to allow family picnics in public parks.

First of all, public outdoor spaces are essential for community health. With childhood obesity on the rise, we should encourage families to spend time outside. Every time I visit Trinity Bellwoods Park on weekends, I see dozens of families exercising, playing, and bonding together.

Second, allowing picnics creates a safer environment. Parks with more visitors tend to have lower crime rates because there are always people around. My neighborhood park became much safer after the city started hosting monthly community events there.

Finally, these gatherings help build stronger communities. When families share meals together in public spaces, they create connections with their neighbors. Last summer, I met three families from my street at a park picnic, and we now help each other with childcare.

In conclusion, maintaining family picnics in public parks is beneficial because they improve public health, increase safety, and strengthen community bonds.`
};

// Export all sections
export const allGuideSections: GuideSection[] = [
  csfFramework,
  makeItRealTechnique,
  task1Formula,
  task2Formula,
  commonMistakes
];
