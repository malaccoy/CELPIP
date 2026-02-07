// Sentence Starters Content Data
// Organized by communicative function for CELPIP Writing

export interface StarterPhrase {
  phrase: string;
  example: string;
  tip: string;
  tags: string[];
}

export interface StarterCategory {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  color: string;
  phrases: StarterPhrase[];
  practice: PracticeQuestion[];
}

export interface PracticeQuestion {
  type: 'fill-blank' | 'choose-best';
  question: string;
  options?: string[];
  answer: string;
  explanation?: string;
}

export const STARTER_CATEGORIES: StarterCategory[] = [
  {
    id: 'starting-email',
    title: 'Starting a Formal Email',
    subtitle: 'Opening lines that set the right tone',
    description: 'Learn how to open your email with clarity and purpose. A strong opening tells the reader exactly why you are writing.',
    icon: '✉️',
    color: '#6366f1',
    phrases: [
      {
        phrase: 'I am writing to inquire about...',
        example: 'I am writing to inquire about the availability of parking spaces in the building.',
        tip: 'Use when asking for information or clarification.',
        tags: ['Formal', 'Request', 'Inquiry']
      },
      {
        phrase: 'I am writing to inform you that...',
        example: 'I am writing to inform you that I will be vacating my apartment at the end of this month.',
        tip: 'Use when delivering news or updates.',
        tags: ['Formal', 'Notification', 'Neutral']
      },
      {
        phrase: 'I would like to bring to your attention...',
        example: 'I would like to bring to your attention a recurring noise issue in the building.',
        tip: 'Use when highlighting a problem politely.',
        tags: ['Formal', 'Complaint', 'Polite']
      },
      {
        phrase: 'I am writing to express my concern regarding...',
        example: 'I am writing to express my concern regarding the frequent delays in garbage collection.',
        tip: 'Use when showing dissatisfaction professionally.',
        tags: ['Formal', 'Complaint', 'Concern']
      },
      {
        phrase: 'I am writing in response to...',
        example: 'I am writing in response to your job posting for the Customer Service Representative position.',
        tip: 'Use when replying to something you saw or received.',
        tags: ['Formal', 'Reply', 'Application']
      },
      {
        phrase: 'I am contacting you regarding...',
        example: 'I am contacting you regarding the maintenance request I submitted last week.',
        tip: 'General purpose opener - works for many situations.',
        tags: ['Formal', 'Neutral', 'Follow-up']
      },
      {
        phrase: 'I hope this email finds you well.',
        example: 'I hope this email finds you well. I wanted to follow up on our previous discussion about the project timeline.',
        tip: 'Friendly opener for semi-formal emails.',
        tags: ['Semi-formal', 'Friendly', 'Warm']
      },
      {
        phrase: 'I am writing to request...',
        example: 'I am writing to request a two-week extension on my assignment due to unforeseen circumstances.',
        tip: 'Direct way to ask for something specific.',
        tags: ['Formal', 'Request', 'Direct']
      }
    ],
    practice: [
      {
        type: 'fill-blank',
        question: 'I am writing to ___ about the job opening.',
        options: ['inquire', 'say', 'talk', 'speak'],
        answer: 'inquire',
        explanation: '"Inquire" is the formal way to ask for information.'
      },
      {
        type: 'choose-best',
        question: 'You want to report a noise problem to your building manager. Which opening is best?',
        options: [
          'Hey, there is too much noise here.',
          'I would like to bring to your attention a noise issue in the building.',
          'The noise is really bad and you need to fix it.',
          'I am writing to say the noise is annoying.'
        ],
        answer: 'I would like to bring to your attention a noise issue in the building.',
        explanation: 'This is polite, formal, and clearly states the purpose.'
      },
      {
        type: 'fill-blank',
        question: 'I am writing to ___ you that my internet service has been unreliable.',
        options: ['inform', 'tell', 'say', 'speak'],
        answer: 'inform',
        explanation: '"Inform" is the formal choice for delivering information.'
      },
      {
        type: 'choose-best',
        question: 'You are applying for a job you saw advertised online. How should you start?',
        options: [
          'I saw your job and I want it.',
          'I am writing in response to your advertisement for the Sales Associate position.',
          'Give me the job please.',
          'I need a job and you have one.'
        ],
        answer: 'I am writing in response to your advertisement for the Sales Associate position.',
        explanation: 'Professional, specific, and shows you are responding to their posting.'
      },
      {
        type: 'fill-blank',
        question: 'I am ___ you regarding the maintenance request I submitted last week.',
        options: ['contacting', 'telling', 'saying to', 'speaking'],
        answer: 'contacting',
        explanation: '"I am contacting you regarding..." is a versatile formal opener.'
      }
    ]
  },
  {
    id: 'expressing-problems',
    title: 'Expressing a Problem',
    subtitle: 'Describe issues clearly and professionally',
    description: 'Learn how to explain problems without sounding aggressive. Professional language gets better results.',
    icon: '⚠️',
    color: '#f59e0b',
    phrases: [
      {
        phrase: 'I have been experiencing issues with...',
        example: 'I have been experiencing issues with my internet connection for the past two weeks.',
        tip: 'Use for ongoing problems that continue over time.',
        tags: ['Formal', 'Ongoing', 'Technical']
      },
      {
        phrase: 'Unfortunately, there has been a problem with...',
        example: 'Unfortunately, there has been a problem with the delivery of my furniture order.',
        tip: '"Unfortunately" softens the complaint and sounds professional.',
        tags: ['Formal', 'Complaint', 'Polite']
      },
      {
        phrase: 'I am facing difficulties regarding...',
        example: 'I am facing difficulties regarding access to the company parking lot.',
        tip: 'Formal way to express challenges you are encountering.',
        tags: ['Formal', 'Challenge', 'Professional']
      },
      {
        phrase: 'This has caused significant inconvenience...',
        example: 'This has caused significant inconvenience to all residents on the third floor.',
        tip: 'Use to emphasize the negative impact of a problem.',
        tags: ['Formal', 'Impact', 'Emphasis']
      },
      {
        phrase: 'The situation has not improved despite...',
        example: 'The situation has not improved despite multiple requests to the maintenance team.',
        tip: 'Use when a problem persists after previous attempts to fix it.',
        tags: ['Formal', 'Escalation', 'Follow-up']
      },
      {
        phrase: 'I regret to inform you that...',
        example: 'I regret to inform you that the equipment arrived in damaged condition.',
        tip: 'Formal way to deliver bad news or report issues.',
        tags: ['Formal', 'Notification', 'Bad news']
      },
      {
        phrase: 'There seems to be an issue with...',
        example: 'There seems to be an issue with the billing on my most recent statement.',
        tip: 'Softer way to point out a problem without directly blaming anyone.',
        tags: ['Semi-formal', 'Billing', 'Soft']
      },
      {
        phrase: 'I am disappointed to find that...',
        example: 'I am disappointed to find that the service quality has declined since last year.',
        tip: 'Expresses dissatisfaction professionally without being aggressive.',
        tags: ['Formal', 'Disappointment', 'Feedback']
      }
    ],
    practice: [
      {
        type: 'fill-blank',
        question: 'I have been ___ issues with the heating system in my apartment.',
        options: ['experiencing', 'having', 'making', 'doing'],
        answer: 'experiencing',
        explanation: '"Experiencing issues" is the most formal and natural collocation.'
      },
      {
        type: 'choose-best',
        question: 'You want to complain about a late delivery. Which is most professional?',
        options: [
          'My package is late and this is unacceptable!',
          'Unfortunately, there has been a delay with my delivery.',
          'Where is my package? It should be here by now.',
          'You guys are always late with deliveries.'
        ],
        answer: 'Unfortunately, there has been a delay with my delivery.',
        explanation: 'Professional tone while clearly stating the problem.'
      },
      {
        type: 'fill-blank',
        question: 'This has caused significant ___ to our daily operations.',
        options: ['inconvenience', 'problem', 'issue', 'trouble'],
        answer: 'inconvenience',
        explanation: '"Inconvenience" is the most formal choice for describing negative impact.'
      },
      {
        type: 'choose-best',
        question: 'Your order arrived broken. Which sentence is most appropriate?',
        options: [
          'You sent me broken stuff!',
          'I regret to inform you that the items arrived damaged.',
          'Everything is broken and I am angry.',
          'The package was bad.'
        ],
        answer: 'I regret to inform you that the items arrived damaged.',
        explanation: '"I regret to inform you" is the professional way to report problems.'
      },
      {
        type: 'fill-blank',
        question: 'The situation has not ___ despite several attempts to resolve it.',
        options: ['improved', 'changed', 'fixed', 'better'],
        answer: 'improved',
        explanation: '"Has not improved" is grammatically correct for describing persistent problems.'
      }
    ]
  },
  {
    id: 'polite-requests',
    title: 'Making Polite Requests',
    subtitle: 'Ask professionally and get better results',
    description: 'The way you ask determines the response you get. Polite requests are more likely to be approved.',
    icon: '🙏',
    color: '#10b981',
    phrases: [
      {
        phrase: 'I would appreciate it if you could...',
        example: 'I would appreciate it if you could send me the updated schedule by Friday.',
        tip: 'Very polite; shows gratitude before they even respond.',
        tags: ['Formal', 'Polite', 'Appreciative']
      },
      {
        phrase: 'Would it be possible to...',
        example: 'Would it be possible to reschedule our appointment to next Tuesday?',
        tip: 'Asks without assuming they will say yes.',
        tags: ['Formal', 'Question', 'Flexible']
      },
      {
        phrase: 'I would like to request...',
        example: 'I would like to request a replacement for the defective product.',
        tip: 'Direct but formal way to state what you need.',
        tags: ['Formal', 'Direct', 'Clear']
      },
      {
        phrase: 'Could you please...',
        example: 'Could you please provide me with more details about the refund process?',
        tip: 'Simple and universally polite.',
        tags: ['Semi-formal', 'Simple', 'Universal']
      },
      {
        phrase: 'I was wondering if you could...',
        example: 'I was wondering if you could extend the deadline by a few days.',
        tip: 'Very soft request; good for sensitive or difficult asks.',
        tags: ['Formal', 'Soft', 'Sensitive']
      },
      {
        phrase: 'I would be grateful if you could...',
        example: 'I would be grateful if you could review my application at your earliest convenience.',
        tip: 'Shows deep appreciation; very formal and respectful.',
        tags: ['Formal', 'Grateful', 'Respectful']
      },
      {
        phrase: 'Would you be able to...',
        example: 'Would you be able to provide a reference letter for my job application?',
        tip: 'Polite way to check if something is possible for them.',
        tags: ['Semi-formal', 'Question', 'Considerate']
      },
      {
        phrase: 'I kindly request that...',
        example: 'I kindly request that the noise levels be reduced after 10 PM.',
        tip: 'Formal request often used in official or written communications.',
        tags: ['Formal', 'Official', 'Written']
      }
    ],
    practice: [
      {
        type: 'fill-blank',
        question: 'I would ___ it if you could review my application.',
        options: ['appreciate', 'like', 'want', 'love'],
        answer: 'appreciate',
        explanation: '"I would appreciate it if..." is the standard formal request pattern.'
      },
      {
        type: 'choose-best',
        question: 'You need your manager to approve your vacation days. Which is best?',
        options: [
          'I need you to approve my vacation.',
          'Approve my vacation days please.',
          'I would like to request approval for my vacation days.',
          'Can you just approve my vacation?'
        ],
        answer: 'I would like to request approval for my vacation days.',
        explanation: 'Formal, respectful, and clearly states what you need.'
      },
      {
        type: 'fill-blank',
        question: 'Would it be ___ to receive a refund for the cancelled flight?',
        options: ['possible', 'okay', 'good', 'fine'],
        answer: 'possible',
        explanation: '"Would it be possible" is the standard polite question pattern.'
      },
      {
        type: 'choose-best',
        question: 'You want to ask your professor for extra time on an assignment. Which is most appropriate?',
        options: [
          'Give me more time.',
          'I need an extension.',
          'I was wondering if you could extend the deadline by a few days.',
          'The deadline is too soon.'
        ],
        answer: 'I was wondering if you could extend the deadline by a few days.',
        explanation: '"I was wondering if..." is a soft, respectful way to make difficult requests.'
      },
      {
        type: 'fill-blank',
        question: 'I would be ___ if you could send me the documents by tomorrow.',
        options: ['grateful', 'happy', 'nice', 'good'],
        answer: 'grateful',
        explanation: '"I would be grateful if..." expresses sincere appreciation.'
      }
    ]
  },
  {
    id: 'giving-reasons',
    title: 'Giving Reasons',
    subtitle: 'Justify your points with clear logic',
    description: 'Strong reasons make your message convincing. Learn to explain WHY in a professional way.',
    icon: '💡',
    color: '#8b5cf6',
    phrases: [
      {
        phrase: 'The main reason is that...',
        example: 'The main reason is that the current schedule conflicts with my other commitments.',
        tip: 'Use to introduce your primary or most important argument.',
        tags: ['Formal', 'Primary', 'Clear']
      },
      {
        phrase: 'This is because...',
        example: 'This is because the new policy affects all employees in the department.',
        tip: 'Simple and direct way to explain something.',
        tags: ['Neutral', 'Simple', 'Direct']
      },
      {
        phrase: 'Due to the fact that...',
        example: 'Due to the fact that the flight was cancelled, I would like to request a full refund.',
        tip: 'Formal alternative to "because" - good for official writing.',
        tags: ['Formal', 'Official', 'Written']
      },
      {
        phrase: 'This is primarily due to...',
        example: 'This is primarily due to a lack of proper communication between departments.',
        tip: 'Emphasizes the main cause of a situation.',
        tags: ['Formal', 'Analysis', 'Emphasis']
      },
      {
        phrase: 'One key factor is...',
        example: 'One key factor is the limited availability of parking spaces in the area.',
        tip: 'Good for listing multiple reasons or contributing factors.',
        tags: ['Formal', 'Analysis', 'Multiple']
      },
      {
        phrase: 'The reason for this is...',
        example: 'The reason for this is the high demand during the holiday season.',
        tip: 'Clear way to explain why something happened.',
        tags: ['Neutral', 'Explanation', 'Clear']
      },
      {
        phrase: 'This can be attributed to...',
        example: 'This can be attributed to the recent changes in company management.',
        tip: 'Formal way to identify the cause of something.',
        tags: ['Formal', 'Analysis', 'Cause']
      },
      {
        phrase: 'As a result of...',
        example: 'As a result of the construction work, there has been increased noise levels in the building.',
        tip: 'Shows cause and effect relationship clearly.',
        tags: ['Formal', 'Consequence', 'Effect']
      }
    ],
    practice: [
      {
        type: 'fill-blank',
        question: 'The main ___ is that we need more time to complete the project.',
        options: ['reason', 'cause', 'thing', 'point'],
        answer: 'reason',
        explanation: '"The main reason is that..." is the standard pattern.'
      },
      {
        type: 'choose-best',
        question: 'You are explaining why you missed a deadline. Which sounds most professional?',
        options: [
          'I was busy with other stuff.',
          'This is primarily due to unexpected technical issues with my computer.',
          'Because my computer broke.',
          'The reason is I had problems.'
        ],
        answer: 'This is primarily due to unexpected technical issues with my computer.',
        explanation: 'Professional, specific, and explains the situation clearly.'
      },
      {
        type: 'fill-blank',
        question: 'Due to the ___ that the office will be closed, the meeting is postponed.',
        options: ['fact', 'reason', 'cause', 'situation'],
        answer: 'fact',
        explanation: '"Due to the fact that" is a formal fixed expression.'
      },
      {
        type: 'choose-best',
        question: 'You want to explain why sales have decreased. Which is most professional?',
        options: [
          'Sales are bad because of stuff.',
          'This can be attributed to increased competition in the market.',
          'We are not selling enough.',
          'The reason is people are not buying.'
        ],
        answer: 'This can be attributed to increased competition in the market.',
        explanation: '"Can be attributed to" is a formal way to identify causes.'
      },
      {
        type: 'fill-blank',
        question: 'As a ___ of the delay, we will need to adjust our timeline.',
        options: ['result', 'reason', 'cause', 'effect'],
        answer: 'result',
        explanation: '"As a result of" is the correct expression for showing consequence.'
      }
    ]
  },
  {
    id: 'suggesting-solutions',
    title: 'Suggesting Solutions',
    subtitle: 'Propose ideas professionally',
    description: 'Good complaints include solutions. Learn to offer recommendations that get implemented.',
    icon: '🎯',
    color: '#ec4899',
    phrases: [
      {
        phrase: 'One possible solution would be to...',
        example: 'One possible solution would be to install soundproof panels in the meeting rooms.',
        tip: 'Presents your idea as one option without being pushy.',
        tags: ['Formal', 'Suggestion', 'Flexible']
      },
      {
        phrase: 'I would suggest that...',
        example: 'I would suggest that we hold weekly team meetings to improve communication.',
        tip: 'Polite way to offer advice or recommendations.',
        tags: ['Formal', 'Advice', 'Polite']
      },
      {
        phrase: 'It might be helpful to...',
        example: 'It might be helpful to create a FAQ section on the company website.',
        tip: 'Soft suggestion that shows you are being considerate.',
        tags: ['Semi-formal', 'Soft', 'Helpful']
      },
      {
        phrase: 'Perhaps you could consider...',
        example: 'Perhaps you could consider offering a discount to affected customers.',
        tip: 'Very polite; excellent for suggestions to people in authority.',
        tags: ['Formal', 'Polite', 'Respectful']
      },
      {
        phrase: 'I recommend that...',
        example: 'I recommend that the policy be reviewed before full implementation.',
        tip: 'More direct; use when you have expertise or authority.',
        tags: ['Formal', 'Direct', 'Expert']
      },
      {
        phrase: 'A good approach would be to...',
        example: 'A good approach would be to conduct a customer survey before making changes.',
        tip: 'Presents your idea as a well-thought-out option.',
        tags: ['Formal', 'Strategic', 'Professional']
      },
      {
        phrase: 'It would be beneficial to...',
        example: 'It would be beneficial to extend the store hours during the holiday season.',
        tip: 'Emphasizes the positive outcome of your suggestion.',
        tags: ['Formal', 'Positive', 'Benefit']
      },
      {
        phrase: 'One way to address this issue would be to...',
        example: 'One way to address this issue would be to hire additional customer service staff.',
        tip: 'Directly connects your suggestion to solving the problem.',
        tags: ['Formal', 'Solution', 'Targeted']
      }
    ],
    practice: [
      {
        type: 'fill-blank',
        question: 'One possible ___ would be to extend the deadline by one week.',
        options: ['solution', 'answer', 'way', 'idea'],
        answer: 'solution',
        explanation: '"One possible solution would be to..." is the standard pattern.'
      },
      {
        type: 'choose-best',
        question: 'You want to suggest a new process to your team. Which is best?',
        options: [
          'We have to do it this way now.',
          'I would suggest that we try a different approach.',
          'Just change the process.',
          'You should do what I say.'
        ],
        answer: 'I would suggest that we try a different approach.',
        explanation: 'Collaborative, polite, and professionally phrased.'
      },
      {
        type: 'fill-blank',
        question: 'Perhaps you could ___ offering flexible payment options to customers.',
        options: ['consider', 'think', 'try', 'do'],
        answer: 'consider',
        explanation: '"Perhaps you could consider" is a polite suggestion pattern.'
      },
      {
        type: 'choose-best',
        question: 'You want to recommend that your company improve customer service. Which is most professional?',
        options: [
          'Customer service is bad and needs fixing.',
          'It would be beneficial to invest in customer service training.',
          'You should make customer service better.',
          'Customers are complaining a lot.'
        ],
        answer: 'It would be beneficial to invest in customer service training.',
        explanation: '"It would be beneficial to..." presents your idea positively.'
      },
      {
        type: 'fill-blank',
        question: 'One way to ___ this issue would be to implement a new booking system.',
        options: ['address', 'fix', 'solve', 'do'],
        answer: 'address',
        explanation: '"One way to address this issue" formally links solutions to problems.'
      }
    ]
  },
  {
    id: 'closing-email',
    title: 'Closing an Email',
    subtitle: 'End strong and leave a good impression',
    description: 'Your closing is the last thing they read. Make it professional and action-oriented.',
    icon: '✅',
    color: '#06b6d4',
    phrases: [
      {
        phrase: 'Please let me know if you have any questions.',
        example: 'Please let me know if you have any questions regarding this matter.',
        tip: 'Standard professional closing; opens the door for response.',
        tags: ['Formal', 'Open', 'Standard']
      },
      {
        phrase: 'I look forward to hearing from you.',
        example: 'I look forward to hearing from you at your earliest convenience.',
        tip: 'Shows you expect a reply; encourages response.',
        tags: ['Formal', 'Expectant', 'Positive']
      },
      {
        phrase: 'Thank you for your attention to this matter.',
        example: 'Thank you for your attention to this matter.',
        tip: 'Polite and appreciative; especially good for complaints.',
        tags: ['Formal', 'Grateful', 'Complaint']
      },
      {
        phrase: 'I would appreciate a prompt response.',
        example: 'I would appreciate a prompt response regarding my refund request.',
        tip: 'Politely requests a quick reply without being demanding.',
        tags: ['Formal', 'Urgent', 'Polite']
      },
      {
        phrase: 'Please do not hesitate to contact me if...',
        example: 'Please do not hesitate to contact me if you need any additional information.',
        tip: 'Professional way to show availability and helpfulness.',
        tags: ['Formal', 'Helpful', 'Available']
      },
      {
        phrase: 'Thank you for your time and consideration.',
        example: 'Thank you for your time and consideration.',
        tip: 'Warm closing for requests, applications, or proposals.',
        tags: ['Formal', 'Grateful', 'Application']
      },
      {
        phrase: 'I appreciate your assistance in this matter.',
        example: 'I appreciate your assistance in this matter and look forward to a resolution.',
        tip: 'Shows gratitude while expecting action to be taken.',
        tags: ['Formal', 'Grateful', 'Action']
      },
      {
        phrase: 'I trust this matter will be resolved promptly.',
        example: 'I trust this matter will be resolved promptly.',
        tip: 'Confident closing for complaints; shows clear expectation.',
        tags: ['Formal', 'Confident', 'Expectant']
      }
    ],
    practice: [
      {
        type: 'fill-blank',
        question: 'I look ___ to hearing from you soon.',
        options: ['forward', 'ahead', 'up', 'out'],
        answer: 'forward',
        explanation: '"Look forward to" is a fixed expression meaning to anticipate positively.'
      },
      {
        type: 'choose-best',
        question: 'You are ending a complaint email. Which closing is best?',
        options: [
          'Fix this now.',
          'Thank you for your attention to this matter.',
          'Bye.',
          'I hope you read this.'
        ],
        answer: 'Thank you for your attention to this matter.',
        explanation: 'Professional, polite, and appropriate for a complaint.'
      },
      {
        type: 'fill-blank',
        question: 'Please do not ___ to contact me if you need more information.',
        options: ['hesitate', 'wait', 'stop', 'forget'],
        answer: 'hesitate',
        explanation: '"Please do not hesitate to contact me" is a formal fixed expression.'
      },
      {
        type: 'choose-best',
        question: 'You are ending a job application email. Which is most appropriate?',
        options: [
          'Give me the job.',
          'Thank you for your time and consideration.',
          'I need this job.',
          'Call me back.'
        ],
        answer: 'Thank you for your time and consideration.',
        explanation: 'Shows gratitude and is the standard closing for applications.'
      },
      {
        type: 'fill-blank',
        question: 'I ___ your assistance in resolving this billing issue.',
        options: ['appreciate', 'like', 'want', 'need'],
        answer: 'appreciate',
        explanation: '"I appreciate your assistance" is formal and shows gratitude.'
      }
    ]
  },
  // ==========================================
  // TASK 2 CATEGORIES (Survey Response)
  // ==========================================
  {
    id: 'expressing-opinions',
    title: 'Expressing Opinions',
    subtitle: 'State your position clearly',
    description: 'Task 2 requires you to give your opinion. Learn to express what you think in a clear, professional way.',
    icon: '💭',
    color: '#f97316',
    phrases: [
      {
        phrase: 'In my opinion...',
        example: 'In my opinion, remote work offers more flexibility for employees.',
        tip: 'Simple and direct way to introduce your view.',
        tags: ['Neutral', 'Opinion', 'Direct']
      },
      {
        phrase: 'I strongly believe that...',
        example: 'I strongly believe that public transportation should be free for students.',
        tip: 'Shows conviction; use for strong positions.',
        tags: ['Formal', 'Strong', 'Conviction']
      },
      {
        phrase: 'From my perspective...',
        example: 'From my perspective, the benefits of exercise outweigh the time investment.',
        tip: 'Personal viewpoint without being too casual.',
        tags: ['Formal', 'Personal', 'Professional']
      },
      {
        phrase: 'I am of the view that...',
        example: 'I am of the view that stricter regulations are necessary for online privacy.',
        tip: 'Very formal; good for written surveys.',
        tags: ['Formal', 'Written', 'Professional']
      },
      {
        phrase: 'It seems to me that...',
        example: 'It seems to me that technology has improved our quality of life overall.',
        tip: 'Softer opinion; shows you are being thoughtful.',
        tags: ['Semi-formal', 'Soft', 'Thoughtful']
      },
      {
        phrase: 'I would argue that...',
        example: 'I would argue that education is the most important factor in career success.',
        tip: 'Academic tone; presents your view as an argument.',
        tags: ['Formal', 'Academic', 'Argument']
      },
      {
        phrase: 'My view is that...',
        example: 'My view is that cities should invest more in green spaces.',
        tip: 'Clear and straightforward opinion statement.',
        tags: ['Neutral', 'Clear', 'Direct']
      },
      {
        phrase: 'I firmly believe that...',
        example: 'I firmly believe that everyone should have access to affordable healthcare.',
        tip: 'Shows strong conviction on important issues.',
        tags: ['Formal', 'Strong', 'Values']
      }
    ],
    practice: [
      {
        type: 'fill-blank',
        question: 'In my ___, working from home increases productivity.',
        options: ['opinion', 'mind', 'thinking', 'head'],
        answer: 'opinion',
        explanation: '"In my opinion" is the standard expression for stating views.'
      },
      {
        type: 'choose-best',
        question: 'You need to express a strong position on environmental policy. Which is best?',
        options: [
          'I guess recycling is good.',
          'I strongly believe that recycling should be mandatory.',
          'Recycling is okay I think.',
          'Maybe recycling helps.'
        ],
        answer: 'I strongly believe that recycling should be mandatory.',
        explanation: '"I strongly believe" shows conviction appropriate for surveys.'
      },
      {
        type: 'fill-blank',
        question: 'From my ___, the advantages clearly outweigh the disadvantages.',
        options: ['perspective', 'eyes', 'looking', 'seeing'],
        answer: 'perspective',
        explanation: '"From my perspective" is a professional way to share viewpoints.'
      },
      {
        type: 'choose-best',
        question: 'Which opening is most appropriate for a formal survey response?',
        options: [
          'I think that maybe...',
          'I am of the view that...',
          'Well, in my head...',
          'I feel like...'
        ],
        answer: 'I am of the view that...',
        explanation: '"I am of the view that" is formal and appropriate for written responses.'
      },
      {
        type: 'fill-blank',
        question: 'I would ___ that early education is crucial for child development.',
        options: ['argue', 'say', 'tell', 'speak'],
        answer: 'argue',
        explanation: '"I would argue that" presents your opinion as a reasoned position.'
      }
    ]
  },
  {
    id: 'comparing-options',
    title: 'Comparing Options',
    subtitle: 'Weigh pros and cons effectively',
    description: 'Many Task 2 questions ask you to compare. Learn to discuss advantages and disadvantages clearly.',
    icon: '⚖️',
    color: '#14b8a6',
    phrases: [
      {
        phrase: 'While X has its advantages, Y offers...',
        example: 'While online learning has its advantages, in-person classes offer better interaction.',
        tip: 'Balanced comparison that acknowledges both sides.',
        tags: ['Formal', 'Balanced', 'Comparison']
      },
      {
        phrase: 'Compared to X, Y is more...',
        example: 'Compared to driving, public transit is more environmentally friendly.',
        tip: 'Direct comparison between two options.',
        tags: ['Neutral', 'Direct', 'Clear']
      },
      {
        phrase: 'On the one hand... on the other hand...',
        example: 'On the one hand, cities offer more jobs. On the other hand, rural areas provide a quieter lifestyle.',
        tip: 'Classic structure for presenting both sides.',
        tags: ['Formal', 'Structure', 'Balanced']
      },
      {
        phrase: 'The main advantage of X is...',
        example: 'The main advantage of electric cars is their lower environmental impact.',
        tip: 'Highlights the key benefit of one option.',
        tags: ['Neutral', 'Advantage', 'Focus']
      },
      {
        phrase: 'However, a significant drawback is...',
        example: 'However, a significant drawback is the high initial cost of solar panels.',
        tip: 'Introduces a disadvantage professionally.',
        tags: ['Formal', 'Disadvantage', 'Contrast']
      },
      {
        phrase: 'X is preferable to Y because...',
        example: 'Working remotely is preferable to commuting because it saves time and reduces stress.',
        tip: 'States your preference with justification.',
        tags: ['Formal', 'Preference', 'Reason']
      },
      {
        phrase: 'Although X seems attractive, Y provides...',
        example: 'Although freelancing seems attractive, full-time employment provides more stability.',
        tip: 'Concedes one point while favoring another.',
        tags: ['Formal', 'Concession', 'Nuanced']
      },
      {
        phrase: 'Both options have merits, but...',
        example: 'Both options have merits, but I believe traditional education is more effective.',
        tip: 'Acknowledges validity of both before choosing.',
        tags: ['Formal', 'Balanced', 'Decision']
      }
    ],
    practice: [
      {
        type: 'fill-blank',
        question: 'While working from home has its ___, office work offers better collaboration.',
        options: ['advantages', 'goods', 'nice things', 'positives'],
        answer: 'advantages',
        explanation: '"Has its advantages" is the standard expression for acknowledging benefits.'
      },
      {
        type: 'choose-best',
        question: 'You need to present both sides of an argument. Which structure is best?',
        options: [
          'X is good. Y is bad.',
          'On the one hand, X offers flexibility. On the other hand, Y provides stability.',
          'I like X more than Y.',
          'X and Y are different.'
        ],
        answer: 'On the one hand, X offers flexibility. On the other hand, Y provides stability.',
        explanation: '"On the one hand... on the other hand" is the classic balanced comparison structure.'
      },
      {
        type: 'fill-blank',
        question: 'Compared ___ traditional methods, modern technology is more efficient.',
        options: ['to', 'with', 'at', 'for'],
        answer: 'to',
        explanation: '"Compared to" is the correct preposition for comparisons.'
      },
      {
        type: 'choose-best',
        question: 'How do you professionally introduce a disadvantage?',
        options: [
          'The bad thing is...',
          'However, a significant drawback is...',
          'The problem is it sucks.',
          'Negatively speaking...'
        ],
        answer: 'However, a significant drawback is...',
        explanation: '"A significant drawback" is professional language for discussing disadvantages.'
      },
      {
        type: 'fill-blank',
        question: 'Both options have ___, but ultimately I prefer the first one.',
        options: ['merits', 'goods', 'nice parts', 'okays'],
        answer: 'merits',
        explanation: '"Both options have merits" acknowledges validity before stating preference.'
      }
    ]
  },
  {
    id: 'supporting-arguments',
    title: 'Supporting Arguments',
    subtitle: 'Back up your points with evidence',
    description: 'Strong opinions need strong support. Learn to provide examples and evidence for your views.',
    icon: '📊',
    color: '#a855f7',
    phrases: [
      {
        phrase: 'For example...',
        example: 'For example, many companies have reported increased productivity with flexible hours.',
        tip: 'Simple way to introduce a specific example.',
        tags: ['Neutral', 'Example', 'Simple']
      },
      {
        phrase: 'This is evident in...',
        example: 'This is evident in the rising number of people choosing online education.',
        tip: 'Points to observable proof.',
        tags: ['Formal', 'Evidence', 'Observable']
      },
      {
        phrase: 'Research has shown that...',
        example: 'Research has shown that regular exercise improves mental health.',
        tip: 'References studies or data (even general).',
        tags: ['Formal', 'Research', 'Academic']
      },
      {
        phrase: 'A clear example of this is...',
        example: 'A clear example of this is the success of renewable energy in Nordic countries.',
        tip: 'Introduces a specific, relevant example.',
        tags: ['Formal', 'Specific', 'Example']
      },
      {
        phrase: 'This can be seen in...',
        example: 'This can be seen in the growing popularity of electric vehicles.',
        tip: 'Points to trends or observable facts.',
        tags: ['Formal', 'Observable', 'Trend']
      },
      {
        phrase: 'To illustrate this point...',
        example: 'To illustrate this point, consider how smartphones have changed communication.',
        tip: 'Introduces an example to clarify your argument.',
        tags: ['Formal', 'Illustration', 'Clarity']
      },
      {
        phrase: 'Statistics indicate that...',
        example: 'Statistics indicate that over 70% of consumers prefer eco-friendly products.',
        tip: 'References data to support your point.',
        tags: ['Formal', 'Data', 'Statistics']
      },
      {
        phrase: 'Personal experience has taught me that...',
        example: 'Personal experience has taught me that time management is crucial for success.',
        tip: 'Uses personal evidence when appropriate.',
        tags: ['Semi-formal', 'Personal', 'Experience']
      }
    ],
    practice: [
      {
        type: 'fill-blank',
        question: 'For ___, many cities have successfully reduced traffic through bike lanes.',
        options: ['example', 'instance', 'sample', 'case'],
        answer: 'example',
        explanation: '"For example" is the most common way to introduce specific evidence.'
      },
      {
        type: 'choose-best',
        question: 'You want to support your argument with data. Which phrase is best?',
        options: [
          'I heard somewhere that...',
          'Research has shown that...',
          'People say that...',
          'I think maybe...'
        ],
        answer: 'Research has shown that...',
        explanation: '"Research has shown" adds credibility to your argument.'
      },
      {
        type: 'fill-blank',
        question: 'This is ___ in the increasing number of remote workers worldwide.',
        options: ['evident', 'seen', 'showed', 'looked'],
        answer: 'evident',
        explanation: '"This is evident in" points to observable proof of your claim.'
      },
      {
        type: 'choose-best',
        question: 'How do you introduce a specific example to support your point?',
        options: [
          'Like, you know...',
          'A clear example of this is...',
          'Something like...',
          'I guess maybe...'
        ],
        answer: 'A clear example of this is...',
        explanation: '"A clear example of this is" introduces specific, relevant evidence.'
      },
      {
        type: 'fill-blank',
        question: 'To ___ this point, consider the success of online learning during the pandemic.',
        options: ['illustrate', 'show', 'tell', 'speak'],
        answer: 'illustrate',
        explanation: '"To illustrate this point" formally introduces a clarifying example.'
      }
    ]
  }
];

export const getCategoryById = (id: string): StarterCategory | undefined => {
  return STARTER_CATEGORIES.find(cat => cat.id === id);
};
