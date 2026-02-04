/**
 * Interview Scheduler Component
 * Allows recruiters to schedule interviews for candidates
 * Auto-moves candidate to "Interview Scheduled" stage
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar, Clock, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface InterviewSchedulerProps {
  candidate: Candidate;
  isOpen: boolean;
  onClose: () => void;
}

// Interview types
const INTERVIEW_TYPES = [
  { value: 'phone', label: 'Phone Interview' },
  { value: 'video', label: 'Video Interview' },
  { value: 'in-person', label: 'In-Person Interview' },
];

// Time slots
const TIME_SLOTS = [
  '09:00 AM',
  '10:00 AM',
  '11:00 AM',
  '1:00 PM',
  '2:00 PM',
  '3:00 PM',
  '4:00 PM',
];

export function InterviewScheduler({
  candidate,
  isOpen,
  onClose,
}: InterviewSchedulerProps) {
  // Get update function from store
  const updateCandidate = useHireLinkStore((state) => state.updateCandidate);

  // Local state for form
  const [interviewDate, setInterviewDate] = useState('');
  const [interviewTime, setInterviewTime] = useState('');
  const [interviewType, setInterviewType] = useState('');
  const [interviewNotes, setInterviewNotes] = useState('');
  const [isScheduling, setIsScheduling] = useState(false);

  // Validation
  const isValid = interviewDate && interviewTime && interviewType;

  /**
   * Handle schedule interview
   */
  const handleScheduleInterview = async () => {
    if (!isValid) return;

    setIsScheduling(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update candidate with interview details and move to "Interview Scheduled" stage
      updateCandidate(candidate.id, {
        stage: 'Interview Scheduled',
        interviewDate,
        interviewTime,
        notes: interviewNotes,
      });

      // Reset form and close
      setInterviewDate('');
      setInterviewTime('');
      setInterviewType('');
      setInterviewNotes('');
      setIsScheduling(false);
      onClose();
    } catch (error) {
      setIsScheduling(false);
      console.error('Failed to schedule interview:', error);
    }
  };

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Schedule Interview</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Candidate Info */}
          <Card className="p-3 bg-muted">
            <p className="text-sm font-medium text-foreground">
              {candidate.applicationData.personalInfo.fullName}
            </p>
            <p className="text-xs text-muted-foreground">
              {candidate.jobTitle}
            </p>
          </Card>

          {/* Interview Type */}
          <div className="space-y-2">
            <Label htmlFor="type" className="font-medium">
              Interview Type *
            </Label>
            <Select value={interviewType} onValueChange={setInterviewType}>
              <SelectTrigger id="type">
                <SelectValue placeholder="Select interview type" />
              </SelectTrigger>
              <SelectContent>
                {INTERVIEW_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Interview Date */}
          <div className="space-y-2">
            <Label htmlFor="date" className="font-medium flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Interview Date *
            </Label>
            <Input
              id="date"
              type="date"
              value={interviewDate}
              onChange={(e) => setInterviewDate(e.target.value)}
              min={today}
              className="w-full"
              aria-label="Interview date"
            />
          </div>

          {/* Interview Time */}
          <div className="space-y-2">
            <Label htmlFor="time" className="font-medium flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Interview Time *
            </Label>
            <Select value={interviewTime} onValueChange={setInterviewTime}>
              <SelectTrigger id="time">
                <SelectValue placeholder="Select time slot" />
              </SelectTrigger>
              <SelectContent>
                {TIME_SLOTS.map((slot) => (
                  <SelectItem key={slot} value={slot}>
                    {slot}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Interview Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="font-medium">
              Interview Instructions (Optional)
            </Label>
            <Textarea
              id="notes"
              placeholder="e.g., 'Join Zoom meeting link...', 'Office location: 123 Main St'"
              value={interviewNotes}
              onChange={(e) => setInterviewNotes(e.target.value)}
              className="min-h-20 text-sm"
            />
          </div>

          {/* Info Alert */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              The candidate will be automatically moved to &quot;Interview Scheduled&quot; stage.
              A confirmation will be sent to their email.
            </AlertDescription>
          </Alert>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleScheduleInterview}
            disabled={!isValid || isScheduling}
          >
            {isScheduling ? 'Scheduling...' : 'Schedule Interview'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
