/*
 * broadcast-init.js — Broadcast Messages + Progressive Notifications
 * v1.4 — showBroadcastToast removed: #op-message-banner in index.html
 *         is the sole display for all player-facing messages.
 *
 * v1.3 — Dead code removed: subscribeSystemCommands (no-op Realtime channel),
 *          handleSystemCommand (always false), onForceNotify handler
 */

(function () {

  /* ─── Wire Progressive message handler ────────────────────────────── */
  /* Progressive.onMessage() is registered in index.html (op-message-banner).
     No second handler needed here — single display, no duplicate toasts. */
  function wireHandlers() {
    if (typeof Progressive === 'undefined') {
      setTimeout(wireHandlers, 200);
      return;
    }
    console.log('[broadcast-init] v1.4 wired');
  }
  wireHandlers();

}());
