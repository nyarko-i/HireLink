'use client';

/**
 * Recruiter Dashboard - Pipeline Board
 * Displays candidates in a kanban-style pipeline with stages:
 * Applied, Reviewed, Interview Scheduled, Offer Sent
 */

import Link from 'next/link';
import { useHireLinkStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Plus } from 'lucide-react';
import { useState } from 'react';
import { PipelineBoard } from '@/components/PipelineBoard';
import { CandidateModal } from '@/components/CandidateModal';
import { Candidate } from '@/lib/store';

export default function DashboardPage() {
  // Get candidate data from store
  const candidates = useHireLinkStore((state) => state.candidates);

  // Local state for modal
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  /**
   * Handle candidate card click - open modal
   */
  const handleSelectCandidate = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setIsModalOpen(true);
  };

  /**
   * Handle modal close
   */
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCandidate(null);
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Recruiter Dashboard
              </h1>
              <p className="text-sm text-muted-foreground">
                {candidates.length} total application{candidates.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {/* Applied Count */}
          <Card className="p-4">
            <p className="text-sm text-muted-foreground mb-1">Applied</p>
            <p className="text-3xl font-bold text-foreground">
              {candidates.filter((c) => c.stage === 'Applied').length}
            </p>
          </Card>

          {/* Reviewed Count */}
          <Card className="p-4">
            <p className="text-sm text-muted-foreground mb-1">Reviewed</p>
            <p className="text-3xl font-bold text-foreground">
              {candidates.filter((c) => c.stage === 'Reviewed').length}
            </p>
          </Card>

          {/* Interview Scheduled Count */}
          <Card className="p-4">
            <p className="text-sm text-muted-foreground mb-1">Interviews</p>
            <p className="text-3xl font-bold text-foreground">
              {candidates.filter((c) => c.stage === 'Interview Scheduled').length}
            </p>
          </Card>

          {/* Offers Sent Count */}
          <Card className="p-4">
            <p className="text-sm text-muted-foreground mb-1">Offers</p>
            <p className="text-3xl font-bold text-foreground">
              {candidates.filter((c) => c.stage === 'Offer Sent').length}
            </p>
          </Card>
        </div>

        {/* Pipeline Board */}
        {candidates.length > 0 ? (
          <PipelineBoard
            candidates={candidates}
            onSelectCandidate={handleSelectCandidate}
          />
        ) : (
          /* Empty State */
          <Card className="p-12 text-center">
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg inline-block">
                <Plus className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                No applications yet
              </h3>
              <p className="text-muted-foreground max-w-sm mx-auto">
                Candidates will appear here as they apply for your open positions.
              </p>
              <Link href="/jobs">
                <Button variant="outline">View Job Postings</Button>
              </Link>
            </div>
          </Card>
        )}
      </div>

      {/* Candidate Detail Modal */}
      {selectedCandidate && (
        <CandidateModal
          candidate={selectedCandidate}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </main>
  );
}
