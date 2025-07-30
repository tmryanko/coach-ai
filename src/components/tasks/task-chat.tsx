'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { api } from '@/utils/api';
import { MessageRole } from '@prisma/client';
import { Bot, User, Send, MessageCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';

interface TaskChatProps {
  taskId: string;
  taskTitle: string;
  onTaskCompletion?: () => void;
}

interface ChatMessage {
  id: string;
  content: string;
  role: MessageRole;
  createdAt: Date;
}

export function TaskChat({ taskId, taskTitle, onTaskCompletion }: TaskChatProps) {
  const t = useTranslations('taskComponents.taskChat');
  const [message, setMessage] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const utils = api.useUtils();
  
  const { data: session, isLoading: sessionLoading } = api.chat.getTaskSession.useQuery(
    { taskId },
    { enabled: isInitialized }
  );

  const createSessionMutation = api.chat.createTaskSession.useMutation({
    onSuccess: () => {
      // Refetch session after creation
      utils.chat.getTaskSession.invalidate({ taskId });
    },
  });

  const sendMessageMutation = api.ai.sendTaskMessage.useMutation({
    onSuccess: () => {
      setMessage('');
      // Refetch session to get new messages
      utils.chat.getTaskSession.invalidate({ taskId });
    },
  });

  const completeSessionMutation = api.chat.completeTaskSession.useMutation({
    onSuccess: () => {
      if (onTaskCompletion) {
        onTaskCompletion();
      }
    },
  });

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [session?.messages]);

  const handleStartChat = async () => {
    setIsInitialized(true);
    if (!session && !createSessionMutation.isPending) {
      try {
        await createSessionMutation.mutateAsync({ taskId });
        setIsExpanded(true);
      } catch (error) {
        console.error('Failed to create chat session:', error);
      }
    } else {
      setIsExpanded(true);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !session?.id || sendMessageMutation.isPending) return;

    try {
      await sendMessageMutation.mutateAsync({
        sessionId: session.id,
        message: message.trim(),
      });
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCompleteSession = async () => {
    if (!session?.id) return;
    
    try {
      await completeSessionMutation.mutateAsync({ sessionId: session.id });
    } catch (error) {
      console.error('Failed to complete session:', error);
    }
  };

  const messages = session?.messages || [];
  const hasMessages = messages.length > 0;

  if (!isInitialized) {
    return (
      <Card className="border-blue-200 dark:border-blue-800">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-medium text-blue-900 dark:text-blue-100">
                  {t('aiCoachAvailable')}
                </h4>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  {t('getPersonalizedGuidance')}
                </p>
              </div>
            </div>
            <Button 
              onClick={handleStartChat}
              disabled={createSessionMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {createSessionMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {t('starting')}
                </>
              ) : (
                <>
                  <MessageCircle className="w-4 h-4 mr-2" />
                  {t('startChat')}
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (sessionLoading) {
    return (
      <Card className="border-blue-200 dark:border-blue-800">
        <CardContent className="p-4">
          <div className="flex items-center justify-center py-4">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            <span className="ml-2 text-blue-700 dark:text-blue-300">{t('loadingChat')}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!isExpanded) {
    return (
      <Card className="border-blue-200 dark:border-blue-800">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-medium text-blue-900 dark:text-blue-100">
                  {t('coachChatReady')}
                </h4>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  {hasMessages ? t('messages', { count: messages.length }) : t('readyToGuide')}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsExpanded(true)}
              >
                {t('openChat')}
              </Button>
              {hasMessages && !session?.isTaskCompleted && (
                <Button 
                  size="sm"
                  onClick={handleCompleteSession}
                  disabled={completeSessionMutation.isPending}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {t('completeTask')}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-blue-200 dark:border-blue-800">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Bot className="w-5 h-5 text-blue-600" />
            {t('aiCoachSession')}
          </CardTitle>
          <div className="flex items-center gap-2">
            {session?.isTaskCompleted && (
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                {t('completed')}
              </Badge>
            )}
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsExpanded(false)}
            >
              {t('minimize')}
            </Button>
          </div>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          {t('focusedCoachingFor', { taskTitle })}
        </p>
      </CardHeader>
      
      <CardContent className="p-0">
        {/* Messages */}
        <ScrollArea className="h-80 px-4">
          <div className="space-y-4 py-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex gap-3",
                  msg.role === MessageRole.USER ? "justify-end" : "justify-start"
                )}
              >
                {msg.role === MessageRole.ASSISTANT && (
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}
                
                <div
                  className={cn(
                    "max-w-[80%] p-3 rounded-lg",
                    msg.role === MessageRole.USER
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  )}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {msg.content}
                  </p>
                </div>
                
                {msg.role === MessageRole.USER && (
                  <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            ))}
            
            {sendMessageMutation.isPending && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {t('coachIsTyping')}
                    </span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
        
        {/* Input */}
        {!session?.isTaskCompleted && (
          <div className="border-t p-4">
            <div className="flex gap-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={t('placeholder')}
                disabled={sendMessageMutation.isPending}
                className="flex-1"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!message.trim() || sendMessageMutation.isPending}
                size="sm"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            
            {hasMessages && (
              <div className="mt-3 flex justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCompleteSession}
                  disabled={completeSessionMutation.isPending}
                  className="text-green-700 border-green-200 hover:bg-green-50 dark:text-green-400 dark:border-green-800 dark:hover:bg-green-900/20"
                >
                  {completeSessionMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {t('completing')}
                    </>
                  ) : (
                    t('readyToCompleteTask')
                  )}
                </Button>
              </div>
            )}
          </div>
        )}
        
        {session?.isTaskCompleted && (
          <div className="border-t p-4 bg-green-50 dark:bg-green-900/20">
            <p className="text-sm text-green-800 dark:text-green-200 text-center">
              {t('sessionCompleted')}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
