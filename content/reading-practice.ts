// Reading Practice Passages

export interface ReadingQuestion {
  id: number;
  question: string;
  options: string[];
  correct: number; // 0-indexed
  explanation: string;
}

export interface ReadingPassage {
  id: string;
  part: 1 | 2 | 3 | 4;
  partName: string;
  title: string;
  context?: string;
  content: string;
  diagram?: {
    type: 'map' | 'chart' | 'floor-plan' | 'diagram';
    description: string;
  };
  questions: ReadingQuestion[];
}

export const readingPassages: ReadingPassage[] = [
  // PART 1: Reading Correspondence
  {
    id: 'correspondence-1',
    part: 1,
    partName: 'Reading Correspondence',
    title: 'Email About Office Renovation',
    context: 'Read this email from an office manager to all employees.',
    content: `Subject: Temporary Office Relocation During Renovation

Dear Team,

I hope this message finds you well. I'm writing to inform you about an important update regarding our office space.

Starting Monday, March 15th, our main office will undergo a significant renovation project that is expected to last approximately six weeks. During this time, our team will be temporarily relocated to the second floor of the Riverside Building, located at 250 Main Street—just a five-minute walk from our current location.

Here are the key details you need to know:

**Moving Schedule:**
- Friday, March 12th: Pack personal items and label your boxes
- Saturday, March 13th: Moving crew will transport equipment
- Monday, March 15th: Resume work at temporary location

**What to Bring:**
Please take home any personal items of value. While we've arranged secure storage, we cannot be responsible for personal belongings during the move.

**Parking:**
The Riverside Building has limited parking. We encourage carpooling or using public transit. The building is a 3-minute walk from the Central Station bus stop.

**IT Support:**
Our IT team will ensure all computers and phones are set up before Monday morning. If you experience any technical issues, contact the IT helpdesk at extension 555.

I understand that change can be challenging, but I'm confident this renovation will result in a more comfortable and productive workspace. The new layout will include more meeting rooms, a larger break area, and improved lighting.

Please don't hesitate to reach out if you have any questions or concerns.

Best regards,
Sarah Thompson
Office Manager`,
    questions: [
      {
        id: 1,
        question: 'What is the main purpose of this email?',
        options: [
          'To announce a permanent office move',
          'To inform staff about a temporary relocation during renovation',
          'To explain new parking regulations',
          'To introduce a new office manager'
        ],
        correct: 1,
        explanation: 'The email clearly states the office will "undergo a significant renovation" and the team will be "temporarily relocated."'
      },
      {
        id: 2,
        question: 'How long is the renovation expected to take?',
        options: [
          'Three weeks',
          'One month',
          'Six weeks',
          'Two months'
        ],
        correct: 2,
        explanation: 'The email states the renovation is "expected to last approximately six weeks."'
      },
      {
        id: 3,
        question: 'What should employees do on Friday, March 12th?',
        options: [
          'Work from home',
          'Move to the new location',
          'Pack and label their personal items',
          'Contact the IT helpdesk'
        ],
        correct: 2,
        explanation: 'The Moving Schedule shows "Friday, March 12th: Pack personal items and label your boxes."'
      },
      {
        id: 4,
        question: 'What is suggested about parking at the Riverside Building?',
        options: [
          'There is plenty of free parking available',
          'Employees must pay for parking',
          'Parking is limited and alternatives are encouraged',
          'Parking is not allowed'
        ],
        correct: 2,
        explanation: 'The email says "The Riverside Building has limited parking. We encourage carpooling or using public transit."'
      },
      {
        id: 5,
        question: 'What is the tone of this email?',
        options: [
          'Apologetic and worried',
          'Informative and reassuring',
          'Demanding and strict',
          'Casual and humorous'
        ],
        correct: 1,
        explanation: 'Sarah provides clear information while expressing confidence that "this renovation will result in a more comfortable and productive workspace."'
      }
    ]
  },
  {
    id: 'correspondence-2',
    part: 1,
    partName: 'Reading Correspondence',
    title: 'Community Newsletter',
    context: 'Read this message from a neighborhood community association.',
    content: `Maplewood Community Newsletter - Spring Edition

Dear Maplewood Residents,

Spring is finally here, and with it comes several exciting community updates and events!

**Annual Spring Clean-Up Day**
Mark your calendars for Saturday, April 10th! Our yearly neighborhood clean-up will take place from 9 AM to 1 PM. Volunteers will meet at Maplewood Park, where supplies will be provided. Last year, we collected over 50 bags of litter and planted 25 new trees. Let's make this year even better!

Refreshments will be served, and children who participate will receive a special "Community Hero" badge. To volunteer, please sign up at maplewood-community.ca/volunteer or contact Rita Chen at rita.chen@maplewood.ca.

**Road Closure Notice**
Please be aware that Oak Avenue will be closed for resurfacing from April 5th to April 12th. During this time, residents should use Birch Street as an alternate route. Emergency vehicle access will be maintained at all times.

**New Community Garden Plots Available**
Good news for gardening enthusiasts! We have 15 new plots available at the community garden behind the recreation center. Plots are 10x10 feet and cost $40 for the season (May to October). Priority will be given to first-time gardeners. Applications are due by April 15th.

**Upcoming Events:**
- April 10: Spring Clean-Up Day (9 AM - 1 PM)
- April 17: Easter Egg Hunt for children (10 AM, Maplewood Park)
- April 24: Community Potluck Dinner (6 PM, Recreation Center)
- May 1: Farmers Market Opening Day

We look forward to seeing you at these events!

Warm regards,
The Maplewood Community Association`,
    questions: [
      {
        id: 1,
        question: 'What will children receive for participating in the Spring Clean-Up?',
        options: [
          'A gift card',
          'A "Community Hero" badge',
          'A tree to plant at home',
          'Free refreshments only'
        ],
        correct: 1,
        explanation: 'The newsletter states "children who participate will receive a special \'Community Hero\' badge."'
      },
      {
        id: 2,
        question: 'Why will Oak Avenue be closed?',
        options: [
          'For a community event',
          'For emergency repairs',
          'For road resurfacing',
          'For the farmers market'
        ],
        correct: 2,
        explanation: 'The notice says "Oak Avenue will be closed for resurfacing from April 5th to April 12th."'
      },
      {
        id: 3,
        question: 'Who gets priority for the new garden plots?',
        options: [
          'Long-time community members',
          'People who apply earliest',
          'First-time gardeners',
          'Families with children'
        ],
        correct: 2,
        explanation: 'The newsletter clearly states "Priority will be given to first-time gardeners."'
      },
      {
        id: 4,
        question: 'Which event happens first in April?',
        options: [
          'Spring Clean-Up Day',
          'Easter Egg Hunt',
          'Road closure begins',
          'Community Potluck Dinner'
        ],
        correct: 2,
        explanation: 'The road closure begins April 5th, which is before the Spring Clean-Up on April 10th.'
      },
      {
        id: 5,
        question: 'How much does a garden plot cost for the full season?',
        options: [
          '$15',
          '$25',
          '$40',
          '$50'
        ],
        correct: 2,
        explanation: 'The newsletter says "Plots are 10x10 feet and cost $40 for the season."'
      }
    ]
  },
  
  // PART 3: Reading for Information
  {
    id: 'information-1',
    part: 3,
    partName: 'Reading for Information',
    title: 'The Rise of Remote Work in Canada',
    content: `The COVID-19 pandemic fundamentally transformed how Canadians work. What began as a temporary emergency measure has evolved into a permanent shift in workplace culture, with lasting implications for employees, employers, and urban development.

**A Dramatic Shift**

Before 2020, only about 4% of Canadian workers regularly worked from home. By April 2020, that number had skyrocketed to 40%. While many have since returned to offices, a significant portion of the workforce continues to work remotely at least part of the time. According to Statistics Canada, approximately 25% of workers now follow a hybrid model, splitting their time between home and office.

**Benefits for Workers**

Employees cite numerous advantages to remote work. The most commonly mentioned benefit is the elimination of commuting time. The average Canadian spends 26 minutes commuting each way—time that remote workers can reclaim for personal activities, family, or even additional work. Many workers also report improved work-life balance and reduced stress.

However, the picture isn't entirely positive. Some employees struggle with isolation and the blurring of boundaries between work and personal life. Younger workers, in particular, miss the mentorship opportunities and social connections that offices provide.

**Challenges for Employers**

Companies have had to adapt their management styles significantly. Traditional approaches based on physical presence and direct observation no longer apply. Instead, managers are shifting toward results-based evaluation, focusing on output rather than hours worked.

Businesses have also had to invest heavily in technology—not just hardware like laptops and monitors, but also cybersecurity measures to protect sensitive data accessed from home networks. A recent survey found that Canadian businesses spent an average of $2,500 per remote employee on technology upgrades in 2021.

**Impact on Cities**

The remote work revolution is reshaping Canadian cities. Downtown office vacancy rates have climbed to historic highs in cities like Toronto, Vancouver, and Calgary. Some buildings are being converted to residential use, while others struggle to find tenants.

Meanwhile, smaller cities and rural areas are experiencing growth as workers realize they can live anywhere with reliable internet. Communities like Canmore, Alberta and Kelowna, British Columbia have seen significant population increases as remote workers seek better quality of life at lower costs.

**Looking Ahead**

Experts predict that remote and hybrid work will remain common features of Canadian workplaces. However, the exact balance will vary by industry and company culture. Jobs requiring physical presence—manufacturing, healthcare, retail—will obviously remain in-person. But for knowledge workers, the traditional five-day office week may never fully return.`,
    questions: [
      {
        id: 1,
        question: 'According to the passage, what percentage of Canadian workers worked from home before 2020?',
        options: [
          'About 4%',
          'About 25%',
          'About 40%',
          'About 50%'
        ],
        correct: 0,
        explanation: 'The passage states "Before 2020, only about 4% of Canadian workers regularly worked from home."'
      },
      {
        id: 2,
        question: 'What is the most commonly cited benefit of remote work?',
        options: [
          'Higher salaries',
          'Better technology',
          'No commuting time',
          'More vacation days'
        ],
        correct: 2,
        explanation: 'The passage says "The most commonly mentioned benefit is the elimination of commuting time."'
      },
      {
        id: 3,
        question: 'Which group particularly misses office work?',
        options: [
          'Senior executives',
          'Younger workers',
          'Parents with children',
          'Technology professionals'
        ],
        correct: 1,
        explanation: 'The passage states "Younger workers, in particular, miss the mentorship opportunities and social connections that offices provide."'
      },
      {
        id: 4,
        question: 'How have managers had to change their approach?',
        options: [
          'They now monitor employees more closely',
          'They focus on results rather than hours worked',
          'They require more meetings',
          'They have reduced expectations'
        ],
        correct: 1,
        explanation: 'The passage says managers are "shifting toward results-based evaluation, focusing on output rather than hours worked."'
      },
      {
        id: 5,
        question: 'What is happening to downtown office buildings?',
        options: [
          'They are all being demolished',
          'They have record-low vacancy rates',
          'Some are being converted to residential use',
          'They are increasing in value'
        ],
        correct: 2,
        explanation: 'The passage mentions "Some buildings are being converted to residential use, while others struggle to find tenants."'
      },
      {
        id: 6,
        question: 'Why are smaller cities experiencing growth?',
        options: [
          'They have better job opportunities',
          'Workers can live anywhere with internet access',
          'Housing prices have increased',
          'Downtown offices are relocating there'
        ],
        correct: 1,
        explanation: 'The passage explains that "workers realize they can live anywhere with reliable internet" and seek "better quality of life at lower costs."'
      }
    ]
  },

  // PART 4: Reading for Viewpoints
  {
    id: 'viewpoints-1',
    part: 4,
    partName: 'Reading for Viewpoints',
    title: 'Should Schools Ban Smartphones?',
    context: 'Three educators share their views on smartphone policies in schools.',
    content: `**Dr. Michelle Park, High School Principal**

I firmly believe that smartphones should be completely banned during school hours. In my 20 years as an educator, I've never seen a technology that causes as much distraction as the smartphone. Students are constantly checking notifications, texting friends, and scrolling through social media—even during lessons.

When we implemented a phone-free policy at my school last year, the results were remarkable. Teachers reported that students were more engaged and participatory. Test scores improved by an average of 8%. Most importantly, students started talking to each other again during lunch and breaks instead of staring at screens.

Critics say we should teach students to self-regulate their phone use. I disagree. Teenagers' brains are still developing, particularly the prefrontal cortex that controls impulse decisions. Expecting them to resist the pull of social media notifications is unrealistic.

**Marcus Thompson, Middle School Teacher**

I take a more moderate position. Rather than banning phones outright, I think we should establish clear guidelines and teach digital citizenship. Phones aren't going away—they're an essential part of modern life. If we ban them completely at school, we miss an opportunity to teach responsible use.

In my classroom, I use a "phone parking lot" system. Students place their phones in designated slots during instruction time but can use them during approved activities—like researching topics or using educational apps. This teaches them to self-regulate while still maintaining boundaries.

I do agree with Dr. Park that phones can be problematic. But I've also seen them used positively—students photographing notes, accessing digital textbooks, and using translation apps. The solution isn't to ban the technology but to guide its use.

**Jennifer Walsh, Elementary School Counselor**

For younger children, I support strict limitations on phone use at school. However, I'm concerned about complete bans for a different reason than distraction. Many children use phones to contact parents in emergencies or after school. Taking that away creates anxiety for both children and parents.

What worries me more is what we're NOT addressing: why children are so attached to their phones in the first place. Many use social media to cope with stress or loneliness. Simply banning phones doesn't solve these underlying issues—it might even make them worse by removing a coping mechanism without providing alternatives.

I'd rather see schools invest in mental health resources and social-emotional learning programs. If students feel connected and supported at school, they'll be less dependent on their phones for validation.`,
    questions: [
      {
        id: 1,
        question: 'Who supports a complete smartphone ban during school hours?',
        options: [
          'Only Dr. Park',
          'Dr. Park and Marcus Thompson',
          'Dr. Park and Jennifer Walsh',
          'All three educators'
        ],
        correct: 0,
        explanation: 'Only Dr. Park "firmly believes that smartphones should be completely banned." Thompson and Walsh prefer different approaches.'
      },
      {
        id: 2,
        question: 'What evidence does Dr. Park provide for the success of phone-free policies?',
        options: [
          'Student surveys',
          'Parent feedback',
          'Improved test scores and engagement',
          'Reduced discipline problems'
        ],
        correct: 2,
        explanation: 'Dr. Park mentions "Teachers reported that students were more engaged" and "Test scores improved by an average of 8%."'
      },
      {
        id: 3,
        question: 'What is Marcus Thompson\'s main argument against banning phones?',
        options: [
          'It violates student rights',
          'Phones have educational uses',
          'It\'s an opportunity to teach responsible use',
          'Parents will complain'
        ],
        correct: 2,
        explanation: 'Thompson says "If we ban them completely at school, we miss an opportunity to teach responsible use" and digital citizenship.'
      },
      {
        id: 4,
        question: 'What is Jennifer Walsh most concerned about?',
        options: [
          'Students missing important calls',
          'The underlying reasons for phone attachment',
          'Teachers not enforcing rules',
          'Phone theft'
        ],
        correct: 1,
        explanation: 'Walsh says "What worries me more is what we\'re NOT addressing: why children are so attached to their phones in the first place."'
      },
      {
        id: 5,
        question: 'Which educator mentions the development of teenage brains?',
        options: [
          'Dr. Michelle Park',
          'Marcus Thompson',
          'Jennifer Walsh',
          'All three educators'
        ],
        correct: 0,
        explanation: 'Dr. Park mentions that "Teenagers\' brains are still developing, particularly the prefrontal cortex."'
      },
      {
        id: 6,
        question: 'What solution does Jennifer Walsh recommend?',
        options: [
          'Stricter phone bans',
          'Teaching digital citizenship',
          'Investing in mental health resources',
          'Allowing unlimited phone use'
        ],
        correct: 2,
        explanation: 'Walsh says "I\'d rather see schools invest in mental health resources and social-emotional learning programs."'
      },
      {
        id: 7,
        question: 'Who uses a "phone parking lot" system?',
        options: [
          'Dr. Michelle Park',
          'Marcus Thompson',
          'Jennifer Walsh',
          'All three educators'
        ],
        correct: 1,
        explanation: 'Marcus Thompson says "In my classroom, I use a \'phone parking lot\' system."'
      },
      {
        id: 8,
        question: 'Which educators would likely agree that phones have SOME positive uses?',
        options: [
          'Dr. Park only',
          'Thompson only',
          'Thompson and Walsh',
          'All three educators'
        ],
        correct: 2,
        explanation: 'Thompson mentions educational uses, and Walsh mentions emergency contact with parents. Dr. Park focuses only on negatives.'
      }
    ]
  },

  // ============================================
  // PART 2: Reading to Apply a Diagram
  // ============================================
  {
    id: 'diagram-1',
    part: 2,
    partName: 'Reading to Apply a Diagram',
    title: 'Lakeside Shopping Centre Directory',
    context: 'Read the following information about Lakeside Shopping Centre and refer to the floor plan.',
    content: `Welcome to Lakeside Shopping Centre!

Our newly expanded mall features over 80 stores across two levels, plus an underground parking garage with 500 spaces.

**Ground Floor:**
The main entrance on Lakeshore Drive opens into the Central Atrium, where you'll find our Information Desk and the seasonal farmers' market (Saturdays 9 AM–2 PM). To the left of the atrium is the Food Court, featuring 12 restaurants. To the right is the Anchor Department Store, Bayside. Washrooms are located beside the Food Court and near the east exit.

The west wing houses fashion retailers including Northern Thread, Maple Apparel, and Coast & Co. The east wing contains electronics stores and a large bookstore, Chapters North.

**Upper Floor:**
Accessible via escalators at the Central Atrium or elevators near both east and west exits. The upper floor features a 6-screen cinema (Starlight Cinemas) at the west end, a fitness centre (FitLife Gym) at the east end, and a children's play area in the centre. The medical clinic, Lakeside Health, is beside the cinema. A second set of washrooms is located near the play area.

**Parking:**
Underground parking is accessed from Pine Street (south side). The first two hours are free with any purchase. Additional hours are $3 each. Accessible parking spaces are located near the elevator on Level P1.

**Hours:**
Monday–Saturday: 10 AM – 9 PM
Sunday: 11 AM – 6 PM
Holiday hours may vary. Check our website: lakesideshopping.ca`,
    diagram: {
      type: 'floor-plan',
      description: 'Two-level shopping mall floor plan showing: Ground Floor with Central Atrium (centre), Food Court (left/west), Bayside department store (right/east), fashion stores (west wing), electronics and bookstore (east wing). Upper Floor with cinema (west end), gym (east end), play area (centre), medical clinic (beside cinema).'
    },
    questions: [
      {
        id: 1,
        question: 'Where is the Food Court located?',
        options: [
          'On the upper floor near the cinema',
          'To the right of the Central Atrium',
          'To the left of the Central Atrium on the ground floor',
          'In the east wing of the ground floor'
        ],
        correct: 2,
        explanation: 'The passage states "To the left of the atrium is the Food Court."'
      },
      {
        id: 2,
        question: 'Where would you go to see a movie?',
        options: [
          'East end of the upper floor',
          'West end of the ground floor',
          'West end of the upper floor',
          'Central Atrium'
        ],
        correct: 2,
        explanation: 'Starlight Cinemas is at "the west end" of the upper floor.'
      },
      {
        id: 3,
        question: 'A parent wants to take their child to the play area and then see a doctor. What floor should they go to?',
        options: [
          'Ground floor only',
          'Upper floor only',
          'Ground floor first, then upper floor',
          'They need to visit both floors'
        ],
        correct: 1,
        explanation: 'Both the play area and the medical clinic (Lakeside Health) are on the upper floor.'
      },
      {
        id: 4,
        question: 'How long can you park for free?',
        options: [
          'One hour with a purchase',
          'Two hours with any purchase',
          'Three hours with any purchase',
          'Parking is always free'
        ],
        correct: 1,
        explanation: 'The passage says "The first two hours are free with any purchase."'
      },
      {
        id: 5,
        question: 'When does the farmers\' market take place?',
        options: [
          'Every day from 9 AM to 2 PM',
          'Sundays from 11 AM to 6 PM',
          'Saturdays from 9 AM to 2 PM',
          'Weekdays from 10 AM to 9 PM'
        ],
        correct: 2,
        explanation: 'The passage says the "seasonal farmers\' market (Saturdays 9 AM–2 PM)" is in the Central Atrium.'
      },
      {
        id: 6,
        question: 'If you enter from Lakeshore Drive and want to buy a book, which direction should you go?',
        options: [
          'Left toward the Food Court',
          'Right toward the east wing',
          'Upstairs to the upper floor',
          'Downstairs to the parking level'
        ],
        correct: 1,
        explanation: 'Chapters North bookstore is in the east wing, which is to the right of the Central Atrium.'
      }
    ]
  },
  {
    id: 'diagram-2',
    part: 2,
    partName: 'Reading to Apply a Diagram',
    title: 'Vancouver Community Centre Schedule',
    context: 'Read the following activity schedule for the Mountainview Community Centre.',
    content: `Mountainview Community Centre — Winter 2026 Program Schedule

Registration opens January 5th online at mountainviewcc.ca or in person at the front desk. Early bird discount (15% off) available until January 12th.

**Pool Schedule:**
- Lane Swim: Mon/Wed/Fri 6:00–8:00 AM, Tue/Thu 7:00–9:00 PM
- Family Swim: Sat/Sun 1:00–4:00 PM
- Aquafit Class: Tue/Thu 10:00–11:00 AM (Instructor: Diana)
- Children's Lessons: Sat 9:00–12:00 PM (Ages 4–12, 4 levels)

**Gymnasium:**
- Drop-in Basketball: Mon/Wed 7:00–9:00 PM ($5/session)
- Volleyball League: Tue 7:00–9:30 PM (registration required, $120/season)
- Badminton: Fri 6:00–9:00 PM ($5/session)
- Youth Basketball Camp: Sat 10:00 AM–12:00 PM (Ages 8–14, $80 for 10 weeks)

**Fitness Studio (Room 201):**
- Yoga: Mon/Wed 9:30–10:30 AM (Instructor: Priya, $15/class or $120/10 classes)
- Zumba: Tue/Thu 6:00–7:00 PM (Instructor: Carlos, $12/class)
- Pilates: Fri 9:30–10:30 AM (Instructor: Sarah, $15/class)
- Tai Chi: Sat 8:00–9:00 AM (Instructor: Mr. Chen, $10/class)

**Meeting Rooms:**
Available for rental: Room 101 (capacity 20, $30/hr), Room 102 (capacity 40, $50/hr), Boardroom (capacity 12, $25/hr). Book at the front desk or online.

**Important Notes:**
- All pool users must shower before entering the pool
- Children under 8 must be accompanied by an adult in the pool
- Drop-in activities: no registration needed, pay at the door
- Locker rentals: $20/month or $5/visit
- Free parking available in the south lot`,
    diagram: {
      type: 'chart',
      description: 'Weekly schedule grid showing activities by day and time across Pool, Gymnasium, and Fitness Studio areas.'
    },
    questions: [
      {
        id: 1,
        question: 'When can families swim together on weekends?',
        options: [
          'Saturday and Sunday 9:00 AM–12:00 PM',
          'Saturday and Sunday 1:00–4:00 PM',
          'Saturday only 1:00–4:00 PM',
          'Sunday only 1:00–4:00 PM'
        ],
        correct: 1,
        explanation: 'Family Swim is "Sat/Sun 1:00–4:00 PM."'
      },
      {
        id: 2,
        question: 'A person wants to do both Yoga and Zumba. How many days per week would they need to come?',
        options: [
          'Two days',
          'Three days',
          'Four days',
          'Five days'
        ],
        correct: 2,
        explanation: 'Yoga is Mon/Wed and Zumba is Tue/Thu — that\'s four different days.'
      },
      {
        id: 3,
        question: 'Which activity does NOT require registration?',
        options: [
          'Volleyball League',
          'Youth Basketball Camp',
          'Drop-in Basketball',
          'Children\'s Swim Lessons'
        ],
        correct: 2,
        explanation: 'Drop-in Basketball is listed at $5/session, and the notes say "Drop-in activities: no registration needed, pay at the door."'
      },
      {
        id: 4,
        question: 'How much would 10 yoga classes cost compared to paying per class?',
        options: [
          'The same price ($150)',
          '$30 cheaper ($120 vs $150)',
          '$20 cheaper ($120 vs $140)',
          '$50 cheaper ($100 vs $150)'
        ],
        correct: 1,
        explanation: 'Yoga is $15/class × 10 = $150, or $120 for the 10-class package — saving $30.'
      },
      {
        id: 5,
        question: 'What is the maximum room capacity available for rent?',
        options: [
          '12 people',
          '20 people',
          '40 people',
          '50 people'
        ],
        correct: 2,
        explanation: 'Room 102 has the largest capacity at 40 people.'
      },
      {
        id: 6,
        question: 'A parent has a 6-year-old who wants to swim. What rule must they follow?',
        options: [
          'The child must take swimming lessons first',
          'The child can only swim during Family Swim',
          'An adult must accompany the child in the pool',
          'The child must wear a life jacket'
        ],
        correct: 2,
        explanation: 'The notes state "Children under 8 must be accompanied by an adult in the pool."'
      }
    ]
  },
  {
    id: 'diagram-3',
    part: 2,
    partName: 'Reading to Apply a Diagram',
    title: 'Stanley Park Trail Map',
    context: 'Read the following guide about walking trails in Stanley Park, Vancouver.',
    content: `Stanley Park Walking Trails — Visitor Guide

Stanley Park offers over 27 kilometres of trails ranging from easy, paved paths to moderate forest trails. Here are the most popular routes:

**Seawall Path (Easy, Paved)**
Distance: 10 km loop | Time: 2–3 hours | Accessible: Yes
The iconic Seawall is a flat, paved path circling the park along the waterfront. Starting from the Coal Harbour entrance (northeast), the path passes Brockton Point and its lighthouse, the Totem Poles, Lumberman's Arch, and Third Beach before completing the loop. Cyclists and rollerbladers share the path but must travel counterclockwise, while pedestrians may go either direction.

**Beaver Lake Trail (Easy, Gravel)**
Distance: 2 km return | Time: 30–45 min | Accessible: Partially
This trail starts near the park's centre, leading to Beaver Lake, a small freshwater lake known for its water lilies (best viewed June–August). Birdwatchers will enjoy the variety of species around the lake. The trail is flat but gravel, so wheelchairs may find it difficult in wet conditions.

**Cathedral Trail (Moderate, Forest)**
Distance: 1.5 km one way | Time: 30–45 min | Accessible: No
Running through old-growth forest, this trail features some of the park's tallest Douglas fir and western red cedar trees. The path is uneven with roots and moderate elevation changes. It connects the Prospect Point area (northwest) to the park centre near Beaver Lake. Dogs must be on leash.

**Prospect Point Lookout**
Located at the highest point in the park (64 metres), Prospect Point offers stunning views of the Lions Gate Bridge and the North Shore mountains. There is a café and gift shop at the lookout. Parking is available but fills quickly on weekends.

**Getting Here:**
Bus routes 19 and C21 stop at the park entrance. Free parking is available along Park Drive, but paid parking ($3.50/hr) is recommended at the main lots near the aquarium or Prospect Point. The park is open dawn to dusk year-round.`,
    diagram: {
      type: 'map',
      description: 'Trail map of Stanley Park showing: Seawall Path (loop around perimeter), Coal Harbour entrance (northeast), Brockton Point and lighthouse (east), Totem Poles (east), Lumberman\'s Arch (east), Third Beach (west), Beaver Lake (centre), Cathedral Trail (northwest to centre), Prospect Point (northwest, highest point), Lions Gate Bridge (north).'
    },
    questions: [
      {
        id: 1,
        question: 'Which trail is suitable for someone in a wheelchair?',
        options: [
          'Cathedral Trail',
          'Beaver Lake Trail',
          'Seawall Path',
          'Prospect Point Lookout'
        ],
        correct: 2,
        explanation: 'The Seawall Path is marked as "Accessible: Yes" — it\'s flat and paved. Beaver Lake is only partially accessible.'
      },
      {
        id: 2,
        question: 'A cyclist wants to ride around the park. Which direction must they travel?',
        options: [
          'Clockwise only',
          'Counterclockwise only',
          'Either direction',
          'Cyclists are not allowed on the Seawall'
        ],
        correct: 1,
        explanation: 'The passage states "Cyclists and rollerbladers must travel counterclockwise."'
      },
      {
        id: 3,
        question: 'When is the best time to see water lilies at Beaver Lake?',
        options: [
          'March to May',
          'June to August',
          'September to November',
          'Year-round'
        ],
        correct: 1,
        explanation: 'The passage says water lilies are "best viewed June–August."'
      },
      {
        id: 4,
        question: 'Which trail connects Prospect Point to the park centre?',
        options: [
          'Seawall Path',
          'Beaver Lake Trail',
          'Cathedral Trail',
          'Park Drive'
        ],
        correct: 2,
        explanation: 'Cathedral Trail "connects the Prospect Point area (northwest) to the park centre near Beaver Lake."'
      },
      {
        id: 5,
        question: 'What can you see from Prospect Point?',
        options: [
          'Beaver Lake and water lilies',
          'The Totem Poles and Brockton Point',
          'Lions Gate Bridge and North Shore mountains',
          'Third Beach and the ocean'
        ],
        correct: 2,
        explanation: 'Prospect Point "offers stunning views of the Lions Gate Bridge and the North Shore mountains."'
      },
      {
        id: 6,
        question: 'How much does parking cost at the main lots?',
        options: [
          'Free',
          '$2.00 per hour',
          '$3.50 per hour',
          '$5.00 per hour'
        ],
        correct: 2,
        explanation: 'The passage states "paid parking ($3.50/hr) is recommended at the main lots."'
      }
    ]
  },
  {
    id: 'diagram-4',
    part: 2,
    partName: 'Reading to Apply a Diagram',
    title: 'CN Tower Visitor Information',
    context: 'Read the following visitor guide for the CN Tower in Toronto.',
    content: `CN Tower — Visitor Experience Guide

Standing at 553 metres, the CN Tower is Canada's most iconic landmark and one of the tallest freestanding structures in the world. Plan your visit with this guide to our four observation levels.

**Level 1: Main Observation Deck (346 m)**
Your journey begins with a 58-second elevator ride to the Main Deck. The floor-to-ceiling windows provide 360-degree views of Toronto, Lake Ontario, and on clear days, Niagara Falls (120 km away). The outdoor observation terrace is open weather permitting. A gift shop and café are located on this level.

**Level 2: Glass Floor (342 m)**
Just below the Main Deck, the Glass Floor lets you look straight down 342 metres to the ground. It's made of reinforced glass panels that can hold the weight of 14 hippos (5,000 kg each). Not recommended for those with a fear of heights!

**Level 3: SkyPod (447 m)**
The highest observation level, accessible by a separate elevator from the Main Deck. The SkyPod offers views up to 160 km on clear days. This level requires an additional ticket ($15 on top of general admission). Note: The SkyPod may close during high winds.

**Level 4: EdgeWalk (356 m)**
For the ultimate thrill, walk hands-free along a 1.5-metre-wide ledge on the outside of the tower — the world's highest full-circle hands-free walk. EdgeWalk operates May through October and requires a separate booking ($225/person). Participants must be at least 13 years old and weigh between 34–136 kg. Duration: approximately 30 minutes.

**Tickets & Hours:**
- General Admission (Levels 1 & 2): Adults $43, Children (6–13) $33, Under 6 free
- SkyPod Add-on: $15 per person
- Hours: Daily 9 AM–10:30 PM (last entry 9:30 PM)
- Book online at cntower.ca for 10% off and skip the line
- 360 Restaurant: Fine dining at 351 m, reservations include free tower admission`,
    diagram: {
      type: 'diagram',
      description: 'Vertical cross-section of CN Tower showing four levels: Glass Floor (342m), Main Observation Deck (346m), EdgeWalk (356m), and SkyPod (447m). Ground level shows entrance and elevators.'
    },
    questions: [
      {
        id: 1,
        question: 'How long does the elevator ride to the Main Deck take?',
        options: [
          '28 seconds',
          '58 seconds',
          '2 minutes',
          '5 minutes'
        ],
        correct: 1,
        explanation: 'The passage says "a 58-second elevator ride to the Main Deck."'
      },
      {
        id: 2,
        question: 'Which level is the highest that visitors can reach?',
        options: [
          'Main Observation Deck (346 m)',
          'EdgeWalk (356 m)',
          'SkyPod (447 m)',
          'Glass Floor (342 m)'
        ],
        correct: 2,
        explanation: 'The SkyPod at 447 m is described as "The highest observation level."'
      },
      {
        id: 3,
        question: 'How much would it cost for two adults to visit the Main Deck and SkyPod?',
        options: [
          '$86',
          '$96',
          '$116',
          '$126'
        ],
        correct: 2,
        explanation: 'Two adults: 2 × $43 (general) + 2 × $15 (SkyPod) = $86 + $30 = $116.'
      },
      {
        id: 4,
        question: 'What is a requirement for the EdgeWalk?',
        options: [
          'Participants must be at least 18 years old',
          'It operates year-round',
          'Participants must weigh between 34–136 kg',
          'It costs $43 per person'
        ],
        correct: 2,
        explanation: 'The passage states participants "must weigh between 34–136 kg." The minimum age is 13, not 18.'
      },
      {
        id: 5,
        question: 'How can visitors save money on tickets?',
        options: [
          'By visiting on weekdays',
          'By purchasing a family pass',
          'By booking online at cntower.ca',
          'By arriving before 10 AM'
        ],
        correct: 2,
        explanation: 'The passage says "Book online at cntower.ca for 10% off and skip the line."'
      },
      {
        id: 6,
        question: 'What is included with a reservation at the 360 Restaurant?',
        options: [
          'A SkyPod ticket',
          'Free tower admission',
          'An EdgeWalk experience',
          'Free parking'
        ],
        correct: 1,
        explanation: 'The passage states "360 Restaurant: Fine dining at 351 m, reservations include free tower admission."'
      }
    ]
  },
  {
    id: 'diagram-5',
    part: 2,
    partName: 'Reading to Apply a Diagram',
    title: 'Ottawa Transit Map',
    context: 'Read the following guide about public transit in Ottawa.',
    content: `OC Transpo — Getting Around Ottawa

Ottawa's public transit system, OC Transpo, includes the Confederation Line (O-Train Line 1), the Trillium Line (O-Train Line 2), and an extensive bus network. Here's what you need to know.

**Confederation Line (Line 1 — East-West)**
This 12.5-km light rail line runs from Blair Station in the east to Tunney's Pasture in the west, with 13 stations. Key stops include:
- Rideau: Ottawa's main shopping district, Rideau Centre mall
- Parliament: closest stop to Parliament Hill (5-minute walk north)
- Lyon: near the National Art Gallery (10-minute walk)
- Bayview: transfer point to Line 2 (Trillium Line)
- uOttawa: University of Ottawa campus

Trains run every 3–5 minutes during rush hour and every 8–10 minutes during off-peak times.

**Trillium Line (Line 2 — North-South)**
Running from Bayview Station south to Limeroad, this 8-km line serves 5 stations. Key stops include:
- Carleton: Carleton University campus
- Greenboro: connection to South Keys shopping area
- Limeroad: end of line, park-and-ride available (free parking)

Trains run every 6–8 minutes during rush hours.

**Fares:**
- Single ride: $3.75 (cash), $3.00 (Presto card)
- Day Pass: $11.25
- Monthly Pass: $125.50 (adults), $97.75 (students with valid ID)
- Children 5 and under: free
- Transfers are free within 90 minutes on the same fare

**Tips for Visitors:**
- Buy a Presto card at any station ($6 card fee, reloadable)
- The Day Pass pays for itself after 4 trips
- All stations have bike racks; bikes are allowed on trains during off-peak hours only
- Accessibility: all stations and buses are wheelchair accessible
- Lost & Found: call 613-741-4390 or visit the customer service desk at Rideau Station`,
    diagram: {
      type: 'map',
      description: 'Transit map showing two O-Train lines: Line 1 (Confederation Line) running east-west from Blair to Tunney\'s Pasture with 13 stations. Line 2 (Trillium Line) running north-south from Bayview to Limeroad with 5 stations. Transfer point at Bayview Station where both lines connect.'
    },
    questions: [
      {
        id: 1,
        question: 'Where do Lines 1 and 2 connect?',
        options: [
          'Rideau Station',
          'Parliament Station',
          'Bayview Station',
          'Blair Station'
        ],
        correct: 2,
        explanation: 'Bayview is described as the "transfer point to Line 2 (Trillium Line)."'
      },
      {
        id: 2,
        question: 'Which station is closest to Parliament Hill?',
        options: [
          'Rideau',
          'Parliament',
          'Lyon',
          'uOttawa'
        ],
        correct: 1,
        explanation: 'Parliament is the "closest stop to Parliament Hill (5-minute walk north)."'
      },
      {
        id: 3,
        question: 'How much would a tourist save per trip by using a Presto card instead of cash?',
        options: [
          '$0.25',
          '$0.50',
          '$0.75',
          '$1.00'
        ],
        correct: 2,
        explanation: 'Cash fare is $3.75 and Presto fare is $3.00 — a savings of $0.75 per trip.'
      },
      {
        id: 4,
        question: 'A visitor plans to make 5 trips in one day. What is the cheapest option?',
        options: [
          'Pay cash each time ($18.75)',
          'Use a Presto card ($15.00)',
          'Buy a Day Pass ($11.25)',
          'Buy a Monthly Pass'
        ],
        correct: 2,
        explanation: 'Cash: 5 × $3.75 = $18.75. Presto: 5 × $3.00 = $15.00. Day Pass: $11.25. The Day Pass is cheapest.'
      },
      {
        id: 5,
        question: 'When can you bring a bicycle on the train?',
        options: [
          'Anytime',
          'Only during rush hours',
          'Only during off-peak hours',
          'Bicycles are not allowed'
        ],
        correct: 2,
        explanation: 'The passage states "bikes are allowed on trains during off-peak hours only."'
      },
      {
        id: 6,
        question: 'Where can a commuter from the suburbs park for free and take the train?',
        options: [
          'Rideau Station',
          'Bayview Station',
          'Limeroad Station',
          'Blair Station'
        ],
        correct: 2,
        explanation: 'Limeroad has a "park-and-ride available (free parking)."'
      }
    ]
  },

  // ============================================
  // PART 3: Reading for Information (additional)
  // ============================================
  {
    id: 'information-2',
    part: 3,
    partName: 'Reading for Information',
    title: 'How Canada Became a Leader in Immigration',
    content: `Canada has long been recognized as one of the most welcoming countries in the world for immigrants. But this reputation wasn't built overnight—it is the result of decades of deliberate policy choices, economic necessity, and evolving social attitudes.

**The Points System Revolution**

In 1967, Canada introduced the world's first immigration points system, replacing a previous approach that heavily favoured applicants from European countries. The new system evaluated candidates based on objective criteria: education, language ability, work experience, and age. This single policy change transformed Canada's demographic landscape. Within a decade, immigration from Asia, Africa, and Latin America increased dramatically.

Today's Express Entry system, introduced in 2015, is a digital evolution of that original idea. Candidates create online profiles and are ranked using the Comprehensive Ranking System (CRS). The highest-ranked candidates receive Invitations to Apply (ITAs) for permanent residency, typically within six months.

**Economic Drivers**

Canada's embrace of immigration is not purely altruistic. The country faces a significant demographic challenge: an aging population and a declining birth rate of just 1.4 children per woman—well below the 2.1 needed for population replacement. Without immigration, Canada's population would begin shrinking by 2030, placing enormous pressure on healthcare, pensions, and the economy.

In 2024, immigrants accounted for approximately 23% of Canada's population—the highest proportion among G7 nations. The government has set ambitious targets: welcoming 485,000 new permanent residents per year by 2025.

**Integration Challenges**

Despite its success, Canada's immigration system faces real challenges. Many newcomers experience difficulty getting their foreign credentials recognized. A doctor from India may drive a taxi for years before being able to practise medicine in Canada. Housing affordability, particularly in Toronto and Vancouver, makes settlement increasingly difficult.

Language barriers also persist. While newcomers must demonstrate English or French ability, the transition from test scores to workplace communication can be steep. Settlement organizations across the country offer free language classes and employment support, but demand often exceeds capacity.

**A Model for the World**

Despite its imperfections, Canada's approach to immigration remains a global benchmark. The combination of economic pragmatism, transparent selection criteria, and multicultural values has created a system that most Canadians continue to support. Polls consistently show that over 60% of Canadians view immigration as positive for the country—a figure that would be remarkable in most nations.`,
    questions: [
      {
        id: 1,
        question: 'What was significant about Canada\'s 1967 immigration policy?',
        options: [
          'It was the first to ban immigration entirely',
          'It introduced the world\'s first points-based system',
          'It limited immigration to European countries',
          'It created the Express Entry system'
        ],
        correct: 1,
        explanation: 'The passage states "In 1967, Canada introduced the world\'s first immigration points system."'
      },
      {
        id: 2,
        question: 'What is Canada\'s main economic reason for welcoming immigrants?',
        options: [
          'To increase tax revenue',
          'To fill jobs that Canadians won\'t do',
          'To counteract an aging population and low birth rate',
          'To attract foreign investment'
        ],
        correct: 2,
        explanation: 'The passage explains "an aging population and a declining birth rate" as the key demographic challenge.'
      },
      {
        id: 3,
        question: 'What challenge does the passage describe for foreign-trained professionals?',
        options: [
          'They cannot apply for permanent residency',
          'Their qualifications may not be recognized in Canada',
          'They are not allowed to work for five years',
          'They must retake all their education in Canada'
        ],
        correct: 1,
        explanation: 'The passage says "Many newcomers experience difficulty getting their foreign credentials recognized" and gives the example of a doctor driving a taxi.'
      },
      {
        id: 4,
        question: 'What percentage of Canadians view immigration positively?',
        options: [
          'About 40%',
          'About 50%',
          'Over 60%',
          'Over 80%'
        ],
        correct: 2,
        explanation: 'The passage states "over 60% of Canadians view immigration as positive for the country."'
      },
      {
        id: 5,
        question: 'What is the Comprehensive Ranking System (CRS)?',
        options: [
          'A language testing program',
          'A scoring system for Express Entry candidates',
          'A job placement service for newcomers',
          'A citizenship examination'
        ],
        correct: 1,
        explanation: 'The passage explains that Express Entry candidates "are ranked using the Comprehensive Ranking System (CRS)."'
      },
      {
        id: 6,
        question: 'What would happen to Canada\'s population without immigration?',
        options: [
          'It would grow more slowly',
          'It would stay the same',
          'It would begin shrinking by 2030',
          'It would double by 2050'
        ],
        correct: 2,
        explanation: 'The passage says "Without immigration, Canada\'s population would begin shrinking by 2030."'
      }
    ]
  },
  {
    id: 'information-3',
    part: 3,
    partName: 'Reading for Information',
    title: 'The Science of Sleep',
    content: `Why do we sleep? It seems like a simple question, but scientists are still uncovering the full answer. What we do know is that sleep is not a passive state—it's an active, essential process that affects nearly every system in the body.

**The Stages of Sleep**

A typical night's sleep consists of 4–6 cycles, each lasting about 90 minutes. Each cycle includes four stages:

Stages 1 and 2 are light sleep, during which your heart rate slows and body temperature drops. These stages account for about 50% of total sleep time. Stage 3 is deep sleep (also called slow-wave sleep), critical for physical recovery—the body repairs tissues, strengthens the immune system, and releases growth hormones. Finally, REM (Rapid Eye Movement) sleep is when most dreaming occurs. During REM, the brain is almost as active as when you're awake, consolidating memories and processing emotions.

**How Much Sleep Do You Need?**

Sleep needs vary by age. Newborns need 14–17 hours, teenagers need 8–10, and adults need 7–9 hours. However, the quality of sleep matters as much as quantity. Six hours of uninterrupted sleep may be more restorative than eight hours of fragmented sleep.

**The Cost of Sleep Deprivation**

Chronic sleep deprivation—defined as regularly getting less than six hours per night—has serious health consequences. It increases the risk of heart disease by 48%, Type 2 diabetes by 30%, and obesity. Sleep-deprived individuals are also 3 times more likely to be involved in a car accident.

Cognitively, even one night of poor sleep reduces reaction time, impairs decision-making, and weakens emotional regulation. Studies show that staying awake for 17 hours produces impairment equivalent to a blood alcohol level of 0.05%—nearly the legal driving limit in many countries.

**Tips for Better Sleep**

Sleep researchers recommend these evidence-based strategies:
- Maintain a consistent sleep schedule, even on weekends
- Keep your bedroom cool (18–20°C), dark, and quiet
- Avoid screens for 30–60 minutes before bed (blue light suppresses melatonin)
- Limit caffeine after 2 PM (its half-life is 5–6 hours)
- Exercise regularly, but not within 3 hours of bedtime
- If you can't fall asleep within 20 minutes, get up and do something relaxing until you feel drowsy`,
    questions: [
      {
        id: 1,
        question: 'What happens during Stage 3 (deep sleep)?',
        options: [
          'Most dreaming occurs',
          'The brain consolidates memories',
          'The body repairs tissues and releases growth hormones',
          'Heart rate increases to daytime levels'
        ],
        correct: 2,
        explanation: 'Stage 3 is "critical for physical recovery—the body repairs tissues, strengthens the immune system, and releases growth hormones."'
      },
      {
        id: 2,
        question: 'When does dreaming mainly occur?',
        options: [
          'During Stage 1 (light sleep)',
          'During Stage 3 (deep sleep)',
          'During REM sleep',
          'Equally across all stages'
        ],
        correct: 2,
        explanation: 'The passage states "REM (Rapid Eye Movement) sleep is when most dreaming occurs."'
      },
      {
        id: 3,
        question: 'According to the passage, which is more important for feeling rested?',
        options: [
          'Sleeping at least 9 hours',
          'Going to bed before 10 PM',
          'The quality of sleep, not just quantity',
          'Taking naps during the day'
        ],
        correct: 2,
        explanation: 'The passage says "the quality of sleep matters as much as quantity" and that 6 hours uninterrupted may beat 8 hours fragmented.'
      },
      {
        id: 4,
        question: 'Being awake for 17 hours is compared to what?',
        options: [
          'Running a marathon',
          'Having a blood alcohol level of 0.05%',
          'Working a double shift',
          'Skipping two meals'
        ],
        correct: 1,
        explanation: 'The passage says "staying awake for 17 hours produces impairment equivalent to a blood alcohol level of 0.05%."'
      },
      {
        id: 5,
        question: 'Why should you avoid screens before bed?',
        options: [
          'They cause eye damage',
          'They are too stimulating mentally',
          'Blue light suppresses melatonin production',
          'They increase body temperature'
        ],
        correct: 2,
        explanation: 'The tip says "Avoid screens for 30–60 minutes before bed (blue light suppresses melatonin)."'
      },
      {
        id: 6,
        question: 'What should you do if you can\'t fall asleep within 20 minutes?',
        options: [
          'Take a sleeping pill',
          'Try harder to fall asleep',
          'Get up and do something relaxing',
          'Turn on the TV'
        ],
        correct: 2,
        explanation: 'The passage advises: "get up and do something relaxing until you feel drowsy."'
      }
    ]
  },
  {
    id: 'information-4',
    part: 3,
    partName: 'Reading for Information',
    title: 'Understanding Canadian Healthcare',
    content: `Canada's publicly funded healthcare system, known as Medicare, is often cited as a defining feature of Canadian identity. But how does it actually work, and what does it cover?

**The Basics**

Unlike a single national system, Canadian healthcare is actually managed by each province and territory individually. The federal government sets minimum standards through the Canada Health Act (1984), which requires all provincial plans to meet five principles: universality, accessibility, comprehensiveness, portability, and public administration.

Every Canadian citizen and permanent resident is eligible for a provincial health card. This card provides access to medically necessary hospital and doctor services at no direct cost to the patient. There are no co-pays for doctor visits or hospital stays, and no annual deductibles.

**What's Covered**

Medicare covers visits to family doctors and specialists, hospital stays (including surgery, meals, and medications while admitted), diagnostic tests (X-rays, blood work, MRIs), maternity care and delivery, and emergency services. Mental health services provided by psychiatrists (who are medical doctors) are also covered.

**What's NOT Covered**

Many Canadians are surprised to learn that several health services fall outside Medicare. These include prescription medications outside hospitals, dental care, vision care (eye exams and glasses), physiotherapy, and ambulance fees (which vary by province—in Ontario, it's $45 per trip; in British Columbia, $80).

Most working Canadians access these services through employer-sponsored extended health benefits. Those without workplace coverage may purchase private insurance or pay out of pocket. Some provinces offer pharmacare programs for seniors and low-income residents.

**Wait Times**

The most common criticism of Canadian healthcare is wait times. The median wait for an MRI is 10 weeks, and the wait to see a specialist after a GP referral averages 12 weeks nationally. Emergency rooms prioritize by severity—a heart attack patient is seen immediately, while someone with a minor injury might wait several hours.

Provincial governments are investing in solutions: more medical school seats, internationally trained doctor fast-tracking, and virtual care options that expanded rapidly during the pandemic. Walk-in clinics serve as a middle ground between family doctors and emergency rooms for non-urgent concerns.`,
    questions: [
      {
        id: 1,
        question: 'Who manages healthcare in Canada?',
        options: [
          'The federal government exclusively',
          'Private insurance companies',
          'Each province and territory individually',
          'A single national health agency'
        ],
        correct: 2,
        explanation: 'The passage says "Canadian healthcare is actually managed by each province and territory individually."'
      },
      {
        id: 2,
        question: 'Which of these is NOT covered by Medicare?',
        options: [
          'Hospital stays',
          'Prescription drugs outside hospital',
          'Visits to family doctors',
          'Emergency services'
        ],
        correct: 1,
        explanation: 'The passage lists "prescription medications outside hospitals" as not covered by Medicare.'
      },
      {
        id: 3,
        question: 'How do most working Canadians pay for dental care?',
        options: [
          'Through Medicare',
          'Through employer-sponsored health benefits',
          'The government pays directly',
          'It is included in taxes'
        ],
        correct: 1,
        explanation: 'The passage states "Most working Canadians access these services through employer-sponsored extended health benefits."'
      },
      {
        id: 4,
        question: 'What is the median wait time for an MRI?',
        options: [
          '2 weeks',
          '5 weeks',
          '10 weeks',
          '20 weeks'
        ],
        correct: 2,
        explanation: 'The passage says "The median wait for an MRI is 10 weeks."'
      },
      {
        id: 5,
        question: 'Which principle is NOT mentioned in the Canada Health Act?',
        options: [
          'Universality',
          'Profitability',
          'Portability',
          'Accessibility'
        ],
        correct: 1,
        explanation: 'The five principles are universality, accessibility, comprehensiveness, portability, and public administration. Profitability is not mentioned.'
      },
      {
        id: 6,
        question: 'What solutions are provinces implementing for wait times?',
        options: [
          'Closing emergency rooms',
          'Reducing the number of doctors',
          'More medical school seats and virtual care',
          'Charging fees to reduce demand'
        ],
        correct: 2,
        explanation: 'The passage mentions "more medical school seats, internationally trained doctor fast-tracking, and virtual care options."'
      }
    ]
  },

  // ============================================
  // PART 4: Reading for Viewpoints (additional)
  // ============================================
  {
    id: 'viewpoints-2',
    part: 4,
    partName: 'Reading for Viewpoints',
    title: 'Is University Still Worth It?',
    context: 'Three Canadians share their perspectives on the value of a university degree.',
    content: `**Amir Hassan, University Professor**

I hear this question constantly, and my answer is unequivocal: yes, university is still worth it. The data is clear. University graduates earn, on average, $1.3 million more over their lifetime than those with only a high school diploma. They also experience lower unemployment rates—even during recessions.

But reducing the value of university to earnings misses the point. University teaches critical thinking, research skills, and the ability to analyze complex problems. These skills are increasingly valuable in a world drowning in misinformation. A well-educated population is essential for democracy itself.

I acknowledge that tuition has risen significantly—average undergraduate tuition in Canada is now about $7,000 per year. But most provinces offer grants and loans that make it accessible. The real barrier isn't cost; it's the perception that trades are a faster path to money. They might be initially, but over a 40-year career, the degree pays off.

**Sarah Blackwood, Electrician and College Instructor**

With all due respect to Professor Hassan, I think the "university for everyone" mentality is outdated and frankly harmful. I've seen too many young people rack up $40,000 in debt for degrees that don't lead to jobs—English lit, sociology, general arts.

I became a licensed electrician at 22 with zero debt. My apprenticeship paid me while I learned. By the time my university-bound friends graduated, I already had four years of experience and $60,000 in savings. Today, I earn over $100,000 annually, and I can't find enough apprentices because everyone thinks trades are beneath them.

Canada is facing a massive skilled trades shortage. Over 700,000 tradespeople will retire in the next decade. These are well-paying, secure careers that can't be outsourced or automated. Not everyone needs a four-year degree to have a fulfilling, prosperous life.

**Diana Okafor, Career Counsellor**

Both Amir and Sarah make valid points, but they're presenting a false choice. The answer isn't university OR trades—it depends entirely on the individual.

I counsel high school students every day, and here's what I tell them: understand yourself first. What are your strengths? What kind of work energizes you? Some students thrive in academic environments and should absolutely pursue university. Others are hands-on learners who would be miserable in a lecture hall.

What concerns me is the social pressure. Too many families see trades as "Plan B"—something you do if you're not smart enough for university. This stigma hurts everyone. It pushes academic students into trades they don't enjoy, and it discourages natural tradespeople from pursuing their calling.

I advocate for better career education starting in middle school. Students should have exposure to both paths—co-op placements, trade demonstrations, university visits—so they can make informed decisions rather than defaulting to one option.`,
    questions: [
      {
        id: 1,
        question: 'What is Professor Hassan\'s strongest argument for university?',
        options: [
          'University is affordable for everyone',
          'Graduates earn $1.3 million more over a lifetime',
          'All jobs require a degree',
          'Trades are not real careers'
        ],
        correct: 1,
        explanation: 'Hassan\'s key data point is that "University graduates earn, on average, $1.3 million more over their lifetime."'
      },
      {
        id: 2,
        question: 'How did Sarah Blackwood finance her education?',
        options: [
          'She took out student loans',
          'Her parents paid for it',
          'She received a scholarship',
          'Her apprenticeship paid her while she learned'
        ],
        correct: 3,
        explanation: 'Blackwood says "My apprenticeship paid me while I learned" and she graduated "with zero debt."'
      },
      {
        id: 3,
        question: 'What is Diana Okafor\'s main criticism of the current system?',
        options: [
          'University is too expensive',
          'There are too many tradespeople',
          'Students face social pressure and lack career education',
          'Career counsellors don\'t do enough'
        ],
        correct: 2,
        explanation: 'Okafor is concerned about "social pressure" and "stigma" around trades, and advocates for "better career education starting in middle school."'
      },
      {
        id: 4,
        question: 'According to Sarah, how many tradespeople will retire in the next decade?',
        options: [
          '100,000',
          '300,000',
          '500,000',
          '700,000'
        ],
        correct: 3,
        explanation: 'Blackwood says "Over 700,000 tradespeople will retire in the next decade."'
      },
      {
        id: 5,
        question: 'Which speakers would agree that trades are valuable careers?',
        options: [
          'Only Sarah Blackwood',
          'Sarah and Diana',
          'Amir and Diana',
          'All three speakers'
        ],
        correct: 1,
        explanation: 'Sarah strongly advocates for trades. Diana says both paths are valid and criticizes stigma against trades. Amir focuses on university\'s value and suggests trades are only initially faster for money.'
      },
      {
        id: 6,
        question: 'What does Amir say is the real barrier to university?',
        options: [
          'High tuition costs',
          'Lack of available programs',
          'The perception that trades are faster to money',
          'Too few university spaces'
        ],
        correct: 2,
        explanation: 'Hassan says "The real barrier isn\'t cost; it\'s the perception that trades are a faster path to money."'
      },
      {
        id: 7,
        question: 'What solution does Diana propose?',
        options: [
          'Make university free for everyone',
          'Require all students to learn a trade',
          'Better career education with exposure to both paths',
          'Eliminate student loans'
        ],
        correct: 2,
        explanation: 'Okafor advocates for "better career education starting in middle school" with "exposure to both paths—co-op placements, trade demonstrations, university visits."'
      }
    ]
  },
  {
    id: 'viewpoints-3',
    part: 4,
    partName: 'Reading for Viewpoints',
    title: 'Should Canada Invest More in Public Transit?',
    context: 'Three residents of a mid-sized Canadian city share their views on public transit funding.',
    content: `**Kevin Liu, City Councillor**

Absolutely. Investing in public transit is one of the smartest things a city can do. Every dollar spent on transit generates approximately $4 in economic returns through reduced congestion, lower pollution, increased property values near transit lines, and improved access to employment.

Our city is growing rapidly—we've added 30,000 residents in the last five years. But our transit system was designed for a population half our current size. Buses are overcrowded during rush hour, routes don't reach new subdivisions, and evening service is so infrequent that shift workers simply can't rely on it.

I'm proposing a dedicated transit levy—a small property tax increase that would fund a light rail line and expanded bus service. Yes, it costs money upfront. But the alternative—more highway lanes—costs even more and just encourages more driving.

**Patricia Samson, Small Business Owner**

I understand Kevin's passion, but I have to push back. As a small business owner, I already pay substantial property taxes. Another levy would be the last straw for many businesses struggling with rising costs.

The real problem isn't funding—it's efficiency. Our transit agency wastes money on routes that carry five passengers per trip while ignoring busy corridors. Before asking taxpayers for more money, they need to optimize what they have. Consolidate underperforming routes, introduce demand-responsive transit for low-density areas, and partner with ride-sharing companies.

I also question the light rail proposal. For a city our size, bus rapid transit (BRT) achieves 80% of the benefit at 20% of the cost. We don't need to copy Toronto or Vancouver. Let's find solutions that fit our scale and budget.

**Robert Naysmith, Retired Transit Planner**

Having spent 35 years in transit planning, I can tell you both Kevin and Patricia are partially right, and partially wrong.

Kevin is correct that investment is desperately needed. Canada's transit infrastructure deficit is estimated at $18 billion nationally. However, simply spending more money doesn't guarantee better service. I've seen billions wasted on poorly planned projects—the Scarborough subway extension being a prime example.

Patricia's efficiency argument has merit, but there's a flaw. You can't optimize your way to a fundamentally better system. At some point, you need capital investment. Her BRT suggestion, however, is excellent for a city of this size.

What's missing from both arguments is regional coordination. Transit doesn't stop at city boundaries. Workers commute from surrounding towns, but there's no integrated fare system, no coordinated schedules. Until we solve that—through a regional transit authority—we'll keep building disconnected networks that don't serve people's actual travel patterns.`,
    questions: [
      {
        id: 1,
        question: 'What economic return does Kevin cite for transit investment?',
        options: [
          '$2 return per $1 spent',
          '$4 return per $1 spent',
          '$6 return per $1 spent',
          '$10 return per $1 spent'
        ],
        correct: 1,
        explanation: 'Kevin says "Every dollar spent on transit generates approximately $4 in economic returns."'
      },
      {
        id: 2,
        question: 'What is Patricia\'s main concern about more transit funding?',
        options: [
          'Public transit doesn\'t work in Canadian cities',
          'The transit agency needs to improve efficiency first',
          'Cars are more convenient than transit',
          'Light rail is dangerous'
        ],
        correct: 1,
        explanation: 'Patricia says "The real problem isn\'t funding—it\'s efficiency" and the agency should "optimize what they have" before asking for more money.'
      },
      {
        id: 3,
        question: 'What transit solution does Patricia prefer over light rail?',
        options: [
          'More highways',
          'Ride-sharing only',
          'Bus rapid transit (BRT)',
          'No new investment'
        ],
        correct: 2,
        explanation: 'Patricia says "bus rapid transit (BRT) achieves 80% of the benefit at 20% of the cost."'
      },
      {
        id: 4,
        question: 'What does Robert say is missing from both arguments?',
        options: [
          'Environmental considerations',
          'Regional coordination across municipal boundaries',
          'Public consultation',
          'Federal funding applications'
        ],
        correct: 1,
        explanation: 'Robert says "What\'s missing from both arguments is regional coordination. Transit doesn\'t stop at city boundaries."'
      },
      {
        id: 5,
        question: 'Who has the most professional expertise in transit?',
        options: [
          'Kevin Liu',
          'Patricia Samson',
          'Robert Naysmith',
          'They all have equal expertise'
        ],
        correct: 2,
        explanation: 'Robert says "Having spent 35 years in transit planning" — he is a retired transit planner with direct professional experience.'
      },
      {
        id: 6,
        question: 'Which speakers agree that the current transit system is inadequate?',
        options: [
          'Only Kevin',
          'Kevin and Robert',
          'Kevin and Patricia',
          'All three speakers'
        ],
        correct: 3,
        explanation: 'All three agree the system needs improvement — Kevin wants investment, Patricia wants efficiency, Robert wants both plus coordination.'
      },
      {
        id: 7,
        question: 'What negative example does Robert mention?',
        options: [
          'The Ottawa LRT breakdown',
          'The Scarborough subway extension',
          'The Vancouver SkyTrain delays',
          'The Montreal Metro closures'
        ],
        correct: 1,
        explanation: 'Robert mentions "the Scarborough subway extension being a prime example" of a poorly planned project.'
      }
    ]
  },

  // ============================================
  // PART 1: Reading Correspondence (additional)
  // ============================================
  {
    id: 'correspondence-3',
    part: 1,
    partName: 'Reading Correspondence',
    title: 'Tenant Notice from Property Management',
    context: 'Read this letter from a property management company to building residents.',
    content: `Greenfield Property Management
1200 Oak Street, Unit 4
Calgary, AB T2P 3N7

February 3, 2026

Dear Residents of Parkview Towers,

We are writing to inform you of several important updates regarding your building.

**Water Shut-Off — February 15**
Due to essential plumbing repairs on the 4th and 5th floors, water service will be temporarily suspended on Saturday, February 15th, from 8:00 AM to 4:00 PM. All floors will be affected. We recommend storing water in advance for drinking and essential use. Washroom facilities will be available in the lobby during this time.

**New Recycling Program**
Starting March 1st, Parkview Towers will participate in the City of Calgary's enhanced recycling program. You will receive a blue bin guide in your mailbox explaining what can and cannot be recycled. Key changes include:
- Soft plastics (bags, wraps) can now be recycled
- Styrofoam is no longer accepted in blue bins
- A textile donation bin will be placed beside the garbage room on P1

Residents who consistently contaminate recycling bins may receive a warning notice. Please help us keep our recycling stream clean.

**Parking Stall Reassignment**
Due to several move-outs, parking stalls 22, 35, 41, and 48 are now available. Monthly cost is $75 (underground heated) or $40 (outdoor surface lot). Please contact our office to apply. Priority will be given to residents who have been on the waiting list.

**Rent Increase Notice**
As per Alberta's Residential Tenancies Act, we are providing 90 days' notice that monthly rents will increase by 3% effective May 1, 2026. This increase reflects rising maintenance costs, property taxes, and insurance premiums. Your new monthly amount will be included in your March statement.

If you have any questions, please contact our office at (403) 555-0199 or email info@greenfieldpm.ca. Office hours are Monday to Friday, 9 AM – 5 PM.

Sincerely,
James Whitfield
Property Manager
Greenfield Property Management`,
    questions: [
      {
        id: 1,
        question: 'Why will the water be shut off?',
        options: [
          'For a building-wide inspection',
          'Due to unpaid water bills',
          'For plumbing repairs on the 4th and 5th floors',
          'To install a new water system'
        ],
        correct: 2,
        explanation: 'The letter says "Due to essential plumbing repairs on the 4th and 5th floors."'
      },
      {
        id: 2,
        question: 'Which of the following is a change in the recycling program?',
        options: [
          'All plastics are now banned from blue bins',
          'Styrofoam can now be recycled',
          'Soft plastics can now be recycled',
          'Recycling is now optional'
        ],
        correct: 2,
        explanation: 'The letter states "Soft plastics (bags, wraps) can now be recycled" as a key change.'
      },
      {
        id: 3,
        question: 'How much does heated underground parking cost per month?',
        options: [
          '$40',
          '$50',
          '$75',
          '$100'
        ],
        correct: 2,
        explanation: 'The letter says parking costs "$75 (underground heated)."'
      },
      {
        id: 4,
        question: 'When will the rent increase take effect?',
        options: [
          'March 1, 2026',
          'April 1, 2026',
          'May 1, 2026',
          'June 1, 2026'
        ],
        correct: 2,
        explanation: 'The letter states "rents will increase by 3% effective May 1, 2026."'
      },
      {
        id: 5,
        question: 'What should residents do during the water shut-off?',
        options: [
          'Leave the building for the day',
          'Use the lobby washrooms and store water in advance',
          'Call the emergency plumber',
          'Boil water before drinking'
        ],
        correct: 1,
        explanation: 'The letter recommends "storing water in advance" and says "Washroom facilities will be available in the lobby."'
      },
      {
        id: 6,
        question: 'Who gets priority for the available parking stalls?',
        options: [
          'Residents who have lived there the longest',
          'Residents who pay the most rent',
          'Residents on the waiting list',
          'Residents on the 4th and 5th floors'
        ],
        correct: 2,
        explanation: 'The letter says "Priority will be given to residents who have been on the waiting list."'
      }
    ]
  },
  {
    id: 'correspondence-4',
    part: 1,
    partName: 'Reading Correspondence',
    title: 'Email About a Product Return',
    context: 'Read this email exchange between a customer and a company\'s customer service team.',
    content: `From: lin.zhang@email.ca
To: support@northernoutdoors.ca
Subject: Return Request — Order #NO-28491
Date: January 20, 2026

Hello,

I purchased a Trailblazer 60L Backpack (Order #NO-28491) from your website on January 8th. Unfortunately, I need to return it for the following reasons:

1. The hip belt strap is significantly shorter than advertised. Your website lists it as adjustable from 28" to 48", but it only extends to about 40".
2. One of the compression straps was already frayed when I opened the package.

I have not used the backpack outdoors—I only tried it on at home. I would prefer an exchange for the same model, but if the sizing issue is a design problem rather than a defect, I'd like a full refund instead.

Please let me know how to proceed.

Best regards,
Lin Zhang

---

From: support@northernoutdoors.ca
To: lin.zhang@email.ca
Subject: RE: Return Request — Order #NO-28491
Date: January 22, 2026

Dear Lin,

Thank you for contacting Northern Outdoors. We sincerely apologize for the issues with your Trailblazer 60L Backpack.

After reviewing your concerns, here's what we can offer:

**Option A: Exchange**
We'll send a replacement backpack immediately and include a prepaid return label for the defective one. Our warehouse team will inspect the replacement before shipping to ensure proper strap length and quality. Please allow 5–7 business days for delivery.

**Option B: Full Refund**
We'll issue a complete refund of $189.99 plus the original shipping charge ($12.95) once we receive the returned item. Refunds are processed within 3–5 business days after inspection.

Regarding the hip belt issue: we've forwarded your feedback to our product team. It appears some units from a recent batch may have a manufacturing inconsistency, and your report helps us address it.

For either option, simply reply to this email with your choice. We'll send a prepaid Canada Post return label to your email within 24 hours.

Again, we apologize for the inconvenience. As a gesture of goodwill, we'd like to offer you a 20% discount code (VALUED20) for your next purchase.

Warm regards,
Chloe Martin
Customer Experience Team
Northern Outdoors`,
    questions: [
      {
        id: 1,
        question: 'Why is Lin returning the backpack?',
        options: [
          'She doesn\'t like the colour',
          'It was damaged during a hiking trip',
          'The hip belt is too short and a strap is frayed',
          'She found a cheaper price elsewhere'
        ],
        correct: 2,
        explanation: 'Lin mentions two issues: the hip belt "only extends to about 40\'" (shorter than advertised) and "one of the compression straps was already frayed."'
      },
      {
        id: 2,
        question: 'What does the company suspect about the hip belt issue?',
        options: [
          'Lin measured incorrectly',
          'The website description is wrong',
          'Some units from a recent batch have a manufacturing inconsistency',
          'The belt stretches with use'
        ],
        correct: 2,
        explanation: 'Chloe says "some units from a recent batch may have a manufacturing inconsistency."'
      },
      {
        id: 3,
        question: 'How much would the total refund be?',
        options: [
          '$189.99',
          '$196.94',
          '$202.94',
          '$209.99'
        ],
        correct: 2,
        explanation: 'The refund would be $189.99 + $12.95 shipping = $202.94.'
      },
      {
        id: 4,
        question: 'How will Lin return the backpack?',
        options: [
          'She must pay for shipping herself',
          'She must drop it off at a store',
          'The company will send a prepaid return label',
          'A courier will pick it up from her home'
        ],
        correct: 2,
        explanation: 'Chloe says "We\'ll send a prepaid Canada Post return label to your email within 24 hours."'
      },
      {
        id: 5,
        question: 'What extra offer does the company make to Lin?',
        options: [
          'Free overnight shipping on the exchange',
          'A free accessory with the replacement',
          'A 20% discount code for a future purchase',
          'A free upgrade to a larger backpack'
        ],
        correct: 2,
        explanation: 'The company offers "a 20% discount code (VALUED20) for your next purchase."'
      },
      {
        id: 6,
        question: 'What is the tone of the company\'s response?',
        options: [
          'Defensive and dismissive',
          'Apologetic and accommodating',
          'Formal and cold',
          'Surprised and confused'
        ],
        correct: 1,
        explanation: 'Chloe apologizes twice, offers two solutions, and provides a discount code — the tone is clearly apologetic and accommodating.'
      }
    ]
  },
  {
    id: 'correspondence-5',
    part: 1,
    partName: 'Reading Correspondence',
    title: 'Workplace Policy Update',
    context: 'Read this email from the HR department to all employees.',
    content: `From: hr@westcoastmedia.ca
To: all-staff@westcoastmedia.ca
Subject: Updated Hybrid Work Policy — Effective March 1
Date: February 10, 2026

Dear Team,

Following our company-wide survey in December (thank you to the 87% who responded!), we're pleased to announce our updated hybrid work policy, effective March 1, 2026.

**What's Changing:**

1. **Core In-Office Days:** Tuesday and Thursday are now mandatory in-office days for all departments. This replaces the previous Monday/Wednesday/Friday schedule based on your feedback that back-to-back office days work better for collaboration.

2. **Flexible Fridays:** Fridays are now fully remote for everyone. Previously, only Engineering and Design had this option.

3. **Desk Booking System:** Since we're reducing our office footprint by 30%, we're moving to a hot-desking model. Use the BookMyDesk app (download instructions below) to reserve your workspace. Each floor will have quiet zones, collaboration zones, and phone booth rooms.

4. **Home Office Stipend:** The annual home office allowance increases from $500 to $750. Submit receipts through Expensify by December 15th each year. Eligible purchases include desk, chair, monitor, keyboard, mouse, and internet costs.

**What's NOT Changing:**
- Client-facing roles (Sales, Account Management) maintain their existing schedules
- Team leads may still require additional in-office days for project sprints
- All-hands meetings remain the first Monday of each month (in-person required)

**Important Reminders:**
- VPN must be active when working remotely
- Response time expectation: within 1 hour during business hours, regardless of location
- If you need to work from a different province for more than 30 days, tax implications apply — contact HR first

We believe this updated policy balances flexibility with the in-person collaboration our teams value. Questions? Join our Q&A session on February 20th at 2 PM (Teams link below).

Best,
Nadia Petrova
VP, People & Culture`,
    questions: [
      {
        id: 1,
        question: 'Why were the in-office days changed to Tuesday and Thursday?',
        options: [
          'To save on electricity costs',
          'Because managers requested it',
          'Employee feedback said back-to-back office days work better',
          'To align with client schedules'
        ],
        correct: 2,
        explanation: 'The email says this change is "based on your feedback that back-to-back office days work better for collaboration."'
      },
      {
        id: 2,
        question: 'What is new about Fridays?',
        options: [
          'Everyone must work from the office',
          'Everyone can now work remotely on Fridays',
          'Fridays are now a day off',
          'Only Engineering works remotely on Fridays'
        ],
        correct: 1,
        explanation: '"Fridays are now fully remote for everyone. Previously, only Engineering and Design had this option."'
      },
      {
        id: 3,
        question: 'Why is the company moving to hot-desking?',
        options: [
          'To encourage more collaboration',
          'Because they are reducing office space by 30%',
          'To save on furniture costs',
          'Because employees requested it in the survey'
        ],
        correct: 1,
        explanation: 'The email says "Since we\'re reducing our office footprint by 30%, we\'re moving to a hot-desking model."'
      },
      {
        id: 4,
        question: 'How much is the new annual home office allowance?',
        options: [
          '$500',
          '$650',
          '$750',
          '$1,000'
        ],
        correct: 2,
        explanation: '"The annual home office allowance increases from $500 to $750."'
      },
      {
        id: 5,
        question: 'When should an employee contact HR?',
        options: [
          'When they want to work from a café',
          'When they work from another province for more than 30 days',
          'When they need to change their office days',
          'When their VPN doesn\'t work'
        ],
        correct: 1,
        explanation: 'The email says "If you need to work from a different province for more than 30 days, tax implications apply — contact HR first."'
      },
      {
        id: 6,
        question: 'What response time is expected when working remotely?',
        options: [
          'Within 15 minutes',
          'Within 30 minutes',
          'Within 1 hour',
          'By end of business day'
        ],
        correct: 2,
        explanation: '"Response time expectation: within 1 hour during business hours, regardless of location."'
      }
    ]
  }
];

export const getPassagesByPart = (part: 1 | 2 | 3 | 4): ReadingPassage[] => {
  return readingPassages.filter(p => p.part === part);
};

export const getPassageById = (id: string): ReadingPassage | undefined => {
  return readingPassages.find(p => p.id === id);
};
