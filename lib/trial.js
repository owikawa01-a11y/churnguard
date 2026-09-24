// ===========================================
//  RetainPulse - Trial Logic
//  Determines account access based on subscription status
// ===========================================

/**
 * Check if a trial has expired
 */
export function isTrialExpired(trialEndsAt) {
  if (!trialEndsAt) return false;
  const end = new Date(trialEndsAt);
  const now = new Date();
  return now > end;
}

/**
 * Get number of days left in trial
 */
export function getDaysLeft(trialEndsAt) {
  if (!trialEndsAt) return 0;
  const end = new Date(trialEndsAt);
  const now = new Date();
  const diff = end - now;
  if (diff <= 0) return 0;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

/**
 * Determine account access level
 */
export function getAccountAccess(account) {
  if (!account) {
    return { canAccess: false, reason: 'no_account', daysLeft: 0 };
  }

  const status = account.subscription_status || 'trialing';

  // Canceled or paused - no access
  if (status === 'canceled' || status === 'paused') {
    return {
      canAccess: false,
      reason: status,
      daysLeft: 0,
    };
  }

  // Trialing - check expiration FIRST
  if (status === 'trialing') {
    if (isTrialExpired(account.trial_ends_at)) {
      return {
        canAccess: false,
        reason: 'trial_expired',
        daysLeft: 0,
      };
    }
    return {
      canAccess: true,
      reason: 'trialing',
      daysLeft: getDaysLeft(account.trial_ends_at),
    };
  }

  // Active subscription
  if (status === 'active') {
    return {
      canAccess: true,
      reason: 'active',
      daysLeft: 0,
    };
  }

  // Default
  return {
    canAccess: true,
    reason: 'new',
    daysLeft: getDaysLeft(account.trial_ends_at),
  };
}

export const TRIAL_WARNING_THRESHOLD = 7;