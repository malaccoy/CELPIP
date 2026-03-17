// Listening Drills — Tasks 4-6 (Harder) Triplets
// 15 scenarios × 3 exercises = 45 exercises
// Based on CELPIP Listening Technique Guide "7 Secret Steps"
// Tasks 4-6: Names matter, details matter, note-taking important

module.exports = [
  // ─── Task 4: News Item ─── (5 scenarios)

  // 4.1 — Thrift store rings
  [
    { type: 'listenChoose',
      audioLines: [
        { voice: 'narrator', text: "Seventeen-year-old Shauna Bergman made over one thousand dollars this weekend, all because of her love of thrift store shopping. While browsing at a local shop, Shauna spotted a pair of rings with unusual orange stones priced at just three dollars." },
      ],
      question: 'What is this news story mainly about?',
      options: ['A new thrift store opening in town', 'A teenager who found valuable rings at a thrift store', 'Problems with overpriced jewelry in stores', 'A guide to thrift store shopping'],
      correct: 1, explanation: 'Step 1: What is the story about? The opening sentence tells you: a 17-year-old made money from thrift store rings. Always get the gist from the first sentence.' },
    { type: 'listenChoose',
      audioLines: [
        { voice: 'narrator', text: "Shauna brought the rings home and showed them to her mother, who suggested the stones might actually be amber rather than glass. To test this, they rubbed the stones vigorously on a piece of fabric. When the stones attracted tiny dust particles, they knew the amber was real." },
      ],
      question: 'Who first suggested the rings might be valuable?',
      options: ['Shauna herself', 'A local jeweler', 'Shauna\'s mother', 'The thrift store owner'],
      correct: 2, explanation: 'Step 2: Names matter! "Her mother suggested the stones might actually be amber." Track who said/did what — this is always tested in Task 4.' },
    { type: 'listenChoose',
      audioLines: [
        { voice: 'narrator', text: "A local jeweler later confirmed the rings were genuine amber, worth approximately twelve hundred dollars. Shauna has decided to use the money to finance a trip to South America, something she has dreamed about since she was twelve." },
      ],
      question: 'What will Shauna probably do with the money?',
      options: ['Buy more jewelry from the thrift store', 'Save it for university tuition', 'Travel to South America', 'Give it back to the thrift store'],
      correct: 2, explanation: 'Step 7: Future. "Decided to use the money to finance a trip to South America." Note: the test might say "travel abroad" instead — same idea, different words (paraphrase).' },
  ],

  // 4.2 — Community garden award
  [
    { type: 'listenChoose',
      audioLines: [
        { voice: 'narrator', text: "The Maple Ridge Community Garden has been named this year's winner of the National Green Spaces Award. The garden, which was started just three years ago by retired teacher Margaret Chen, has grown from a small patch of land to a thriving urban farm serving over two hundred families." },
      ],
      question: 'What is the main topic of this news story?',
      options: ['A new farming technique being tested', 'A community garden winning a national award', 'A school building a vegetable garden', 'A retired teacher writing a book about gardening'],
      correct: 1, explanation: 'Step 1: Main story. "Maple Ridge Community Garden named winner of National Green Spaces Award." Focus on the first sentence for the main topic.' },
    { type: 'listenChoose',
      audioLines: [
        { voice: 'narrator', text: "Margaret Chen said she started the garden because she noticed many families in her neighborhood couldn't afford fresh vegetables. Quote: I saw children who had never tasted a fresh tomato right off the vine. That broke my heart and I knew I had to do something." },
      ],
      question: 'Why did Margaret Chen start the garden?',
      options: ['She wanted to win a gardening competition', 'She needed a hobby after retiring from teaching', 'She noticed families couldn\'t afford fresh vegetables', 'The city asked her to manage an empty lot'],
      correct: 2, explanation: 'Step 2: Names matter + quotes! Margaret Chen (founder) started it because "many families couldn\'t afford fresh vegetables." When CELPIP quotes someone, expect a question about it.' },
    { type: 'listenChoose',
      audioLines: [
        { voice: 'narrator', text: "The award comes with a ten-thousand-dollar grant. Margaret plans to use the funding to build a greenhouse so the garden can produce fresh food year-round, even during the harsh Canadian winters." },
      ],
      question: 'What does Margaret plan to do with the grant money?',
      options: ['Expand the garden to a second location', 'Build a greenhouse for year-round growing', 'Hire professional farmers to manage the garden', 'Donate the money to local food banks'],
      correct: 1, explanation: 'Step 7: Future. "Plans to use the funding to build a greenhouse" for year-round production. Not expanding to another location — building a greenhouse at the existing one.' },
  ],

  // 4.3 — Electric bus fleet
  [
    { type: 'listenChoose',
      audioLines: [
        { voice: 'narrator', text: "The city of Burlington announced today that it will replace its entire bus fleet with electric vehicles by 2028. The transition, which will cost an estimated forty-five million dollars, is part of the city's broader plan to achieve carbon neutrality by 2035." },
      ],
      question: 'What did the city of Burlington announce?',
      options: ['It will build a new bus terminal downtown', 'It will replace all buses with electric vehicles by 2028', 'It will increase bus fares to fund repairs', 'It will reduce the number of bus routes'],
      correct: 1, explanation: 'Step 1: Main story from the first sentence. Replace entire bus fleet with electric vehicles by 2028. Cost: $45 million. Part of carbon neutrality plan.' },
    { type: 'listenChoose',
      audioLines: [
        { voice: 'narrator', text: "Mayor Patricia Dunn defended the high cost, saying, quote, The initial investment is significant, but electric buses cost sixty percent less to maintain than diesel ones. In five years, we'll actually be saving money. Transit Director James Park added that the new buses will be quieter and produce zero emissions." },
      ],
      question: 'According to Mayor Dunn, why is the investment worth it?',
      options: ['Electric buses are more comfortable for passengers', 'The federal government is paying for the buses', 'Electric buses cost sixty percent less to maintain', 'The current buses are too old to repair'],
      correct: 2, explanation: 'Step 2: Track who said what! Mayor Dunn (not James Park) said the maintenance savings justify the cost. "60% less to maintain" is her argument. Quotes are always tested.' },
    { type: 'listenChoose',
      audioLines: [
        { voice: 'narrator', text: "The first twenty electric buses are expected to arrive in early 2027. They will be deployed on the city's three busiest routes first, with the remaining routes converting over the following year." },
      ],
      question: 'What will happen first in the transition?',
      options: ['All routes will switch to electric buses at once', 'The three busiest routes will get electric buses first', 'Passengers will vote on which routes to convert', 'The city will test one electric bus for a year'],
      correct: 1, explanation: 'Step 7: Future sequence. First 20 buses arrive early 2027 → deployed on 3 busiest routes → remaining routes convert the next year. Busiest routes go first.' },
  ],

  // 4.4 — Dog rescue hero
  [
    { type: 'listenChoose',
      audioLines: [
        { voice: 'narrator', text: "A Calgary firefighter is being called a hero after rescuing a dog trapped in a frozen river last Thursday evening. Lieutenant Mark Torres was off duty when he heard barking near the Bow River and found a golden retriever struggling on thin ice about fifteen meters from shore." },
      ],
      question: 'What is the news story about?',
      options: ['A dog that was lost for several days', 'A firefighter who rescued a dog from a frozen river', 'Training exercises for search and rescue teams', 'New safety rules for walking dogs near rivers'],
      correct: 1, explanation: 'Step 1: A firefighter rescued a dog from a frozen river. Note: he was OFF DUTY — this detail might be tested.' },
    { type: 'listenChoose',
      audioLines: [
        { voice: 'narrator', text: "Without hesitation, Torres crawled across the ice on his stomach to distribute his weight. He said, quote, I knew if I stood up, the ice would crack immediately. It took me about ten minutes to reach her. The dog's owner, Sarah Mitchell, had been calling for help for nearly twenty minutes before Torres arrived." },
      ],
      question: 'How did Lieutenant Torres cross the ice safely?',
      options: ['He ran quickly across the ice before it cracked', 'He used a rope to pull himself across', 'He crawled on his stomach to spread his weight', 'He waited for the ice to freeze thicker overnight'],
      correct: 2, explanation: 'Step 6: Emphasized detail. The news spent time explaining HOW he crossed — "crawled on his stomach to distribute his weight." When they explain HOW something works, expect a question.' },
    { type: 'listenChoose',
      audioLines: [
        { voice: 'narrator', text: "Sarah Mitchell said she is eternally grateful. The fire department is now planning to use this incident as a training case study. Torres himself said he hopes the story reminds people to keep their dogs on a leash near frozen waterways during winter." },
      ],
      question: 'What does Torres hope will result from this story?',
      options: ['That he will receive a promotion at work', 'That people will keep dogs on leashes near frozen water', 'That the city will build fences along the river', 'That more firefighters will learn to swim'],
      correct: 1, explanation: 'Step 7: Future / outcome. Torres hopes "people will keep dogs on a leash near frozen waterways." His goal is awareness, not personal recognition.' },
  ],

  // 4.5 — Student invention
  [
    { type: 'listenChoose',
      audioLines: [
        { voice: 'narrator', text: "A group of engineering students at the University of British Columbia has invented a water filter that can be made for less than two dollars using materials found in any hardware store. The team, led by twenty-two-year-old Priya Sharma, developed the filter as part of their final year project." },
      ],
      question: 'What did the students invent?',
      options: ['A new type of water bottle', 'An affordable water filter made from common materials', 'A machine that tests water quality', 'A smartphone app for finding clean water'],
      correct: 1, explanation: 'Step 1: UBC students invented a water filter costing under $2, made from hardware store materials. Led by Priya Sharma.' },
    { type: 'listenChoose',
      audioLines: [
        { voice: 'narrator', text: "Priya Sharma explained how the filter works. Quote: We use layers of sand, gravel, and activated charcoal inside a simple plastic container. The water passes through each layer, and by the time it reaches the bottom, ninety-nine percent of bacteria have been removed. It takes about thirty minutes to filter one liter." },
      ],
      question: 'What materials are used in the filter?',
      options: ['Metal mesh and copper pipes', 'Sand, gravel, and activated charcoal', 'Cotton fabric and plastic sheets', 'Ceramic tiles and rubber tubing'],
      correct: 1, explanation: 'Step 6: Emphasized detail. They spent time explaining HOW it works — sand, gravel, and activated charcoal in a plastic container. 99% bacteria removal. This detailed explanation = guaranteed question.' },
    { type: 'listenChoose',
      audioLines: [
        { voice: 'narrator', text: "The team has already received interest from three international aid organizations. Priya said their next step is to travel to rural communities in Southeast Asia this summer to test the filter in real-world conditions and train local volunteers to build them independently." },
      ],
      question: 'What is the team planning to do next?',
      options: ['Sell the filter to a major corporation', 'Apply for a patent and start a company', 'Test the filter in Southeast Asia and train locals to build it', 'Present the filter at a science fair in Vancouver'],
      correct: 2, explanation: 'Step 7: Future. Travel to Southeast Asia this summer → test in real conditions → train local volunteers. Multiple future actions — pick the one stated.' },
  ],

  // ─── Task 5: Discussion (3 people) ─── (5 scenarios)

  // 5.1 — Office dress code
  [
    { type: 'listenChoose',
      audioLines: [
        { voice: 'male', text: "So, management wants to bring back the formal dress code starting next month. No more casual Fridays either." },
        { voice: 'female', text: "Seriously? I think that's a step backward. Studies show people are more productive when they're comfortable." },
        { voice: 'male2', text: "I actually don't mind. When I dress professionally, I feel more focused. There's something to it." },
      ],
      question: 'What is being discussed?',
      options: ['Whether to hire new employees', 'A return to formal dress code at work', 'Planning the company holiday party', 'Changes to the work schedule'],
      correct: 1, explanation: 'Step 1: The topic is bringing back formal dress code. Three people, three different opinions — track each one in your mental table.' },
    { type: 'listenChoose',
      audioLines: [
        { voice: 'female', text: "But forcing everyone into suits won't make them work harder. It just makes people uncomfortable." },
        { voice: 'male2', text: "I see your point, but clients visit the office regularly. First impressions matter." },
        { voice: 'male', text: "That's exactly what management said. They want us to look more professional when clients are here." },
        { voice: 'female', text: "Then why not make it formal only on days when clients visit? That's a reasonable compromise." },
      ],
      question: 'What does the woman suggest as a compromise?',
      options: ['Everyone should wear uniforms provided by the company', 'Formal dress only on days when clients visit the office', 'Employees should vote on the dress code policy', 'Management should pay for employees\' professional clothing'],
      correct: 1, explanation: 'Step 3: Track opinions & solutions. The woman is AGAINST full-time formal dress but suggests a compromise: formal only on client visit days. Track who proposes what.' },
    { type: 'listenChoose',
      audioLines: [
        { voice: 'male', text: "That's actually not a bad idea. I could bring that up to HR." },
        { voice: 'male2', text: "I'd support that. Professional when it counts, comfortable the rest of the time." },
        { voice: 'female', text: "Great. So we all agree — formal for client days, casual otherwise?" },
        { voice: 'male', text: "Agreed. I'll email HR this afternoon." },
      ],
      question: 'What decision do they reach?',
      options: ['They reject the dress code change completely', 'They accept the full formal dress code without changes', 'They agree to suggest formal dress only for client visit days', 'They decide to ask all employees to vote on the issue'],
      correct: 2, explanation: 'Step 7 + Decision. All three agree on the compromise. The first man will email HR. CIRCLE this — group decisions are always tested.' },
  ],

  // 5.2 — Team building activity
  [
    { type: 'listenChoose',
      audioLines: [
        { voice: 'female', text: "The company gave us a budget of five hundred dollars for a team building activity. Any ideas?" },
        { voice: 'male', text: "How about an escape room? It's fun and it actually requires teamwork." },
        { voice: 'female2', text: "I'd prefer something outdoors. We sit at desks all week — it would be nice to get some fresh air." },
      ],
      question: 'Why are they having this discussion?',
      options: ['They need to reduce the department budget', 'They have a budget for a team building activity', 'They want to change their work schedules', 'Their manager asked them to work overtime'],
      correct: 1, explanation: 'Step 1: The company gave them $500 for team building. They need to decide how to spend it. Track each person\'s preference.' },
    { type: 'listenChoose',
      audioLines: [
        { voice: 'male', text: "An escape room is only about twenty-five dollars per person. For a team of twelve, that's three hundred. We'd still have budget left." },
        { voice: 'female2', text: "But some people on the team have anxiety in small spaces. Remember what happened with Lisa last time?" },
        { voice: 'female', text: "That's a good point. What about a cooking class? It's indoors but spacious, and everyone gets to eat what they make." },
        { voice: 'male', text: "Actually, that could work. How much does that cost?" },
        { voice: 'female', text: "Around forty dollars per person. For twelve people, that's four hundred and eighty — just under budget." },
      ],
      question: 'Why is the escape room idea rejected?',
      options: ['It costs too much for the group', 'Some team members have anxiety in small spaces', 'The nearest escape room is too far away', 'They already did an escape room last year'],
      correct: 1, explanation: 'Step 3: The escape room is rejected because "some people have anxiety in small spaces" — not cost (it was actually cheaper). Track the REAL reason for rejection.' },
    { type: 'listenChoose',
      audioLines: [
        { voice: 'female2', text: "A cooking class sounds fun! And we could choose a cuisine — maybe Italian or Thai?" },
        { voice: 'male', text: "I vote Thai. The Thai place downtown does group classes on Saturdays." },
        { voice: 'female', text: "Thai it is. I'll book it for two Saturdays from now. Everyone agree?" },
        { voice: 'female2', text: "Sounds perfect." },
      ],
      question: 'What activity do they choose and when?',
      options: ['An escape room this Friday', 'An outdoor hiking trip next weekend', 'A Thai cooking class in two Saturdays', 'An Italian dinner at a restaurant tonight'],
      correct: 2, explanation: 'Step 7: Decision + Future. Thai cooking class, two Saturdays from now. The first woman will book it. All three agree.' },
  ],

  // 5.3 — Office temperature dispute
  [
    { type: 'listenChoose',
      audioLines: [
        { voice: 'male', text: "Can we talk about the thermostat? It's freezing in here every afternoon. I'm wearing a jacket at my desk." },
        { voice: 'female', text: "Really? I think the temperature is fine. Actually, in the mornings it's way too warm for me." },
        { voice: 'male2', text: "The problem is our side of the building faces the sun all morning. By afternoon, the AC overcorrects and it gets cold." },
      ],
      question: 'What is the core problem?',
      options: ['The heating system is completely broken', 'The building is too old to regulate temperature', 'The AC overcorrects after the morning sun heats one side', 'Everyone wants different temperatures at all times'],
      correct: 2, explanation: 'Step 1: The third speaker identifies the root cause — sun heats one side in the morning, AC overcorrects in the afternoon. It\'s a building orientation issue, not a broken system.' },
    { type: 'listenChoose',
      audioLines: [
        { voice: 'male', text: "I asked facilities to turn up the heat, but then the people on the south side complained it was too hot." },
        { voice: 'female', text: "Because it was! You can't just crank up the heat for the whole building." },
        { voice: 'male2', text: "What if we asked facilities to set different temperatures for different zones? The north side could be a couple degrees warmer." },
        { voice: 'female', text: "Can they even do that with our system?" },
        { voice: 'male2', text: "I think so. The newer thermostats support zone control." },
      ],
      question: 'What solution does the third person propose?',
      options: ['Everyone should bring their own space heater', 'Facilities should set different temperatures for different zones', 'They should close the blinds on the south side', 'The entire HVAC system needs to be replaced'],
      correct: 1, explanation: 'Step 3: The third person (male2) proposes zone-based temperature control. Track who suggests what — this proposal is the key solution discussed.' },
    { type: 'listenChoose',
      audioLines: [
        { voice: 'male', text: "That would actually solve both problems. The south side stays cooler, the north side stays warmer." },
        { voice: 'female', text: "I'm on board. Should we submit a request together? It'll carry more weight than one person asking." },
        { voice: 'male2', text: "Good idea. I'll draft the email and we can all sign it. I'll send it to facilities by end of day." },
      ],
      question: 'What will they do next?',
      options: ['Each person will submit a separate complaint', 'The third person will draft a joint request to facilities', 'They will buy space heaters with their own money', 'They will schedule a meeting with the building owner'],
      correct: 1, explanation: 'Step 7: The third person (male2) will draft an email, all three sign it, send to facilities by end of day. A JOINT request — this decision is the future action.' },
  ],

  // 5.4 — Client presentation approach
  [
    { type: 'listenChoose',
      audioLines: [
        { voice: 'female', text: "We need to finalize our approach for the Henderson client presentation next week. It's a big account — two million dollars." },
        { voice: 'male', text: "I think we should lead with the data. Numbers speak for themselves. Show them the ROI projections first." },
        { voice: 'female2', text: "I disagree. Henderson is a family business. They care more about relationships than spreadsheets." },
      ],
      question: 'What is the main topic of discussion?',
      options: ['Hiring a new team member for the project', 'How to approach a major client presentation', 'Deciding whether to accept the Henderson account', 'Planning the annual company retreat'],
      correct: 1, explanation: 'Step 1: They\'re deciding on the approach for the Henderson presentation. $2 million account. Two different strategies are proposed.' },
    { type: 'listenChoose',
      audioLines: [
        { voice: 'male', text: "But every business wants to see the return on investment. That's universal." },
        { voice: 'female2', text: "Sure, but the ORDER matters. If we start with a story about how we helped a similar family business grow, they'll trust us. Then the numbers will mean more." },
        { voice: 'female', text: "She has a point. What if we combine both? Start with the case study, then transition into the data?" },
        { voice: 'male', text: "I can work with that. Story first, numbers second." },
      ],
      question: 'What presentation strategy do they agree on?',
      options: ['Lead with data and ROI projections only', 'Tell a story about a similar client first, then show the numbers', 'Let the client ask questions and respond naturally', 'Send the data ahead of time and skip the presentation'],
      correct: 1, explanation: 'Step 3: Compromise reached. Story about a similar family business FIRST → then transition to data/numbers. Track how the disagreement was resolved.' },
    { type: 'listenChoose',
      audioLines: [
        { voice: 'female', text: "Great. So who's doing what? I can handle the opening and introductions." },
        { voice: 'female2', text: "I'll prepare the case study. I worked with the Morrison account — similar size, family owned." },
        { voice: 'male', text: "And I'll put together the financial projections and ROI slides." },
        { voice: 'female', text: "Perfect. Let's do a practice run on Wednesday to make sure it flows." },
      ],
      question: 'What is each person responsible for?',
      options: ['First woman: case study, second woman: data, man: introductions', 'First woman: introductions, second woman: case study, man: financial projections', 'They will all work on each section together', 'The man will handle the entire presentation alone'],
      correct: 1, explanation: 'Step 3 + Step 7: Track who does what. First woman = introductions, second woman = case study (Morrison account), man = financial projections. Practice run on Wednesday.' },
  ],

  // 5.5 — New employee training
  [
    { type: 'listenChoose',
      audioLines: [
        { voice: 'male2', text: "We have three new hires starting next Monday. We need to figure out the training schedule." },
        { voice: 'female', text: "Last time, we did a full week of classroom training and it was overwhelming. Two people quit in the first month." },
        { voice: 'male', text: "I remember. They said it felt like drinking from a fire hose — too much information at once." },
      ],
      question: 'What problem are they trying to solve?',
      options: ['How to recruit more employees', 'How to improve training for new hires so they don\'t quit', 'How to reduce the number of employees', 'How to organize the company holiday schedule'],
      correct: 1, explanation: 'Step 1: The problem is that previous training was overwhelming and people quit. They need a better approach for three new hires starting Monday.' },
    { type: 'listenChoose',
      audioLines: [
        { voice: 'female', text: "What if we split the training into smaller chunks? Two days of basics, then pair them with a mentor for hands-on learning." },
        { voice: 'male', text: "The mentor idea is great. People learn better by doing. But who would be the mentors?" },
        { voice: 'male2', text: "I was thinking each of us could take one new hire. We know the different departments, so each person gets a different perspective." },
        { voice: 'female', text: "That works. And we could do a short check-in every Friday for the first month — just fifteen minutes to see how they're adjusting." },
      ],
      question: 'What training approach do they design?',
      options: ['A two-week classroom course with daily exams', 'Two days of basics, then each person mentors one new hire with weekly check-ins', 'Online video training that new hires complete at home', 'New hires shadow the CEO for one week'],
      correct: 1, explanation: 'Step 3: Combined approach: 2 days classroom basics → each of the 3 mentors takes 1 new hire → 15-minute Friday check-ins for the first month.' },
    { type: 'listenChoose',
      audioLines: [
        { voice: 'male2', text: "So let me summarize. Monday and Tuesday: basic orientation. Wednesday onward: each of us mentors one person. Fridays: group check-in." },
        { voice: 'male', text: "Sounds solid. I'll prepare the orientation materials this week." },
        { voice: 'female', text: "And I'll create a welcome guide with the key contacts, office map, and frequently asked questions." },
        { voice: 'male2', text: "Great. I'll send an email to the new hires with what to expect on their first day." },
      ],
      question: 'Who will contact the new hires before they start?',
      options: ['The first man will call them', 'The woman will send them the welcome guide', 'The second man will send them an email about the first day', 'HR will handle all communication'],
      correct: 2, explanation: 'Step 7: Track who does what. First man = orientation materials, woman = welcome guide, second man (male2) = email to new hires. The second man contacts them directly.' },
  ],

  // ─── Task 6: Viewpoints ─── (5 scenarios)

  // 6.1 — Remote work debate
  [
    { type: 'listenChoose',
      audioLines: [
        { voice: 'narrator', text: "A recent survey found that seventy-three percent of Canadian employees prefer working from home at least three days a week. But as companies push for a return to the office, the debate over remote work continues to divide workers, managers, and economists." },
      ],
      question: 'What is the main topic of this presentation?',
      options: ['How to set up a home office efficiently', 'The debate over remote work versus returning to the office', 'A survey about employee satisfaction with salaries', 'New government regulations on workplace safety'],
      correct: 1, explanation: 'Step 1: The debate over remote work vs. return to office. Three groups mentioned: workers, managers, economists — expect viewpoints from each.' },
    { type: 'listenChoose',
      audioLines: [
        { voice: 'narrator', text: "Workers argue that remote work gives them flexibility and eliminates stressful commutes. Managers, however, worry about accountability. As one senior executive put it, quote, How do I know my team is actually working if I can't see them? Economists take a middle ground, noting that a hybrid model could boost productivity by up to eighteen percent while maintaining team cohesion." },
      ],
      question: 'What concern do managers have about remote work?',
      options: ['Remote workers earn too much money', 'They cannot monitor whether employees are actually working', 'Technology costs are too high for remote setups', 'Employees working from home create security risks'],
      correct: 1, explanation: 'Step 2: Track who says what. Workers want flexibility. Managers worry about accountability — "How do I know they\'re working?" Economists prefer hybrid. Three distinct viewpoints.' },
    { type: 'listenChoose',
      audioLines: [
        { voice: 'narrator', text: "Perhaps the real question is not where people work, but how we measure results. Companies that focus on outcomes rather than hours logged seem to thrive regardless of where their employees sit. The future of work may not be about choosing sides at all, but about finding a balance that serves everyone." },
      ],
      question: 'What is the speaker\'s own opinion?',
      options: ['Everyone should return to the office full-time', 'Remote work should be banned in Canada', 'The focus should be on results rather than location, with a balanced approach', 'Companies should let employees decide everything independently'],
      correct: 2, explanation: 'Step 3: Speaker\'s position (revealed at the end). "Focus on outcomes rather than hours" + "finding a balance." The speaker favors a balanced, results-oriented approach — not fully pro-remote or pro-office.' },
  ],

  // 6.2 — Social media in schools
  [
    { type: 'listenChoose',
      audioLines: [
        { voice: 'narrator', text: "Should social media be banned in schools? This question has sparked heated debate among parents, teachers, and students themselves. With nearly ninety percent of Canadian teenagers using social media daily, the issue affects virtually every family in the country." },
      ],
      question: 'What issue is being discussed?',
      options: ['Whether schools should teach coding classes', 'Whether social media should be banned in schools', 'How to make schools more technologically advanced', 'The cost of providing laptops to students'],
      correct: 1, explanation: 'Step 1: Should social media be banned in schools? Three groups with views: parents, teachers, and students.' },
    { type: 'listenChoose',
      audioLines: [
        { voice: 'narrator', text: "Parents overwhelmingly support restrictions. In a recent poll, eighty-two percent said phones should be locked away during school hours. Teachers are more divided. While many agree that phones are distracting, some argue that social media can be a powerful educational tool. History teacher Marcus Williams said, quote, I use Instagram to bring primary sources to life. My students are more engaged than ever." },
      ],
      question: 'What is teacher Marcus Williams\'s view on social media?',
      options: ['All phones should be confiscated at the school entrance', 'Social media has no place in a learning environment', 'Social media can be a valuable educational tool when used properly', 'Students should only use social media during lunch breaks'],
      correct: 2, explanation: 'Step 2: Names matter in Task 6! Marcus Williams (history teacher) uses Instagram for teaching — he sees social media as an educational tool. Parents want restrictions, but teachers are divided.' },
    { type: 'listenChoose',
      audioLines: [
        { voice: 'narrator', text: "Students, predictably, oppose a ban. But their reasons are more nuanced than one might expect. Many cite the need to stay connected for group projects, school announcements, and even mental health support through peer communities. Rather than banning technology altogether, perhaps the answer lies in teaching digital literacy — helping young people use these tools wisely rather than taking them away entirely." },
      ],
      question: 'What does the speaker ultimately recommend?',
      options: ['A complete ban on social media for all students', 'Teaching digital literacy instead of banning technology', 'Letting students use phones only during breaks', 'Asking parents to monitor their children\'s phone use at home'],
      correct: 1, explanation: 'Step 3: Speaker\'s opinion (at the end). "Teaching digital literacy — helping young people use these tools wisely rather than taking them away entirely." The speaker favors education over prohibition.' },
  ],

  // 6.3 — Housing affordability
  [
    { type: 'listenChoose',
      audioLines: [
        { voice: 'narrator', text: "Housing affordability in Canada has reached a crisis point. The average home price in major cities has increased by over forty percent in the last five years, putting homeownership out of reach for many young Canadians. Three key groups have very different ideas about how to fix this problem." },
      ],
      question: 'What is the presentation about?',
      options: ['A new luxury housing development in Toronto', 'The housing affordability crisis in Canada', 'How to invest in real estate for profit', 'Government plans to raise property taxes'],
      correct: 1, explanation: 'Step 1: Housing affordability crisis. Prices up 40% in 5 years. Three groups will present different solutions — track each one.' },
    { type: 'listenChoose',
      audioLines: [
        { voice: 'narrator', text: "Real estate developers like Jennifer Walsh argue that the solution is simple: build more housing. Quote, If we cut through the red tape and build faster, prices will naturally come down. Renters disagree. Tenant advocate Omar Hassan points out that new buildings are almost always luxury condos. Quote, They build penthouses, not affordable apartments. Building more doesn't help if it's only for the wealthy." },
      ],
      question: 'What does Omar Hassan argue about building more housing?',
      options: ['Building more houses will solve the crisis quickly', 'New construction focuses on luxury units, not affordable housing', 'The government should pay developers to build faster', 'Renters should save more money for down payments'],
      correct: 1, explanation: 'Step 2: Two named viewpoints. Jennifer Walsh (developer): build more housing. Omar Hassan (tenant advocate): new buildings are luxury condos, not affordable. Directly opposing views.' },
    { type: 'listenChoose',
      audioLines: [
        { voice: 'narrator', text: "Economist Dr. Lisa Tran offers a third perspective. She believes a combination of increased construction AND rent control is needed. Quote, We need both supply and protection. Building alone won't help if investors buy everything. It's clear that no single solution will fix Canada's housing crisis. What's needed is a comprehensive approach that addresses both supply and affordability simultaneously." },
      ],
      question: 'What does the speaker conclude?',
      options: ['Developers are right that building more housing is the only answer', 'Rent control alone will solve the affordability problem', 'A comprehensive approach combining supply and affordability protections is needed', 'The government should stop all new construction until prices drop'],
      correct: 2, explanation: 'Step 3: Speaker agrees with Dr. Lisa Tran\'s balanced view — "comprehensive approach that addresses both supply and affordability." Neither just building nor just rent control, but both together.' },
  ],

  // 6.4 — Artificial intelligence in healthcare
  [
    { type: 'listenChoose',
      audioLines: [
        { voice: 'narrator', text: "Artificial intelligence is transforming healthcare across Canada. From diagnosing diseases to predicting patient outcomes, AI tools are becoming increasingly common in hospitals and clinics. But not everyone is convinced this is a positive development." },
      ],
      question: 'What is the main topic?',
      options: ['A new hospital being built with AI technology', 'The role and debate around AI in Canadian healthcare', 'How to become a doctor using AI training', 'AI replacing all medical workers in the future'],
      correct: 1, explanation: 'Step 1: AI in healthcare — its growing role AND the debate around it. "Not everyone is convinced" signals opposing viewpoints coming.' },
    { type: 'listenChoose',
      audioLines: [
        { voice: 'narrator', text: "Dr. Rachel Kim, a radiologist at Vancouver General Hospital, is enthusiastic. Quote, AI helped us detect a tumor that I almost missed on the scan. It's like having a second pair of expert eyes. But nurse practitioner Thomas Okafor is cautious. Quote, Patients don't want to hear their diagnosis from an algorithm. They want a human being who understands their fear and can hold their hand." },
      ],
      question: 'Why is Thomas Okafor cautious about AI in healthcare?',
      options: ['AI makes too many diagnostic errors', 'AI technology is too expensive for hospitals', 'Patients need human empathy and connection, not just algorithms', 'AI will eliminate all nursing jobs'],
      correct: 2, explanation: 'Step 2: Track who says what. Dr. Rachel Kim (radiologist) = pro-AI ("second pair of eyes"). Thomas Okafor (nurse) = cautious — patients need human empathy. Two named viewpoints with different priorities.' },
    { type: 'listenChoose',
      audioLines: [
        { voice: 'narrator', text: "Perhaps the most thoughtful perspective comes from patient advocacy groups, who argue that AI should assist doctors, never replace them. The technology works best when it enhances human judgment rather than substituting it. The goal should not be artificial intelligence or human expertise, but artificial intelligence and human expertise working together." },
      ],
      question: 'What is the speaker\'s final position on AI in healthcare?',
      options: ['AI should completely replace doctors to reduce costs', 'AI is too dangerous and should be banned from hospitals', 'AI should work alongside human doctors, enhancing rather than replacing them', 'Only young doctors should be allowed to use AI tools'],
      correct: 2, explanation: 'Step 3: Speaker\'s position (end). "AI AND human expertise working together" — not replacement, not rejection, but collaboration. The word "and" vs "or" is the key.' },
  ],

  // 6.5 — Four-day work week
  [
    { type: 'listenChoose',
      audioLines: [
        { voice: 'narrator', text: "The idea of a four-day work week has gained significant momentum in Canada. Several companies have already adopted it, and the results are surprising many business leaders. But can working less really lead to better outcomes?" },
      ],
      question: 'What question does this presentation explore?',
      options: ['How to get a raise at your current job', 'Whether a four-day work week can lead to better results', 'Why Canadian workers are unhappy with their salaries', 'How to start a business with fewer employees'],
      correct: 1, explanation: 'Step 1: Can a 4-day work week lead to better outcomes? The question is stated directly. Expect supporting and opposing viewpoints.' },
    { type: 'listenChoose',
      audioLines: [
        { voice: 'narrator', text: "CEO Angela Frost of a Toronto tech company reported a thirty-two percent drop in employee burnout after switching to four days. Quote, Our team produces the same output in four days because they're more focused and rested. Business owner Ricardo Mendes disagrees. Quote, In my restaurant, I need staff seven days a week. A four-day model would force me to hire more people, which I simply cannot afford." },
      ],
      question: 'Why does Ricardo Mendes oppose the four-day work week?',
      options: ['His employees don\'t want to work fewer days', 'He believes people should work harder, not less', 'He would need to hire more staff, which he cannot afford', 'His restaurant already closes on weekdays'],
      correct: 2, explanation: 'Step 2: Names matter! Angela Frost (tech CEO): supports — same output, less burnout. Ricardo Mendes (restaurant owner): opposes — needs 7-day coverage, can\'t afford more staff. Industry matters.' },
    { type: 'listenChoose',
      audioLines: [
        { voice: 'narrator', text: "Labor economist Dr. Yuki Tanaka suggests a flexible approach. Quote, The four-day week works beautifully in knowledge-based industries, but service industries need a different model, perhaps shorter shifts across five days. A one-size-fits-all solution simply won't work. What's clear is that the traditional five-day, forty-hour model is being challenged, and the conversation is far from over." },
      ],
      question: 'What does the speaker suggest about the four-day work week?',
      options: ['It should be mandatory for all businesses in Canada', 'It only works for restaurants and retail stores', 'Different industries need different approaches — there is no universal solution', 'The traditional five-day model should never be changed'],
      correct: 2, explanation: 'Step 3: Speaker agrees with Dr. Tanaka\'s nuanced view — different models for different industries. "One-size-fits-all won\'t work." The speaker favors flexibility, not a blanket rule.' },
  ],
];
