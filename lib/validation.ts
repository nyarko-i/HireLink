/**
 * Validation utilities for HireLink form
 * Provides step-by-step validation and error handling
 */

// ============================================================================
// VALIDATION RULES
// ============================================================================

const VALIDATION_RULES = {
  fullName: {
    minLength: 2,
    maxLength: 100,
    pattern: /^[a-zA-Z\s'-]+$/,
  },
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  phone: {
    pattern: /^[\d\s\-+()]+$/,
    minLength: 10,
  },
  yearsOfExperience: {
    pattern: /^\d+(\.\d+)?$/,
  },
  portfolioLink: {
    pattern: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
  },
  skills: {
    minItems: 1,
    maxItems: 20,
    maxLength: 50,
  },
  resume: {
    acceptedFormats: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    maxSize: 5 * 1024 * 1024, // 5MB
  },
};

// ============================================================================
// VALIDATION FUNCTIONS
// ============================================================================

/**
 * Validate full name field
 * - Required
 * - 2-100 characters
 * - Only letters, spaces, hyphens, and apostrophes
 */
export const validateFullName = (name: string): { valid: boolean; error?: string } => {
  if (!name.trim()) {
    return { valid: false, error: 'Full name is required' };
  }

  if (name.length < VALIDATION_RULES.fullName.minLength) {
    return { valid: false, error: 'Full name must be at least 2 characters' };
  }

  if (name.length > VALIDATION_RULES.fullName.maxLength) {
    return { valid: false, error: 'Full name must not exceed 100 characters' };
  }

  if (!VALIDATION_RULES.fullName.pattern.test(name)) {
    return { valid: false, error: 'Full name can only contain letters, spaces, hyphens, and apostrophes' };
  }

  return { valid: true };
};

/**
 * Validate email field
 * - Required
 * - Must be valid email format
 */
export const validateEmail = (email: string): { valid: boolean; error?: string } => {
  if (!email.trim()) {
    return { valid: false, error: 'Email is required' };
  }

  if (!VALIDATION_RULES.email.pattern.test(email)) {
    return { valid: false, error: 'Please enter a valid email address' };
  }

  return { valid: true };
};

/**
 * Validate phone number field
 * - Required
 * - At least 10 digits/characters
 * - Can include spaces, hyphens, parentheses
 */
export const validatePhone = (phone: string): { valid: boolean; error?: string } => {
  if (!phone.trim()) {
    return { valid: false, error: 'Phone number is required' };
  }

  if (!VALIDATION_RULES.phone.pattern.test(phone)) {
    return { valid: false, error: 'Phone number contains invalid characters' };
  }

  const digitsOnly = phone.replace(/\D/g, '');
  if (digitsOnly.length < VALIDATION_RULES.phone.minLength) {
    return { valid: false, error: 'Phone number must contain at least 10 digits' };
  }

  return { valid: true };
};

/**
 * Validate years of experience field
 * - Required
 * - Must be a valid number
 */
export const validateYearsOfExperience = (years: string): { valid: boolean; error?: string } => {
  if (!years.trim()) {
    return { valid: false, error: 'Years of experience is required' };
  }

  if (!VALIDATION_RULES.yearsOfExperience.pattern.test(years)) {
    return { valid: false, error: 'Years of experience must be a valid number' };
  }

  const numYears = parseFloat(years);
  if (numYears < 0 || numYears > 80) {
    return { valid: false, error: 'Years of experience must be between 0 and 80' };
  }

  return { valid: true };
};

/**
 * Validate skills field
 * - Required (at least 1 skill)
 * - Maximum 20 skills
 * - Each skill max 50 characters
 */
export const validateSkills = (skills: string[]): { valid: boolean; error?: string } => {
  if (!skills || skills.length === 0) {
    return { valid: false, error: 'Please add at least one skill' };
  }

  if (skills.length > VALIDATION_RULES.skills.maxItems) {
    return { valid: false, error: `Maximum ${VALIDATION_RULES.skills.maxItems} skills allowed` };
  }

  for (const skill of skills) {
    if (skill.length > VALIDATION_RULES.skills.maxLength) {
      return { valid: false, error: `Each skill must not exceed ${VALIDATION_RULES.skills.maxLength} characters` };
    }
  }

  return { valid: true };
};

/**
 * Validate portfolio link field
 * - Optional field
 * - If provided, must be valid URL
 */
export const validatePortfolioLink = (link: string): { valid: boolean; error?: string } => {
  if (!link.trim()) {
    return { valid: true }; // Optional field
  }

  if (!VALIDATION_RULES.portfolioLink.pattern.test(link)) {
    return { valid: false, error: 'Please enter a valid portfolio URL' };
  }

  return { valid: true };
};

/**
 * Validate resume file
 * - Required
 * - Must be PDF or DOC/DOCX
 * - Maximum 5MB
 */
export const validateResume = (file: File | null): { valid: boolean; error?: string } => {
  if (!file) {
    return { valid: false, error: 'Resume is required' };
  }

  if (!VALIDATION_RULES.resume.acceptedFormats.includes(file.type)) {
    return { valid: false, error: 'Resume must be PDF, DOC, or DOCX format' };
  }

  if (file.size > VALIDATION_RULES.resume.maxSize) {
    return { valid: false, error: 'Resume must not exceed 5MB' };
  }

  return { valid: true };
};

// ============================================================================
// STEP VALIDATION FUNCTIONS
// ============================================================================

/**
 * Validate entire Personal Information step
 */
export const validatePersonalInfoStep = (
  fullName: string,
  email: string,
  phone: string
): { valid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};

  const nameValidation = validateFullName(fullName);
  if (!nameValidation.valid) errors.fullName = nameValidation.error || '';

  const emailValidation = validateEmail(email);
  if (!emailValidation.valid) errors.email = emailValidation.error || '';

  const phoneValidation = validatePhone(phone);
  if (!phoneValidation.valid) errors.phone = phoneValidation.error || '';

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validate entire Experience & Skills step
 */
export const validateExperienceStep = (
  yearsOfExperience: string,
  skills: string[],
  portfolioLink: string
): { valid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};

  const yearsValidation = validateYearsOfExperience(yearsOfExperience);
  if (!yearsValidation.valid) errors.yearsOfExperience = yearsValidation.error || '';

  const skillsValidation = validateSkills(skills);
  if (!skillsValidation.valid) errors.skills = skillsValidation.error || '';

  const portfolioValidation = validatePortfolioLink(portfolioLink);
  if (!portfolioValidation.valid) errors.portfolioLink = portfolioValidation.error || '';

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validate entire Resume step
 */
export const validateResumeStep = (
  file: File | null
): { valid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};

  const resumeValidation = validateResume(file);
  if (!resumeValidation.valid) errors.resume = resumeValidation.error || '';

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Generate unique application ID
 * Format: HLA-XXXXXXXX-XXXXX (HireLink Application)
 */
export const generateApplicationId = (): string => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 10).toUpperCase();
  return `HLA-${random}-${timestamp}`;
};
