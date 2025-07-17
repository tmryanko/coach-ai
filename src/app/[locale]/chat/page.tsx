'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { api } from '@/utils/api';
import { AppLayout } from '@/components/layout/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Send, Plus, MessageCircle } from 'lucide-react';
import { MessageRole } from '@prisma/client';

export default function ChatPage() {
  const { user } = useAuth();
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: sessions, refetch: refetchSessions } = api.chat.getSessions.useQuery(undefined, {
    enabled: typeof window !== 'undefined',
  });
  const { data: currentSession } = api.chat.getSession.useQuery(
    { sessionId: currentSessionId! },
    { enabled: !!currentSessionId && typeof window !== 'undefined' }
  );

  const createSessionMutation = api.chat.createSession.useMutation({
    onSuccess: (newSession) => {
      setCurrentSessionId(newSession.id);
      refetchSessions();
    },
  });

  const sendMessageMutation = api.ai.sendMessage.useMutation({
    onSuccess: () => {
      setMessage('');
      setIsLoading(false);
    },
    onError: () => {
      setIsLoading(false);
    },
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentSession?.messages]);

  const handleSendMessage = async () => {
    if (!message.trim() || !currentSessionId) return;

    setIsLoading(true);
    await sendMessageMutation.mutateAsync({
      sessionId: currentSessionId,
      message: message.trim(),
    });
  };

  const handleCreateSession = () => {
    createSessionMutation.mutate({
      title: 'New Conversation',
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!user) {
    return <div>Please sign in to access chat.</div>;
  }

  return (
    <AppLayout 
      title="AI Coaching Chat"
      description="Have a conversation with your personal AI relationship coach"
      showBackButton={true}
    >
      <div className="flex h-[calc(100vh-200px)] bg-gray-50 dark:bg-gray-900 rounded-lg border">
      {/* Sidebar */}
      <div className="w-80 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <Button onClick={handleCreateSession} className="w-full" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            New Conversation
          </Button>
        </div>
        
        <div className="p-4 space-y-2">
          <h3 className="font-medium text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Recent Conversations
          </h3>
          
          {sessions?.map((session) => (
            <div
              key={session.id}
              onClick={() => setCurrentSessionId(session.id)}
              className={`p-3 rounded-lg cursor-pointer transition-colors ${
                currentSessionId === session.id
                  ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-gray-400" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {session.title || 'Untitled Conversation'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(session.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {currentSessionId ? (
          <>
            {/* Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">Your AI Relationship Coach</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    I&apos;m here to help you with your relationship questions and goals.
                  </p>
                </div>
                <Badge variant="secondary">Online</Badge>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {currentSession?.messages?.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${
                    msg.role === MessageRole.USER ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {msg.role === MessageRole.ASSISTANT && (
                    <Avatar className="w-8 h-8">
                      <AvatarFallback>AI</AvatarFallback>
                    </Avatar>
                  )}
                  
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-2 ${
                      msg.role === MessageRole.USER
                        ? 'bg-blue-600 text-white'
                        : 'bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {new Date(msg.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                  
                  {msg.role === MessageRole.USER && (
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={user.user_metadata?.avatar_url} />
                      <AvatarFallback>
                        {user.user_metadata?.name?.charAt(0) || user.email?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              
              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback>AI</AvatarFallback>
                  </Avatar>
                  <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <div className="flex gap-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message here..."
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!message.trim() || isLoading}
                  size="sm"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <Card className="w-full max-w-md">
              <CardHeader className="text-center">
                <CardTitle>Start a Conversation</CardTitle>
                <CardDescription>
                  Create a new conversation to begin chatting with your AI relationship coach.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={handleCreateSession} className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Start New Conversation
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
      </div>
    </AppLayout>
  );
}