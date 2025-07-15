import { PrismaClient, TaskType } from '@prisma/client';

const prisma = new PrismaClient();

export const seedData = async () => {
  // Create a sample coaching program
  const program = await prisma.coachingProgram.create({
    data: {
      name: 'Communication Mastery',
      description: 'Learn effective communication skills to strengthen your relationship through better understanding, active listening, and conflict resolution.',
      duration: 21,
      phases: {
        create: [
          {
            name: 'Foundation Building',
            description: 'Establish the basics of healthy communication',
            order: 1,
            tasks: {
              create: [
                {
                  title: 'Reflect on Your Communication Style',
                  description: 'Take some time to think about how you typically communicate in your relationship. What patterns do you notice? What works well, and what could be improved?',
                  type: TaskType.REFLECTION,
                  order: 1,
                  content: {
                    prompts: [
                      'How do you typically express your needs and feelings?',
                      'What happens when you disagree with your partner?',
                      'What communication habits would you like to change?'
                    ]
                  }
                },
                {
                  title: 'Active Listening Practice',
                  description: 'Practice active listening with your partner for 10 minutes. Focus entirely on understanding their perspective without planning your response.',
                  type: TaskType.EXERCISE,
                  order: 2,
                  content: {
                    instructions: [
                      'Set aside 10 minutes of uninterrupted time',
                      'Ask your partner to share something on their mind',
                      'Listen without interrupting or giving advice',
                      'Reflect back what you heard to confirm understanding'
                    ]
                  }
                },
                {
                  title: 'Communication Assessment',
                  description: 'Complete this assessment to identify your communication strengths and areas for growth.',
                  type: TaskType.ASSESSMENT,
                  order: 3,
                  content: {
                    questions: [
                      'How often do you feel truly heard by your partner?',
                      'How comfortable are you expressing difficult emotions?',
                      'How do you handle disagreements?'
                    ]
                  }
                }
              ]
            }
          },
          {
            name: 'Conflict Resolution',
            description: 'Learn healthy ways to navigate disagreements and conflicts',
            order: 2,
            tasks: {
              create: [
                {
                  title: 'Identify Conflict Patterns',
                  description: 'Reflect on recent conflicts in your relationship. What patterns do you notice in how conflicts typically unfold?',
                  type: TaskType.REFLECTION,
                  order: 1,
                  content: {
                    prompts: [
                      'What typically triggers conflicts in your relationship?',
                      'How do you both usually respond to conflict?',
                      'What would healthy conflict resolution look like for you?'
                    ]
                  }
                },
                {
                  title: 'Practice the "I" Statement Technique',
                  description: 'Practice expressing your feelings using "I" statements instead of "you" statements to reduce defensiveness.',
                  type: TaskType.EXERCISE,
                  order: 2,
                  content: {
                    technique: 'I feel [emotion] when [situation] because [reason]. I need [request].',
                    examples: [
                      'Instead of: "You never listen to me"',
                      'Try: "I feel unheard when I\'m interrupted because it makes me feel like my thoughts don\'t matter. I need us to take turns speaking."'
                    ]
                  }
                }
              ]
            }
          },
          {
            name: 'Emotional Intelligence',
            description: 'Develop emotional awareness and regulation skills',
            order: 3,
            tasks: {
              create: [
                {
                  title: 'Daily Emotion Check-ins',
                  description: 'For the next week, practice checking in with your emotions throughout the day and sharing them with your partner.',
                  type: TaskType.EXERCISE,
                  order: 1,
                  content: {
                    schedule: 'Set 3 daily reminders to check in with your emotions',
                    sharing: 'Share your emotional state with your partner once daily',
                    reflection: 'Notice how emotional awareness affects your relationship'
                  }
                },
                {
                  title: 'Relationship Gratitude Journal',
                  description: 'Keep a daily journal of three things you appreciate about your partner and your relationship.',
                  type: TaskType.JOURNALING,
                  order: 2,
                  content: {
                    frequency: 'Daily for 7 days',
                    format: 'Write 3 specific things you appreciate',
                    sharing: 'Consider sharing one appreciation with your partner each day'
                  }
                }
              ]
            }
          }
        ]
      }
    }
  });

  console.log('Seeded coaching program:', program.name);
  return program;
};

export const runSeed = async () => {
  try {
    await seedData();
    console.log('Seeding completed successfully');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await prisma.$disconnect();
  }
};

// Run if called directly
if (require.main === module) {
  runSeed();
}