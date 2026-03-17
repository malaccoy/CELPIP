// Writing Drills — Survey Response Triplets (Task 2)
// 10 scenarios × 3 exercises (Opening stance → Supporting argument → Conclusion) = 30 exercises
// Based on CELPIP Writing Task 2 + Mastery PRE technique + Sentence Starters
// Structure: "I would rather/recommend/suggest" → PRE arguments → Conclusion restate + summarize
// Rules: NO contractions, NO "Option A/B", always use organization words
module.exports = [
  // ─── 1. Public transport vs bike lanes (WHO: City Council) ───
  [
    { type: 'choose', question: '📋 Survey from: City Council\n"Should the city invest in more public transit routes or build new bike lanes?"\n\nWhich opening follows the correct Task 2 format?', options: [
      'I would recommend that the city invest in more public transit routes because they serve a wider range of residents.',
      'Dear City Council,\n\nI believe transit is better than bike lanes.',
      'Both options are good but I think maybe transit could work.',
      'Option A is better because more people use buses.'
    ], correct: 0, explanation: 'Uses "I would recommend that" (correct Task 2 opener) + no greeting (it is a survey, not an email) + never says "Option A." The argument targets the Council\'s concern: serving residents.' },
    { type: 'fillGap', sentence: 'First of all, public transit serves seniors, people with disabilities, and those who cannot afford a car. ________, the nearest bus stop in my neighborhood is a 20-minute walk, which forces elderly residents to rely on expensive taxis.', options: ['For example', 'I think', 'Also', 'Maybe'], correct: 0, explanation: '"For example" introduces the E (Example) in PRE technique: Point → Reason → Example. A specific, realistic detail strengthens the argument.' },
    { type: 'choose', question: 'Which conclusion correctly restates the opinion with DIFFERENT words?', options: [
      'In conclusion, expanding public transit would create a more accessible city for all residents, regardless of age or ability.',
      'In conclusion, I would recommend that the city invest in more public transit routes because they serve a wider range of residents.',
      'So that is why I chose public transit.',
      'Both options have advantages, but public transit is probably better.'
    ], correct: 0, explanation: 'Restates with new words ("accessible city for all residents") instead of copying the opening. Ties back to the WHO (City Council cares about all residents).' },
  ],

  // ─── 2. Work from home vs office (WHO: Company CEO) ───
  [
    { type: 'choose', question: '📋 Survey from: Company CEO\n"Should employees work from home permanently or return to the office?"\n\nBest opening?', options: [
      'I would rather employees be allowed to work from home permanently, as it improves both productivity and employee retention.',
      'I think working from home is nice because you do not have to commute.',
      'In my opinion, this is a difficult question with many factors.',
      'Option B is the best choice for the company.'
    ], correct: 0, explanation: '"I would rather [employees BE allowed]" follows the Mastery formula. Arguments target the CEO: productivity + retention (business impact, not personal comfort).' },
    { type: 'fillGap', sentence: 'Second, remote work reduces overhead costs for the company. When my previous employer switched to remote work, they ________ over $50,000 per year on office rent alone.', options: ['saved', 'got', 'made', 'had'], correct: 0, explanation: '"Saved" — specific dollar amount makes the example concrete. Uses "Second" for organization.' },
    { type: 'choose', question: 'Best conclusion?', options: [
      'Ultimately, allowing remote work benefits both the company through lower costs and the employees through better work-life balance.',
      'That is why I think working from home is better.',
      'In conclusion, there are many reasons to support remote work.',
      'Working from home is the future and companies should accept that.'
    ], correct: 0, explanation: 'Shows benefit to BOTH sides (company + employees) — this "balanced thinking" scores higher per the Mastery guide.' },
  ],

  // ─── 3. Free parking vs paid parking (WHO: City Manager) ───
  [
    { type: 'choose', question: '📋 Survey from: City Manager\n"Should downtown parking be free for the first two hours, or should paid parking continue to fund road repairs?"\n\nBest opening?', options: [
      'I would suggest that the city keep paid parking downtown because the revenue is essential for maintaining roads and infrastructure.',
      'Paid parking is better than free parking in my opinion.',
      'I choose the second option because it makes more money.',
      'Dear City Manager,\n\nI am writing to share my thoughts on parking.'
    ], correct: 0, explanation: '"I would suggest that" + specific reason (revenue for roads). No "Dear" (it is a survey). No "second option" — always paraphrase.' },
    { type: 'reorder', question: 'Put this PRE argument in order (Point → Reason → Example):', words: [
      'First of all, parking revenue directly funds road maintenance.',
      'Without this income, the city would need to raise property taxes.',
      'Last winter, potholes on Main Street caused over $200,000 in vehicle damage, all repaired with parking funds.'
    ], correct: [0, 1, 2], explanation: 'PRE: Point (revenue funds roads) → Reason (alternative is higher taxes) → Example ($200,000 repair, specific street name).' },
    { type: 'choose', question: 'Best conclusion?', options: [
      'For these reasons, paid parking is a practical way to fund road repairs without increasing taxes for all residents.',
      'In conclusion, paid parking is the better option.',
      'So we should keep paid parking downtown.',
      'I would suggest that the city keep paid parking because it is essential.'
    ], correct: 0, explanation: 'Uses different words from the opening + addresses the City Manager\'s concern (taxes vs parking revenue).' },
  ],

  // ─── 4. Longer school days vs after-school programs (WHO: School Board) ───
  [
    { type: 'fillGap', sentence: 'I would rather the school board invest in after-school programs ________ extend the school day, because children need variety in their learning experiences.', options: ['than', 'then', 'that', 'and'], correct: 0, explanation: '"I would rather X THAN Y" — correct grammar for the Mastery opener formula. "Then" means time; "than" means comparison.' },
    { type: 'choose', question: 'Which body paragraph uses the PRE technique correctly?', options: [
      'First of all, after-school programs develop skills that regular classes cannot. This is because hands-on activities build confidence and creativity. For example, my daughter joined a robotics club last year, and her teacher commented that she now participates more actively in class.',
      'After-school programs are good because kids can learn new things and have fun after school.',
      'Many studies show that after-school programs help children. This is well known by educators.',
      'Kids do not like staying in school longer. They get tired and cannot concentrate.'
    ], correct: 0, explanation: 'Perfect PRE: Point (develop skills) → Reason (hands-on builds confidence) → Example (daughter + robotics + teacher\'s comment). Specific and convincing.' },
    { type: 'choose', question: 'Best conclusion?', options: [
      'In conclusion, after-school programs offer children the chance to explore new interests while reinforcing classroom learning, which benefits both students and parents.',
      'That is why after-school programs are the best choice for schools.',
      'In conclusion, longer school days are bad for children.',
      'The school board should choose after-school programs.'
    ], correct: 0, explanation: 'Restates with new words + shows benefit to multiple groups (students AND parents) — balanced thinking.' },
  ],

  // ─── 5. Community garden vs playground (WHO: Neighborhood Association) ───
  [
    { type: 'choose', question: '📋 Survey from: Neighborhood Association\n"An empty lot is available. Should it become a community garden or a children\'s playground?"\n\nBest opening?', options: [
      'I would recommend that the lot be turned into a community garden because it would benefit residents of all ages and promote healthier eating habits.',
      'A playground would be fun but a garden might be better for everyone.',
      'This is a hard choice because both options are useful for the community.',
      'I think a community garden is a good idea for our neighborhood.'
    ], correct: 0, explanation: '"I would recommend that [the lot BE turned]" — correct subjunctive after "recommend that." Two clear reasons for the Association.' },
    { type: 'fillGap', sentence: 'Second, a community garden would strengthen neighborhood connections. In my previous neighborhood, the garden became a gathering place where families ________ on weekends, sharing recipes and gardening tips.', options: ['gathered', 'came', 'went', 'stayed'], correct: 0, explanation: '"Gathered" is more vivid and precise. The example follows PRE: Point (connections) → Reason (gathering place) → Example (families sharing recipes).' },
    { type: 'choose', question: 'Best conclusion?', options: [
      'For these reasons, a community garden would serve our neighborhood better by improving nutrition, building community bonds, and creating a shared space for all ages.',
      'That is why I chose the garden option over the playground.',
      'In conclusion, gardens are better than playgrounds for neighborhoods.',
      'I hope the neighborhood association chooses a community garden.'
    ], correct: 0, explanation: 'Summarizes all three points (nutrition + bonds + all ages) as the Mastery guide requires.' },
  ],

  // ─── 6. Cash vs digital payments (WHO: Small Business Council) ───
  [
    { type: 'choose', question: '📋 Survey from: Small Business Council\n"Should local businesses be required to accept digital payments, or should cash remain the only required method?"\n\nBest opening?', options: [
      'I would suggest that all local businesses be required to accept digital payments because it is more convenient and safer for both customers and store owners.',
      'Digital payments are the future and everyone should use them.',
      'I prefer digital payments because I do not like carrying cash around.',
      'Option A should be implemented by all businesses immediately.'
    ], correct: 0, explanation: '"I would suggest that" + mentions BOTH parties (customers and owners) — tailored to the Small Business Council audience.' },
    { type: 'fillGap', sentence: 'Finally, digital payments create automatic records that help small businesses with tax reporting. ________, my friend who owns a café switched to digital last year and reduced her accounting time by half.', options: ['To illustrate this point', 'I think', 'Also', 'Because'], correct: 0, explanation: '"To illustrate this point" is a Sentence Starter from the Mastery guide for introducing examples. Uses "Finally" for organization.' },
    { type: 'choose', question: 'Best conclusion?', options: [
      'In summary, requiring digital payment options would improve convenience, reduce theft, and simplify record-keeping for small business owners.',
      'So digital payments should be required everywhere in the city.',
      'In conclusion, digital payments are better than cash for businesses.',
      'I think most people would agree that digital is the way to go.'
    ], correct: 0, explanation: 'Summarizes all 3 PRE points (convenience + theft + records) targeting the Small Business Council.' },
  ],

  // ─── 7. Recycling education vs more bins (WHO: Environmental Committee) ───
  [
    { type: 'choose', question: '📋 Survey from: Environmental Committee\n"To reduce waste, should the city focus on recycling education or install more recycling bins?"\n\nBest opening?', options: [
      'In my opinion, I would prefer that the city invest in recycling education programs because changing habits creates a lasting impact on waste reduction.',
      'More recycling bins would help but education is probably more important.',
      'Recycling is very important for the environment and our future.',
      'Both options could help reduce waste in our city.'
    ], correct: 0, explanation: '"In my opinion, I would prefer that" — Mastery opener formula. Targets the Environmental Committee with "lasting impact on waste reduction."' },
    { type: 'reorder', question: 'Order this PRE argument correctly:', words: [
      'First of all, many residents do not know which items can actually be recycled.',
      'This lack of knowledge leads to contamination that ruins entire batches of recyclable materials.',
      'For instance, my neighbor regularly puts plastic bags in the blue bin, which the recycling facility cannot process.'
    ], correct: [0, 1, 2], explanation: 'PRE: Point (residents do not know) → Reason (contamination) → Example (neighbor + plastic bags + specific detail).' },
    { type: 'choose', question: 'Best conclusion?', options: [
      'In conclusion, recycling education would address the root cause of waste problems and create long-term behavioral change in our community.',
      'In conclusion, education is better than more bins for recycling.',
      'That is why the city should focus on education programs.',
      'Recycling education has many benefits for the environment.'
    ], correct: 0, explanation: '"Root cause" + "long-term behavioral change" — restates with NEW words and targets the Committee\'s goals.' },
  ],

  // ─── 8. Library funding vs online resources (WHO: City Budget Committee) ───
  [
    { type: 'fillGap', sentence: 'I would rather the city increase funding for public libraries ________ invest in online platforms, because libraries provide essential community services that websites cannot replace.', options: ['than', 'then', 'and', 'or'], correct: 0, explanation: '"I would rather X THAN Y" — correct comparison structure. Never use "then" (time) for comparisons.' },
    { type: 'choose', question: 'Which body paragraph best uses the PRE technique with "Make It Real" details?', options: [
      'Second, libraries serve as community hubs for newcomers to Canada. For example, our Cedar Avenue library offers free English conversation groups every Tuesday, and my coworker Maria found her first job through their employment workshop last September.',
      'Libraries have books and computers that people can use for free. They are important places in the community.',
      'Many people prefer physical books over digital ones. Libraries should stay open for this reason.',
      'Online platforms are not accessible to everyone. Libraries are more fair and equal.'
    ], correct: 0, explanation: 'PRE + Make It Real: Point (community hubs) → Reason (newcomer services) → Example (Cedar Avenue + Maria + Tuesday groups + September job). Specific names, places, and dates.' },
    { type: 'choose', question: 'Best conclusion?', options: [
      'For these reasons, public libraries remain vital community spaces that provide services, connections, and opportunities that online platforms simply cannot replicate.',
      'In conclusion, libraries are more important than online platforms for our city.',
      'That is why we need more funding for libraries in the budget.',
      'Libraries should continue to receive support from the city government.'
    ], correct: 0, explanation: 'Restates with new language (vital + services/connections/opportunities + cannot replicate). Targets the Budget Committee\'s need for justification.' },
  ],

  // ─── 9. Electric vehicles vs public transit (WHO: Transportation Department) ───
  [
    { type: 'choose', question: '📋 Survey from: Transportation Department\n"To reduce emissions, should the government offer EV subsidies or expand public transit?"\n\nBest opening?', options: [
      'I would recommend that the government expand public transit because it reduces emissions at a lower cost per person and benefits a larger portion of the population.',
      'Electric vehicles are expensive so public transit is the better choice.',
      'Reducing carbon emissions is important for our future and our children.',
      'I choose the second option because buses help more people than cars.'
    ], correct: 0, explanation: '"I would recommend that" + two reasons targeting the Transportation Dept: cost efficiency + population reach. Never says "second option."' },
    { type: 'fillGap', sentence: 'A clear example of this is the Canada Line expansion in Vancouver, which ________ daily ridership by over 100,000 passengers within two years of opening.', options: ['increased', 'grew', 'made', 'raised'], correct: 0, explanation: '"Increased ridership" is the standard collocation. "A clear example of this is" — Mastery Sentence Starter for introducing evidence.' },
    { type: 'choose', question: 'Which conclusion uses the "other side" technique from the Mastery guide?', options: [
      'On the other hand, EV subsidies do help individual buyers. However, public transit serves thousands of commuters daily at a fraction of the cost. For this reason, expanding transit is the more effective solution.',
      'In short, public transit is better than electric vehicles for the environment.',
      'The government should invest in public transit instead of electric vehicles.',
      'Both options help, but I prefer public transit for all the reasons above.'
    ], correct: 0, explanation: 'Uses the "other side" argument: concede a point (EV subsidies help) → counter it (transit serves thousands at lower cost) → YOUR argument wins. This shows maturity and scores higher.' },
  ],

  // ─── 10. Tourism vs local business support (WHO: Economic Development Board) ───
  [
    { type: 'choose', question: '📋 Survey from: Economic Development Board\n"Should the city spend its budget on promoting tourism or supporting local small businesses?"\n\nBest opening?', options: [
      'I would rather the city prioritize supporting local small businesses because they form the backbone of our economy and create stable, year-round employment.',
      'Tourism brings money but local businesses are also important for the city.',
      'This is a tough question because both options can help the economy grow.',
      'I think local businesses need more support from the city budget.'
    ], correct: 0, explanation: '"I would rather [the city prioritize]" — Mastery formula. Targets the Economic Development Board with "backbone of economy" + "year-round employment" (vs seasonal tourism).' },
    { type: 'fillGap', sentence: 'First of all, local businesses provide consistent employment throughout the year. This is primarily due to the fact that they serve the ________ community regardless of tourist seasons.', options: ['local', 'small', 'big', 'entire'], correct: 0, explanation: '"Local community" — precise word choice. "This is primarily due to the fact that" is a Mastery Sentence Starter for giving reasons.' },
    { type: 'choose', question: 'Best conclusion?', options: [
      'In conclusion, supporting local businesses would generate more stable and sustainable economic growth, which is precisely what our community needs for long-term prosperity.',
      'In conclusion, local businesses are more important than tourism for the economy.',
      'That is why we should support local businesses with the city budget.',
      'I hope the Economic Development Board makes the right choice.'
    ], correct: 0, explanation: 'Uses different words (stable + sustainable + long-term prosperity) and ties directly to what the Economic Development Board cares about.' },
  ],
];
