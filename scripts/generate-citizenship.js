#!/usr/bin/env node
/**
 * Generate English for Citizenship — Canadian Citizenship Test Prep
 * Based on "Discover Canada" official study guide
 * 10 chapters, ~50 lessons total for Level 1, focused purely on citizenship test content
 * NO Portuguese translations, NO CELPIP content — pure citizenship test prep in English
 */
const fs = require('fs');

const OPENAI_KEY = fs.readFileSync('/var/www/CELPIP/.env.local', 'utf-8').match(/OPENAI_API_KEY=(.+)/)?.[1];

// 25 lessons covering all 10 Discover Canada topics
const LESSONS = [
  // Chapter 1: Rights & Responsibilities (3 lessons)
  { n: 1, title: "Rights of a Citizen", topic: "Rights & Responsibilities", 
    focus: "Canadian Charter of Rights and Freedoms, fundamental freedoms (conscience, religion, thought, expression, peaceful assembly, association), democratic rights, mobility rights, legal rights, equality rights, language rights" },
  { n: 2, title: "Responsibilities of Citizenship", topic: "Rights & Responsibilities",
    focus: "Obeying the law, serving on a jury, voting in elections, helping others in the community, protecting the environment, eliminating discrimination and injustice" },
  { n: 3, title: "The Oath of Citizenship", topic: "Rights & Responsibilities",
    focus: "The Oath of Citizenship text, meaning of swearing allegiance to the Queen/King, what it means to become Canadian, dual citizenship" },

  // Chapter 2: Who We Are (2 lessons)
  { n: 4, title: "Who We Are: Canadian Identity", topic: "Who We Are",
    focus: "Three founding peoples: Aboriginal, French, British. Multiculturalism. Two official languages: English and French. Bilingual country. Values: equality, respect for cultural differences, freedom, peace" },
  { n: 5, title: "Aboriginal Peoples of Canada", topic: "Who We Are",
    focus: "Three groups: First Nations, Métis, Inuit. Treaties. Residential schools. Aboriginal rights in the Constitution. Indian Act. Self-government." },

  // Chapter 3: Canada's History (5 lessons)
  { n: 6, title: "Early History & Exploration", topic: "Canada's History",
    focus: "Aboriginal peoples first inhabitants. John Cabot 1497. Jacques Cartier 1534. Samuel de Champlain founded Quebec City 1608. New France. Fur trade. Coureurs des bois and voyageurs." },
  { n: 7, title: "The Struggle for Canada", topic: "Canada's History",
    focus: "British vs French rivalry. Battle of the Plains of Abraham 1759. Treaty of Paris 1763. Quebec Act 1774. Constitutional Act 1791 (Upper/Lower Canada). War of 1812 against American invasion. Laura Secord." },
  { n: 8, title: "Confederation", topic: "Canada's History",
    focus: "Confederation July 1, 1867. Dominion of Canada. Four original provinces: Ontario, Quebec, Nova Scotia, New Brunswick. Sir John A. Macdonald first PM. BNA Act (now Constitution Act 1867). Why provinces united: trade, railways, defense." },
  { n: 9, title: "Expansion Westward", topic: "Canada's History",
    focus: "Manitoba 1870. BC joined 1871. PEI 1873. NWMP (now RCMP) 1873. Canadian Pacific Railway completed 1885. Louis Riel and Métis resistance. Saskatchewan and Alberta 1905. Newfoundland 1949." },
  { n: 10, title: "Canada in the World Wars", topic: "Canada's History",
    focus: "WWI 1914-1918: Vimy Ridge (April 1917 — birth of nation). Battle of the Somme. In Flanders Fields by John McCrae. Remembrance Day Nov 11. WWII 1939-1945: D-Day Juno Beach. Battle of the Atlantic. 1 million+ Canadians served." },

  // Chapter 4: Modern Canada (2 lessons)
  { n: 11, title: "Modern Canada", topic: "Modern Canada",
    focus: "Post-WWII prosperity. Baby boom. Immigration waves. Multiculturalism Act 1988. Charter of Rights 1982. Constitution patriated 1982 by Pierre Trudeau. Canada's role in NATO, UN, NORAD. Quiet Revolution in Quebec." },
  { n: 12, title: "Canada's Diversity", topic: "Modern Canada",
    focus: "Immigration policy. Points system. Refugees. Multiculturalism as policy. Languages: English (majority), French (Quebec, New Brunswick, minorities). Heritage languages. Cultural communities." },

  // Chapter 5: How Canadians Govern Themselves (3 lessons)
  { n: 13, title: "Constitutional Monarchy & Parliament", topic: "Government",
    focus: "Constitutional monarchy. King/Queen is Head of State represented by Governor General (federal) and Lieutenant Governors (provincial). Parliament: Senate (appointed, 105) + House of Commons (elected, 338). Three branches: Executive, Legislative, Judicial." },
  { n: 14, title: "The Prime Minister & Cabinet", topic: "Government",
    focus: "PM is Head of Government, leader of the party with most seats. Cabinet ministers run departments. Responsible government: Cabinet must have confidence of House. Opposition parties. Official Opposition." },
  { n: 15, title: "Provincial & Municipal Government", topic: "Government",
    focus: "10 provinces, 3 territories. Provincial premiers. Legislatures (unicameral). Territories governed under federal authority. Municipal governments: mayors, city councils. Education and healthcare are provincial." },

  // Chapter 6: Federal Elections (2 lessons)
  { n: 16, title: "How Federal Elections Work", topic: "Federal Elections",
    focus: "First-past-the-post system. 338 electoral districts (ridings). Secret ballot. Election day. Advance polls. Elections Canada. Eligible voters: Canadian citizens 18+. Voter registration." },
  { n: 17, title: "Your Vote, Your Voice", topic: "Federal Elections",
    focus: "Voting is both a right and a responsibility. How to vote. Political parties: Liberal, Conservative, NDP, Bloc Québécois, Green. By-elections. Minority vs majority government." },

  // Chapter 7: The Justice System (2 lessons)
  { n: 18, title: "The Canadian Justice System", topic: "Justice System",
    focus: "Rule of law. Everyone is equal before the law. Due process. Presumption of innocence. Courts: Supreme Court (9 justices, highest), Federal Court, Provincial/Territorial courts. Jury duty is a citizenship responsibility." },
  { n: 19, title: "Rights in the Justice System", topic: "Justice System",
    focus: "Habeas corpus. Right to a fair trial. Right to an interpreter. Police services. Canadian Human Rights Act. No cruel or unusual punishment. Youth Criminal Justice Act." },

  // Chapter 8: Canadian Symbols (2 lessons)
  { n: 20, title: "National Symbols of Canada", topic: "Canadian Symbols",
    focus: "Maple leaf. Beaver (official emblem). Canadian flag (red-white-red with maple leaf, adopted 1965). O Canada (national anthem). Royal anthem: God Save the King. Coat of Arms. Fleur-de-lis (French heritage). RCMP." },
  { n: 21, title: "Important Canadian Dates", topic: "Canadian Symbols",
    focus: "Canada Day July 1. Remembrance Day Nov 11. Victoria Day (May). Thanksgiving. National Indigenous Peoples Day June 21. Saint-Jean-Baptiste Day June 24 (Quebec). Terry Fox Run. Commonwealth Day." },

  // Chapter 9: Canada's Economy (1 lesson)
  { n: 22, title: "Canada's Economy & Resources", topic: "Canada's Economy",
    focus: "Natural resources: oil, minerals, forests, fish, agriculture. Major industries: manufacturing, technology, services. Trade: NAFTA/CUSMA, largest trading partner is USA. Innovation. Banking system. Employment Insurance. CPP." },

  // Chapter 10: Canada's Regions (2 lessons)
  { n: 23, title: "Atlantic & Central Canada", topic: "Canada's Regions",
    focus: "Atlantic: Newfoundland & Labrador (St. John's), PEI (Charlottetown), Nova Scotia (Halifax), New Brunswick (Fredericton). Central: Quebec (Quebec City, largest province by area), Ontario (Toronto, capital Ottawa). Industries, features." },
  { n: 24, title: "Prairie, West & North", topic: "Canada's Regions",
    focus: "Prairies: Manitoba (Winnipeg), Saskatchewan (Regina), Alberta (Edmonton, oil/gas). West: British Columbia (Victoria capital, Vancouver largest city). North: Yukon (Whitehorse), NWT (Yellowknife), Nunavut (Iqaluit). All 13 capitals." },

  // Checkpoint
  { n: 25, title: "🏆 PRACTICE TEST", situation: "Simulated Citizenship Test — 20 questions", topic: "All Topics", focus: "" },
];

async function generateLesson(lesson) {
  if (lesson.n === 25) {
    return {
      number: 25, title: lesson.title, situation: 'Simulated Canadian Citizenship Test — 20 questions from all topics',
      grammarFocus: 'All Topics', keyPhrases: [],
      dialogue: [], vocabulary: [],
      exercises: [{ type: 'checkpoint', order: 1, question: { text: 'Practice Citizenship Test — 20 questions coming soon!' }, correct: {}, points: 50 }],
    };
  }

  const prompt = `You are creating a Canadian Citizenship Test preparation lesson based on the official "Discover Canada" study guide.

LESSON ${lesson.n}: "${lesson.title}"
TOPIC: ${lesson.topic}
KEY CONTENT: ${lesson.focus}

Generate a lesson in JSON format. NO Portuguese translations — everything in English only. This is citizenship test prep, not language learning.

{
  "keyFacts": [
    { "fact": "A key fact from Discover Canada that could appear on the test", "detail": "Additional context or explanation" }
  ],
  "exercises": [
    {
      "type": "citizenship_question",
      "order": 1,
      "question": { "text": "Question exactly like the real citizenship test" },
      "options": ["Correct answer", "Plausible wrong 1", "Plausible wrong 2", "Plausible wrong 3"],
      "correct": 0,
      "points": 10,
      "explanation": "Brief explanation of why this is correct, referencing Discover Canada"
    }
  ]
}

REQUIREMENTS:
- keyFacts: 8-10 important facts from Discover Canada about this topic. Must be ACCURATE real facts.
- exercises: 8-10 multiple choice questions in the EXACT style of the real citizenship test
- Questions should mix: direct recall ("What year..."), understanding ("Why did..."), and application ("Which right protects...")
- All 4 options must be plausible — real names, real dates, real places (just wrong for THAT question)
- Include an explanation for each answer referencing the Discover Canada guide
- All facts must be ACCURATE — this is test prep, not creative writing
- NO Portuguese, NO translations — English only
- Focus on what's MOST LIKELY to appear on the actual test

Respond with valid JSON only.`;

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${OPENAI_KEY}` },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.5,
      max_tokens: 4000,
      response_format: { type: 'json_object' },
    }),
  });

  const data = await res.json();
  if (!data.choices?.[0]?.message?.content) {
    console.error(`Failed lesson ${lesson.n}:`, data.error);
    return null;
  }

  try {
    const content = JSON.parse(data.choices[0].message.content);
    return {
      number: lesson.n,
      title: lesson.title,
      situation: `${lesson.topic} — Canadian Citizenship Test`,
      grammarFocus: lesson.topic,
      keyPhrases: [],
      dialogue: content.keyFacts || [],
      vocabulary: [],
      exercises: (content.exercises || []).map((e, i) => ({ ...e, order: i + 1 })),
    };
  } catch (e) {
    console.error(`Parse error lesson ${lesson.n}:`, e.message);
    return null;
  }
}

async function main() {
  const outDir = '/var/www/CELPIP/public/data/english';
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const outPath = `${outDir}/level1.json`;
  let lessons = [];

  for (const lesson of LESSONS) {
    console.log(`Generating lesson ${lesson.n}: "${lesson.title}"...`);
    let retries = 0, result = null;
    while (!result && retries < 3) {
      result = await generateLesson(lesson);
      if (!result) retries++;
    }
    
    if (result) {
      lessons.push(result);
      lessons.sort((a, b) => a.number - b.number);
      fs.writeFileSync(outPath, JSON.stringify(lessons, null, 2));
      console.log(`  ✅ Lesson ${lesson.n} done (${result.exercises.length} exercises, ${(result.dialogue || []).length} key facts)`);
    } else {
      console.log(`  ❌ Lesson ${lesson.n} FAILED`);
    }
    await new Promise(r => setTimeout(r, 500));
  }

  console.log(`\n🎉 Complete! ${lessons.length} lessons generated`);
}

main().catch(console.error);
