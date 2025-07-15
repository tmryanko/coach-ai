import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY environment variable');
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const SYSTEM_PROMPT = `You are an expert AI relationship coach with deep expertise in psychology, communication, and relationship dynamics. Your role is to provide personalized, empathetic, and actionable guidance to help users improve their romantic relationships.

Core Principles:
- Always be supportive, non-judgmental, and empathetic
- Focus on practical, actionable advice rather than generic statements
- Encourage healthy communication and emotional intelligence
- Respect boundaries and promote mutual respect in relationships
- Be mindful of different relationship styles and cultural backgrounds
- Never provide advice that could harm or endanger someone

Your Approach:
1. Listen actively to understand the user's specific situation
2. Ask clarifying questions when needed to provide better guidance
3. Provide concrete examples and techniques they can try
4. Encourage self-reflection and personal growth
5. Help users identify patterns in their relationships
6. Suggest communication scripts when appropriate
7. Recommend resources for further learning when relevant

Areas of Expertise:
- Communication skills and conflict resolution
- Emotional intelligence and regulation
- Building trust and intimacy
- Managing expectations and boundaries
- Dealing with common relationship challenges
- Personal growth within relationships
- Attachment styles and their impact
- Love languages and connection styles

Remember to:
- Keep responses conversational and warm
- Use "I" statements when giving advice to make it less prescriptive
- Validate the user's feelings and experiences
- Encourage professional therapy when appropriate for serious issues
- Maintain confidentiality and create a safe space for sharing

If a user shares something concerning (abuse, violence, severe mental health crisis), gently encourage them to seek professional help immediately.`;

export async function generateCoachResponse(
  userMessage: string,
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }> = [],
  context?: {
    userProgress?: any;
    currentTask?: any;
    programPhase?: string;
  }
) {
  try {
    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      { role: 'system', content: SYSTEM_PROMPT },
    ];

    // Add context if available
    if (context) {
      let contextMessage = '';
      
      if (context.currentTask) {
        contextMessage += `Current task: ${context.currentTask.title} - ${context.currentTask.description}\n`;
      }
      
      if (context.programPhase) {
        contextMessage += `Program phase: ${context.programPhase}\n`;
      }
      
      if (context.userProgress) {
        contextMessage += `User progress: ${context.userProgress.completedTasks}/${context.userProgress.totalTasks} tasks completed\n`;
      }

      if (contextMessage) {
        messages.push({
          role: 'system',
          content: `Context for this conversation:\n${contextMessage}\nPlease incorporate this context into your response when relevant.`,
        });
      }
    }

    // Add conversation history (limit to last 10 messages to avoid token limits)
    const recentHistory = conversationHistory.slice(-10);
    for (const msg of recentHistory) {
      messages.push({ role: msg.role, content: msg.content });
    }

    // Add current user message
    messages.push({ role: 'user', content: userMessage });

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      max_tokens: 800,
      temperature: 0.7,
      presence_penalty: 0.1,
      frequency_penalty: 0.1,
    });

    return completion.choices[0]?.message?.content || 'I apologize, but I had trouble generating a response. Could you please try again?';
  } catch (error) {
    console.error('Error generating AI response:', error);
    throw new Error('Failed to generate AI response');
  }
}

export async function generateTaskFeedback(
  taskDescription: string,
  userResponse: string,
  taskType: string
) {
  try {
    const feedbackPrompt = `As a relationship coach, provide constructive feedback on the user's response to this ${taskType.toLowerCase()} task.

Task: ${taskDescription}

User's Response: ${userResponse}

Please provide:
1. Positive acknowledgments of what they did well
2. Constructive suggestions for improvement
3. Encouragement for their next steps
4. Any insights about their relationship patterns you notice

Keep the feedback supportive, specific, and actionable. Limit to 200 words.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: feedbackPrompt },
      ],
      max_tokens: 300,
      temperature: 0.6,
    });

    return completion.choices[0]?.message?.content || 'Thank you for completing this task. Keep up the great work!';
  } catch (error) {
    console.error('Error generating task feedback:', error);
    throw new Error('Failed to generate task feedback');
  }
}