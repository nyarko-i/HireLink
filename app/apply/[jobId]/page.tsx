'use client';

/**
 * Multi-Step Application Form Page
 * Displays the three-step application process:
 * 1. Personal Information
 * 2. Experience & Skills
 * 3. Resume Upload
 */

import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useHireLinkStore } from '@/lib/store';
import { PersonalInfoStep } from '@/components/PersonalInfoStep';
import { ExperienceStep } from '@/components/ExperienceStep';
import { ResumeStep } from '@/components/ResumeStep';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ApplicationFormPage() {
  // Get job and form state from store
  const { jobId } = useParams() as { jobId: string };
  const router = useRouter();
  const currentStep = useHireLinkStore((state) => state.currentStep);
  const setCurrentStep = useHireLinkStore((state) => state.setCurrentStep);
  const selectedJobId = useHireLinkStore((state) => state.selectedJobId);
  const jobPostings = useHireLinkStore((state) => state.jobPostings);

  // Check if job exists
  const selectedJob = jobPostings.find((j) => j.id === jobId);

  // Validate that we have a job selected and redirect if necessary
  useEffect(() => {
    if (!selectedJobId || selectedJobId !== jobId) {
      router.push('/jobs');
    }
  }, [selectedJobId, jobId, router]);

  if (!selectedJob) {
    return null;
  }

  // Calculate progress (0%, 33%, 66%, 100%)
  const progressPercentage = ((currentStep + 1) / 3) * 100;

  // Step titles for display
  const stepTitles = [
    'Personal Information',
    'Experience & Skills',
    'Resume Upload',
  ];

  /**
   * Handle moving to next step
   */
  const handleNextStep = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  /**
   * Handle moving to previous step
   */
  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/jobs">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-lg font-semibold text-foreground">
              Apply for {selectedJob.title}
            </h1>
            <p className="text-sm text-muted-foreground">{selectedJob.location}</p>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Progress Section */}
        <Card className="p-6 mb-8">
          <div className="space-y-4">
            {/* Step Counter */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-foreground">
                  Step {currentStep + 1} of 3
                </h2>
                <p className="text-sm text-muted-foreground">
                  {stepTitles[currentStep]}
                </p>
              </div>
              <div className="text-sm text-muted-foreground">
                {Math.round(progressPercentage)}%
              </div>
            </div>

            {/* Progress Bar */}
            <Progress value={progressPercentage} className="h-2" />

            {/* Step Indicators */}
            <div className="flex justify-between">
              {stepTitles.map((title, index) => (
                <div key={index} className="flex flex-col items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                      index <= currentStep
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {index + 1}
                  </div>
                  <p className="text-xs text-muted-foreground text-center max-w-20 truncate">
                    {title}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Form Content - Rendered based on current step */}
        <Card className="p-8 mb-8">
          {currentStep === 0 && <PersonalInfoStep onNext={handleNextStep} />}
          {currentStep === 1 && (
            <ExperienceStep onNext={handleNextStep} onBack={handlePreviousStep} />
          )}
          {currentStep === 2 && <ResumeStep onBack={handlePreviousStep} />}
        </Card>
      </div>
    </main>
  );
}
