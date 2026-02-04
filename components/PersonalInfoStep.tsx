/**
 * Personal Information Step (Step 1 of 3)
 * Collects candidate's name, email, and phone number
 * Includes real-time validation
 */

'use client';

import { useState } from 'react';
import { useHireLinkStore } from '@/lib/store';
import { validateFullName, validateEmail, validatePhone } from '@/lib/validation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface PersonalInfoStepProps {
  onNext: () => void;
}

export function PersonalInfoStep({ onNext }: PersonalInfoStepProps) {
  // Get form data and setter from global store
  const applicationForm = useHireLinkStore((state) => state.applicationForm);
  const setApplicationForm = useHireLinkStore((state) => state.setApplicationForm);

  // Local state for field-level errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Extract personal info from application form
  const { fullName, email, phone } = applicationForm.personalInfo;

  /**
   * Handle field changes and clear associated errors
   */
  const handleFieldChange = (field: string, value: string) => {
    setApplicationForm({
      personalInfo: {
        ...applicationForm.personalInfo,
        [field]: value,
      },
    });

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  /**
   * Handle field blur to show validation errors
   */
  const handleFieldBlur = (field: string) => {
    setTouched({ ...touched, [field]: true });

    let validation;
    switch (field) {
      case 'fullName':
        validation = validateFullName(fullName);
        break;
      case 'email':
        validation = validateEmail(email);
        break;
      case 'phone':
        validation = validatePhone(phone);
        break;
      default:
        return;
    }

    if (!validation.valid) {
      setErrors({ ...errors, [field]: validation.error || '' });
    }
  };

  /**
   * Validate all fields before proceeding to next step
   */
  const handleNext = () => {
    const fullNameVal = validateFullName(fullName);
    const emailVal = validateEmail(email);
    const phoneVal = validatePhone(phone);

    const newErrors: Record<string, string> = {};
    if (!fullNameVal.valid) newErrors.fullName = fullNameVal.error || '';
    if (!emailVal.valid) newErrors.email = emailVal.error || '';
    if (!phoneVal.valid) newErrors.phone = phoneVal.error || '';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setTouched({
        fullName: true,
        email: true,
        phone: true,
      });
      return;
    }

    // All validation passed, proceed to next step
    onNext();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2 text-foreground">Personal Information</h2>
        <p className="text-muted-foreground">
          Let&apos;s start with your basic information
        </p>
      </div>

      <Card className="p-6">
        <div className="space-y-5">
          {/* Full Name Field */}
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-foreground font-medium">
              Full Name *
            </Label>
            <Input
              id="fullName"
              type="text"
              placeholder="John Doe"
              value={fullName}
              onChange={(e) => handleFieldChange('fullName', e.target.value)}
              onBlur={() => handleFieldBlur('fullName')}
              className={errors.fullName && touched.fullName ? 'border-red-500' : ''}
              aria-invalid={!!(errors.fullName && touched.fullName)}
              aria-describedby={errors.fullName && touched.fullName ? 'fullName-error' : undefined}
            />
            {/* Error message displayed below field */}
            {errors.fullName && touched.fullName && (
              <p id="fullName-error" className="text-sm text-red-500">
                {errors.fullName}
              </p>
            )}
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground font-medium">
              Email *
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              value={email}
              onChange={(e) => handleFieldChange('email', e.target.value)}
              onBlur={() => handleFieldBlur('email')}
              className={errors.email && touched.email ? 'border-red-500' : ''}
              aria-invalid={!!(errors.email && touched.email)}
              aria-describedby={errors.email && touched.email ? 'email-error' : undefined}
            />
            {errors.email && touched.email && (
              <p id="email-error" className="text-sm text-red-500">
                {errors.email}
              </p>
            )}
          </div>

          {/* Phone Field */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-foreground font-medium">
              Phone Number *
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+1 (555) 123-4567"
              value={phone}
              onChange={(e) => handleFieldChange('phone', e.target.value)}
              onBlur={() => handleFieldBlur('phone')}
              className={errors.phone && touched.phone ? 'border-red-500' : ''}
              aria-invalid={!!(errors.phone && touched.phone)}
              aria-describedby={errors.phone && touched.phone ? 'phone-error' : undefined}
            />
            {errors.phone && touched.phone && (
              <p id="phone-error" className="text-sm text-red-500">
                {errors.phone}
              </p>
            )}
          </div>

          {/* Helper Text */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              All fields are required. We&apos;ll use this information to contact you about your application.
            </AlertDescription>
          </Alert>
        </div>
      </Card>

      {/* Navigation Button */}
      <Button onClick={handleNext} className="w-full" size="lg">
        Next: Experience & Skills
      </Button>
    </div>
  );
}
