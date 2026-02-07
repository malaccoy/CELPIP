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
  }
];

export const getPassagesByPart = (part: 1 | 2 | 3 | 4): ReadingPassage[] => {
  return readingPassages.filter(p => p.part === part);
};

export const getPassageById = (id: string): ReadingPassage | undefined => {
  return readingPassages.find(p => p.id === id);
};
