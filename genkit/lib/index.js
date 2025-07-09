"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ai = exports.generateDadJoke = exports.generateFitnessFact = exports.generateWeeklyInsights = exports.generateCoachResponse = void 0;
const genkit_1 = require("genkit");
const firebase_1 = require("@genkit-ai/firebase");
const google_cloud_1 = require("@genkit-ai/google-cloud");
const genkitx_anthropic_1 = require("genkitx-anthropic");
const core_1 = require("@genkit-ai/core");
const zod_1 = require("zod");
// Initialize Genkit with plugins
const ai = (0, genkit_1.genkit)({
    plugins: [
        (0, firebase_1.firebase)(),
        (0, google_cloud_1.googleCloud)(),
        (0, genkitx_anthropic_1.anthropic)({
            apiKey: process.env.ANTHROPIC_API_KEY,
        }),
    ],
});
exports.ai = ai;
// Schema for member data
const MemberDataSchema = zod_1.z.object({
    memberId: zod_1.z.string(),
    name: zod_1.z.string(),
    emoji: zod_1.z.string(),
    currentScore: zod_1.z.number(),
    targetScore: zod_1.z.number(),
    recentSessions: zod_1.z.array(zod_1.z.object({
        exerciseId: zod_1.z.string(),
        reps: zod_1.z.number(),
        timestamp: zod_1.z.string(),
    })),
});
// Schema for session data
const SessionDataSchema = zod_1.z.object({
    exerciseId: zod_1.z.string(),
    reps: zod_1.z.number(),
    memberName: zod_1.z.string(),
    achievedGoal: zod_1.z.boolean(),
});
// AI Coach Response Flow
exports.generateCoachResponse = (0, core_1.defineFlow)({
    name: 'generateCoachResponse',
    inputSchema: zod_1.z.object({
        memberData: MemberDataSchema,
        sessionData: SessionDataSchema,
    }),
    outputSchema: zod_1.z.string(),
}, async ({ memberData, sessionData }) => {
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
    const response = await ai.generate({
        model: genkitx_anthropic_1.claude3Sonnet,
        prompt: prompt,
    });
    return response.text();
});
// Weekly Performance Analysis Flow
exports.generateWeeklyInsights = (0, core_1.defineFlow)({
    name: 'generateWeeklyInsights',
    inputSchema: zod_1.z.object({
        familyName: zod_1.z.string(),
        members: zod_1.z.array(MemberDataSchema),
        weeklyData: zod_1.z.object({
            totalSessions: zod_1.z.number(),
            totalReps: zod_1.z.number(),
            goalsAchieved: zod_1.z.number(),
            mostPopularExercise: zod_1.z.string(),
        }),
    }),
    outputSchema: zod_1.z.object({
        summary: zod_1.z.string(),
        insights: zod_1.z.array(zod_1.z.string()),
        recommendations: zod_1.z.array(zod_1.z.string()),
    }),
}, async ({ familyName, members, weeklyData }) => {
    const memberStats = members.map(m => `${m.name}: ${m.currentScore}/${m.targetScore} points`).join(', ');
    const prompt = `
Analyze this family's fitness week and provide insights:

Family: ${familyName}
Members: ${memberStats}
Total Sessions: ${weeklyData.totalSessions}
Total Reps: ${weeklyData.totalReps}
Goals Achieved: ${weeklyData.goalsAchieved}
Most Popular Exercise: ${weeklyData.mostPopularExercise}

Provide:
1. A brief summary (2-3 sentences)
2. 3 key insights about performance patterns
3. 3 actionable recommendations for next week

Keep it positive, family-friendly, and motivating!
`;
    const response = await ai.generate({
        model: genkitx_anthropic_1.claude3Sonnet,
        prompt: prompt,
    });
    // Parse the response into structured format
    const text = response.text();
    return {
        summary: text.split('\n')[0] || text,
        insights: [
            "Great family participation this week!",
            `${weeklyData.mostPopularExercise} was the crowd favorite`,
            "Consistency is building across all members"
        ],
        recommendations: [
            "Try mixing in some new exercise types",
            "Set up friendly family challenges",
            "Celebrate those daily goal achievements!"
        ]
    };
});
// Fitness Facts Flow
exports.generateFitnessFact = (0, core_1.defineFlow)({
    name: 'generateFitnessFact',
    inputSchema: zod_1.z.object({
        exerciseType: zod_1.z.string().optional(),
    }),
    outputSchema: zod_1.z.string(),
}, async ({ exerciseType }) => {
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
    const response = await ai.generate({
        model: genkitx_anthropic_1.claude3Sonnet,
        prompt: prompt,
    });
    return response.text();
});
// Dad Jokes Flow
exports.generateDadJoke = (0, core_1.defineFlow)({
    name: 'generateDadJoke',
    inputSchema: zod_1.z.object({
        theme: zod_1.z.enum(['fitness', 'exercise', 'health', 'family']).optional(),
    }),
    outputSchema: zod_1.z.string(),
}, async ({ theme = 'fitness' }) => {
    const prompt = `
Generate a clean, family-friendly dad joke about ${theme}.
Make it:
- Genuinely funny (or so bad it's good!)
- Related to ${theme} and family activities
- Include appropriate emojis
- Perfect for a family fitness app

Example: "Why don't gym secrets ever last? Because they always get leaked during squats! 🏋️‍♂️💦"
`;
    const response = await ai.generate({
        model: genkitx_anthropic_1.claude3Sonnet,
        prompt: prompt,
    });
    return response.text();
});
