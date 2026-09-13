// ===========================================
//  ChurnGuard - Trial Logic
//  Determines account access based on subscription status
// ===========================================

/**
 * Check if a trial has expired
 * @param {string} trialEndsAt - ISO date string
 * @returns {boolean}
 */
export function isTrialExpired(trialEndsAt) {
  if (!trialEndsAt) return false;
  const end = new Date(trialEndsAt);
  const now = new Date();
  return now > end;
}

/**
 * Get number of days left in trial
 * @param {string} trialEndsAt - ISO date string
 * @returns {number}
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
 * @param {object} account - Account row from Supabase
 * @returns {object} - { canAccess: boolean, reason: string, daysLeft: number }
 */
export function getAccountAccess(account) {
  if (!account) {
    return { canAccess: false, reason: 'no_account', daysLeft: 0 };
  }

  const status = account.subscription_status || 'trialing';
  const planStatus = account.plan_status || 'trial';

  // Active subscription → full access
  if (status === 'active' || status === 'trialing') {
    return {
      canAccess: true,
      reason: 'active',
      daysLeft: getDaysLeft(account.trial_ends_at),
    };
  }

  // Trial expired
  if (status === 'trialing' && isTrialExpired(account.trial_ends_at)) {
    return {
      canAccess: false,
      reason: 'trial_expired',
      daysLeft: 0,
    };
  }

  // Canceled or paused
  if (status === 'canceled' || status === 'paused') {
    return {
      canAccess: false,
      reason: status,
      daysLeft: 0,
    };
  }

  // Default: allow (for new accounts)
  return {
    canAccess: true,
    reason: 'new',
    daysLeft: getDaysLeft(account.trial_ends_at),
  };
}

/**
 * Trial warning thresholds (in days)
 */
export const TRIAL_WARNING_THRESHOLD = 7;