import { FeedbackItem, Task1State, Task2State } from "../types";

export const countWords = (text: string) => {
  return text.trim().split(/\s+/).filter(w => w.length > 0).length;
};

export const generateTask1Feedback = (state: Task1State): FeedbackItem[] => {
  const text = state.content;
  const lowerText = text.toLowerCase();
  const feedback: FeedbackItem[] = [];

  // 1. Check for "Dear"
  feedback.push({
    id: 'dear-check',
    message: 'O email deve começar com "Dear ..."',
    severity: 'BLOCKER',
    passed: /^\s*dear/i.test(text)
  });

  // 2. Introduction check (Simple heuristic: check for line breaks early on or keywords)
  const lines = text.split('\n').filter(l => l.trim().length > 0);
  const introProbablyExists = lines.length > 0 && lines[0].length > 20; 
  feedback.push({
    id: 'intro-check',
    message: 'A primeira frase deve explicar quem é você e por que está escrevendo (Purpose).',
    severity: 'IMPORTANT',
    passed: introProbablyExists && (lowerText.includes('writing to') || lowerText.includes('name is') || lowerText.includes('resident of') || lowerText.includes('customer'))
  });

  // 3. Connectors
  const connectors = ['first', 'second', 'third', 'finally', 'additionally', 'moreover', 'furthermore'];
  const foundConnectors = connectors.filter(c => lowerText.includes(c));
  feedback.push({
    id: 'connectors-check',
    message: 'Use conectores de ordem (First, Second, Third, Finally).',
    severity: 'IMPORTANT',
    passed: foundConnectors.length >= 2
  });

  // 4. Contractions
  const contractions = ["don't", "can't", "i'm", "it's", "won't", "shouldn't"];
  const foundContractions = contractions.filter(c => lowerText.includes(c));
  const isFormal = state.formality === 'Formal';
  if (isFormal) {
      feedback.push({
        id: 'contractions-check',
        message: 'Em emails formais, evite contrações (don\'t -> do not).',
        severity: 'POLISH',
        passed: foundContractions.length === 0
      });
  }

  // 5. Specific CTA
  feedback.push({
    id: 'cta-check',
    message: 'Use uma frase específica para fechar, como "Please let me know if...".',
    severity: 'IMPORTANT',
    passed: lowerText.includes('let me know') || lowerText.includes('look forward') || lowerText.includes('waiting for')
  });

  // 6. Sign-off
  feedback.push({
    id: 'signoff-check',
    message: 'Termine com "Regards," seguido do seu nome completo.',
    severity: 'BLOCKER',
    passed: /regards,?/i.test(text)
  });

  return feedback;
};

export const generateTask2Feedback = (state: Task2State): FeedbackItem[] => {
  const text = state.content;
  const lowerText = text.toLowerCase();
  const feedback: FeedbackItem[] = [];

  // 1. Forbidden Option references
  const optionRefs = ["option a", "option b", "choose option"];
  const foundOptions = optionRefs.filter(o => lowerText.includes(o));
  feedback.push({
    id: 'option-ref-check',
    message: 'NÃO use "Option A" ou "Option B". Refira-se ao tema diretamente.',
    severity: 'BLOCKER',
    passed: foundOptions.length === 0
  });

  // 2. Opinion Structure in Intro
  feedback.push({
    id: 'intro-opinion',
    message: 'A introdução deve declarar claramente sua opinião.',
    severity: 'BLOCKER',
    passed: lowerText.includes('opinion') || lowerText.includes('believe') || lowerText.includes('recommend') || lowerText.includes('suggest') || lowerText.includes('would rather')
  });

  // 3. Connectors
  const connectors = ['first', 'second', 'finally', 'reason', 'another'];
  feedback.push({
    id: 'connectors-check',
    message: 'O corpo deve usar conectores claros para separar argumentos.',
    severity: 'IMPORTANT',
    passed: connectors.filter(c => lowerText.includes(c)).length >= 2
  });

  // 4. Conclusion
  feedback.push({
    id: 'conclusion-check',
    message: 'Deve haver um parágrafo final começando com "In conclusion" ou similar.',
    severity: 'IMPORTANT',
    passed: lowerText.includes('conclusion') || lowerText.includes('summarize') || lowerText.includes('all in all')
  });

  // 5. PRE check (heuristic: look for "example" or "instance")
  feedback.push({
    id: 'example-check',
    message: 'Use exemplos concretos (use palavras como "For example", "For instance").',
    severity: 'POLISH',
    passed: lowerText.includes('example') || lowerText.includes('instance') || lowerText.includes('such as')
  });

    // 6. Contractions
  const contractions = ["don't", "can't", "i'm", "it's", "won't", "shouldn't"];
  const foundContractions = contractions.filter(c => lowerText.includes(c));
  feedback.push({
    id: 'contractions-check',
    message: 'Evite contrações em textos argumentativos (Task 2).',
    severity: 'POLISH',
    passed: foundContractions.length === 0
  });

    // 7. Rhetorical questions
  feedback.push({
    id: 'rhetorical-check',
    message: 'Evite começar parágrafos com perguntas retóricas (Ex: "Why is this good?").',
    severity: 'POLISH',
    passed: !/\?/.test(text) // crude check for any question mark
  });

  return feedback;
};