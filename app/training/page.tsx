'use client';

import { useAuth } from '@/components/context/AuthProvider';
import { createGame } from '@/lib/firebase/firestore';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import LoginForm from '@/components/LoginForm';
import { TrainingPageComponent } from '@/components/training-page';
import { getLocalFiles } from '@/lib/firebase/storage';
import { MarkdownFile } from '@/lib/projectTypes';

export default async function TrainingPage() {
  const files: MarkdownFile[] = await getLocalFiles();

  return <TrainingPageComponent files={files} />;
}
