#!/usr/bin/env node
/**
 * Generate Levels 4-5 for English for Citizenship
 * Level 4: Advanced Topics (tricky questions, deep details)
 * Level 5: Practice Tests (5 full 20-question simulated tests + topic reviews)
 */
const fs = require('fs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const OPENAI_KEY = fs.readFileSync('/var/www/CELPIP/.env.local', 'utf-8').match(/OPENAI_API_KEY=(.+)/)?.[1];

const LEVELS = {
  4: {
    lessons: [
      { n:1, title:"Tricky Dates in Canadian History", topic:"History", focus:"1497 Cabot, 1534 Cartier, 1608 Champlain Quebec, 1759 Plains of Abraham, 1774 Quebec Act, 1791 Constitutional Act, 1812 War, 1867 Confederation, 1870 Manitoba, 1871 BC, 1873 PEI+NWMP, 1885 CPR+Riel, 1905 Sask+Alta, 1914-18 WWI, 1917 Vimy, 1939-45 WWII, 1949 Newfoundland, 1965 Flag, 1969 Official Languages Act, 1982 Constitution patriated, 1988 Multiculturalism Act, 1999 Nunavut" },
      { n:2, title:"Who Said What? Famous Quotes", topic:"History", focus:"'The True North strong and free' (O Canada), 'A Mari Usque Ad Mare' (coat of arms, from sea to sea), 'Peace, Order, and Good Government' (BNA Act), 'In Flanders Fields' (John McCrae), Oath of Citizenship text, Charter preamble 'Canada is founded upon principles that recognize the supremacy of God and the rule of law'" },
      { n:3, title:"Numbers That Matter", topic:"All", focus:"338 MPs, 105 senators, 10 provinces, 3 territories, 13 capitals, 9 Supreme Court justices, 75 retirement age senators, 18 voting age, 20 questions on test, 75% pass mark, 3 of 5 years residency, 2 official languages, 6 time zones, 3 oceans border Canada" },
      { n:4, title:"Commonly Confused Facts", topic:"All", focus:"Head of State (King) vs Head of Government (PM), Governor General vs Lieutenant Governor, Senate (appointed) vs Commons (elected), Federal vs Provincial powers, Common law vs Civil law (Quebec), First Nations vs Métis vs Inuit, Confederation (1867) vs Constitution patriation (1982)" },
      { n:5, title:"The Charter: Section by Section", topic:"Rights", focus:"Section 1 reasonable limits, Section 2 fundamental freedoms, Sections 3-5 democratic rights, Section 6 mobility, Sections 7-14 legal rights, Section 15 equality, Sections 16-23 language rights, Section 25 Aboriginal rights, Section 27 multiculturalism, Section 28 gender equality" },
      { n:6, title:"All the Prime Ministers", topic:"Government", focus:"Macdonald (1st, Confederation), Laurier (1st French-Canadian), Borden (WWI, women's suffrage), King (longest serving, WWII), Diefenbaker (Bill of Rights), Pearson (flag, medicare, Nobel Peace), P.E. Trudeau (Charter, patriation), Mulroney (NAFTA, GST), Chrétien (clarity act), Harper, J. Trudeau" },
      { n:7, title:"Provincial Powers vs Federal Powers", topic:"Government", focus:"Federal: defense, criminal law, banking, postal, Indigenous affairs, immigration (shared), trade. Provincial: education, healthcare, highways, natural resources, property/civil rights, municipalities. Shared: immigration, agriculture, pensions" },
      { n:8, title:"Indigenous Rights & Treaties", topic:"Rights", focus:"Royal Proclamation 1763, numbered treaties, Indian Act 1876, residential schools (last closed 1996), Section 35 Aboriginal rights, Duty to consult, Truth and Reconciliation 2015, 94 Calls to Action, MMIWG, land claims, self-government agreements" },
      { n:9, title:"Canada's Wars & Battles", topic:"History", focus:"War of 1812 (British/Canadian vs US), Fenian raids, South African (Boer) War, WWI (Ypres gas attack, Somme, Vimy Ridge, Passchendaele), WWII (Battle of Atlantic, Dieppe, Sicily, D-Day Juno, Liberation of Netherlands), Korean War, peacekeeping (Suez 1956), Afghanistan 2001-2014" },
      { n:10, title:"Electoral System Details", topic:"Elections", focus:"First-past-the-post explained, 338 ridings, redistribution every 10 years (census), election writs, nomination process, candidate deposits, spending limits, third-party advertising, voter turnout trends, election day Monday, advance polls, special ballots" },
      { n:11, title:"The Court System Hierarchy", topic:"Justice", focus:"Supreme Court (9 justices: 3 from QC, final appeal, constitutional questions), Federal Court (immigration, intellectual property), Federal Court of Appeal, Provincial Superior Courts (serious criminal, large civil), Provincial Courts (most criminal cases), Small Claims, Family Court, Tax Court of Canada" },
      { n:12, title:"Symbols: The Details", topic:"Symbols", focus:"Maple leaf: sugar maple, national tree. Beaver: official emblem since 1975, fur trade history. Flag: red=sacrifice/valour, white=peace/tranquility, 1:2:1 proportions. Coat of arms: lion, unicorn, fleur-de-lis, Irish harp, English roses, Scottish thistles, French lilies. Tartan: maple leaf tartan. Canadian horse: national breed" },
      { n:13, title:"Provinces: Population & Economy", topic:"Regions", focus:"Ontario: 14.8M (largest pop), manufacturing/finance. Quebec: 8.6M, aerospace/hydro. BC: 5.1M, film/tech/port. Alberta: 4.4M, oil/gas. Manitoba: 1.4M, agriculture/mining. Saskatchewan: 1.2M, potash/uranium/wheat. NS: 1M, ocean tech. NB: 800K, bilingual. NL: 520K, oil/fish. PEI: 160K (smallest), tourism/agriculture" },
      { n:14, title:"Famous Canadians", topic:"History", focus:"Terry Fox (Marathon of Hope), Tommy Douglas (father of medicare), Alexander Graham Bell (telephone, lived in NS), Sir Frederick Banting (insulin), Lester Pearson (Nobel Peace, flag), Pierre Trudeau (Charter), Wayne Gretzky, Céline Dion, Margaret Atwood, Robertson Davies, Emily Carr, Group of Seven" },
      { n:15, title:"Constitutional Milestones", topic:"Government", focus:"Royal Proclamation 1763, Quebec Act 1774, Constitutional Act 1791, Act of Union 1840, BNA Act 1867, Statute of Westminster 1931, Canadian Bill of Rights 1960, Official Languages Act 1969, Constitution Act 1982, Meech Lake Accord (failed 1990), Charlottetown Accord (failed 1992), Clarity Act 2000" },
      { n:16, title:"Immigration Waves", topic:"History", focus:"Pre-Confederation: French/British settlers. 1840s: Irish famine. 1880s: Chinese railway workers, head tax. 1900s: Ukrainian/Eastern European prairie settlers. Post-WWII: European refugees. 1967: Points system introduced. 1971: Multiculturalism policy. 1976: Immigration Act categories. 2000s+: Asia, Middle East, Africa major sources" },
      { n:17, title:"Canada in International Organizations", topic:"Modern", focus:"United Nations (founding member 1945), NATO (founding 1949), NORAD (1958, with US), Commonwealth, La Francophonie, G7/G8, G20, WTO, APEC, OAS, Arctic Council. Peacekeeping tradition started by Lester Pearson (Suez Crisis 1956, Nobel Peace Prize 1957)" },
      { n:18, title:"Quebec's Distinct History", topic:"History", focus:"New France, Conquest 1760, Quebec Act 1774 (preserved French civil law + Catholic rights), Patriots Rebellion 1837-38, Confederation debates, Quiet Revolution 1960s, Official Languages Act, October Crisis 1970 (FLQ), Bill 101 (Charter of French Language 1977), 1980 referendum (60% No), 1995 referendum (50.58% No), distinct society debate" },
      { n:19, title:"Aboriginal Self-Government", topic:"Rights", focus:"Inherent right to self-government, Nisga'a Treaty (BC, 2000), Nunavut creation 1999, James Bay Agreement 1975, comprehensive land claims, specific claims, Métis Nation, Inuit Tapiriit Kanatami, Assembly of First Nations, National Centre for Truth and Reconciliation" },
      { n:20, title:"Canadian Economy Deep Dive", topic:"Economy", focus:"GDP ~$2 trillion, 10th largest economy. Exports: energy (26%), motor vehicles, machinery, minerals. Top partners: US (75%), EU, China, UK, Japan. CUSMA/USMCA replaced NAFTA 2020. Service sector 70% of GDP. Tech hubs: Toronto, Vancouver, Montreal, Waterloo, Ottawa (Silicon Valley North)" },
      { n:21, title:"Social Programs History", topic:"Modern", focus:"Medicare: Tommy Douglas Saskatchewan 1962, national 1966 (Medical Care Act), Canada Health Act 1984 (5 principles: public admin, comprehensiveness, universality, portability, accessibility). CPP 1966. OAS 1952. EI (formerly UI). Child benefit. Equalization payments. Transfer payments" },
      { n:22, title:"Law Enforcement in Canada", topic:"Justice", focus:"RCMP: founded 1873 as NWMP, renamed 1920, Musical Ride, red serge uniform, federal + contract policing. OPP: Ontario. SQ: Quebec. Municipal police forces. CSIS (intelligence). CBSA (border). Military Police. First Nations policing. Civilian oversight: CRCC (RCMP), SIU (Ontario)" },
      { n:23, title:"Canadian Holidays & Commemorations", topic:"Symbols", focus:"Statutory: New Year, Good Friday, Canada Day (Jul 1), Labour Day, Thanksgiving (2nd Mon Oct), Remembrance Day (Nov 11), Christmas. Provincial: Victoria Day, Family Day, National Day (QC Jun 24). Special: National Indigenous Peoples Day (Jun 21), Multiculturalism Day (Jun 27), National Flag Day (Feb 15), Terry Fox Day (2nd Mon Aug BC only)" },
      { n:24, title:"Trick Questions Collection", topic:"All", focus:"Who is Head of State? (King, NOT PM). What is the capital? (Ottawa, NOT Toronto). Which province is bilingual? (New Brunswick, NOT Quebec). Largest province by area? (Quebec, NOT Ontario). Smallest province? (PEI). Newest territory? (Nunavut 1999, NOT NWT). National summer sport? (Lacrosse, NOT hockey). National winter sport? (Hockey). Who appoints senators? (GG on PM advice, NOT elected)" },
      { n:25, title:"🏆 ADVANCED PRACTICE TEST", topic:"All", focus:"" },
    ]
  },
  5: {
    lessons: [
      { n:1, title:"Practice Test A — Rights & History", topic:"Rights & History", focus:"Focus on Charter sections, fundamental freedoms, citizenship responsibilities, early exploration, Confederation, westward expansion. 20 questions mixing recall and application." },
      { n:2, title:"Practice Test B — Government", topic:"Government", focus:"Focus on Parliament structure, PM role, Cabinet, Senate vs Commons, how bills become law, provincial vs federal powers, municipal government. 20 questions." },
      { n:3, title:"Practice Test C — Elections & Justice", topic:"Elections & Justice", focus:"Focus on electoral system, political parties, voter rights, court hierarchy, rule of law, police, rights of accused. 20 questions." },
      { n:4, title:"Practice Test D — Symbols & Regions", topic:"Symbols & Regions", focus:"Focus on flag, anthem, beaver, maple leaf, all 13 capitals, provinces/territories, geographic features, holidays. 20 questions." },
      { n:5, title:"Practice Test E — Economy & Modern", topic:"Economy & Modern", focus:"Focus on natural resources, trade, industries, social programs, immigration, multiculturalism, international organizations. 20 questions." },
      { n:6, title:"Practice Test F — Mixed Easy", topic:"All", focus:"20 easier questions covering all topics — good warm-up. Focus on most commonly asked questions on real test." },
      { n:7, title:"Practice Test G — Mixed Medium", topic:"All", focus:"20 medium-difficulty questions. Mix of all 10 Discover Canada chapters. Some specific dates and names." },
      { n:8, title:"Practice Test H — Mixed Hard", topic:"All", focus:"20 hard questions — tricky details, obscure facts, commonly confused items. Tests deep knowledge of Discover Canada." },
      { n:9, title:"Practice Test I — Dates & Numbers", topic:"All", focus:"20 questions specifically about dates, years, numbers, quantities. Hardest category for most test-takers." },
      { n:10, title:"Practice Test J — People & Places", topic:"All", focus:"20 questions about specific people (PMs, explorers, heroes) and places (capitals, provinces, landmarks)." },
      { n:11, title:"Quick Review: Rights & Responsibilities", topic:"Rights", focus:"Condensed review of all key facts about Charter, freedoms, citizenship rights and responsibilities. 10 rapid-fire questions." },
      { n:12, title:"Quick Review: Who We Are", topic:"Identity", focus:"Review Aboriginal peoples, diversity, official languages, Canadian values. 10 rapid-fire questions." },
      { n:13, title:"Quick Review: History", topic:"History", focus:"Review exploration to modern Canada timeline. 10 rapid-fire questions on key events and dates." },
      { n:14, title:"Quick Review: Government", topic:"Government", focus:"Review monarchy, Parliament, PM, Cabinet, provincial/territorial/municipal. 10 rapid-fire questions." },
      { n:15, title:"Quick Review: Elections & Justice", topic:"Elections & Justice", focus:"Review electoral system, parties, courts, rights of accused. 10 rapid-fire questions." },
      { n:16, title:"Quick Review: Symbols & Regions", topic:"Symbols & Regions", focus:"Review flag, anthem, symbols, all provinces/territories/capitals. 10 rapid-fire questions." },
      { n:17, title:"Practice Test K — Full Simulation 1", topic:"All", focus:"Complete 20-question simulation matching real test format and difficulty. Timed feel. Proportional topic coverage." },
      { n:18, title:"Practice Test L — Full Simulation 2", topic:"All", focus:"Another full 20-question simulation, different questions. Real test difficulty." },
      { n:19, title:"Practice Test M — Full Simulation 3", topic:"All", focus:"Third full simulation. Includes some of the hardest commonly-asked questions." },
      { n:20, title:"Practice Test N — Full Simulation 4", topic:"All", focus:"Fourth simulation. New questions not seen in previous tests." },
      { n:21, title:"Weak Spots: Dates Quiz", topic:"History", focus:"15 questions focused purely on dates — the #1 area people fail. Every important year from 1497 to 1999." },
      { n:22, title:"Weak Spots: Capitals Quiz", topic:"Regions", focus:"15 questions about provincial/territorial capitals and major cities. Must know all 13." },
      { n:23, title:"Weak Spots: People Quiz", topic:"History", focus:"15 questions about famous Canadians, Prime Ministers, explorers, historical figures." },
      { n:24, title:"Final Exam — 20 Hardest Questions", topic:"All", focus:"The 20 trickiest, most commonly missed questions on the real citizenship test. If you pass this, you're ready." },
      { n:25, title:"🏆 CERTIFICATION TEST", topic:"All", focus:"" },
    ]
  },
};

async function generateLesson(levelNum, lesson) {
  const isTest = lesson.title.includes('Practice Test') || lesson.title.includes('PRACTICE TEST') || lesson.title.includes('CERTIFICATION') || lesson.title.includes('Quick Review') || lesson.title.includes('Weak Spots') || lesson.title.includes('Final Exam');
  
  const numQuestions = lesson.title.includes('Quick Review') || lesson.title.includes('Weak Spots') ? 15 : 20;
  const difficulty = levelNum === 4 ? 'advanced — include tricky details, obscure facts, specific dates/names' : 
    lesson.title.includes('Hard') || lesson.title.includes('Final Exam') || lesson.title.includes('CERTIFICATION') ? 'very hard — trickiest questions' :
    lesson.title.includes('Easy') ? 'easy — most commonly asked' : 'medium-hard — realistic test difficulty';
  
  if (isTest || levelNum === 5) {
    const prompt = `Generate a Canadian Citizenship Test quiz: ${numQuestions} multiple-choice questions.
TOPIC FOCUS: ${lesson.topic} — ${lesson.focus}
DIFFICULTY: ${difficulty}

JSON: {"exercises":[{"type":"citizenship_question","order":1,"question":{"text":"..."},"options":["A","B","C","D"],"correct":0,"points":5,"explanation":"..."}]}
All facts ACCURATE from Discover Canada. JSON only.`;

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${OPENAI_KEY}` },
      body: JSON.stringify({
        model: 'gpt-4o-mini', temperature: 0.5, max_tokens: 6000,
        response_format: { type: 'json_object' },
        messages: [{ role: 'user', content: prompt }],
      }),
    });
    const data = await res.json();
    if (!data.choices?.[0]) { console.error('Failed:', data.error); return null; }
    const content = JSON.parse(data.choices[0].message.content);
    return {
      number: lesson.n, title: lesson.title, situation: lesson.topic,
      grammarFocus: lesson.topic, keyPhrases: [],
      dialogue: [{ fact: lesson.title, detail: `${numQuestions} questions — ${difficulty}. 75% to pass. 🍁` }],
      vocabulary: [], exercises: (content.exercises || []).map((e, i) => ({ ...e, order: i + 1 })),
    };
  }

  // Level 4 regular lessons (advanced study + quiz)
  const prompt = `Canadian Citizenship Test prep — ADVANCED level.

LESSON: "${lesson.title}"
TOPIC: ${lesson.topic}
CONTENT: ${lesson.focus}

This is Level 4 ADVANCED — focus on tricky details, specific dates/names/numbers that commonly appear on the real test and trip people up.

JSON:
{
  "keyFacts": [{"fact":"...","detail":"..."}],
  "exercises": [{"type":"citizenship_question","order":1,"question":{"text":"..."},"options":["A","B","C","D"],"correct":0,"points":10,"explanation":"..."}]
}

- keyFacts: 12-15 detailed facts (focus on commonly confused/missed items)
- exercises: 12 hard multiple choice questions
- All facts ACCURATE from Discover Canada
- English only, JSON only.`;

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${OPENAI_KEY}` },
    body: JSON.stringify({
      model: 'gpt-4o-mini', temperature: 0.5, max_tokens: 5000,
      response_format: { type: 'json_object' },
      messages: [{ role: 'user', content: prompt }],
    }),
  });
  const data = await res.json();
  if (!data.choices?.[0]) { console.error('Failed:', data.error); return null; }
  try {
    const content = JSON.parse(data.choices[0].message.content);
    return {
      number: lesson.n, title: lesson.title,
      situation: `${lesson.topic} — Advanced`, grammarFocus: lesson.topic,
      keyPhrases: [], dialogue: content.keyFacts || [], vocabulary: [],
      exercises: (content.exercises || []).map((e, i) => ({ ...e, order: i + 1 })),
    };
  } catch (e) { console.error('Parse error:', e.message); return null; }
}

async function seedLevel(levelNum, lessons) {
  const level = await prisma.englishLevel.findUnique({ where: { number: levelNum } });
  if (!level) { console.error(`Level ${levelNum} not found`); return; }

  for (const lesson of lessons) {
    const dbLesson = await prisma.englishLesson.upsert({
      where: { levelId_number: { levelId: level.id, number: lesson.number } },
      update: { title: lesson.title, situation: lesson.situation, grammarFocus: lesson.grammarFocus, keyPhrases: [], dialogue: lesson.dialogue, vocabulary: [] },
      create: { levelId: level.id, number: lesson.number, title: lesson.title, situation: lesson.situation, grammarFocus: lesson.grammarFocus, keyPhrases: [], dialogue: lesson.dialogue, vocabulary: [] },
    });
    await prisma.englishExercise.deleteMany({ where: { lessonId: dbLesson.id } });
    for (const ex of lesson.exercises) {
      await prisma.englishExercise.create({ data: {
        lessonId: dbLesson.id, type: ex.type, order: ex.order,
        question: ex.question, options: ex.options || null,
        correct: ex.correct ?? 0, hint: ex.explanation || null, points: ex.points || 5,
      }});
    }
    console.log(`  ✅ L${levelNum} Lesson ${lesson.number}: "${lesson.title}" — ${lesson.exercises.length} ex`);
  }
}

async function main() {
  for (const [lvlStr, lvlData] of Object.entries(LEVELS)) {
    const lvlNum = parseInt(lvlStr);
    console.log(`\n═══ Generating Level ${lvlNum} ═══`);
    const outPath = `/var/www/CELPIP/public/data/english/level${lvlNum}.json`;
    let generated = [];
    for (const lesson of lvlData.lessons) {
      console.log(`L${lvlNum} lesson ${lesson.n}: "${lesson.title}"...`);
      let result = null, retries = 0;
      while (!result && retries < 3) { result = await generateLesson(lvlNum, lesson); if (!result) retries++; }
      if (result) {
        generated.push(result);
        generated.sort((a, b) => a.number - b.number);
        fs.writeFileSync(outPath, JSON.stringify(generated, null, 2));
        console.log(`  ✅ done (${result.exercises.length} ex)`);
      } else console.log(`  ❌ FAILED`);
      await new Promise(r => setTimeout(r, 500));
    }
    console.log(`\nSeeding Level ${lvlNum}...`);
    await seedLevel(lvlNum, generated);
    console.log(`Level ${lvlNum} complete! ${generated.length} lessons`);
  }
  await prisma.$disconnect();
  console.log('\n🎉 Levels 4-5 done!');
}
main().catch(console.error);
