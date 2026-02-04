'use client';

/**
 * Thank You Page
 * Displayed after successful application submission
 * Shows unique application ID and next steps for the candidate
 */

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle2, Copy, Mail, Clock } from 'lucide-react';
import { useState } from 'react';

export default function ThankYouPage() {
  // Get application ID from URL params
  const { applicationId } = useParams() as { applicationId: string };
  const [copied, setCopied] = useState(false);

  /**
   * Copy application ID to clipboard
   */
  const handleCopyApplicationId = () => {
    navigator.clipboard.writeText(applicationId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Success Card */}
        <Card className="p-8 md:p-12 text-center">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-green-100 dark:bg-green-950 rounded-full">
              <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-400" />
            </div>
          </div>

          {/* Main Message */}
          <h1 className="text-3xl md:text-4xl font-bold mb-3 text-foreground">
            Application Submitted!
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Thank you for your interest. We've received your application and will
            review it shortly.
          </p>

          {/* Application ID Section */}
          <Card className="bg-muted p-6 mb-8">
            <p className="text-sm text-muted-foreground mb-2">
              Your Application ID
            </p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <code className="text-xl font-mono font-bold text-foreground break-all">
                {applicationId}
              </code>
              <Button
                onClick={handleCopyApplicationId}
                variant="outline"
                size="sm"
                aria-label="Copy application ID"
              >
                <Copy className="w-4 h-4 mr-2" />
                {copied ? 'Copied!' : 'Copy'}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Save this ID for your records. You can use it to check your application status.
            </p>
          </Card>

          {/* Next Steps */}
          <div className="bg-card border rounded-lg p-6 mb-8 text-left">
            <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              What Happens Next?
            </h2>
            <ol className="space-y-3">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                  1
                </span>
                <div>
                  <p className="font-medium text-foreground">Initial Review</p>
                  <p className="text-sm text-muted-foreground">
                    Our team will review your application within 1-2 weeks.
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                  2
                </span>
                <div>
                  <p className="font-medium text-foreground">Assessment</p>
                  <p className="text-sm text-muted-foreground">
                    If you match our criteria, we'll contact you for the next stage.
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                  3
                </span>
                <div>
                  <p className="font-medium text-foreground">Interview</p>
                  <p className="text-sm text-muted-foreground">
                    We'll schedule a meeting to discuss the role further.
                  </p>
                </div>
              </li>
            </ol>
          </div>

          {/* Contact Information */}
          <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800 p-4 mb-8">
            <div className="flex gap-3">
              <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="text-left">
                <p className="font-medium text-blue-900 dark:text-blue-100">
                  Check your email
                </p>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  We'll send you updates about your application status via email.
                </p>
              </div>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/jobs">
              <Button variant="outline" className="w-full sm:w-auto bg-transparent">
                Browse More Jobs
              </Button>
            </Link>
            <Link href="/">
              <Button className="w-full sm:w-auto">
                Return to Home
              </Button>
            </Link>
          </div>
        </Card>

        {/* Footer Note */}
        <div className="text-center mt-8 text-sm text-muted-foreground">
          <p>
            Questions? Contact us at{' '}
            <a
              href="mailto:careers@hirelink.com"
              className="text-primary hover:underline"
            >
              careers@hirelink.com
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
