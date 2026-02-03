'use client';

/**
 * HireLink Landing Page
 * Allows users to choose between candidate and recruiter roles
 */

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useHireLinkStore } from '../lib/store';
import { Briefcase, ClipboardList } from 'lucide-react';

export default function Home() {
  // Get the setUserRole function from our state management store
  const setUserRole = useHireLinkStore((state) => state.setUserRole);

  return (
    <main className="min-h-screen flex items-center justify-center bg-linear-to-br from-background to-muted p-4">
      <div className="w-full max-w-5xl">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Welcome to HireLink
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Your intelligent hiring platform for seamless recruitment. Choose your role to get started.
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Candidate Card */}
          <Card className="flex flex-col items-center justify-center p-8 hover:shadow-lg transition-shadow">
            <div className="mb-6 p-4 bg-primary/10 rounded-lg">
              <ClipboardList className="w-12 h-12 text-primary" />
            </div>
            <h2 className="text-2xl font-semibold mb-2 text-foreground">
              I&apos;m a Candidate
            </h2>
            <p className="text-center text-muted-foreground mb-6">
              Browse open positions and submit your application to land your next great opportunity.
            </p>
            <Link href="/jobs" onClick={() => setUserRole('candidate')}>
              <Button className="w-full">
                Browse Jobs
              </Button>
            </Link>
          </Card>

          {/* Recruiter Card */}
          <Card className="flex flex-col items-center justify-center p-8 hover:shadow-lg transition-shadow">
            <div className="mb-6 p-4 bg-primary/10 rounded-lg">
              <Briefcase className="w-12 h-12 text-primary" />
            </div>
            <h2 className="text-2xl font-semibold mb-2 text-foreground">
              I&apos;m a Recruiter
            </h2>
            <p className="text-center text-muted-foreground mb-6">
              Manage candidates, review applications, and make hiring decisions efficiently.
            </p>
            <Link href="/dashboard" onClick={() => setUserRole('recruiter')}>
              <Button className="w-full">
                Go to Dashboard
              </Button>
            </Link>
          </Card>
        </div>

        {/* Footer Info */}
        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p>HireLink - Streamlining the hiring process for everyone</p>
        </div>
      </div>
    </main>
  );
}
