/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Resume Upload Step (Step 3 of 3)
 * Handles PDF/DOC file upload with validation
 * Displays file information and submission readiness
 */

'use client';

import React from "react"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useHireLinkStore } from '@/lib/store';
import { validateResume, generateApplicationId } from '@/lib/validation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AlertCircle, FileUp, CheckCircle2, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ResumeStepProps {
  onBack: () => void;
}

export function ResumeStep({ onBack }: ResumeStepProps) {
  // Get form data and functions from global store
  const applicationForm = useHireLinkStore((state) => state.applicationForm);
  const setApplicationForm = useHireLinkStore((state) => state.setApplicationForm);
  const selectedJobId = useHireLinkStore((state) => state.selectedJobId);
  const jobPostings = useHireLinkStore((state) => state.jobPostings);
  const addCandidate = useHireLinkStore((state) => state.addCandidate);

  // Local state for errors and submission
  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const { resumeFile, resumeFileName } = applicationForm;

  /**
   * Handle file selection from input
   */
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate the file
    const validation = validateResume(file);
    if (!validation.valid) {
      setError(validation.error || 'Invalid file');
      return;
    }

    // Clear previous errors and update form
    setError('');
    setApplicationForm({
      resumeFile: file,
      resumeFileName: file.name,
    });
  };

  /**
   * Handle file drag and drop
   */
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  /**
   * Handle file drop
   */
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    // Validate the file
    const validation = validateResume(file);
    if (!validation.valid) {
      setError(validation.error || 'Invalid file');
      return;
    }

    // Clear previous errors and update form
    setError('');
    setApplicationForm({
      resumeFile: file,
      resumeFileName: file.name,
    });
  };

  /**
   * Remove the selected file
   */
  const handleRemoveFile = () => {
    setApplicationForm({
      resumeFile: null,
      resumeFileName: '',
    });
    setError('');
  };

  /**
   * Submit the entire application
   */
  const handleSubmit = async () => {
    // Validate resume before submission
    const validation = validateResume(resumeFile);
    if (!validation.valid) {
      setError(validation.error || 'Resume is required');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Generate unique application ID
      const applicationId = generateApplicationId();

      // Find the selected job posting
      const selectedJob = jobPostings.find((j) => j.id === selectedJobId);
      if (!selectedJob) {
        throw new Error('Job posting not found');
      }

      // Create candidate record with all application data
      const candidate = {
        id: Math.random().toString(36).substr(2, 9),
        applicationId,
        jobId: selectedJobId || '',
        jobTitle: selectedJob.title,
        applicationData: applicationForm,
        appliedDate: new Date().toISOString(),
        stage: 'Applied' as const,
        notes: '',
      };

      // Store candidate in global state
      addCandidate(candidate);

      // Navigate to thank you page with application ID
      router.push(`/thank-you/${applicationId}`);
    } catch (err) {
      setError('Failed to submit application. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2 text-foreground">Upload Resume</h2>
        <p className="text-muted-foreground">
          Complete your application by uploading your resume
        </p>
      </div>

      <Card className="p-6">
        <div className="space-y-5">
          {/* File Upload Area */}
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
          >
            <input
              type="file"
              onChange={handleFileSelect}
              accept=".pdf,.doc,.docx"
              className="hidden"
              id="resume-upload"
              aria-label="Upload resume file"
            />
            <label
              htmlFor="resume-upload"
              className="cursor-pointer flex flex-col items-center gap-2"
            >
              {resumeFile ? (
                <>
                  <CheckCircle2 className="w-10 h-10 text-green-500" />
                  <p className="font-medium text-foreground">File Selected</p>
                  <p className="text-sm text-muted-foreground">{resumeFileName}</p>
                </>
              ) : (
                <>
                  <FileUp className="w-10 h-10 text-muted-foreground" />
                  <p className="font-medium text-foreground">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-sm text-muted-foreground">
                    PDF, DOC, or DOCX (Max 5MB)
                  </p>
                </>
              )}
            </label>
          </div>

          {/* File Information */}
          {resumeFile && (
            <Card className="bg-green-50 dark:bg-green-950 p-4 border-green-200 dark:border-green-800">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium text-green-900 dark:text-green-100">
                    Resume ready to upload
                  </p>
                  <p className="text-sm text-green-800 dark:text-green-200">
                    File: {resumeFileName}
                  </p>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    Size: {(resumeFile.size / 1024).toFixed(2)} KB
                  </p>
                </div>
                <Button
                  onClick={handleRemoveFile}
                  variant="outline"
                  size="sm"
                  className="mt-1 bg-transparent"
                >
                  Remove
                </Button>
              </div>
            </Card>
          )}

          {/* Error Message */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* File Requirements */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <ul className="list-disc list-inside space-y-1">
                <li>Accepted formats: PDF, DOC, DOCX</li>
                <li>Maximum file size: 5MB</li>
                <li>Make sure your resume is clear and up to date</li>
              </ul>
            </AlertDescription>
          </Alert>
        </div>
      </Card>

      {/* Navigation and Submit Buttons */}
      <div className="flex gap-3">
        <Button onClick={onBack} variant="outline" className="flex-1 bg-transparent">
          Back
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!resumeFile || isSubmitting}
          className="flex-1"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Submitting...
            </>
          ) : (
            'Submit Application'
          )}
        </Button>
      </div>
    </div>
  );
}
