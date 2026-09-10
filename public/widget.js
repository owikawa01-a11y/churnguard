/**
 * ChurnGuard Widget v2.1
 * Embeddable cancellation feedback widget with AI follow-up.
 *
 * Usage:
 *   <script>window.ChurnGuardConfig = { publicKey: "THEIR_PUBLIC_KEY" };</script>
 *   <script src="https://churnguard-sandy.vercel.app/widget.js" async></script>
 *   <button data-churnguard-trigger>Cancel subscription</button>
 */

(function () {
  'use strict';

  // ─── Configuration ────────────────────────────────────────
  var API_BASE = 'https://churnguard-sandy.vercel.app';
  var config = window.ChurnGuardConfig || {};
  var publicKey = config.publicKey;

  if (!publicKey) {
    console.warn('[ChurnGuard] No publicKey set. Add: window.ChurnGuardConfig = { publicKey: "..." }');
    return;
  }

  var REASONS = [
    { id: 'price', label: 'Too expensive' },
    { id: 'feature', label: 'Missing a feature I need' },
    { id: 'competitor', label: 'Switching to another tool' },
    { id: 'usage', label: "Don't use it enough" },
    { id: 'other', label: 'Other' }
  ];

  // ─── State ────────────────────────────────────────────────
  var currentOverlay = null;

  // ─── Utilities ────────────────────────────────────────────
  function escapeHtml(str) {
    if (!str) return '';
    var div = document.createElement('div');
    div.textContent = String(str);
    return div.innerHTML;
  }

  function el(tag, styles, attrs) {
    var e = document.createElement(tag);
    if (styles) e.style.cssText = styles;
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        if (k === 'text') e.textContent = attrs[k];
        else e.setAttribute(k, attrs[k]);
      });
    }
    return e;
  }

  // ─── Animations ───────────────────────────────────────────
  function injectStyles() {
    if (document.getElementById('churnguard-styles')) return;
    var style = document.createElement('style');
    style.id = 'churnguard-styles';
    style.textContent =
      '@keyframes cgFadeIn{from{opacity:0}to{opacity:1}}' +
      '@keyframes cgSlideUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}' +
      '@keyframes cgSpin{to{transform:rotate(360deg)}}';
    document.head.appendChild(style);
  }

  // ─── Modal Creation ───────────────────────────────────────
  function createModal() {
    // Remove any existing overlay first
    var existing = document.getElementById('churnguard-overlay');
    if (existing) existing.remove();

    var overlay = document.createElement('div');
    overlay.id = 'churnguard-overlay';
    overlay.style.cssText = [
      'position:fixed',
      'inset:0',
      'background:rgba(10,10,20,0.6)',
      'backdrop-filter:blur(6px)',
      '-webkit-backdrop-filter:blur(6px)',
      'z-index:2147483647',
      'display:flex',
      'align-items:center',
      'justify-content:center',
      'padding:20px',
      'font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif',
      'animation:cgFadeIn 0.2s ease-out'
    ].join(';');

    var box = document.createElement('div');
    box.style.cssText = [
      'background:#ffffff',
      'border-radius:18px',
      'padding:32px',
      'max-width:420px',
      'width:100%',
      'box-shadow:0 25px 70px rgba(0,0,0,0.35)',
      'box-sizing:border-box',
      'animation:cgSlideUp 0.3s ease-out'
    ].join(';');

    overlay.appendChild(box);
    document.body.appendChild(overlay);
    currentOverlay = overlay;

    // Close on overlay click
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeModal();
    });

    // Close on Escape key
    var escHandler = function (e) {
      if (e.key === 'Escape') {
        closeModal();
        document.removeEventListener('keydown', escHandler);
      }
    };
    document.addEventListener('keydown', escHandler);

    return box;
  }

  function closeModal() {
    if (currentOverlay && currentOverlay.parentNode) {
      var overlay = currentOverlay;
      overlay.style.opacity = '0';
      overlay.style.transition = 'opacity 0.15s';
      setTimeout(function () {
        if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
      }, 150);
      currentOverlay = null;
    }
  }

  // ─── Step 1: Reason Selection ─────────────────────────────
  function renderReasonStep(box) {
    box.innerHTML = '';

    var title = el(
      'h3',
      'margin:0 0 6px;font-size:20px;font-weight:700;color:#0a0a1a;line-height:1.3;',
      { text: 'Before you go...' }
    );
    box.appendChild(title);

    var subtitle = el(
      'p',
      'margin:0 0 22px;font-size:14px;color:#6b7280;line-height:1.5;',
      { text: "We'd love to understand what's not working. Your feedback helps us improve." }
    );
    box.appendChild(subtitle);

    REASONS.forEach(function (reason) {
      var btn = el(
        'button',
        [
          'display:block',
          'width:100%',
          'text-align:left',
          'padding:14px 18px',
          'margin-bottom:10px',
          'border:1.5px solid #e5e7eb',
          'border-radius:12px',
          'background:#fafafa',
          'cursor:pointer',
          'font-size:14px',
          'font-weight:500',
          'color:#111827',
          'transition:all 0.15s',
          'font-family:inherit'
        ].join(';'),
        { type: 'button', text: reason.label }
      );

      btn.addEventListener('mouseenter', function () {
        btn.style.borderColor = '#8b5cf6';
        btn.style.background = '#f5f3ff';
        btn.style.transform = 'translateY(-1px)';
        btn.style.boxShadow = '0 4px 12px rgba(139,92,246,0.15)';
      });
      btn.addEventListener('mouseleave', function () {
        btn.style.borderColor = '#e5e7eb';
        btn.style.background = '#fafafa';
        btn.style.transform = 'translateY(0)';
        btn.style.boxShadow = 'none';
      });

      btn.addEventListener('click', function () {
        submitReason(reason.label, box);
      });
      box.appendChild(btn);
    });

    var skip = el(
      'button',
      'margin-top:12px;background:none;border:none;color:#9ca3af;font-size:13px;cursor:pointer;padding:8px;font-family:inherit;',
      { type: 'button', text: 'Skip and cancel' }
    );
    skip.addEventListener('mouseenter', function () { skip.style.color = '#6b7280'; });
    skip.addEventListener('mouseleave', function () { skip.style.color = '#9ca3af'; });
    skip.addEventListener('click', function () {
      if (typeof config.originalCancel === 'function') config.originalCancel();
      closeModal();
    });
    box.appendChild(skip);
  }

  // ─── Step 2: Loading ──────────────────────────────────────
  function renderLoadingStep(box) {
    box.innerHTML =
      '<div style="text-align:center;padding:20px 0;">' +
      '<div style="display:inline-block;width:32px;height:32px;border:3px solid #e5e7eb;border-top-color:#8b5cf6;border-radius:50%;animation:cgSpin 0.7s linear infinite;"></div>' +
      '<p style="margin:16px 0 0;font-size:14px;color:#6b7280;">Thinking...</p>' +
      '</div>';
  }

  // ─── Step 3: AI Follow-up Question ────────────────────────
  function renderFollowUpStep(box, eventId, question) {
    box.innerHTML = '';

    var title = el(
      'h3',
      'margin:0 0 8px;font-size:18px;font-weight:700;color:#0a0a1a;line-height:1.3;',
      { text: 'One more thing' }
    );
    box.appendChild(title);

    var q = el(
      'p',
      'margin:0 0 18px;font-size:15px;color:#1f2937;line-height:1.5;font-weight:500;',
      { text: question }
    );
    box.appendChild(q);

    var textarea = el(
      'textarea',
      [
        'width:100%',
        'padding:12px 14px',
        'border:1.5px solid #e5e7eb',
        'border-radius:12px',
        'font-size:14px',
        'font-family:inherit',
        'resize:vertical',
        'min-height:80px',
        'box-sizing:border-box',
        'color:#111827',
        'transition:border-color 0.15s',
        'outline:none'
      ].join(';'),
      { rows: '3', placeholder: 'Your thoughts (optional)...' }
    );
    textarea.addEventListener('focus', function () { textarea.style.borderColor = '#8b5cf6'; });
    textarea.addEventListener('blur', function () { textarea.style.borderColor = '#e5e7eb'; });
    box.appendChild(textarea);

    var submitBtn = el(
      'button',
      [
        'margin-top:16px',
        'width:100%',
        'padding:14px',
        'background:linear-gradient(135deg,#8b5cf6 0%,#d946ef 100%)',
        'color:#ffffff',
        'border:none',
        'border-radius:12px',
        'font-size:14px',
        'font-weight:600',
        'cursor:pointer',
        'font-family:inherit',
        'transition:all 0.15s',
        'box-shadow:0 4px 14px rgba(139,92,246,0.3)'
      ].join(';'),
      { type: 'button', text: 'Submit and cancel' }
    );
    submitBtn.addEventListener('mouseenter', function () {
      submitBtn.style.transform = 'translateY(-1px)';
      submitBtn.style.boxShadow = '0 6px 20px rgba(139,92,246,0.4)';
    });
    submitBtn.addEventListener('mouseleave', function () {
      submitBtn.style.transform = 'translateY(0)';
      submitBtn.style.boxShadow = '0 4px 14px rgba(139,92,246,0.3)';
    });

    submitBtn.addEventListener('click', function () {
      var answer = textarea.value.trim();
      submitBtn.disabled = true;
      submitBtn.textContent = 'Saving...';
      submitBtn.style.opacity = '0.7';

      fetch(API_BASE + '/api/answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event_id: eventId, answer: answer })
      })
        .catch(function (err) {
          console.error('[ChurnGuard] Failed to save answer:', err);
        })
        .then(function () {
          if (typeof config.originalCancel === 'function') config.originalCancel();
          closeModal();
        });
    });
    box.appendChild(submitBtn);
  }

  // ─── Submit Reason ────────────────────────────────────────
  function submitReason(reason, box) {
    renderLoadingStep(box);

    fetch(API_BASE + '/api/follow-up', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ public_key: publicKey, reason: reason })
    })
      .then(function (res) {
        if (!res.ok) {
          return res.json().catch(function () { return {}; }).then(function (data) {
            throw new Error(data.error || 'HTTP ' + res.status);
          });
        }
        return res.json();
      })
      .then(function (data) {
        if (!data.success || !data.event_id) {
          throw new Error('Invalid response from server');
        }
        renderFollowUpStep(box, data.event_id, data.question);
      })
      .catch(function (err) {
        console.error('[ChurnGuard] Error:', err);
        if (typeof config.originalCancel === 'function') config.originalCancel();
        closeModal();
      });
  }

  // ─── Public API ───────────────────────────────────────────
  function show() {
    var box = createModal();
    renderReasonStep(box);
  }

  window.ChurnGuard = {
    show: show,
    hide: closeModal
  };

  // ─── Auto-wire Triggers ───────────────────────────────────
  function init() {
    var triggers = document.querySelectorAll('[data-churnguard-trigger]');
    triggers.forEach(function (trigger) {
      trigger.addEventListener('click', function (e) {
        e.preventDefault();
        show();
      });
    });
  }

  // ─── Bootstrap ────────────────────────────────────────────
  function boot() {
    injectStyles();
    init();
    console.log('[ChurnGuard] Widget v2.1 ready');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();