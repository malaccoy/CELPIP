import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { writeFile, unlink } from 'fs/promises';
import { join } from 'path';
import { randomUUID } from 'crypto';
import { logActivity } from '@/lib/activity';
import { requireProWithLimit } from '@/lib/plan';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { authenticated, userId, isPro } = await (await import('@/lib/plan')).getUserPlan();
    if (!authenticated || !userId) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    const { checkRateLimit, rateLimitResponse } = await import('@/lib/rate-limit');
    const { allowed } = await checkRateLimit(userId, 'speaking-feedback', isPro);
    if (!allowed) return rateLimitResponse() as unknown as NextResponse;

    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;

    // Limit audio size to 10MB
    if (audioFile && audioFile.size > 25 * 1024 * 1024) {
      return NextResponse.json({ error: 'Audio file too large (max 25MB)' }, { status: 413 });
    }

    const taskType = formData.get('taskType') as string;
    const taskPart = formData.get('taskPart') as string;
    const prompt = formData.get('prompt') as string;

    if (!audioFile) {
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      );
    }

    console.log('[Speaking Feedback] Audio file received:', {
      name: audioFile.name,
      type: audioFile.type,
      size: audioFile.size,
    });

    // Save audio temporarily with correct extension
    const bytes = await audioFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const mimeType = audioFile.type || 'audio/mp4';
    const ext = mimeType.includes('mp4') || mimeType.includes('m4a') ? 'm4a' 
              : mimeType.includes('ogg') ? 'ogg'
              : mimeType.includes('wav') ? 'wav'
              : mimeType.includes('webm') ? 'webm'
              : 'm4a'; // Safari fallback
    const tempPath = join('/tmp', `speaking-${randomUUID()}.${ext}`);
    await writeFile(tempPath, buffer);

    console.log('[Speaking Feedback] Saved temp file:', tempPath, 'size:', buffer.length);

    // Transcribe with Whisper
    const transcription = await openai.audio.transcriptions.create({
      file: await import('fs').then(fs => fs.createReadStream(tempPath)),
      model: 'whisper-1',
      language: 'en',
    });

    // Clean up temp file
    await unlink(tempPath).catch(() => {});

    const transcript = transcription.text;

    // If no speech detected
    if (!transcript || transcript.trim().length < 10) {
      return NextResponse.json({
        score: 3,
        transcript: transcript || '(No speech detected)',
        strengths: ['Attempted the task'],
        improvements: [
          'Speak clearly into the microphone',
          'Make sure your microphone is working',
          'Try to speak for the full time allowed'
        ],
        detailedFeedback: {
          content: { score: 3, comment: 'Unable to evaluate - no clear speech detected' },
          vocabulary: { score: 3, comment: 'Unable to evaluate' },
          fluency: { score: 3, comment: 'Unable to evaluate' },
          structure: { score: 3, comment: 'Unable to evaluate' }
        },
        overallComment: 'We could not detect clear speech in your recording. Please check your microphone and try again.'
      });
    }

    // Analyze with GPT — enhanced prompt based on Speaking Technique Guide
    const analysisPrompt = `You are an expert CELPIP Speaking test evaluator with deep knowledge of the CSF framework (Context, Skill, Formula).

TASK: Part ${taskPart} - ${taskType}
PROMPT GIVEN TO CANDIDATE: ${prompt}
CANDIDATE'S RESPONSE (transcript):
"${transcript}"

## CELPIP SCORE BANDS (use these strictly — DO NOT inflate scores):
- 1-2: Minimal — gibberish, off-topic nonsense, random words unrelated to the prompt, or near-silence
- 3: Very Limited — attempts to speak but response is largely incoherent, irrelevant, or just filler words/phrases repeated ("I don't know", "yeah maybe")
- 4: Limited — recognizable attempt at the topic but major gaps, very short, lacks any structure
- 5-6: Developing — covers the topic partially, frequent grammar errors, limited vocabulary, some structure but incomplete
- 7: Adequate — covers the topic, some errors, lacks detail
- 8: Good — clear ideas, minor errors, reasonable vocabulary
- 9: Very Good — well-organized, varied vocabulary, few errors
- 10-12: Excellent/Expert — sophisticated, natural, near-native

## CRITICAL SCORING RULES:
1. If the response does NOT address the prompt at all → score 1-2
2. If the response is mostly filler/nonsense/off-topic with only a vague connection → score 2-3
3. If the response is under 30 words and doesn't form coherent advice/opinion/description → max score 4
4. If the candidate repeats "I don't know" or similar → SEVERELY penalize content and fluency
5. NEVER give above 5 to a response that doesn't attempt the task formula
6. NEVER give above 7 unless vocabulary is varied and grammar is mostly correct
7. The AVERAGE learner scores 5-7. Scores of 8+ require genuinely good English.
8. A 5/12 means the person CAN communicate basic ideas. Random words ≠ basic ideas.

## EVALUATION CRITERIA:

### 1. Content/Coherence (1-12)
- Did they address ALL parts of the prompt?
- Is the response organized with a clear beginning, middle, and end?
- Did they follow the expected FORMULA for this task type?
- For Task 1 (Advice): Greeting → 3 pieces of advice with expressions → Closing
- For Task 2 (Personal Experience): Opening → Setting (where/when) → Characters → Answer questions → Feeling
- For Task 3 (Scene Description): Location → General → Center → Outward → Closing
- For Task 4 (Predictions): Reference scene → 3 predictions with reasoning → Closing
- For Task 5 (Compare/Persuade): State choice → 3 comparisons → Closing persuasion
- For Task 6 (Difficult Situation): State decision → 3 reasons → Closing
- For Task 7 (Opinions): Opinion → 3 P.R.E. blocks (Point+Reason+Example) → Paraphrased closing
- For Task 8 (Unusual Scene): Greeting + why calling → Describe → Unusual elements → Call to action

### 2. Vocabulary (1-12)
- Range: Did they use varied vocabulary or repeat the same words?
- Accuracy: Were words used correctly?
- Task-specific expressions: Did they use the right expressions for this task type?
  - Task 1: Advice expressions (I suggest, I recommend, Why don't you)
  - Task 2: Past tense markers, feeling words
  - Task 3: Location words, present progressive (ING), "It looks like"
  - Task 5: Comparative language (whereas, while, however)
  - Task 7: Opinion expressions + paraphrasing in closing
- Flag specific vocabulary errors with corrections

### 3. Fluency/Listenability (1-12)
- Natural pace and flow (based on transcript coherence)
- Excessive filler words (um, uh, like, you know) — count them
- Informal/slang words inappropriate for CELPIP (bro, dude, gonna, wanna)
- Use of contractions is GOOD (don't, I've, here's — sounds natural)
- Self-corrections handled naturally vs. awkwardly

### 4. Structure/Organization (1-12)
- Clear transitions between points (First of all, Second, Finally)
- Logical progression of ideas
- Time management — did they use enough speaking time?
- Opening and closing present and effective?

## GRAMMAR ANALYSIS
Identify ALL grammar errors with:
- The exact error phrase
- What's wrong
- The corrected version

## RESPOND IN THIS EXACT JSON FORMAT:
{
  "score": <overall 1-12, be strict per score bands above>,
  "detailedFeedback": {
    "content": { "score": <1-12>, "comment": "<specific feedback referencing what they said>" },
    "vocabulary": { "score": <1-12>, "comment": "<specific feedback with examples of good/bad word choices>" },
    "fluency": { "score": <1-12>, "comment": "<feedback about flow, fillers, pace>" },
    "structure": { "score": <1-12>, "comment": "<feedback about organization and formula>" }
  },
  "strengths": ["<specific strength 1>", "<specific strength 2>", "<specific strength 3>"],
  "improvements": ["<actionable improvement 1>", "<actionable improvement 2>", "<actionable improvement 3>"],
  "grammarErrors": [
    { "error": "<exact phrase>", "correction": "<corrected phrase>", "explanation": "<brief why>" }
  ],
  "vocabularySuggestions": [
    { "used": "<word/phrase they used>", "better": "<improved alternative>", "why": "<brief reason>" }
  ],
  "modelResponse": "<A short improved version (3-4 sentences) showing how they could restructure their BEST point with better vocabulary and grammar. Keep the same ideas, just improve execution.>",
  "overallComment": "<2-3 sentence honest assessment. Reference specific things they said. Be encouraging but direct about what needs work.>"
}

IMPORTANT RULES:
- Be STRICT with scoring — most learners score 6-8, not 9-12
- Excessive use of "bro", "dude", "you know" should lower fluency score
- Generic advice without personal connection should lower content score
- If they didn't follow the formula for their task type, mention it explicitly
- grammarErrors should have at least 1 entry (even advanced speakers make errors)
- vocabularySuggestions should have 2-3 entries showing better word choices
- modelResponse should be achievable — not perfect English, just a better version of THEIR response`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a STRICT CELPIP Speaking evaluator. You provide honest, no-nonsense evaluations. You NEVER inflate scores. A response that is mostly gibberish, off-topic, or filler gets 1-3/12. A mediocre attempt gets 4-6. Only genuinely competent responses get 7+. You output JSON only.'
        },
        { role: 'user', content: analysisPrompt }
      ],
      temperature: 0.5,
      response_format: { type: 'json_object' }
    });

    const analysisText = completion.choices[0]?.message?.content || '';
    const analysis = JSON.parse(analysisText);

    // Log activity for leaderboard
    try {
      const { getUserPlan } = await import('@/lib/plan');
      const plan = await getUserPlan();
      if (plan.userId) {
        await logActivity(plan.userId, 'speaking');
      }
    } catch {}

    return NextResponse.json({
      ...analysis,
      transcript
    });

  } catch (error: unknown) {
    const err = error as Error & { status?: number; code?: string };
    console.error('Speaking feedback error:', err.message, err.code, err.status);
    return NextResponse.json(
      { error: 'Failed to analyze recording' },
      { status: 500 }
    );
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
