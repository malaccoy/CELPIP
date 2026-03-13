#!/usr/bin/env node
/**
 * Generate Levels 2-4 for English for Citizenship
 * Level 2: Government & Law (deep dive)
 * Level 3: Economy & Regions (deep dive)  
 * Level 4: Advanced Topics (tricky questions)
 */
const fs = require('fs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const OPENAI_KEY = fs.readFileSync('/var/www/CELPIP/.env.local', 'utf-8').match(/OPENAI_API_KEY=(.+)/)?.[1];

const LEVELS = {
  2: {
    lessons: [
      { n:1, title:"The Constitution Act, 1867", topic:"Government", focus:"BNA Act, division of powers federal vs provincial, peace order good government, Section 91/92, why Confederation happened" },
      { n:2, title:"The Constitution Act, 1982", topic:"Government", focus:"Patriation, Charter of Rights, amending formula, Pierre Trudeau's role, Kitchen Accord, significance" },
      { n:3, title:"The Canadian Charter of Rights", topic:"Rights", focus:"Fundamental freedoms (2), democratic rights (3-5), mobility rights (6), legal rights (7-14), equality rights (15), language rights (16-23), reasonable limits clause (1)" },
      { n:4, title:"The Monarchy in Canada", topic:"Government", focus:"Constitutional monarchy, King Charles III, Governor General (Mary Simon), role is ceremonial, Royal Assent, Lieutenant Governors, Crown land" },
      { n:5, title:"The Governor General", topic:"Government", focus:"Represents the King, appointed by PM, gives Royal Assent, dissolves Parliament, ceremonial head of military, current: Mary Simon (first Indigenous GG)" },
      { n:6, title:"The Senate", topic:"Government", focus:"Upper house, 105 senators, appointed by GG on PM advice, regional representation, sober second thought, can delay/amend bills, retirement age 75" },
      { n:7, title:"The House of Commons", topic:"Government", focus:"Lower house, 338 MPs, elected by citizens, introduces money bills, confidence votes, Speaker of the House, Question Period, committees" },
      { n:8, title:"How a Bill Becomes Law", topic:"Government", focus:"Three readings in Commons, committee study, three readings in Senate, Royal Assent, private member's bills vs government bills" },
      { n:9, title:"The Prime Minister", topic:"Government", focus:"Head of Government, leader of party with most seats, chooses Cabinet, advises GG, PM residence 24 Sussex, Rideau Cottage, power and responsibilities" },
      { n:10, title:"Famous Prime Ministers", topic:"History", focus:"Sir John A. Macdonald (1st, Confederation), Wilfrid Laurier (1st French-Canadian PM), Lester Pearson (flag, Nobel Peace), Pierre Trudeau (Charter), all PMs must know for test" },
      { n:11, title:"The Cabinet", topic:"Government", focus:"Ministers chosen by PM, run federal departments, Cabinet solidarity, Privy Council, Treasury Board, Cabinet committees, Minister responsible to Parliament" },
      { n:12, title:"Provincial Government", topic:"Government", focus:"10 provinces, each has Premier, Legislature (unicameral), Lieutenant Governor, provincial powers: education, healthcare, highways, natural resources, property" },
      { n:13, title:"Territorial Government", topic:"Government", focus:"3 territories: Yukon, NWT, Nunavut. Commissioner (like Lt. Gov), powers delegated by federal govt, not constitutionally guaranteed, smaller population" },
      { n:14, title:"Municipal Government", topic:"Government", focus:"Cities/towns, Mayor and council, property taxes, local services: police, fire, water, garbage, transit, parks, zoning, not mentioned in Constitution" },
      { n:15, title:"Federal Elections Deep Dive", topic:"Elections", focus:"First-past-the-post, 338 ridings, Elections Canada independent body, Chief Electoral Officer, voter registration, advance polls, special ballots, election day rules" },
      { n:16, title:"Political Parties", topic:"Elections", focus:"Liberal Party, Conservative Party, NDP, Bloc Québécois, Green Party. Party leaders, platforms, history of each party, minority vs majority government" },
      { n:17, title:"Your Rights as a Voter", topic:"Elections", focus:"Secret ballot, right to vote at 18, voter ID requirements, accessibility, voting from abroad, penalties for electoral fraud, peaceful transition of power" },
      { n:18, title:"The Justice System Overview", topic:"Justice", focus:"Rule of law, independence of judiciary, common law (all provinces except QC), civil law in Quebec, adversarial system, burden of proof" },
      { n:19, title:"The Court System", topic:"Justice", focus:"Supreme Court (9 justices, final appeal), Federal Court, Provincial Superior Courts, Provincial Courts, Tax Court, specific jurisdiction of each level" },
      { n:20, title:"Rights of the Accused", topic:"Justice", focus:"Presumption of innocence, habeas corpus, right to counsel, right to interpreter, right to fair trial, bail, jury trial, no cruel punishment, appeal rights" },
      { n:21, title:"The Police in Canada", topic:"Justice", focus:"RCMP (federal), provincial police (OPP, Sûreté du Québec), municipal police, role of police, complaints process, civilian oversight" },
      { n:22, title:"Canadian Human Rights", topic:"Rights", focus:"Canadian Human Rights Act, Human Rights Commission, prohibited grounds of discrimination, employment equity, accessibility, duty to accommodate" },
      { n:23, title:"Citizenship Responsibilities", topic:"Rights", focus:"Obeying law, jury duty, voting, helping community, protecting environment, paying taxes, respect for rights of others, defending Canada if needed" },
      { n:24, title:"The Citizenship Process", topic:"Rights", focus:"Eligibility (18-54 for test), permanent resident 3 of 5 years, language requirement, take test, attend ceremony, Oath of Citizenship, dual citizenship allowed" },
      { n:25, title:"🏆 PRACTICE TEST 2", topic:"All", focus:"" },
    ]
  },
  3: {
    lessons: [
      { n:1, title:"Canada's Geography", topic:"Regions", focus:"Second largest country, 10 million km², borders 3 oceans (Atlantic, Pacific, Arctic), longest coastline in world, 6 time zones, geographic regions" },
      { n:2, title:"Ontario", topic:"Regions", focus:"Capital of Canada (Ottawa) is in Ontario, largest population, Toronto (largest city), Niagara Falls, manufacturing hub, Bay Street (financial), multicultural" },
      { n:3, title:"Quebec", topic:"Regions", focus:"Largest province by area, mainly French-speaking, Quebec City (capital), Montreal, distinct society, Quiet Revolution, civil law system, maple syrup, hydroelectric" },
      { n:4, title:"British Columbia", topic:"Regions", focus:"Pacific province, Victoria (capital), Vancouver, mountains and forests, film industry, Port of Vancouver (largest in Canada), salmon, First Nations cultures" },
      { n:5, title:"Alberta", topic:"Regions", focus:"Edmonton (capital), Calgary (Stampede), oil sands, beef cattle, Rocky Mountains, Banff/Jasper, richest province per capita, Western alienation" },
      { n:6, title:"The Prairie Provinces", topic:"Regions", focus:"Manitoba (Winnipeg), Saskatchewan (Regina), breadbasket of Canada, wheat and canola, potash, cold winters, Indigenous populations, Louis Riel" },
      { n:7, title:"Atlantic Canada", topic:"Regions", focus:"Nova Scotia (Halifax), New Brunswick (Fredericton, only bilingual province), PEI (Charlottetown, birthplace of Confederation), NL (St. John's), fishing, shipbuilding" },
      { n:8, title:"The Northern Territories", topic:"Regions", focus:"Yukon (Whitehorse, Gold Rush), NWT (Yellowknife, diamonds), Nunavut (Iqaluit, newest territory 1999, Inuit homeland), permafrost, midnight sun, aurora borealis" },
      { n:9, title:"All 13 Capitals", topic:"Regions", focus:"Ottawa (national), Toronto, Quebec City, Victoria, Edmonton, Winnipeg, Regina, Halifax, Fredericton, Charlottetown, St. John's, Whitehorse, Yellowknife, Iqaluit — must memorize all" },
      { n:10, title:"Canada's Natural Resources", topic:"Economy", focus:"Oil/gas (Alberta), minerals (diamonds, nickel, uranium), forests (BC, Ontario), fisheries (Atlantic, Pacific), hydroelectric power (Quebec), potash (Saskatchewan)" },
      { n:11, title:"Key Industries", topic:"Economy", focus:"Manufacturing (Ontario, Quebec), technology (Ottawa, Waterloo, Toronto, Vancouver), agriculture (Prairies), mining, forestry, energy sector, service economy" },
      { n:12, title:"International Trade", topic:"Economy", focus:"CUSMA/USMCA (replaced NAFTA), USA is largest trading partner (75% exports), exports: oil, cars, lumber, minerals. Free trade agreements. WTO member" },
      { n:13, title:"The Banking System", topic:"Economy", focus:"Big Five banks (RBC, TD, Scotiabank, BMO, CIBC), Bank of Canada (central bank), Canadian dollar (loonie), monetary policy, financial regulation, CDIC insurance" },
      { n:14, title:"Social Programs", topic:"Economy", focus:"Universal healthcare (Medicare), Canada Pension Plan (CPP), Employment Insurance (EI), Old Age Security (OAS), Child benefits, public education, social safety net" },
      { n:15, title:"Indigenous Peoples: First Nations", topic:"Who We Are", focus:"Over 600 First Nations, diverse languages and cultures, treaties, reserves, Indian Act, self-government, Truth and Reconciliation, residential schools legacy" },
      { n:16, title:"Indigenous Peoples: Métis & Inuit", topic:"Who We Are", focus:"Métis: mixed First Nations-European heritage, Red River, Louis Riel. Inuit: Arctic peoples, Nunavut, Inuktitut language, land claims, traditional knowledge" },
      { n:17, title:"French-English Relations", topic:"History", focus:"Two founding European peoples, Official Languages Act 1969, bilingualism, Quebec sovereignty movements (1980, 1995 referendums), Meech Lake, Charlottetown Accord" },
      { n:18, title:"Immigration History", topic:"History", focus:"Waves of immigration: British/French, Irish famine, Chinese railway workers, post-WWII Europeans, 1967 points system, multiculturalism, recent immigration trends" },
      { n:19, title:"Canadian Military History", topic:"History", focus:"Vimy Ridge, Dieppe, D-Day Juno Beach, Korean War, peacekeeping (Lester Pearson), NATO, Afghanistan, Victoria Cross recipients, Remembrance Day" },
      { n:20, title:"The Canadian Flag", topic:"Symbols", focus:"Red-white-red with maple leaf, adopted Feb 15 1965, National Flag Day, great flag debate, previous flags (Red Ensign), meaning of colors (red=sacrifice, white=peace)" },
      { n:21, title:"O Canada & Royal Anthem", topic:"Symbols", focus:"O Canada: written 1880, national anthem 1980. Bilingual versions. God Save the King: Royal anthem. When each is played. Lyrics should be known" },
      { n:22, title:"Canadian Symbols Deep Dive", topic:"Symbols", focus:"Beaver (first emblem), maple tree, coat of arms (motto: A Mari Usque Ad Mare), Parliament buildings, Peace Tower, Rideau Canal, Terry Fox, Canadian horse" },
      { n:23, title:"Important Dates & Holidays", topic:"Symbols", focus:"Canada Day July 1, Remembrance Nov 11, Victoria Day, National Indigenous Day June 21, St-Jean-Baptiste June 24, Thanksgiving, Terry Fox Run September" },
      { n:24, title:"Canadian Culture & Values", topic:"Who We Are", focus:"Multiculturalism, tolerance, equality, two official languages, hockey (national winter sport), lacrosse (national summer sport), peacekeeping tradition, mosaic vs melting pot" },
      { n:25, title:"🏆 PRACTICE TEST 3", topic:"All", focus:"" },
    ]
  },
};

async function generateLesson(levelNum, lesson) {
  if (lesson.title.includes('PRACTICE TEST')) {
    // Generate 20-question practice test
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${OPENAI_KEY}` },
      body: JSON.stringify({
        model: 'gpt-4o-mini', temperature: 0.5, max_tokens: 6000,
        response_format: { type: 'json_object' },
        messages: [{ role: 'user', content: `Generate a Canadian Citizenship Practice Test: 20 multiple-choice questions covering all Discover Canada topics. More difficult than Level 1 — focus on tricky details, dates, specific names. JSON: {"exercises":[{"type":"citizenship_question","order":1,"question":{"text":"..."},"options":["A","B","C","D"],"correct":0,"points":5,"explanation":"..."}]}. All facts ACCURATE. JSON only.` }],
      }),
    });
    const data = await res.json();
    const content = JSON.parse(data.choices[0].message.content);
    return {
      number: lesson.n, title: lesson.title, situation: 'Simulated Citizenship Test',
      grammarFocus: 'All Topics', keyPhrases: [],
      dialogue: [{ fact: `Practice Test — Level ${levelNum}`, detail: '20 questions, 75% to pass. Good luck! 🍁' }],
      vocabulary: [], exercises: (content.exercises || []).map((e, i) => ({ ...e, order: i + 1 })),
    };
  }

  const prompt = `Canadian Citizenship Test prep lesson based on "Discover Canada".

LESSON: "${lesson.title}"
TOPIC: ${lesson.topic}
CONTENT: ${lesson.focus}

This is Level ${levelNum} — MORE DETAILED than Level 1. Include specific dates, names, and facts that commonly appear on the test.

JSON format:
{
  "keyFacts": [
    { "fact": "Key testable fact", "detail": "Extra context" }
  ],
  "exercises": [
    {
      "type": "citizenship_question",
      "order": 1,
      "question": { "text": "Test-style question" },
      "options": ["Correct", "Wrong1", "Wrong2", "Wrong3"],
      "correct": 0,
      "points": 10,
      "explanation": "Why correct, from Discover Canada"
    }
  ]
}

REQUIREMENTS:
- keyFacts: 10-12 detailed facts (MORE than Level 1)
- exercises: 10 multiple choice questions (HARDER than Level 1)
- Include tricky questions about specific dates, names, numbers
- All facts ACCURATE from Discover Canada
- English only, no translations
- JSON only.`;

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${OPENAI_KEY}` },
    body: JSON.stringify({
      model: 'gpt-4o-mini', temperature: 0.5, max_tokens: 4000,
      response_format: { type: 'json_object' },
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  const data = await res.json();
  if (!data.choices?.[0]?.message?.content) { console.error(`Failed:`, data.error); return null; }

  try {
    const content = JSON.parse(data.choices[0].message.content);
    return {
      number: lesson.n, title: lesson.title,
      situation: `${lesson.topic} — Canadian Citizenship Test`,
      grammarFocus: lesson.topic, keyPhrases: [],
      dialogue: content.keyFacts || [], vocabulary: [],
      exercises: (content.exercises || []).map((e, i) => ({ ...e, order: i + 1 })),
    };
  } catch (e) { console.error(`Parse error:`, e.message); return null; }
}

async function seedLevel(levelNum, lessons) {
  const level = await prisma.englishLevel.findUnique({ where: { number: levelNum } });
  if (!level) { console.error(`Level ${levelNum} not found in DB`); return; }

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
        correct: ex.correct ?? 0, hint: ex.explanation || null, points: ex.points || 10,
      }});
    }
    console.log(`  ✅ L${levelNum} Lesson ${lesson.number}: "${lesson.title}" — ${lesson.exercises.length} exercises`);
  }
}

async function main() {
  for (const [lvlStr, lvlData] of Object.entries(LEVELS)) {
    const lvlNum = parseInt(lvlStr);
    console.log(`\n═══ Generating Level ${lvlNum} ═══`);
    
    const outPath = `/var/www/CELPIP/public/data/english/level${lvlNum}.json`;
    let generated = [];

    for (const lesson of lvlData.lessons) {
      console.log(`Generating L${lvlNum} lesson ${lesson.n}: "${lesson.title}"...`);
      let result = null, retries = 0;
      while (!result && retries < 3) {
        result = await generateLesson(lvlNum, lesson);
        if (!result) retries++;
      }
      if (result) {
        generated.push(result);
        generated.sort((a, b) => a.number - b.number);
        fs.writeFileSync(outPath, JSON.stringify(generated, null, 2));
        console.log(`  ✅ done (${result.exercises.length} exercises)`);
      } else {
        console.log(`  ❌ FAILED`);
      }
      await new Promise(r => setTimeout(r, 500));
    }

    console.log(`\nSeeding Level ${lvlNum} to database...`);
    await seedLevel(lvlNum, generated);
    console.log(`Level ${lvlNum} complete! ${generated.length} lessons`);
  }

  await prisma.$disconnect();
  console.log('\n🎉 All levels generated and seeded!');
}

main().catch(console.error);
