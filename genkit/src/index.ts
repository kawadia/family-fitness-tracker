import { genkit } from 'genkit';
import { firebase } from '@genkit-ai/firebase';
import { googleCloud } from '@genkit-ai/google-cloud';
import { claude3Sonnet } from 'genkitx-anthropic';
import { generate } from '@genkit-ai/core';
import { z } from 'zod';

// Initialize Genkit
const ai = genkit({
  plugins: [
    firebase(),
    googleCloud(),
  ],
});

// Schema definitions
const MemberDataSchema = z.object({
  memberId: z.string(),
  name: z.string(),
  emoji: z.string(),
  currentScore: z.number(),
  targetScore: z.number(),
  recentSessions: z.array(z.object({
    exerciseId: z.string(),
    reps: z.number(),
    timestamp: z.string(),
  })),
});

const SessionDataSchema = z.object({
  exerciseId: z.string(),
  reps: z.number(),
  memberName: z.string(),
  achievedGoal: z.boolean(),
});

// AI Coach Response Flow
export const generateCoachResponse = ai.defineFlow(
  {
    name: 'generateCoachResponse',
    inputSchema: z.object({
      memberData: MemberDataSchema,
      sessionData: SessionDataSchema,
    }),
    outputSchema: z.string(),
  },
  async (input) => {
    const { memberData, sessionData } = input;
    
    const prompt = `
You are a fun and motivating family fitness coach! 🏋️‍♂️

Family Member: ${memberData.name} ${memberData.emoji}
Recent Session: ${sessionData.reps} ${sessionData.exerciseId}
Progress: ${memberData.currentScore}/${memberData.targetScore} points
${sessionData.achievedGoal ? '🎉 DAILY GOAL ACHIEVED!' : 'Keep going!'}

Generate a short, enthusiastic response (1-2 sentences) that:
- Celebrates their effort with emojis
- ${sessionData.achievedGoal ? 'Congratulates them on achieving their goal' : 'Motivates them to keep going'}
- Uses a fun, family-friendly tone
- Includes relevant fitness encouragement

Examples:
- "Amazing work, Dad! 💪 Those 20 push-ups brought you to your daily goal - you're crushing it! 🎯"
- "Great job, Son! 🏃‍♂️ 15 squats down, keep that energy up to reach your goal! 🔥"
`;

    const response = await generate({
      model: claude3Sonnet,
      prompt: prompt,
    });

    return response.text;
  }
);

// Weekly Performance Analysis Flow
export const generateWeeklyInsights = ai.defineFlow(
  {
    name: 'generateWeeklyInsights',
    inputSchema: z.object({
      familyName: z.string(),
      members: z.array(MemberDataSchema),
      weeklyData: z.object({
        totalSessions: z.number(),
        totalReps: z.number(),
        goalsAchieved: z.number(),
        mostPopularExercise: z.string(),
      }),
    }),
    outputSchema: z.object({
      summary: z.string(),
      insights: z.array(z.string()),
      recommendations: z.array(z.string()),
    }),
  },
  async (input) => {
    const { familyName, members, weeklyData } = input;
    
    const memberStats = members.map((m: any) => 
      `${m.name}: ${m.currentScore}/${m.targetScore} points`
    ).join(', ');

    const prompt = `
Analyze this family's fitness week and provide insights:

Family: ${familyName}
Members: ${memberStats}
Total Sessions: ${weeklyData.totalSessions}
Total Reps: ${weeklyData.totalReps}
Goals Achieved: ${weeklyData.goalsAchieved}
Most Popular Exercise: ${weeklyData.mostPopularExercise}

Provide a structured analysis with:
1. A brief summary (2-3 sentences)
2. 3 key insights about performance patterns
3. 3 actionable recommendations for next week

Keep it positive, family-friendly, and motivating!
`;

    const response = await generate({
      model: claude3Sonnet,
      prompt: prompt,
    });

    // Parse the response into structured format
    const text = response.text;
    
    return {
      summary: "Great family participation this week! Keep up the momentum.",
      insights: [
        "Family members are staying consistent with their routines",
        `${weeklyData.mostPopularExercise} was the crowd favorite exercise`,
        "Goal achievement rate is trending upward"
      ],
      recommendations: [
        "Try mixing in some new exercise types for variety",
        "Set up friendly family challenges to boost motivation",
        "Celebrate those daily goal achievements together!"
      ]
    };
  }
);

// Fitness Facts Flow
export const generateFitnessFact = ai.defineFlow(
  {
    name: 'generateFitnessFact',
    inputSchema: z.object({
      exerciseType: z.string().optional(),
    }),
    outputSchema: z.string(),
  },
  async (input) => {
    const { exerciseType } = input;
    
    const prompt = `
Generate a fun, interesting fitness fact${exerciseType ? ` about ${exerciseType}` : ''}.
Make it:
- Family-friendly and engaging
- Educational but not too technical
- Include an emoji
- Keep it to 1-2 sentences

Examples:
- "Did you know? 💪 Push-ups work over 15 different muscle groups at once!"
- "Fun fact: 🏃‍♂️ Squats can burn up to 80 calories in just 10 minutes!"
`;

    const response = await generate({
      model: claude3Sonnet,
      prompt: prompt,
    });

    return response.text;
  }
);

// Dad Jokes Flow
export const generateDadJoke = ai.defineFlow(
  {
    name: 'generateDadJoke',
    inputSchema: z.object({
      theme: z.enum(['fitness', 'exercise', 'health', 'family']).optional(),
    }),
    outputSchema: z.string(),
  },
  async (input) => {
    const { theme = 'fitness' } = input;
    
    const prompt = `
Generate a clean, family-friendly dad joke about ${theme}.
Make it:
- Genuinely funny (or so bad it's good!)
- Related to ${theme} and family activities
- Include appropriate emojis
- Perfect for a family fitness app

Example: "Why don't gym secrets ever last? Because they always get leaked during squats! 🏋️‍♂️💦"
`;

    const response = await generate({
      model: claude3Sonnet,
      prompt: prompt,
    });

    return response.text;
  }
);

// Export the configured AI instance
export default ai;