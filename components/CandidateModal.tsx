/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Candidate Modal Component
 * Displays full candidate details with options to:
 * - View application information
 * - Score the candidate (1-5)
 * - Add notes
 * - Move to next stage
 * - Schedule interview
 * - Send offer
 */

'use client';

import { useState } from 'react';
import { useHireLinkStore, Candidate } from '@/lib/store';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Star, Mail, Phone, Briefcase, Calendar } from 'lucide-react';
import { InterviewScheduler } from './InterviewScheduler';
import { OfferLetter } from './OfferLetter';

interface CandidateModalProps {
  candidate: Candidate;
  isOpen: boolean;
  onClose: () => void;
}

export function CandidateModal({
  candidate,
  isOpen,
  onClose,
}: CandidateModalProps) {
  // Get update function from store
  const updateCandidate = useHireLinkStore((state) => state.updateCandidate);

  // Local state for editing
  const [isEditing, setIsEditing] = useState(false);
  const [score, setScore] = useState<number | undefined>(candidate.score);
  const [notes, setNotes] = useState(candidate.notes || '');
  const [newStage, setNewStage] = useState<typeof candidate.stage | ''>('');
  const [isInterviewSchedulerOpen, setIsInterviewSchedulerOpen] = useState(false);
  const [isOfferLetterOpen, setIsOfferLetterOpen] = useState(false);

  const { applicationData, jobTitle } = candidate;
  const { fullName, email, phone } = applicationData.personalInfo;
  const { yearsOfExperience, skills, portfolioLink } =
    applicationData.experience;

  /**
   * Handle saving changes
   */
  const handleSave = () => {
    updateCandidate(candidate.id, {
      score: score ? parseInt(String(score)) : undefined,
      notes,
      ...(newStage && { stage: newStage as typeof candidate.stage }),
    });
    setIsEditing(false);
  };

  /**
   * Handle stage change
   */
  const handleMoveToStage = (stage: typeof candidate.stage) => {
    updateCandidate(candidate.id, { stage });
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-96 overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{fullName}</DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="info" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="info">Application</TabsTrigger>
              <TabsTrigger value="review">Review</TabsTrigger>
              <TabsTrigger value="actions">Actions</TabsTrigger>
            </TabsList>

            {/* Application Info Tab */}
            <TabsContent value="info" className="space-y-4">
              {/* Basic Info Card */}
              <Card className="p-4">
                <h3 className="font-semibold mb-3 text-foreground">
                  Contact Information
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <a href={`mailto:${email}`} className="text-primary hover:underline">
                      {email}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <a href={`tel:${phone}`} className="text-primary hover:underline">
                      {phone}
                    </a>
                  </div>
                </div>
              </Card>

              {/* Job & Experience Card */}
              <Card className="p-4">
                <h3 className="font-semibold mb-3 text-foreground">
                  Experience
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <Briefcase className="w-4 h-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">{jobTitle}</p>
                      <p className="text-muted-foreground">
                        {yearsOfExperience} years of experience
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Skills Card */}
              <Card className="p-4">
                <h3 className="font-semibold mb-3 text-foreground">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </Card>

              {/* Portfolio Card */}
              {portfolioLink && (
                <Card className="p-4">
                  <h3 className="font-semibold mb-2 text-foreground">Portfolio</h3>
                  <a
                    href={portfolioLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline text-sm break-all"
                  >
                    {portfolioLink}
                  </a>
                </Card>
              )}

              {/* Application ID Card */}
              <Card className="p-4 bg-muted">
                <p className="text-xs text-muted-foreground mb-1">
                  Application ID
                </p>
                <code className="font-mono text-sm text-foreground">
                  {candidate.applicationId}
                </code>
                <p className="text-xs text-muted-foreground mt-2">
                  Applied {new Date(candidate.appliedDate).toLocaleDateString()}
                </p>
              </Card>
            </TabsContent>

            {/* Review Tab */}
            <TabsContent value="review" className="space-y-4">
              {/* Scoring Section */}
              <Card className="p-4">
                <Label htmlFor="score" className="text-foreground font-semibold mb-3 block">
                  Candidate Score (1-5)
                </Label>
                <div className="flex gap-2 mb-4">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      onClick={() => setScore(num)}
                      className={`p-2 rounded transition-colors ${
                        score === num
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground hover:bg-muted'
                      }`}
                    >
                      <Star
                        className={`w-5 h-5 ${
                          score === num || score === undefined
                            ? 'fill-current'
                            : ''
                        }`}
                      />
                    </button>
                  ))}
                </div>
                {score && (
                  <p className="text-sm text-muted-foreground">
                    Rating: {score} out of 5
                  </p>
                )}
              </Card>

              {/* Notes Section */}
              <Card className="p-4">
                <Label htmlFor="notes" className="text-foreground font-semibold mb-2 block">
                  Reviewer Notes
                </Label>
                <Textarea
                  id="notes"
                  placeholder="Add your assessment and notes about this candidate..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="min-h-24"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  {notes.length}/500 characters
                </p>
              </Card>
            </TabsContent>

            {/* Actions Tab */}
            <TabsContent value="actions" className="space-y-4">
              {/* Current Stage */}
              <Card className="p-4">
                <Label className="text-foreground font-semibold mb-2 block">
                  Current Stage
                </Label>
                <Badge className="mb-4">{candidate.stage}</Badge>

                {/* Stage Change Buttons */}
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground mb-3">
                    Move to next stage:
                  </p>

                  {candidate.stage === 'Applied' && (
                    <Button
                      onClick={() => handleMoveToStage('Reviewed')}
                      className="w-full"
                      variant="outline"
                    >
                      Move to Reviewed
                    </Button>
                  )}

                  {candidate.stage === 'Reviewed' && (
                    <Button
                      onClick={() => setIsInterviewSchedulerOpen(true)}
                      className="w-full"
                      variant="outline"
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Schedule Interview
                    </Button>
                  )}

                  {candidate.stage === 'Interview Scheduled' && (
                    <Button
                      onClick={() => setIsOfferLetterOpen(true)}
                      className="w-full"
                      variant="outline"
                    >
                      Draft & Send Offer
                    </Button>
                  )}

                  {candidate.stage === 'Offer Sent' && (
                    <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg text-center">
                      <p className="text-sm font-medium text-green-900 dark:text-green-100">
                        Offer has been sent
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            </TabsContent>
          </Tabs>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button onClick={handleSave} disabled={!isEditing && !score && !notes}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Interview Scheduler Modal */}
      <InterviewScheduler
        candidate={candidate}
        isOpen={isInterviewSchedulerOpen}
        onClose={() => {
          setIsInterviewSchedulerOpen(false);
          onClose();
        }}
      />

      {/* Offer Letter Modal */}
      <OfferLetter
        candidate={candidate}
        isOpen={isOfferLetterOpen}
        onClose={() => {
          setIsOfferLetterOpen(false);
          onClose();
        }}
      />
    </>
  );
}
