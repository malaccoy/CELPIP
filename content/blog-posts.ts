export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  readTime: string;
  category: 'writing' | 'speaking' | 'reading' | 'listening' | 'general' | 'tips';
  keywords: string[];
  content: string; // markdown-ish HTML
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'celpip-writing-task-1-complete-guide',
    title: 'CELPIP Writing Task 1: Complete Guide with Sample Answers (2026)',
    description: 'Master CELPIP Writing Task 1 with proven strategies, sample emails, scoring criteria, and common mistakes to avoid. Free practice tips for CLB 7-12.',
    date: '2026-03-02',
    readTime: '12 min read',
    category: 'writing',
    keywords: ['CELPIP writing task 1', 'CELPIP email writing', 'CELPIP writing tips', 'CELPIP writing sample', 'CELPIP writing score'],
    content: `
<h2>What is CELPIP Writing Task 1?</h2>
<p>CELPIP Writing Task 1 asks you to write an <strong>email</strong> of approximately 150-200 words in <strong>27 minutes</strong>. You'll be given a situation and must write an email that addresses all the points in the prompt.</p>
<p>This task tests your ability to communicate clearly in everyday Canadian English — think of it as writing a real email to a friend, colleague, or business.</p>

<h2>Scoring Criteria (What Examiners Look For)</h2>
<p>Your email is scored from <strong>1-12</strong> based on four criteria:</p>
<ul>
<li><strong>Content/Coherence</strong> — Did you address ALL parts of the prompt? Is your email logical and well-organized?</li>
<li><strong>Vocabulary</strong> — Do you use a range of words accurately? Avoid repetition?</li>
<li><strong>Readability</strong> — Is your email easy to read? Good paragraph structure?</li>
<li><strong>Task Fulfillment</strong> — Did you write the right type of email (formal vs informal) with the right tone?</li>
</ul>

<h2>The 3-Part Email Structure (Score CLB 9+)</h2>
<p>Every high-scoring email follows this structure:</p>

<h3>1. Opening (2-3 sentences)</h3>
<p>State WHY you're writing. Be direct.</p>
<blockquote>
<p><strong>Formal:</strong> "I am writing to express my concern regarding the recent changes to the parking policy in our building."</p>
<p><strong>Informal:</strong> "Hey Sarah! I just heard about your promotion — congratulations! I wanted to reach out because..."</p>
</blockquote>

<h3>2. Body (3-5 sentences)</h3>
<p>Address each point from the prompt. Use <strong>transition words</strong>: Furthermore, Additionally, However, On the other hand.</p>
<blockquote>
<p>"First, I would like to suggest that we extend the visitor parking hours until 9 PM. Many residents have guests who stay for dinner, and the current 6 PM limit causes significant inconvenience. Additionally, I believe adding a guest registration system would help manage the limited spaces more effectively."</p>
</blockquote>

<h3>3. Closing (1-2 sentences)</h3>
<p>End with a clear call to action or warm closing.</p>
<blockquote>
<p><strong>Formal:</strong> "I would appreciate the opportunity to discuss this further at the next residents' meeting. Thank you for your time and consideration."</p>
<p><strong>Informal:</strong> "Let me know what you think! Can't wait to catch up over coffee this weekend."</p>
</blockquote>

<h2>Common Mistakes That Kill Your Score</h2>
<ol>
<li><strong>Not addressing all bullet points</strong> — If the prompt has 3 points, cover ALL 3. Missing one = automatic score drop.</li>
<li><strong>Wrong tone</strong> — Writing formally to a friend, or casually to a manager. Read the prompt carefully!</li>
<li><strong>Too short</strong> — Under 150 words signals insufficient development. Aim for 170-200.</li>
<li><strong>Using contractions in formal emails</strong> — "don't" → "do not", "can't" → "cannot" for formal tone.</li>
<li><strong>No paragraphs</strong> — One giant block of text = low readability score.</li>
</ol>

<h2>Sample Task & Model Answer</h2>
<p><strong>Prompt:</strong> Write an email to your apartment building manager about a noise complaint. In your email:</p>
<ul>
<li>Describe the noise problem</li>
<li>Explain how it affects you</li>
<li>Suggest a solution</li>
</ul>

<div class="sample-answer">
<p><strong>Model Answer (CLB 10):</strong></p>
<p>Dear Mr. Thompson,</p>
<p>I am writing to bring to your attention a persistent noise issue that has been affecting several residents on the fourth floor, including myself.</p>
<p>For the past three weeks, the tenant in unit 405 has been playing extremely loud music every evening between 10 PM and midnight. The bass vibrations travel through the walls and make it impossible for me to sleep or concentrate on my work. As someone who starts work at 7 AM, this has significantly impacted my daily routine and overall well-being.</p>
<p>I would like to suggest that you send a formal reminder to all residents about the building's quiet hours policy, which states that noise levels should be reduced after 10 PM. If the situation does not improve, perhaps a direct conversation with the tenant would be appropriate.</p>
<p>Thank you for looking into this matter. I am confident we can find a reasonable solution.</p>
<p>Sincerely,<br/>Alex Chen</p>
</div>

<h2>Power Phrases to Boost Your Score</h2>
<p>Keep these in your toolkit:</p>
<ul>
<li><strong>Opening:</strong> "I am writing to inquire about...", "I hope this email finds you well.", "I wanted to reach out regarding..."</li>
<li><strong>Transitions:</strong> "Furthermore,", "In addition to this,", "Having said that,", "On a different note,"</li>
<li><strong>Suggestions:</strong> "I would like to propose that...", "Perhaps we could consider...", "One possible solution would be..."</li>
<li><strong>Closing:</strong> "I look forward to hearing from you.", "Please do not hesitate to contact me.", "I appreciate your prompt attention to this matter."</li>
</ul>

<h2>Practice Strategy</h2>
<p>The fastest way to improve your CELPIP Writing score:</p>
<ol>
<li><strong>Practice with a timer</strong> — Set 27 minutes. No cheating.</li>
<li><strong>Get AI feedback</strong> — Use our <a href="/writing/ai-tutor">AI Writing Tutor</a> for instant scoring and grammar correction.</li>
<li><strong>Study the technique guide</strong> — Our <a href="/writing/mastery">Writing Mastery Guide</a> covers everything in detail.</li>
<li><strong>Write daily</strong> — Even 15 minutes a day for 2 weeks = massive improvement.</li>
</ol>
`
  },
  {
    slug: 'celpip-vs-ielts-which-is-easier',
    title: 'CELPIP vs IELTS: Which is Easier? Honest Comparison (2026)',
    description: 'Detailed comparison of CELPIP and IELTS: difficulty, scoring, format, cost, and which test is better for Canadian immigration. Real data and student experiences.',
    date: '2026-03-02',
    readTime: '10 min read',
    category: 'general',
    keywords: ['CELPIP vs IELTS', 'CELPIP easier than IELTS', 'which English test for Canada', 'CELPIP or IELTS for immigration', 'CELPIP IELTS comparison'],
    content: `
<h2>The Short Answer</h2>
<p><strong>For most people, CELPIP is easier than IELTS.</strong> Here's why: CELPIP is 100% computer-based, uses Canadian English only, and the speaking test is done to a computer (not a live examiner). Many test-takers find this less stressful.</p>
<p>But it depends on your situation. Let's break it down.</p>

<h2>Quick Comparison Table</h2>
<table>
<thead>
<tr><th>Feature</th><th>CELPIP</th><th>IELTS</th></tr>
</thead>
<tbody>
<tr><td><strong>Format</strong></td><td>100% Computer</td><td>Paper or Computer</td></tr>
<tr><td><strong>Duration</strong></td><td>3 hours</td><td>2 hours 45 min</td></tr>
<tr><td><strong>English Accent</strong></td><td>Canadian only</td><td>British, Australian, American mix</td></tr>
<tr><td><strong>Speaking</strong></td><td>Record to computer</td><td>Live interview with examiner</td></tr>
<tr><td><strong>Writing</strong></td><td>Email + Survey response</td><td>Letter + Essay</td></tr>
<tr><td><strong>Score Scale</strong></td><td>1-12 (maps to CLB)</td><td>0-9 (maps to CLB)</td></tr>
<tr><td><strong>Cost (Canada)</strong></td><td>$280-$320 CAD</td><td>$309-$340 CAD</td></tr>
<tr><td><strong>Results</strong></td><td>4-5 business days (online)</td><td>13 days (paper) / 3-5 days (computer)</td></tr>
<tr><td><strong>Accepted for</strong></td><td>Canada only (PR, citizenship)</td><td>Worldwide</td></tr>
</tbody>
</table>

<h2>Why CELPIP is Easier (For Most People)</h2>

<h3>1. Speaking to a Computer ≠ Speaking to a Human</h3>
<p>This is the #1 reason people choose CELPIP. In IELTS, you sit across from an examiner who asks follow-up questions. Many people freeze under this pressure.</p>
<p>In CELPIP, you talk to a microphone. There's a timer on screen. No one judges your appearance or body language. For introverts and anxious test-takers, this is a game-changer.</p>

<h3>2. Canadian English Only</h3>
<p>IELTS listening includes British, Australian, and American accents. If you live in Canada, you're used to Canadian English. CELPIP only uses Canadian accents — a significant advantage if you've been living in Canada.</p>

<h3>3. Writing is More Practical</h3>
<p>CELPIP Writing Task 1 is an email. Task 2 is responding to a survey. These are real-life tasks most people do every day.</p>
<p>IELTS Task 1 is describing a graph/chart. Task 2 is a formal essay. More academic, less practical.</p>

<h3>4. Faster Results</h3>
<p>CELPIP results come in 4-5 business days online. IELTS paper-based takes 13 days. When you're anxious about immigration deadlines, every day counts.</p>

<h2>When IELTS Might Be Better</h2>
<ul>
<li><strong>You need the score for multiple countries</strong> — CELPIP is Canada-only. IELTS is accepted worldwide.</li>
<li><strong>You're strong at academic writing</strong> — If you have a university background, IELTS essay format might suit you.</li>
<li><strong>You prefer human interaction</strong> — Some people actually perform better with a live examiner who nods and encourages them.</li>
<li><strong>Test availability</strong> — IELTS has more test centres worldwide. CELPIP is mainly available in Canada.</li>
</ul>

<h2>CLB Score Comparison</h2>
<table>
<thead>
<tr><th>CLB Level</th><th>CELPIP Score</th><th>IELTS Score</th></tr>
</thead>
<tbody>
<tr><td>CLB 4</td><td>4</td><td>4.0</td></tr>
<tr><td>CLB 5</td><td>5</td><td>5.0</td></tr>
<tr><td>CLB 7</td><td>7</td><td>6.0</td></tr>
<tr><td>CLB 9</td><td>9</td><td>7.0</td></tr>
<tr><td>CLB 10</td><td>10</td><td>7.5</td></tr>
</tbody>
</table>
<p>Notice: CLB 7 requires CELPIP 7 but only IELTS 6.0. Some argue IELTS scoring is "easier" at lower CLB levels, but CELPIP's computer format often compensates.</p>

<h2>Our Recommendation</h2>
<p><strong>Choose CELPIP if:</strong></p>
<ul>
<li>You live in Canada (familiar with Canadian English)</li>
<li>You get nervous speaking to examiners</li>
<li>You need results quickly</li>
<li>You only need the score for Canadian immigration</li>
</ul>
<p><strong>Choose IELTS if:</strong></p>
<ul>
<li>You might need the score for other countries</li>
<li>You're outside Canada and can't access a CELPIP test centre</li>
<li>You have strong academic English skills</li>
</ul>

<h2>Ready to Start Preparing?</h2>
<p>If you've decided on CELPIP, start with our free resources:</p>
<ul>
<li><a href="/listening/technique">Listening Technique Guide</a> — Master all 6 parts</li>
<li><a href="/reading/technique">Reading Technique Guide</a> — Truth Trio method for Part 2</li>
<li><a href="/writing/mastery">Writing Mastery Guide</a> — Score CLB 9+ on both tasks</li>
<li><a href="/speaking/technique">Speaking Technique Guide</a> — CSF method for all 8 tasks</li>
</ul>
<p>Or jump straight into <a href="/dashboard">free practice</a> with our AI-powered platform.</p>
`
  },
  {
    slug: 'celpip-speaking-tips-score-9',
    title: 'CELPIP Speaking: 10 Tips to Score CLB 9+ (With Examples)',
    description: 'Proven strategies to score CLB 9 or higher on CELPIP Speaking. Covers all 8 tasks with examples, timing tricks, and common mistakes to avoid.',
    date: '2026-03-02',
    readTime: '14 min read',
    category: 'speaking',
    keywords: ['CELPIP speaking tips', 'CELPIP speaking score 9', 'CELPIP speaking practice', 'CELPIP speaking tasks', 'how to improve CELPIP speaking'],
    content: `
<h2>Why Speaking Is the Hardest Section</h2>
<p>CELPIP Speaking has <strong>8 tasks</strong> in about 20 minutes. You speak into a microphone with no human interaction. Each task gives you 30-60 seconds of prep time and 60-90 seconds to respond. It's intense.</p>
<p>The good news? With the right strategies, Speaking is also the section where you can improve the fastest.</p>

<h2>The CSF Method (Context → Skill → Formula)</h2>
<p>This is the framework that separates CLB 7 from CLB 9+ speakers:</p>
<ol>
<li><strong>Context</strong> — Understand what the task is really asking. Read the prompt carefully during prep time.</li>
<li><strong>Skill</strong> — Apply the specific technique for that task type (each of the 8 tasks has a different strategy).</li>
<li><strong>Formula</strong> — Follow a proven structure so you never run out of things to say.</li>
</ol>

<h2>10 Tips That Actually Work</h2>

<h3>1. Use ALL Your Prep Time</h3>
<p>Don't start talking the second the mic turns on. Use every second of prep time to plan your response. Jot mental notes: opening → point 1 → point 2 → closing.</p>

<h3>2. Speak for the ENTIRE Duration</h3>
<p>If you get 90 seconds, speak for 85-90 seconds. Stopping at 45 seconds = automatic low score for "development." Even if you're repeating a point with different words, keep going.</p>

<h3>3. Don't Memorize Scripts</h3>
<p>Examiners can tell. Memorized responses sound robotic and often don't match the prompt exactly. Instead, memorize <strong>frameworks</strong> and <strong>transition phrases</strong>.</p>

<h3>4. Vary Your Vocabulary</h3>
<p>Don't say "good" five times. Use: excellent, fantastic, outstanding, remarkable, impressive. Same for "bad": terrible, disappointing, concerning, problematic, unacceptable.</p>

<h3>5. Use Signpost Language</h3>
<p>Guide the listener through your response:</p>
<ul>
<li>"First and foremost..."</li>
<li>"Another important point is..."</li>
<li>"To add to that..."</li>
<li>"In conclusion, I'd like to emphasize..."</li>
</ul>

<h3>6. Task 3: Macro to Micro</h3>
<p>For the scene description task, go from big to small:</p>
<ol>
<li>Location/setting (overall scene)</li>
<li>General atmosphere</li>
<li>Centre of the image</li>
<li>Outward details (left, right, background)</li>
<li>Closing observation or feeling</li>
</ol>

<h3>7. Task 7: The Backstreet Boys Technique</h3>
<p>For the opinion task, give <strong>3 reasons</strong> with the Point → Reason → Example structure:</p>
<blockquote>
<p>"I strongly believe [opinion]. First, [point 1] because [reason]. For example, [specific example]. Second, [point 2]..." </p>
</blockquote>

<h3>8. Record Yourself Daily</h3>
<p>Listen to your recordings. You'll catch filler words ("um", "uh", "like"), pronunciation issues, and pacing problems you never noticed.</p>

<h3>9. Practice With Noise</h3>
<p>The real test centre isn't silent — other people are speaking nearby. Practice in a coffee shop or with background noise to build focus.</p>

<h3>10. Don't Panic on Mistakes</h3>
<p>Said the wrong word? Keep going. Self-correcting once is fine ("I mean..."), but stopping to correct every mistake kills fluency — which is worth more than perfect grammar.</p>

<h2>Task-by-Task Quick Guide</h2>
<table>
<thead>
<tr><th>Task</th><th>Type</th><th>Key Strategy</th></tr>
</thead>
<tbody>
<tr><td>1</td><td>Giving Advice</td><td>3 specific suggestions with reasons</td></tr>
<tr><td>2</td><td>Talking About Experience</td><td>Story structure: setup → event → outcome → lesson</td></tr>
<tr><td>3</td><td>Describing a Scene</td><td>Macro to Micro (location → center → outward)</td></tr>
<tr><td>4</td><td>Making Predictions</td><td>2 predictions with evidence + consequences</td></tr>
<tr><td>5</td><td>Comparing and Persuading</td><td>Compare both → choose one → 3 persuasion points</td></tr>
<tr><td>6</td><td>Dealing with Difficulty</td><td>Acknowledge → Empathize → Propose solution</td></tr>
<tr><td>7</td><td>Expressing Opinions</td><td>State opinion → 3 reasons with examples (Backstreet Boys)</td></tr>
<tr><td>8</td><td>Describing an Unusual Situation</td><td>Set the scene → What happened → Why it's unusual → Resolution</td></tr>
</tbody>
</table>

<h2>Start Practicing Now</h2>
<p>Reading tips is step one. Actually speaking is what improves your score.</p>
<ul>
<li><a href="/speaking/technique">Full Speaking Technique Guide</a> — Deep dive into all 8 tasks with the CSF method</li>
<li><a href="/speaking">Speaking Practice</a> — Record yourself with our timer and self-evaluation checklist</li>
<li><a href="/ai-coach">AI Speaking Coach</a> — Get instant AI feedback on pronunciation, fluency, and content (Pro)</li>
</ul>
`
  },
  {
    slug: 'celpip-listening-tips-perfect-score',
    title: 'CELPIP Listening: How to Get a Perfect Score (6 Part Breakdown)',
    description: 'Complete CELPIP Listening guide covering all 6 parts. Learn prediction techniques, note-taking strategies, and time management tips for maximum score.',
    date: '2026-03-02',
    readTime: '11 min read',
    category: 'listening',
    keywords: ['CELPIP listening tips', 'CELPIP listening practice', 'CELPIP listening score', 'CELPIP listening parts', 'CELPIP listening strategies'],
    content: `
<h2>CELPIP Listening Overview</h2>
<p>The Listening section has <strong>6 parts</strong> with approximately <strong>38 questions</strong> in 47-55 minutes. You hear each audio <strong>only once</strong> — there's no replay button. This makes preparation crucial.</p>

<h2>The 6 Parts Explained</h2>

<h3>Part 1: Listening to Problem Solving (8 questions)</h3>
<p>You hear a conversation where someone has a problem and another person helps solve it.</p>
<p><strong>Strategy:</strong> Focus on the SOLUTION, not just the problem. The questions usually ask about what was decided or recommended.</p>

<h3>Part 2: Listening to a Daily Life Conversation (5 questions)</h3>
<p>An everyday conversation — at work, at home, with friends.</p>
<p><strong>Strategy:</strong> Pay attention to attitudes and feelings, not just facts. Questions often ask "How does the speaker feel about...?"</p>

<h3>Part 3: Listening for Information (6 questions)</h3>
<p>Someone provides information — a tour guide, a presentation, an announcement.</p>
<p><strong>Strategy:</strong> Take quick notes on numbers, dates, and names. Information-heavy passages test specific recall.</p>

<h3>Part 4: Listening to a News Item (5 questions)</h3>
<p>A news report on a Canadian topic.</p>
<p><strong>Strategy:</strong> Identify WHO, WHAT, WHERE, WHEN, WHY in the first 30 seconds. News follows a predictable structure.</p>

<h3>Part 5: Listening to a Discussion (8 questions)</h3>
<p>A workplace discussion or meeting with multiple speakers.</p>
<p><strong>Strategy:</strong> Track who says what. Questions often ask about specific speakers' opinions or suggestions.</p>

<h3>Part 6: Listening to Viewpoints (6 questions)</h3>
<p>Two or more people share different opinions on a topic.</p>
<p><strong>Strategy:</strong> Note each speaker's position clearly (FOR vs AGAINST). Compare and contrast their arguments.</p>

<h2>5 Techniques for Higher Scores</h2>

<h3>1. Read Questions FIRST</h3>
<p>You get time to read questions before the audio plays. Use EVERY second. Knowing what to listen for = hearing the answer when it comes.</p>

<h3>2. Predict Before You Hear</h3>
<p>After reading the question, predict possible answers. Even wrong predictions prime your brain to recognize the actual answer faster.</p>

<h3>3. Don't Get Stuck</h3>
<p>Missed an answer? Move on immediately. If you're thinking about question 3 while question 4's answer is playing, you'll miss both. Mark your best guess and move forward.</p>

<h3>4. Listen for Signpost Words</h3>
<p>Answer clues often follow these words:</p>
<ul>
<li>"Actually..." (correction — real answer follows)</li>
<li>"The main point is..." (summary — important info)</li>
<li>"What I'd suggest is..." (recommendation — often tested)</li>
<li>"However..." / "But..." (contrast — the SECOND opinion is usually the answer)</li>
</ul>

<h3>5. Watch for Distractors</h3>
<p>CELPIP loves mentioning one option then changing to another. The speaker might say "We could do A... but actually B would be better." The answer is B, but many people pick A because they heard it first.</p>

<h2>Common Mistakes</h2>
<ol>
<li><strong>Choosing the first answer you hear</strong> — Wait for the speaker to finish. They often change their mind.</li>
<li><strong>Ignoring tone of voice</strong> — Sarcasm, hesitation, and enthusiasm all signal meaning beyond words.</li>
<li><strong>Not using prep time</strong> — Staring blankly instead of reading ahead = lost points.</li>
<li><strong>Overthinking</strong> — If you heard it clearly, trust your first instinct. CELPIP doesn't try to trick you.</li>
</ol>

<h2>Practice Makes Perfect</h2>
<p>The best way to improve listening is to practice with CELPIP-format audio:</p>
<ul>
<li><a href="/listening/technique">Listening Technique Guide</a> — Deep strategies for all 6 parts</li>
<li><a href="/listening">Listening Practice</a> — 16 free audio exercises covering all parts</li>
<li><a href="/ai-coach">AI Coach</a> — Unlimited AI-generated listening exercises (Pro)</li>
</ul>
<p>Also: watch Canadian news (CBC, CTV) daily for 15 minutes. You'll absorb Canadian English naturally.</p>
`
  },
  {
    slug: 'celpip-reading-strategies-time-management',
    title: 'CELPIP Reading: Time Management Strategies for All 4 Parts',
    description: 'Beat the clock on CELPIP Reading with proven strategies for all 4 parts. Learn the Truth Trio method, skimming techniques, and how to handle tricky questions.',
    date: '2026-03-02',
    readTime: '9 min read',
    category: 'reading',
    keywords: ['CELPIP reading tips', 'CELPIP reading strategies', 'CELPIP reading time management', 'CELPIP reading practice', 'CELPIP reading parts'],
    content: `
<h2>The Time Challenge</h2>
<p>CELPIP Reading gives you approximately <strong>55 minutes for 38 questions</strong> across 4 parts. That's less than 1.5 minutes per question. Many test-takers run out of time on Parts 3 and 4 because they spend too long on Parts 1 and 2.</p>

<h2>Recommended Time Split</h2>
<table>
<thead>
<tr><th>Part</th><th>Questions</th><th>Time</th><th>Strategy</th></tr>
</thead>
<tbody>
<tr><td>Part 1: Correspondence</td><td>11</td><td>13 min</td><td>Skim first, then answer</td></tr>
<tr><td>Part 2: Diagram/Chart</td><td>8</td><td>12 min</td><td>Study visual first</td></tr>
<tr><td>Part 3: Information</td><td>9</td><td>15 min</td><td>Topic sentences only</td></tr>
<tr><td>Part 4: Viewpoints</td><td>10</td><td>15 min</td><td>Compare positions</td></tr>
</tbody>
</table>

<h2>Part-by-Part Strategies</h2>

<h3>Part 1: Reading Correspondence (Emails, Letters)</h3>
<p>You'll read 2-3 related emails or letters and answer questions about them.</p>
<p><strong>Strategy:</strong></p>
<ul>
<li>Read the FIRST and LAST sentence of each email first — they contain the purpose and conclusion</li>
<li>Note who's writing to whom and why</li>
<li>Pay attention to tone shifts between emails (disagreement, agreement, compromise)</li>
</ul>

<h3>Part 2: Reading to Apply a Diagram</h3>
<p>You match information from a passage to a diagram, chart, or visual.</p>
<p><strong>Strategy:</strong></p>
<ul>
<li>Study the diagram BEFORE reading the passage</li>
<li>Identify what information is missing from the diagram</li>
<li>Scan the passage specifically for that missing information</li>
</ul>

<h3>Part 3: Reading for Information</h3>
<p>Longer passage with detail-oriented questions.</p>
<p><strong>Strategy — The Truth Trio Method:</strong></p>
<ol>
<li><strong>True</strong> — directly stated in the text</li>
<li><strong>False</strong> — contradicted by the text</li>
<li><strong>Not Given</strong> — not mentioned at all</li>
</ol>
<p>For each answer option, classify it as True/False/Not Given. The answer is always "True." If you can't find evidence in the text, it's probably wrong.</p>

<h3>Part 4: Reading for Viewpoints</h3>
<p>Two passages with different viewpoints on the same topic.</p>
<p><strong>Strategy:</strong></p>
<ul>
<li>Read Author 1's position first, summarize in one sentence</li>
<li>Read Author 2's position, summarize in one sentence</li>
<li>For each question, ask: "Whose viewpoint is this about?"</li>
<li>Don't mix up the authors' opinions — this is the #1 mistake</li>
</ul>

<h2>Universal Tips</h2>

<h3>Skim, Don't Read Every Word</h3>
<p>You don't have time to read every word carefully. Skim for main ideas first, then go back for specific answers. Reading every word = running out of time.</p>

<h3>Answer in Order</h3>
<p>CELPIP reading questions generally follow the order of the text. Question 3's answer comes after question 2's answer in the passage. Use this to locate information faster.</p>

<h3>Eliminate Wrong Answers</h3>
<p>Can't find the right answer? Eliminate obviously wrong ones. Even removing 1-2 options dramatically improves your chances.</p>

<h3>Don't Leave Blanks</h3>
<p>No penalty for wrong answers. If you're running out of time, quickly select your best guess for remaining questions.</p>

<h2>Practice Resources</h2>
<ul>
<li><a href="/reading/technique">Reading Technique Guide</a> — Truth Trio method + all 4 parts explained</li>
<li><a href="/reading/practice">Reading Practice</a> — 17 free passages across all parts</li>
<li><a href="/ai-coach">AI Practice Generator</a> — Unlimited AI-generated reading exercises (Pro)</li>
</ul>
`
  }
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find(p => p.slug === slug);
}

export function getAllBlogPosts(): BlogPost[] {
  return blogPosts.sort((a, b) => b.date.localeCompare(a.date));
}
