(function() {
  // 1. إعدادات الـ Widget من الـ HTML
  const CONFIG = window.ChurnGuardConfig || {};

  if (!CONFIG.publicKey) {
    console.error('ChurnGuard: publicKey is required. Set window.ChurnGuardConfig = { publicKey: "YOUR_KEY" }');
    return;
  }

  // 2. إنشاء النافذة المنبثقة
  const modal = document.createElement('div');
  modal.id = 'churnguard-modal';
  modal.style.cssText = `
    display: none;
    position: fixed;
    top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0,0,0,0.6);
    backdrop-filter: blur(4px);
    z-index: 9999;
    justify-content: center;
    align-items: center;
  `;
  modal.innerHTML = `
    <div style="
      background: #1e293b;
      color: white;
      padding: 2rem;
      border-radius: 24px;
      max-width: 400px;
      width: 90%;
      box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    ">
      <h2 style="margin-top: 0; color: #f1f5f9;">😢 We're sorry to see you go</h2>
      <p style="color: #94a3b8; font-size: 0.9rem;">Mind telling us why you're cancelling?</p>
      <textarea id="churnguard-reason" rows="3" style="
        width: 100%;
        padding: 0.75rem;
        border-radius: 12px;
        border: 1px solid #334155;
        background: #0f172a;
        color: white;
        resize: vertical;
        font-family: inherit;
        margin-top: 0.5rem;
      " placeholder="Your feedback helps us improve..."></textarea>
      <div style="display: flex; gap: 0.75rem; margin-top: 1.5rem;">
        <button id="churnguard-submit" style="
          flex: 1;
          background: #3b82f6;
          border: none;
          color: white;
          padding: 0.75rem;
          border-radius: 40px;
          font-weight: 600;
          cursor: pointer;
          transition: 0.2s;
        ">Send & Cancel</button>
        <button id="churnguard-cancel" style="
          flex: 1;
          background: transparent;
          border: 1px solid #475569;
          color: #cbd5e1;
          padding: 0.75rem;
          border-radius: 40px;
          font-weight: 600;
          cursor: pointer;
          transition: 0.2s;
        ">Just Cancel</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  // 3. دوال التحكم
  const showModal = () => {
    modal.style.display = 'flex';
    document.getElementById('churnguard-reason').focus();
  };

  const hideModal = () => {
    modal.style.display = 'none';
  };

  // 4. إرسال السبب
  const submitReason = async () => {
    const reason = document.getElementById('churnguard-reason').value.trim();
    if (!reason) {
      alert('Please tell us why you are cancelling.');
      return;
    }

    try {
      const response = await fetch('https://churnguard-sandy.vercel.app/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          public_key: CONFIG.publicKey,
          reason: reason,
          customer_email: CONFIG.customerEmail || null
        })
      });

      const data = await response.json();
      console.log('ChurnGuard: Feedback sent', data);
    } catch (err) {
      console.error('ChurnGuard: Error sending feedback', err);
    }

    hideModal();
    if (CONFIG.originalCancel && typeof CONFIG.originalCancel === 'function') {
      CONFIG.originalCancel();
    } else {
      window.location.href = CONFIG.cancelUrl || '/cancel';
    }
  };

  // 5. ربط الأزرار
  document.getElementById('churnguard-submit').addEventListener('click', submitReason);
  document.getElementById('churnguard-cancel').addEventListener('click', () => {
    hideModal();
    if (CONFIG.originalCancel && typeof CONFIG.originalCancel === 'function') {
      CONFIG.originalCancel();
    } else {
      window.location.href = CONFIG.cancelUrl || '/cancel';
    }
  });

  // 6. إظهار النافذة
  window.ChurnGuard = {
    show: showModal,
    hide: hideModal,
  };

  // 7. تدخل على زر الإلغاء
  const cancelButtons = document.querySelectorAll('[data-churnguard-trigger]');
  cancelButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      showModal();
    });
  });

  console.log('ChurnGuard: Widget initialized with key', CONFIG.publicKey);
})();