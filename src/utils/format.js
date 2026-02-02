export const formatValidationErrors = errors => {
  if (!errors || !errors.issues === 0) return 'No validation errors';

  if (Array.isArray(errors.issues)) {
    return errors.issues.map(issue => issue.message).join(', ');
  }

  return JSON.stringify(errors);
};
