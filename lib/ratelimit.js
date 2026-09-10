import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// ─── إعداد الـ Redis ──────────────────────────────────────
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

// ─── Rate Limiter للـ follow-up ──────────────────────────
// 5 طلبات كل 10 ثواني لكل IP
export const followUpRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '10 s'),
  analytics: true,
  prefix: 'cg:followup',
});

// ─── Rate Limiter للـ answer ──────────────────────────────
// 10 طلبات كل 10 ثواني لكل IP
export const answerRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '10 s'),
  analytics: true,
  prefix: 'cg:answer',
});

// ─── دالة مساعدة عشان نجيب الـ IP ────────────────────────
export function getClientIP(request) {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'anonymous'
  );
}