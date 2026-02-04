/**
 * Experience & Skills Step (Step 2 of 3)
 * Collects years of experience, skills, and portfolio link
 * Allows dynamic skill management (add/remove)
 */

'use client';

import { useState } from 'react';
import { useHireLinkStore } from '@/lib/store';
import {
  validateYearsOfExperience,
  validateSkills,
  validatePortfolioLink,
} from '@/lib/validation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Plus, X } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ExperienceStepProps {
  onNext: () => void;
  onBack: () => void;
}

export function ExperienceStep({ onNext, onBack }: ExperienceStepProps) {
  // Get form data and setter from global store
  const applicationForm = useHireLinkStore((state) => state.applicationForm);
  const setApplicationForm = useHireLinkStore((state) => state.setApplicationForm);

  // Local state for field-level errors and skill input
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [skillInput, setSkillInput] = useState('');

  // Extract experience from application form
  const { yearsOfExperience, skills, portfolioLink } = applicationForm.experience;

  /**
   * Handle years of experience change
   */
  const handleExperienceChange = (value: string) => {
    setApplicationForm({
      experience: {
        ...applicationForm.experience,
        yearsOfExperience: value,
      },
    });

    if (errors.yearsOfExperience) {
      setErrors({ ...errors, yearsOfExperience: '' });
    }
  };

  /**
   * Handle portfolio link change
   */
  const handlePortfolioChange = (value: string) => {
    setApplicationForm({
      experience: {
        ...applicationForm.experience,
        portfolioLink: value,
      },
    });

    if (errors.portfolioLink) {
      setErrors({ ...errors, portfolioLink: '' });
    }
  };

  /**
   * Add a new skill to the skills array
   */
  const handleAddSkill = () => {
    const trimmedSkill = skillInput.trim();

    // Validate skill input
    if (!trimmedSkill) {
      setErrors({ ...errors, skillInput: 'Please enter a skill' });
      return;
    }

    if (trimmedSkill.length > 50) {
      setErrors({ ...errors, skillInput: 'Skill must not exceed 50 characters' });
      return;
    }

    // Check for duplicate skills
    if (skills.includes(trimmedSkill)) {
      setErrors({ ...errors, skillInput: 'This skill is already added' });
      return;
    }

    // Check if we've reached the maximum limit
    if (skills.length >= 20) {
      setErrors({ ...errors, skillInput: 'Maximum 20 skills allowed' });
      return;
    }

    // Add the skill
    setApplicationForm({
      experience: {
        ...applicationForm.experience,
        skills: [...skills, trimmedSkill],
      },
    });

    setSkillInput('');
    setErrors({ ...errors, skillInput: '' });
  };

  /**
   * Remove a skill from the skills array
   */
  const handleRemoveSkill = (skillToRemove: string) => {
    setApplicationForm({
      experience: {
        ...applicationForm.experience,
        skills: skills.filter((skill) => skill !== skillToRemove),
      },
    });
  };

  /**
   * Handle field blur for validation
   */
  const handleFieldBlur = (field: string) => {
    setTouched({ ...touched, [field]: true });

    let validation;
    switch (field) {
      case 'yearsOfExperience':
        validation = validateYearsOfExperience(yearsOfExperience);
        break;
      case 'portfolioLink':
        validation = validatePortfolioLink(portfolioLink);
        break;
      default:
        return;
    }

    if (!validation.valid) {
      setErrors({ ...errors, [field]: validation.error || '' });
    }
  };

  /**
   * Validate all fields before proceeding
   */
  const handleNext = () => {
    const yearsVal = validateYearsOfExperience(yearsOfExperience);
    const skillsVal = validateSkills(skills);
    const portfolioVal = validatePortfolioLink(portfolioLink);

    const newErrors: Record<string, string> = {};
    if (!yearsVal.valid) newErrors.yearsOfExperience = yearsVal.error || '';
    if (!skillsVal.valid) newErrors.skills = skillsVal.error || '';
    if (!portfolioVal.valid) newErrors.portfolioLink = portfolioVal.error || '';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setTouched({
        yearsOfExperience: true,
        skills: true,
        portfolioLink: true,
      });
      return;
    }

    onNext();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2 text-foreground">
          Experience & Skills
        </h2>
        <p className="text-muted-foreground">
          Tell us about your professional background
        </p>
      </div>

      <Card className="p-6">
        <div className="space-y-5">
          {/* Years of Experience Field */}
          <div className="space-y-2">
            <Label htmlFor="years" className="text-foreground font-medium">
              Years of Experience *
            </Label>
            <Input
              id="years"
              type="number"
              placeholder="5"
              value={yearsOfExperience}
              onChange={(e) => handleExperienceChange(e.target.value)}
              onBlur={() => handleFieldBlur('yearsOfExperience')}
              className={
                errors.yearsOfExperience && touched.yearsOfExperience
                  ? 'border-red-500'
                  : ''
              }
              aria-invalid={
                !!(errors.yearsOfExperience && touched.yearsOfExperience)
              }
              aria-describedby={
                errors.yearsOfExperience && touched.yearsOfExperience
                  ? 'years-error'
                  : undefined
              }
            />
            {errors.yearsOfExperience && touched.yearsOfExperience && (
              <p id="years-error" className="text-sm text-red-500">
                {errors.yearsOfExperience}
              </p>
            )}
          </div>

          {/* Skills Field */}
          <div className="space-y-2">
            <Label className="text-foreground font-medium">
              Skills * ({skills.length}/20)
            </Label>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="e.g., React, Node.js, TypeScript"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSkill();
                  }
                }}
              />
              <Button
                type="button"
                onClick={handleAddSkill}
                size="sm"
                className="px-4"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {/* Error message for skill input */}
            {errors.skillInput && (
              <p className="text-sm text-red-500">{errors.skillInput}</p>
            )}

            {/* Display added skills as badges */}
            {skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {skills.map((skill) => (
                  <Badge
                    key={skill}
                    variant="secondary"
                    className="cursor-pointer hover:bg-secondary/80"
                  >
                    {skill}
                    <button
                      onClick={() => handleRemoveSkill(skill)}
                      className="ml-2 hover:text-foreground"
                      aria-label={`Remove ${skill} skill`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}

            {/* Validation error for skills array */}
            {errors.skills && (
              <p className="text-sm text-red-500">{errors.skills}</p>
            )}
          </div>

          {/* Portfolio Link Field (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="portfolio" className="text-foreground font-medium">
              Portfolio Link (Optional)
            </Label>
            <Input
              id="portfolio"
              type="url"
              placeholder="https://yourportfolio.com"
              value={portfolioLink}
              onChange={(e) => handlePortfolioChange(e.target.value)}
              onBlur={() => handleFieldBlur('portfolioLink')}
              className={
                errors.portfolioLink && touched.portfolioLink
                  ? 'border-red-500'
                  : ''
              }
              aria-invalid={
                !!(errors.portfolioLink && touched.portfolioLink)
              }
              aria-describedby={
                errors.portfolioLink && touched.portfolioLink
                  ? 'portfolio-error'
                  : undefined
              }
            />
            {errors.portfolioLink && touched.portfolioLink && (
              <p id="portfolio-error" className="text-sm text-red-500">
                {errors.portfolioLink}
              </p>
            )}
          </div>

          {/* Helper Alert */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Add your key technical and soft skills that match the job requirements.
            </AlertDescription>
          </Alert>
        </div>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex gap-3">
        <Button onClick={onBack} variant="outline" className="flex-1 bg-transparent">
          Back
        </Button>
        <Button onClick={handleNext} className="flex-1">
          Next: Upload Resume
        </Button>
      </div>
    </div>
  );
}
