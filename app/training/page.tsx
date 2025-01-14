'use client';

import FileSelection from '@/components/keyboard/FileSelection';
import MarkdownViewer from '@/components/keyboard/MarkdownViewer';
import ExamSubmission from '@/components/keyboard/ExamSubmission';
import { KeyboardProvider, useKeyboard } from '@/components/context/KeyboardContext';

function TrainingContent() {
  const { _loading, _viewState, _containerHeight, _selectedFile } = useKeyboard();

  if (_loading) {
    return <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
    </div>;
  }

  const renderContent = () => {
    switch (_viewState) {
      case 'selecting' || 'submitted':
        return <FileSelection />;
      case 'selected' || 'processing':
        return (
          <MarkdownViewer
            content={_selectedFile?.content || ''}
          />
        );
      case 'finished':
        return (
          <>
            <ExamSubmission />
            <div className="mt-4">
              <h2 className="text-xl font-semibold mb-2">Your Typing Performance</h2>
              <p className="text-gray-600 mb-4">
                Green keys indicate good performance, yellow indicates room for improvement,
                and red indicates areas that need practice.
              </p>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-4 flex flex-col" style={{ height: _containerHeight }}>
      <h1 className="text-2xl font-bold mb-4">Training Materials</h1>
      <div className="flex flex-col flex-grow overflow-hidden">
        {renderContent()}
      </div>
    </div>
  );
}

export default function TrainingPage() {
  return (
    <KeyboardProvider>
      <TrainingContent />
    </KeyboardProvider>
  );
}
