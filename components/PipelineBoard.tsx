/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Pipeline Board Component
 * Displays candidates in a kanban-style board with four stages:
 * Applied, Reviewed, Interview Scheduled, Offer Sent
 */

'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Candidate } from '@/lib/store';
import { Mail, Star } from 'lucide-react';

interface PipelineBoardProps {
  candidates: Candidate[];
  onSelectCandidate: (candidate: Candidate) => void;
}

// Define the pipeline stages
const PIPELINE_STAGES = [
  { id: 'Applied', label: 'Applied', color: 'bg-blue-50 dark:bg-blue-950' },
  {
    id: 'Reviewed',
    label: 'Reviewed',
    color: 'bg-yellow-50 dark:bg-yellow-950',
  },
  {
    id: 'Interview Scheduled',
    label: 'Interview Scheduled',
    color: 'bg-purple-50 dark:bg-purple-950',
  },
  { id: 'Offer Sent', label: 'Offer Sent', color: 'bg-green-50 dark:bg-green-950' },
] as const;

export function PipelineBoard({
  candidates,
  onSelectCandidate,
}: PipelineBoardProps) {
  /**
   * Get candidates filtered by stage
   */
  const getCandidatesByStage = (stage: string) => {
    return candidates.filter((c) => c.stage === stage);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
      {PIPELINE_STAGES.map((stage) => {
        const stageCandidates = getCandidatesByStage(stage.id);

        return (
          <div key={stage.id} className="flex flex-col gap-3">
            {/* Stage Header */}
            <div className="flex items-center justify-between px-2">
              <h3 className="font-semibold text-foreground">{stage.label}</h3>
              <Badge variant="secondary">{stageCandidates.length}</Badge>
            </div>

            {/* Candidates Container */}
            <div className={`rounded-lg p-3 min-h-96 flex flex-col gap-3 ${stage.color}`}>
              {stageCandidates.length > 0 ? (
                stageCandidates.map((candidate) => (
                  <CandidateCard
                    key={candidate.id}
                    candidate={candidate}
                    onClick={() => onSelectCandidate(candidate)}
                  />
                ))
              ) : (
                <div className="flex-1 flex items-center justify-center text-center">
                  <p className="text-sm text-muted-foreground">
                    No candidates in this stage
                  </p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/**
 * Individual Candidate Card Component
 * Displays candidate information in a card format
 */
interface CandidateCardProps {
  candidate: Candidate;
  onClick: () => void;
}

function CandidateCard({ candidate, onClick }: CandidateCardProps) {
  const { applicationData, score, stage } = candidate;
  const { fullName, email } = applicationData.personalInfo;

  return (
    <Card
      onClick={onClick}
      className="p-4 cursor-pointer hover:shadow-md transition-shadow bg-card hover:bg-accent/50"
    >
      {/* Header with Name and Rating */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-foreground truncate text-sm">
            {fullName}
          </h4>
          <p className="text-xs text-muted-foreground truncate">{email}</p>
        </div>

        {/* Score Display */}
        {score && (
          <div className="flex items-center gap-1 shrink-0">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-semibold text-foreground">{score}</span>
          </div>
        )}
      </div>

      {/* Job Title */}
      <p className="text-xs text-muted-foreground mb-3 truncate">
        {candidate.jobTitle}
      </p>

      {/* Applied Date */}
      <div className="text-xs text-muted-foreground mb-3">
        Applied {new Date(candidate.appliedDate).toLocaleDateString()}
      </div>

      {/* Skills Preview */}
      <div className="flex flex-wrap gap-1 mb-3">
        {applicationData.experience.skills.slice(0, 2).map((skill) => (
          <Badge key={skill} variant="outline" className="text-xs">
            {skill}
          </Badge>
        ))}
        {applicationData.experience.skills.length > 2 && (
          <Badge variant="outline" className="text-xs">
            +{applicationData.experience.skills.length - 2}
          </Badge>
        )}
      </div>

      {/* Notes Preview */}
      {candidate.notes && (
        <p className="text-xs text-muted-foreground line-clamp-2 mb-3 italic">
          &ldquo;{candidate.notes}&quot;
        </p>
      )}

      {/* Action Button */}
      <Button
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        variant="outline"
        size="sm"
        className="w-full text-xs"
      >
        <Mail className="w-3 h-3 mr-1" />
        View Details
      </Button>
    </Card>
  );
}
