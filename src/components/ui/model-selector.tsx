'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { ChevronDown, Cpu, Sparkles, Zap, Brain } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import { api } from '@/utils/api';

interface ModelSelectorProps {
  selectedModel: string;
  onModelChange: (model: string) => void;
  variant?: 'compact' | 'full';
  disabled?: boolean;
}

const MODEL_ICONS = {
  'gpt-4o': Sparkles,
  'gpt-4o-mini': Zap,
  'gpt-3.5-turbo': Cpu,
  'gpt-4': Brain,
} as const;

export function ModelSelector({ 
  selectedModel, 
  onModelChange, 
  variant = 'compact',
  disabled = false 
}: ModelSelectorProps) {
  const t = useTranslations('taskComponents.modelSelector');
  const { data: availableModels, isLoading } = api.ai.getAvailableModels.useQuery();

  if (isLoading || !availableModels) {
    return null;
  }

  const currentModel = availableModels.find(model => model.id === selectedModel);
  const currentModelName = currentModel ? t(`models.${currentModel.id}.name`) : selectedModel;

  if (variant === 'compact') {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            disabled={disabled}
            className="h-8 px-2 text-xs"
          >
            <div className="flex items-center gap-1.5">
              {currentModel && MODEL_ICONS[currentModel.id as keyof typeof MODEL_ICONS] && (
                <div className="w-3 h-3 flex items-center justify-center">
                  {(() => {
                    const Icon = MODEL_ICONS[currentModel.id as keyof typeof MODEL_ICONS];
                    return <Icon className="w-3 h-3" />;
                  })()}
                </div>
              )}
              <span className="max-w-[100px] truncate">
                {currentModelName}
              </span>
              <ChevronDown className="w-3 h-3 opacity-50" />
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <DropdownMenuLabel>{t('selectModel')}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          {/* Premium Models */}
          {availableModels.filter(model => model.category === 'premium').length > 0 && (
            <>
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                {t('categories.premium')}
              </DropdownMenuLabel>
              {availableModels
                .filter(model => model.category === 'premium')
                .map((model) => {
                  const Icon = MODEL_ICONS[model.id as keyof typeof MODEL_ICONS];
                  return (
                    <DropdownMenuItem
                      key={model.id}
                      onClick={() => onModelChange(model.id)}
                      className={cn(
                        "flex items-start gap-3 p-3",
                        selectedModel === model.id && "bg-accent"
                      )}
                    >
                      <div className="w-4 h-4 flex items-center justify-center mt-0.5">
                        {Icon && <Icon className="w-4 h-4" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">
                            {t(`models.${model.id}.name`)}
                          </span>
                          <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                            {t('categories.premium')}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {t(`models.${model.id}.description`)}
                        </p>
                      </div>
                      {selectedModel === model.id && (
                        <div className="w-2 h-2 bg-primary rounded-full mt-1" />
                      )}
                    </DropdownMenuItem>
                  );
                })}
              <DropdownMenuSeparator />
            </>
          )}

          {/* Standard Models */}
          {availableModels.filter(model => model.category === 'standard').length > 0 && (
            <>
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                {t('categories.standard')}
              </DropdownMenuLabel>
              {availableModels
                .filter(model => model.category === 'standard')
                .map((model) => {
                  const Icon = MODEL_ICONS[model.id as keyof typeof MODEL_ICONS];
                  return (
                    <DropdownMenuItem
                      key={model.id}
                      onClick={() => onModelChange(model.id)}
                      className={cn(
                        "flex items-start gap-3 p-3",
                        selectedModel === model.id && "bg-accent"
                      )}
                    >
                      <div className="w-4 h-4 flex items-center justify-center mt-0.5">
                        {Icon && <Icon className="w-4 h-4" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">
                            {t(`models.${model.id}.name`)}
                          </span>
                          <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                            {t('categories.standard')}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {t(`models.${model.id}.description`)}
                        </p>
                      </div>
                      {selectedModel === model.id && (
                        <div className="w-2 h-2 bg-primary rounded-full mt-1" />
                      )}
                    </DropdownMenuItem>
                  );
                })}
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Full variant - expanded card view
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Cpu className="w-5 h-5" />
          {t('title')}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {t('description')}
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {availableModels.map((model) => {
          const Icon = MODEL_ICONS[model.id as keyof typeof MODEL_ICONS];
          const isSelected = selectedModel === model.id;
          
          return (
            <div
              key={model.id}
              onClick={() => onModelChange(model.id)}
              className={cn(
                "flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors",
                isSelected 
                  ? "border-primary bg-primary/5" 
                  : "border-border hover:border-primary/50 hover:bg-accent/50",
                disabled && "cursor-not-allowed opacity-50"
              )}
            >
              <div className="w-5 h-5 flex items-center justify-center mt-0.5">
                {Icon && <Icon className="w-5 h-5" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium">
                    {t(`models.${model.id}.name`)}
                  </span>
                  <Badge 
                    variant={model.category === 'premium' ? 'secondary' : 'outline'}
                    className="text-xs"
                  >
                    {t(`categories.${model.category}`)}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {t(`models.${model.id}.description`)}
                </p>
              </div>
              {isSelected && (
                <div className="w-3 h-3 bg-primary rounded-full mt-1" />
              )}
            </div>
          );
        })}
        
        {currentModel && (
          <div className="pt-2 border-t">
            <p className="text-sm text-muted-foreground">
              {t('currentModel', { modelName: currentModelName })}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}