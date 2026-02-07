// Closing Builder Content - "Please Let Me Know If..." Generator

export interface ClosingCategory {
  id: string;
  title: string;
  icon: string;
  description: string;
  closings: ClosingPhrase[];
}

export interface ClosingPhrase {
  id: string;
  template: string;
  example: string;
  context: string;
}

export const closingCategories: ClosingCategory[] = [
  {
    id: 'complaint',
    title: 'Complaints',
    icon: '😤',
    description: 'When you are unhappy about something',
    closings: [
      {
        id: 'comp-1',
        template: 'Please let me know if you need any further details about [the issue].',
        example: 'Please let me know if you need any further details about the noise disturbance.',
        context: 'When offering to provide more information'
      },
      {
        id: 'comp-2',
        template: 'Please let me know if there is anything I can do to help resolve this matter.',
        example: 'Please let me know if there is anything I can do to help resolve this matter.',
        context: 'When offering to help fix the problem'
      },
      {
        id: 'comp-3',
        template: 'Please let me know when I can expect a response regarding [the issue].',
        example: 'Please let me know when I can expect a response regarding the refund.',
        context: 'When you need a timeline'
      },
      {
        id: 'comp-4',
        template: 'Please let me know if you require any documentation to process [my request].',
        example: 'Please let me know if you require any documentation to process my complaint.',
        context: 'When offering to provide evidence'
      }
    ]
  },
  {
    id: 'request',
    title: 'Requests',
    icon: '🙏',
    description: 'When you are asking for something',
    closings: [
      {
        id: 'req-1',
        template: 'Please let me know if you need any additional information to process my request.',
        example: 'Please let me know if you need any additional information to process my request.',
        context: 'General request follow-up'
      },
      {
        id: 'req-2',
        template: 'Please let me know if this request can be accommodated.',
        example: 'Please let me know if this request can be accommodated.',
        context: 'When asking for something that might not be possible'
      },
      {
        id: 'req-3',
        template: 'Please let me know if there are any forms I need to complete.',
        example: 'Please let me know if there are any forms I need to complete.',
        context: 'When there might be paperwork'
      },
      {
        id: 'req-4',
        template: 'Please let me know the next steps I should take.',
        example: 'Please let me know the next steps I should take.',
        context: 'When you need guidance'
      }
    ]
  },
  {
    id: 'suggestion',
    title: 'Suggestions',
    icon: '💡',
    description: 'When you are proposing an idea',
    closings: [
      {
        id: 'sug-1',
        template: 'Please let me know if you would like me to elaborate on this suggestion.',
        example: 'Please let me know if you would like me to elaborate on this suggestion.',
        context: 'When offering more details'
      },
      {
        id: 'sug-2',
        template: 'Please let me know if you need help implementing this idea.',
        example: 'Please let me know if you need help implementing this idea.',
        context: 'When offering to assist'
      },
      {
        id: 'sug-3',
        template: 'Please let me know your thoughts on this proposal.',
        example: 'Please let me know your thoughts on this proposal.',
        context: 'When seeking feedback'
      },
      {
        id: 'sug-4',
        template: 'Please let me know if there are any concerns about this approach.',
        example: 'Please let me know if there are any concerns about this approach.',
        context: 'When anticipating objections'
      }
    ]
  },
  {
    id: 'thank-you',
    title: 'Thank You',
    icon: '🙌',
    description: 'When you are expressing gratitude',
    closings: [
      {
        id: 'thx-1',
        template: 'Please let me know if there is anything I can do to return the favor.',
        example: 'Please let me know if there is anything I can do to return the favor.',
        context: 'When offering to help back'
      },
      {
        id: 'thx-2',
        template: 'Please let me know if you would like me to write a testimonial.',
        example: 'Please let me know if you would like me to write a testimonial.',
        context: 'When offering public appreciation'
      },
      {
        id: 'thx-3',
        template: 'Please let me know if there is a way I can show my appreciation.',
        example: 'Please let me know if there is a way I can show my appreciation.',
        context: 'When wanting to do something in return'
      }
    ]
  },
  {
    id: 'invitation',
    title: 'Invitations',
    icon: '🎉',
    description: 'When you are inviting someone',
    closings: [
      {
        id: 'inv-1',
        template: 'Please let me know if you can attend by [date].',
        example: 'Please let me know if you can attend by next Friday.',
        context: 'When you need an RSVP'
      },
      {
        id: 'inv-2',
        template: 'Please let me know if you have any dietary restrictions.',
        example: 'Please let me know if you have any dietary restrictions.',
        context: 'When food is involved'
      },
      {
        id: 'inv-3',
        template: 'Please let me know if you need directions to the venue.',
        example: 'Please let me know if you need directions to the venue.',
        context: 'When offering location help'
      },
      {
        id: 'inv-4',
        template: 'Please let me know if you would like to bring a guest.',
        example: 'Please let me know if you would like to bring a guest.',
        context: 'When guests are welcome'
      }
    ]
  },
  {
    id: 'apology',
    title: 'Apologies',
    icon: '😔',
    description: 'When you are saying sorry',
    closings: [
      {
        id: 'apo-1',
        template: 'Please let me know if there is anything I can do to make it up to you.',
        example: 'Please let me know if there is anything I can do to make it up to you.',
        context: 'When offering to fix things'
      },
      {
        id: 'apo-2',
        template: 'Please let me know if you are willing to give me another chance.',
        example: 'Please let me know if you are willing to give me another chance.',
        context: 'When asking for forgiveness'
      },
      {
        id: 'apo-3',
        template: 'Please let me know how I can prevent this from happening again.',
        example: 'Please let me know how I can prevent this from happening again.',
        context: 'When seeking improvement advice'
      }
    ]
  }
];

// ============================================
// CONTRACTION SPOTTER GAME
// ============================================

export interface ContractionChallenge {
  id: string;
  text: string;
  contractions: ContractionItem[];
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface ContractionItem {
  word: string;
  position: number; // word index in the text
  correction: string;
}

export const contractionChallenges: ContractionChallenge[] = [
  // EASY - 1-2 contractions, short text
  {
    id: 'easy-1',
    text: "I'm writing to inform you about a problem with my order. The package didn't arrive on time.",
    contractions: [
      { word: "I'm", position: 0, correction: "I am" },
      { word: "didn't", position: 14, correction: "did not" }
    ],
    difficulty: 'easy'
  },
  {
    id: 'easy-2',
    text: "Thank you for your help. I can't express how grateful I am for your support.",
    contractions: [
      { word: "can't", position: 7, correction: "cannot" }
    ],
    difficulty: 'easy'
  },
  {
    id: 'easy-3',
    text: "The service wasn't what I expected. I won't be returning to this restaurant.",
    contractions: [
      { word: "wasn't", position: 2, correction: "was not" },
      { word: "won't", position: 9, correction: "will not" }
    ],
    difficulty: 'easy'
  },
  {
    id: 'easy-4',
    text: "I've been a loyal customer for five years. It's disappointing to receive such poor service.",
    contractions: [
      { word: "I've", position: 0, correction: "I have" },
      { word: "It's", position: 10, correction: "It is" }
    ],
    difficulty: 'easy'
  },
  {
    id: 'easy-5',
    text: "We're planning a community event next month. Everyone's invited to participate.",
    contractions: [
      { word: "We're", position: 0, correction: "We are" },
      { word: "Everyone's", position: 8, correction: "Everyone is" }
    ],
    difficulty: 'easy'
  },

  // MEDIUM - 2-3 contractions, longer text
  {
    id: 'med-1',
    text: "I'm writing to suggest that we shouldn't allow loud music after 10pm. It's been disrupting the neighborhood, and many residents aren't happy about it.",
    contractions: [
      { word: "I'm", position: 0, correction: "I am" },
      { word: "shouldn't", position: 6, correction: "should not" },
      { word: "It's", position: 14, correction: "It has" },
      { word: "aren't", position: 22, correction: "are not" }
    ],
    difficulty: 'medium'
  },
  {
    id: 'med-2',
    text: "The new policy doesn't address our concerns. We've raised these issues before, but they haven't been resolved. I'd like to request a meeting.",
    contractions: [
      { word: "doesn't", position: 3, correction: "does not" },
      { word: "We've", position: 6, correction: "We have" },
      { word: "haven't", position: 14, correction: "have not" },
      { word: "I'd", position: 18, correction: "I would" }
    ],
    difficulty: 'medium'
  },
  {
    id: 'med-3',
    text: "There's a problem with the elevator that hasn't been fixed. It's been two weeks, and residents can't access the upper floors easily.",
    contractions: [
      { word: "There's", position: 0, correction: "There is" },
      { word: "hasn't", position: 7, correction: "has not" },
      { word: "It's", position: 10, correction: "It has" },
      { word: "can't", position: 18, correction: "cannot" }
    ],
    difficulty: 'medium'
  },
  {
    id: 'med-4',
    text: "I wouldn't normally complain, but this situation isn't acceptable. You'll need to address this before it's too late.",
    contractions: [
      { word: "wouldn't", position: 1, correction: "would not" },
      { word: "isn't", position: 7, correction: "is not" },
      { word: "You'll", position: 10, correction: "You will" },
      { word: "it's", position: 16, correction: "it is" }
    ],
    difficulty: 'medium'
  },

  // HARD - 4+ contractions, tricky ones
  {
    id: 'hard-1',
    text: "I'm afraid I can't attend the meeting because I'll be traveling. I've already informed my colleague, and she's agreed to take notes. Couldn't we reschedule to next week when I'm available?",
    contractions: [
      { word: "I'm", position: 0, correction: "I am" },
      { word: "can't", position: 3, correction: "cannot" },
      { word: "I'll", position: 9, correction: "I will" },
      { word: "I've", position: 12, correction: "I have" },
      { word: "she's", position: 19, correction: "she has" },
      { word: "Couldn't", position: 25, correction: "Could not" },
      { word: "I'm", position: 31, correction: "I am" }
    ],
    difficulty: 'hard'
  },
  {
    id: 'hard-2',
    text: "It's been brought to my attention that there's been a misunderstanding. We're not trying to cause problems, and we wouldn't have complained if it weren't for the safety concerns. Let's discuss this matter.",
    contractions: [
      { word: "It's", position: 0, correction: "It has" },
      { word: "there's", position: 8, correction: "there has" },
      { word: "We're", position: 12, correction: "We are" },
      { word: "wouldn't", position: 20, correction: "would not" },
      { word: "weren't", position: 27, correction: "were not" },
      { word: "Let's", position: 33, correction: "Let us" }
    ],
    difficulty: 'hard'
  },
  {
    id: 'hard-3',
    text: "Who's responsible for this decision? It wasn't communicated properly, and now we're facing issues that could've been avoided. I'd appreciate it if you'd look into this matter urgently.",
    contractions: [
      { word: "Who's", position: 0, correction: "Who is" },
      { word: "wasn't", position: 6, correction: "was not" },
      { word: "we're", position: 12, correction: "we are" },
      { word: "could've", position: 16, correction: "could have" },
      { word: "I'd", position: 20, correction: "I would" },
      { word: "you'd", position: 25, correction: "you would" }
    ],
    difficulty: 'hard'
  }
];

// Helper to get challenges by difficulty
export const getChallengesByDifficulty = (difficulty: 'easy' | 'medium' | 'hard') => {
  return contractionChallenges.filter(c => c.difficulty === difficulty);
};

// All contractions reference
export const commonContractions: Record<string, string> = {
  "I'm": "I am",
  "I've": "I have",
  "I'd": "I would / I had",
  "I'll": "I will",
  "you're": "you are",
  "you've": "you have",
  "you'd": "you would / you had",
  "you'll": "you will",
  "he's": "he is / he has",
  "she's": "she is / she has",
  "it's": "it is / it has",
  "we're": "we are",
  "we've": "we have",
  "we'd": "we would / we had",
  "we'll": "we will",
  "they're": "they are",
  "they've": "they have",
  "they'd": "they would / they had",
  "they'll": "they will",
  "there's": "there is / there has",
  "that's": "that is / that has",
  "who's": "who is / who has",
  "what's": "what is / what has",
  "where's": "where is / where has",
  "how's": "how is / how has",
  "here's": "here is",
  "let's": "let us",
  "can't": "cannot",
  "won't": "will not",
  "don't": "do not",
  "doesn't": "does not",
  "didn't": "did not",
  "isn't": "is not",
  "aren't": "are not",
  "wasn't": "was not",
  "weren't": "were not",
  "hasn't": "has not",
  "haven't": "have not",
  "hadn't": "had not",
  "wouldn't": "would not",
  "couldn't": "could not",
  "shouldn't": "should not",
  "mustn't": "must not",
  "needn't": "need not",
  "could've": "could have",
  "would've": "would have",
  "should've": "should have",
  "might've": "might have",
  "must've": "must have"
};
