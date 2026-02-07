import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@lib/prisma';
import { auth } from '@/../auth';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// POST: Save a writing analysis
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const body = await request.json();

    const { 
      sessionId,
      taskType, 
      wordCount, 
      aiScore, 
      content,
      grammarIssues = 0,
      vocabularyIssues = 0,
      structureIssues = 0,
      contentIssues = 0,
      styleIssues = 0,
      hasContractions = false,
      hasOrgWords = true,
      hasSpecificDetails = false,
      hasProperClosing = false,
      sentenceFeedback,
      scoreFeedback,
    } = body;

    if (!taskType || !content || aiScore === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const analysis = await prisma.writingAnalysis.create({
      data: {
        sessionId: session?.user?.id ? undefined : sessionId,
        userId: session?.user?.id || undefined,
        taskType,
        wordCount: wordCount || content.split(/\s+/).length,
        aiScore,
        content,
        grammarIssues,
        vocabularyIssues,
        structureIssues,
        contentIssues,
        styleIssues,
        hasContractions,
        hasOrgWords,
        hasSpecificDetails,
        hasProperClosing,
        sentenceFeedback,
        scoreFeedback,
      },
    });

    return NextResponse.json({ success: true, id: analysis.id });
  } catch (error) {
    console.error('Save analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to save analysis' },
      { status: 500 }
    );
  }
}

// GET: Get weakness report and progress
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');
    const action = searchParams.get('action') || 'report';

    // Build where clause
    const whereClause = session?.user?.id 
      ? { userId: session.user.id }
      : sessionId 
        ? { sessionId }
        : null;

    if (!whereClause) {
      return NextResponse.json(
        { error: 'No user session or sessionId provided' },
        { status: 400 }
      );
    }

    // Get recent analyses (last 10)
    const analyses = await prisma.writingAnalysis.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    if (analyses.length === 0) {
      return NextResponse.json({
        hasData: false,
        message: 'No writing history yet. Complete a few practices to see your progress!',
      });
    }

    if (action === 'progress') {
      // Progress tracking - score over time
      const progressData = analyses.reverse().map((a, index) => ({
        date: a.createdAt,
        score: a.aiScore,
        taskType: a.taskType,
        wordCount: a.wordCount,
        index: index + 1,
      }));

      const firstScore = progressData[0]?.score || 0;
      const lastScore = progressData[progressData.length - 1]?.score || 0;
      const improvement = lastScore - firstScore;
      const avgScore = progressData.reduce((sum, p) => sum + p.score, 0) / progressData.length;

      return NextResponse.json({
        hasData: true,
        progress: progressData,
        summary: {
          totalPractices: analyses.length,
          firstScore,
          currentScore: lastScore,
          improvement,
          averageScore: Math.round(avgScore * 10) / 10,
          trend: improvement > 0 ? 'improving' : improvement < 0 ? 'declining' : 'stable',
        },
      });
    }

    // Weakness report - aggregate issues
    const totals = {
      grammar: 0,
      vocabulary: 0,
      structure: 0,
      content: 0,
      style: 0,
      contractions: 0,
      missingOrgWords: 0,
      lackSpecificDetails: 0,
      missingClosing: 0,
    };

    analyses.forEach(a => {
      totals.grammar += a.grammarIssues;
      totals.vocabulary += a.vocabularyIssues;
      totals.structure += a.structureIssues;
      totals.content += a.contentIssues;
      totals.style += a.styleIssues;
      if (a.hasContractions) totals.contractions++;
      if (!a.hasOrgWords) totals.missingOrgWords++;
      if (!a.hasSpecificDetails) totals.lackSpecificDetails++;
      if (!a.hasProperClosing) totals.missingClosing++;
    });

    // Sort by frequency to find top weaknesses
    const categories = [
      { id: 'grammar', label: 'Grammar', count: totals.grammar, icon: '📝' },
      { id: 'vocabulary', label: 'Vocabulary', count: totals.vocabulary, icon: '📚' },
      { id: 'structure', label: 'Structure', count: totals.structure, icon: '🏗️' },
      { id: 'content', label: 'Content', count: totals.content, icon: '💡' },
      { id: 'style', label: 'Style', count: totals.style, icon: '✨' },
    ].sort((a, b) => b.count - a.count);

    const patterns = [
      { id: 'contractions', label: 'Using contractions', count: totals.contractions, tip: 'Always write "do not" instead of "don\'t"' },
      { id: 'org-words', label: 'Missing organization words', count: totals.missingOrgWords, tip: 'Use First, Second, Finally to structure your text' },
      { id: 'specific-details', label: 'Lacking specific details', count: totals.lackSpecificDetails, tip: 'Add names, dates, numbers to make it real' },
      { id: 'closing', label: 'Missing proper closing', count: totals.missingClosing, tip: 'End with "Please let me know if you require..."' },
    ].filter(p => p.count > 0).sort((a, b) => b.count - a.count);

    // Generate AI insight if enough data
    let aiInsight = null;
    if (analyses.length >= 3) {
      const recentTexts = analyses.slice(0, 3).map(a => a.content).join('\n---\n');
      
      try {
        const completion = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            { 
              role: 'system', 
              content: `You are a CELPIP writing coach. Analyze patterns across multiple student writings.
Give ONE specific, actionable piece of advice (max 2 sentences).
Focus on the most impactful improvement they can make.
Be encouraging but direct.` 
            },
            { 
              role: 'user', 
              content: `Here are 3 recent writings from the same student. Their scores were: ${analyses.slice(0, 3).map(a => a.aiScore).join(', ')}/12.

What's the ONE thing they should focus on to improve?

${recentTexts}` 
            }
          ],
          temperature: 0.5,
          max_tokens: 150,
        });

        aiInsight = completion.choices[0].message.content;
      } catch (e) {
        console.error('AI insight error:', e);
      }
    }

    return NextResponse.json({
      hasData: true,
      practiceCount: analyses.length,
      avgScore: Math.round(analyses.reduce((sum, a) => sum + a.aiScore, 0) / analyses.length * 10) / 10,
      topWeaknesses: categories.slice(0, 3).filter(c => c.count > 0),
      patterns,
      aiInsight,
      lastPractice: analyses[0].createdAt,
    });

  } catch (error) {
    console.error('Get report error:', error);
    return NextResponse.json(
      { error: 'Failed to generate report' },
      { status: 500 }
    );
  }
}
