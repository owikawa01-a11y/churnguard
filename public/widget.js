/**
 * ChurnGuard Widget v4.0
 * Single-offer, California-compliant cancellation flow
 *
 * Flow: reason -> AI follow-up -> ONE retention offer -> done
 *
 * IMPORTANT for integrators:
 *   Set `onCancelConfirmed` callback to actually complete cancellation.
 *   Set `onOfferAccepted` callback to apply the discount/pause in your billing.
 *
 * Usage:
 *   <script>
 *     window.ChurnGuardConfig = {
 *       publicKey: "YOUR_KEY",
 *       customerMrr: 49,
 *       onCancelConfirmed: function() { /* your cancel logic */ },
 *       onOfferAccepted: function() { /* apply discount */ }
 *     };
 *   </script>
 *   <script src="https://churnguard-sandy.vercel.app/widget.js" async></script>
 *   <button data-churnguard-trigger>Cancel subscription</button>
 */

(function () {
  'use strict';

  var API_BASE = 'https://churnguard-sandy.vercel.app';
  var config = window.ChurnGuardConfig || {};
  var publicKey = config.publicKey;

  if (!publicKey) {
    console.warn('[ChurnGuard] No publicKey set in window.ChurnGuardConfig');
    return;
  }

  if (typeof config.onCancelConfirmed !== 'function') {
    console.warn(
      '[ChurnGuard] No onCancelConfirmed callback set. The real cancellation ' +
      'will NOT happen automatically - add this to window.ChurnGuardConfig.'
    );
  }

  var REASONS = [
    { id: 'price', label: 'Too expensive' },
    { id: 'feature', label: 'Missing a feature I need' },
    { id: 'competitor', label: 'Switching to another tool' },
    { id: 'usage', label: "Don't use it enough" },
    { id: 'other', label: 'Other' }
  ];

  var UI = {
    brand: '#8b5cf6',
    brandGradient: 'linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)',
    text: '#111827',
    textMuted: '#6b7280',
    textSubtle: '#9ca3af',
    border: '#e5e7eb',
    bg: '#ffffff',
    bgSubtle: '#fafafa'
  };

  var currentOverlay = null;
  var currentEscapeHandler = null;

  // --- Utilities ---
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

  function clearElement(element) {
    while (element.firstChild) element.removeChild(element.firstChild);
  }

  function escapeHtml(str) {
    if (!str) return '';
    var div = document.createElement('div');
    div.textContent = String(str);
    return div.innerHTML;
  }

  // --- Animations ---
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

  // --- Modal Shell ---
  function createModal() {
    removeExistingModal();

    var overlay = document.createElement('div');
    overlay.id = 'churnguard-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.style.cssText = [
      'position:fixed', 'inset:0', 'background:rgba(10,10,20,0.6)',
      'backdrop-filter:blur(6px)', '-webkit-backdrop-filter:blur(6px)',
      'z-index:2147483647', 'display:flex', 'align-items:center',
      'justify-content:center', 'padding:20px',
      'font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif',
      'animation:cgFadeIn 0.2s ease-out'
    ].join(';');

    var box = document.createElement('div');
    box.style.cssText = [
      'background:' + UI.bg, 'border-radius:18px', 'padding:32px',
      'max-width:420px', 'width:100%',
      'box-shadow:0 25px 70px rgba(0,0,0,0.35)', 'box-sizing:border-box',
      'animation:cgSlideUp 0.3s ease-out', 'max-height:90vh', 'overflow-y:auto'
    ].join(';');

    overlay.appendChild(box);
    document.body.appendChild(overlay);
    currentOverlay = overlay;

    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeModal();
    });

    currentEscapeHandler = function (e) {
      if (e.key === 'Escape') closeModal();
    };
    document.addEventListener('keydown', currentEscapeHandler);

    return box;
  }

  function removeExistingModal() {
    var existing = document.getElementById('churnguard-overlay');
    if (existing && existing.parentNode) existing.parentNode.removeChild(existing);
  }

  function closeModal() {
    if (!currentOverlay) return;
    var overlay = currentOverlay;

    if (currentEscapeHandler) {
      document.removeEventListener('keydown', currentEscapeHandler);
      currentEscapeHandler = null;
    }

    overlay.style.transition = 'opacity 0.15s';
    overlay.style.opacity = '0';
    setTimeout(function () {
      if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
    }, 150);
    currentOverlay = null;
  }

  function completeCancellation() {
    closeModal();
    if (typeof config.onCancelConfirmed === 'function') {
      try {
        config.onCancelConfirmed();
      } catch (err) {
        console.error('[ChurnGuard] onCancelConfirmed failed:', err);
      }
    } else if (config.cancelUrl) {
      window.location.href = config.cancelUrl;
    }
  }

  // --- Step 1: Reason Selection ---
  function renderReasonStep(box) {
    clearElement(box);

    box.appendChild(el(
      'h3',
      'margin:0 0 6px;font-size:20px;font-weight:700;color:' + UI.text + ';line-height:1.3;',
      { text: 'Before you go...' }
    ));

    box.appendChild(el(
      'p',
      'margin:0 0 22px;font-size:14px;color:' + UI.textMuted + ';line-height:1.5;',
      { text: "We'd love to understand what's not working. Your feedback helps us improve." }
    ));

    REASONS.forEach(function (reason) {
      var btn = el('button', [
        'display:block', 'width:100%', 'text-align:left', 'padding:14px 18px',
        'margin-bottom:10px', 'border:1.5px solid ' + UI.border,
        'border-radius:12px', 'background:' + UI.bgSubtle, 'cursor:pointer',
        'font-size:14px', 'font-weight:500', 'color:' + UI.text,
        'transition:all 0.15s', 'font-family:inherit'
      ].join(';'), { type: 'button', text: reason.label });

      btn.addEventListener('mouseenter', function () {
        btn.style.borderColor = UI.brand;
        btn.style.background = '#f5f3ff';
        btn.style.transform = 'translateY(-1px)';
      });
      btn.addEventListener('mouseleave', function () {
        btn.style.borderColor = UI.border;
        btn.style.background = UI.bgSubtle;
        btn.style.transform = 'translateY(0)';
      });
      btn.addEventListener('click', function () { submitReason(reason.label, box); });
      box.appendChild(btn);
    });

    var skip = el(
      'button',
      'margin-top:12px;background:none;border:none;color:' + UI.textSubtle +
      ';font-size:13px;cursor:pointer;padding:8px;font-family:inherit;width:100%;text-decoration:underline;',
      { type: 'button', text: 'Skip and cancel' }
    );
    skip.addEventListener('click', completeCancellation);
    box.appendChild(skip);
  }

  // --- Step 2: Loading ---
  function renderLoadingStep(box, message) {
    clearElement(box);
    var wrapper = el('div', 'text-align:center;padding:20px 0;', null);
    wrapper.appendChild(el(
      'div',
      'display:inline-block;width:32px;height:32px;border:3px solid ' + UI.border +
      ';border-top-color:' + UI.brand + ';border-radius:50%;animation:cgSpin 0.7s linear infinite;',
      null
    ));
    wrapper.appendChild(el(
      'p',
      'margin:16px 0 0;font-size:14px;color:' + UI.textMuted + ';',
      { text: message || 'Thinking...' }
    ));
    box.appendChild(wrapper);
  }

  // --- Step 3: AI Follow-up Question ---
  function renderFollowUpStep(box, eventId, question, reason) {
    clearElement(box);

    box.appendChild(el(
      'h3',
      'margin:0 0 8px;font-size:18px;font-weight:700;color:' + UI.text + ';line-height:1.3;',
      { text: 'One more thing' }
    ));
    box.appendChild(el(
      'p',
      'margin:0 0 18px;font-size:15px;color:' + UI.text + ';line-height:1.5;font-weight:500;',
      { text: question }
    ));

    var textarea = el('textarea', [
      'width:100%', 'padding:12px 14px', 'border:1.5px solid ' + UI.border,
      'border-radius:12px', 'font-size:14px', 'font-family:inherit',
      'resize:vertical', 'min-height:80px', 'box-sizing:border-box',
      'color:' + UI.text, 'transition:border-color 0.15s', 'outline:none'
    ].join(';'), { rows: '3', placeholder: 'Your thoughts (optional)...' });

    textarea.addEventListener('focus', function () { textarea.style.borderColor = UI.brand; });
    textarea.addEventListener('blur', function () { textarea.style.borderColor = UI.border; });
    box.appendChild(textarea);

    var submitBtn = el('button', [
      'margin-top:16px', 'width:100%', 'padding:14px',
      'background:' + UI.brandGradient, 'color:#ffffff', 'border:none',
      'border-radius:12px', 'font-size:14px', 'font-weight:600',
      'cursor:pointer', 'font-family:inherit', 'transition:all 0.15s',
      'box-shadow:0 4px 14px rgba(139,92,246,0.3)'
    ].join(';'), { type: 'button', text: 'Continue' });

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
        .catch(function (err) { console.error('[ChurnGuard] Failed to save answer:', err); })
        .then(function () { fetchAndShowOffer(box, eventId, reason, answer); });
    });
    box.appendChild(submitBtn);

    var skip = el(
      'button',
      'margin-top:10px;background:none;border:none;color:' + UI.textSubtle +
      ';font-size:13px;cursor:pointer;padding:8px;font-family:inherit;width:100%;text-decoration:underline;',
      { type: 'button', text: 'Skip and cancel' }
    );
    skip.addEventListener('click', completeCancellation);
    box.appendChild(skip);
  }

  // --- Step 4: Retention Offer ---
  function fetchAndShowOffer(box, eventId, reason, answer) {
    renderLoadingStep(box, 'Preparing something...');

    fetch(API_BASE + '/api/retention', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event_id: eventId,
        reason: reason,
        follow_up_answer: answer
      })
    })
      .then(function (res) {
        return res.json().then(function (d) { return { ok: res.ok, data: d }; });
      })
      .then(function (result) {
        if (!result.ok || !result.data.offer) {
          recordDecision(eventId, false);
          completeCancellation();
          return;
        }
        renderOfferStep(box, eventId, result.data.offer);
      })
      .catch(function (err) {
        console.error('[ChurnGuard] Failed to fetch offer:', err);
        recordDecision(eventId, false);
        completeCancellation();
      });
  }

  function renderOfferStep(box, eventId, offerText) {
    clearElement(box);

    box.appendChild(el(
      'h3',
      'margin:0 0 10px;font-size:18px;font-weight:700;color:' + UI.text + ';line-height:1.3;',
      { text: 'Wait, before you cancel' }
    ));
    box.appendChild(el(
      'p',
      'margin:0 0 22px;font-size:15px;color:' + UI.text + ';line-height:1.55;',
      { text: offerText }
    ));

    var acceptBtn = el('button', [
      'width:100%', 'padding:14px', 'margin-bottom:10px',
      'background:' + UI.brandGradient, 'color:#ffffff', 'border:none',
      'border-radius:12px', 'font-size:14px', 'font-weight:600',
      'cursor:pointer', 'font-family:inherit', 'transition:all 0.15s',
      'box-shadow:0 4px 14px rgba(139,92,246,0.3)'
    ].join(';'), { type: 'button', text: 'Yes, keep my account' });

    acceptBtn.addEventListener('click', function () {
      recordDecision(eventId, true);
      closeModal();
      if (typeof config.onOfferAccepted === 'function') {
        try { config.onOfferAccepted(); } catch (err) {
          console.error('[ChurnGuard] onOfferAccepted failed:', err);
        }
      } else {
        alert("We've noted your response - the offer will be applied to your account shortly.");
      }
    });
    box.appendChild(acceptBtn);

    var declineBtn = el('button', [
      'width:100%', 'padding:14px', 'background:' + UI.bg,
      'color:' + UI.text, 'border:1.5px solid ' + UI.border,
      'border-radius:12px', 'font-size:14px', 'font-weight:500',
      'cursor:pointer', 'font-family:inherit', 'transition:all 0.15s'
    ].join(';'), { type: 'button', text: 'No thanks, cancel my subscription' });

    declineBtn.addEventListener('mouseenter', function () { declineBtn.style.background = '#f9fafb'; });
    declineBtn.addEventListener('mouseleave', function () { declineBtn.style.background = UI.bg; });
    declineBtn.addEventListener('click', function () {
      recordDecision(eventId, false);
      completeCancellation();
    });
    box.appendChild(declineBtn);
  }

  // --- Network: Submit Reason ---
  function submitReason(reason, box) {
    renderLoadingStep(box, 'Thinking...');

    fetch(API_BASE + '/api/follow-up', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ public_key: publicKey, reason: reason })
    })
      .then(function (res) {
        return res.json().then(function (d) {
          return { status: res.status, ok: res.ok, data: d };
        });
      })
      .then(function (result) {
        if (result.status === 429) {
          renderErrorStep(box, 'Too many requests. Please wait a few seconds and try again.', true, function () {
            submitReason(reason, box);
          });
          return;
        }
        if (result.status === 404) {
          renderErrorStep(box, 'This widget is not configured correctly. Please contact support.', false);
          return;
        }
        if (!result.ok) {
          renderErrorStep(box, 'Server error. Please try again in a moment.', true, function () {
            submitReason(reason, box);
          });
          return;
        }
        if (result.data && result.data.success && result.data.event_id) {
          renderFollowUpStep(box, result.data.event_id, result.data.question, reason);
          return;
        }
        renderErrorStep(box, 'Unexpected response. Please try again.', true, function () {
          submitReason(reason, box);
        });
      })
      .catch(function (err) {
        console.error('[ChurnGuard] Network error:', err);
        renderErrorStep(box, 'Could not connect. Please check your internet.', true, function () {
          submitReason(reason, box);
        });
      });
  }

  // --- Error Step ---
  function renderErrorStep(box, message, canRetry, onRetry) {
    clearElement(box);

    box.appendChild(el('div', 'text-align:center;font-size:40px;margin-bottom:12px;line-height:1;', { text: '!' }));
    box.appendChild(el('h3', 'margin:0 0 8px;font-size:18px;font-weight:700;color:' + UI.text + ';text-align:center;', { text: 'Something went wrong' }));
    box.appendChild(el('p', 'margin:0 0 22px;font-size:14px;color:' + UI.textMuted + ';text-align:center;line-height:1.5;', { text: message }));

    if (canRetry && typeof onRetry === 'function') {
      var retryBtn = el('button', [
        'width:100%', 'padding:13px', 'background:' + UI.brandGradient,
        'color:#ffffff', 'border:none', 'border-radius:12px',
        'font-size:14px', 'font-weight:600', 'cursor:pointer',
        'font-family:inherit', 'margin-bottom:10px'
      ].join(';'), { type: 'button', text: 'Try again' });
      retryBtn.addEventListener('click', onRetry);
      box.appendChild(retryBtn);
    }

    var cancelBtn = el('button', [
      'width:100%', 'padding:13px', 'background:#f3f4f6', 'color:#374151',
      'border:none', 'border-radius:12px', 'font-size:14px', 'font-weight:600',
      'cursor:pointer', 'font-family:inherit'
    ].join(';'), { type: 'button', text: 'Continue cancel' });
    cancelBtn.addEventListener('click', completeCancellation);
    box.appendChild(cancelBtn);
  }

  // --- Record Decision ---
  function recordDecision(eventId, accepted) {
    var payload = { event_id: eventId, accepted: accepted };

    if (typeof config.customerMrr === 'number' && config.customerMrr >= 0) {
      payload.customer_mrr = config.customerMrr;
    }

    fetch(API_BASE + '/api/decision', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).catch(function (err) {
      console.error('[ChurnGuard] Failed to record decision:', err);
    });
  }

  // --- Public API ---
  function show() {
    var box = createModal();
    renderReasonStep(box);
  }

  window.ChurnGuard = { show: show, hide: closeModal };

  // --- Auto-wire Triggers ---
  function init() {
    var triggers = document.querySelectorAll('[data-churnguard-trigger]');
    triggers.forEach(function (trigger) {
      trigger.addEventListener('click', function (e) {
        e.preventDefault();
        show();
      });
    });
  }

  // --- Bootstrap ---
  function boot() {
    injectStyles();
    init();
    console.log('[ChurnGuard] Widget v4.0 ready');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();