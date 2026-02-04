/**
 * Offer Letter Component
 * Generates and displays a mock offer letter for candidates
 * Includes offer details that can be customized by recruiters
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FileText, Download } from 'lucide-react';

interface OfferLetterProps {
  candidate: Candidate;
  isOpen: boolean;
  onClose: () => void;
}

export function OfferLetter({ candidate, isOpen, onClose }: OfferLetterProps) {
  // Get update function from store
  const updateCandidate = useHireLinkStore((state) => state.updateCandidate);

  // Local state for offer details
  const [position, setPosition] = useState(candidate.jobTitle);
  const [salary, setSalary] = useState('');
  const [startDate, setStartDate] = useState('');
  const [offerNotes, setOfferNotes] = useState(
    candidate.offerDetails || ''
  );
  const [isSending, setIsSending] = useState(false);

  const candidateName = candidate.applicationData.personalInfo.fullName;

  /**
   * Handle sending offer
   */
  const handleSendOffer = async () => {
    setIsSending(true);

    try {
      // Simulate API call to send offer
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update candidate with offer details
      updateCandidate(candidate.id, {
        stage: 'Offer Sent',
        offerDetails: offerNotes,
      });

      // Reset form and close
      setSalary('');
      setStartDate('');
      setOfferNotes('');
      setIsSending(false);
      onClose();
    } catch (error) {
      setIsSending(false);
      console.error('Failed to send offer:', error);
    }
  };

  // Get minimum start date (1 week from today)
  const minStartDate = new Date();
  minStartDate.setDate(minStartDate.getDate() + 7);
  const minStartDateString = minStartDate.toISOString().split('T')[0];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-96 overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Draft Offer Letter
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Offer Details Form */}
          <Card className="p-4 bg-muted">
            <h3 className="font-semibold mb-4 text-foreground">
              Offer Details
            </h3>

            <div className="grid grid-cols-2 gap-4 mb-4">
              {/* Position */}
              <div className="space-y-2">
                <Label htmlFor="position" className="text-sm">
                  Position
                </Label>
                <Input
                  id="position"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  placeholder="Senior Developer"
                  disabled
                  className="text-sm"
                />
              </div>

              {/* Salary */}
              <div className="space-y-2">
                <Label htmlFor="salary" className="text-sm">
                  Annual Salary *
                </Label>
                <Input
                  id="salary"
                  type="text"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  placeholder="e.g., $120,000"
                  className="text-sm"
                />
              </div>

              {/* Start Date */}
              <div className="space-y-2 col-span-2">
                <Label htmlFor="startDate" className="text-sm">
                  Start Date *
                </Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  min={minStartDateString}
                  className="text-sm"
                />
              </div>
            </div>

            {/* Additional Terms */}
            <div className="space-y-2">
              <Label htmlFor="terms" className="text-sm">
                Additional Terms & Conditions
              </Label>
              <Textarea
                id="terms"
                placeholder="e.g., Benefits, Remote Work Policy, etc."
                value={offerNotes}
                onChange={(e) => setOfferNotes(e.target.value)}
                className="min-h-20 text-sm"
              />
            </div>
          </Card>

          {/* Offer Letter Preview */}
          <Card className="p-6 bg-card border-2">
            <div className="space-y-4 text-sm">
              {/* Header */}
              <div>
                <p className="text-xs text-muted-foreground">
                  {new Date().toLocaleDateString()}
                </p>
                <p className="font-semibold text-foreground mt-2">{candidateName}</p>
              </div>

              {/* Letter Body */}
              <div className="space-y-3 text-muted-foreground">
                <p>Dear {candidateName.split(' ')[0]},</p>

                <p>
                  We are pleased to offer you the position of{' '}
                  <strong className="text-foreground">{position}</strong> at our
                  company. We are impressed with your qualifications and believe you
                  will be a valuable addition to our team.
                </p>

                {/* Offer Details */}
                <div className="space-y-2">
                  <p>
                    <strong className="text-foreground">Position:</strong> {position}
                  </p>
                  {salary && (
                    <p>
                      <strong className="text-foreground">Compensation:</strong>{' '}
                      {salary} per annum
                    </p>
                  )}
                  {startDate && (
                    <p>
                      <strong className="text-foreground">Start Date:</strong>{' '}
                      {new Date(startDate).toLocaleDateString()}
                    </p>
                  )}
                </div>

                {/* Terms */}
                {offerNotes && (
                  <div>
                    <p className="font-semibold text-foreground mb-1">
                      Terms & Conditions:
                    </p>
                    <p className="whitespace-pre-wrap">{offerNotes}</p>
                  </div>
                )}

                {/* Closing */}
                <p>
                  Please confirm your acceptance of this offer by signing the
                  attached document and returning it within 5 business days.
                </p>

                <p>
                  We look forward to welcoming you to our team. If you have any
                  questions, please do not hesitate to contact us.
                </p>

                <div className="pt-2">
                  <p>Best regards,</p>
                  <p className="font-semibold text-foreground">
                    The HireLink Team
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSendOffer}
            disabled={!salary || !startDate || isSending}
            className="gap-2"
          >
            <Download className="w-4 h-4" />
            {isSending ? 'Sending...' : 'Send Offer'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
