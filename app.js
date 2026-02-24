// ===== Math Buddy - AI Math Tutor for Kids =====
// Integrates with ElevenLabs Conversational AI Agent

(function () {
    "use strict";

    // ===== CONFIGURATION =====
    const CONFIG = {
        // >>> REPLACE WITH YOUR ELEVENLABS AGENT ID <<<
        ELEVENLABS_AGENT_ID: "YOUR_AGENT_ID_HERE",

        // Free tier: 7 minutes (420 seconds)
        FREE_TIER_SECONDS: 7 * 60,

        // Paid tier: 60 minutes per week (3600 seconds)
        PAID_TIER_SECONDS: 60 * 60,

        // Subscription price
        PRICE_PER_WEEK: 9.99,

        // Local storage keys
        STORAGE_KEY_USER: "mathbuddy_user",
        STORAGE_KEY_USAGE: "mathbuddy_usage",
        STORAGE_KEY_SUBSCRIPTION: "mathbuddy_subscription",
    };

    // ===== STATE =====
    const state = {
        user: null,           // { name, email, phone, childName }
        usageSeconds: 0,      // total seconds used
        isSubscribed: false,
        subscriptionExpiry: null,
        sessionActive: false,
        sessionTimer: null,
        sessionStartTime: null,
        conversation: null,   // ElevenLabs conversation instance
        widgetElement: null,  // ElevenLabs widget element
    };

    // ===== DOM ELEMENTS =====
    const $ = (id) => document.getElementById(id);
    const screens = {
        register: $("screen-register"),
        dashboard: $("screen-dashboard"),
        session: $("screen-session"),
        paywall: $("screen-paywall"),
        settings: $("screen-settings"),
    };

    const els = {
        // Registration
        registerForm: $("register-form"),
        inputName: $("input-name"),
        inputEmail: $("input-email"),
        inputPhone: $("input-phone"),
        inputChildName: $("input-child-name"),

        // Dashboard
        dashChildName: $("dash-child-name"),
        dashTimeRemaining: $("dash-time-remaining"),
        dashPlanLabel: $("dash-plan-label"),
        dashPlanDetail: $("dash-plan-detail"),
        timeRingFill: $("time-ring-fill"),
        btnStartSession: $("btn-start-session"),
        btnSettings: $("btn-settings"),

        // Session
        btnEndSession: $("btn-end-session"),
        sessionTimerDisplay: $("session-timer-display"),
        timerDot: $("timer-dot"),
        sessionChildLabel: $("session-child-label"),
        agentContainer: $("agent-container"),
        avatarCircle: $("avatar-circle"),
        avatarPulse: $("avatar-pulse"),
        avatarIcon: $("avatar-icon"),
        agentStatus: $("agent-status"),
        agentTranscript: $("agent-transcript"),
        widgetContainer: $("elevenlabs-widget-container"),
        btnMic: $("btn-mic"),

        // Paywall
        paywallChildMsg: $("paywall-child-msg"),
        btnSubscribe: $("btn-subscribe"),
        btnPaywallBack: $("btn-paywall-back"),

        // Settings
        btnSettingsBack: $("btn-settings-back"),
        settingsName: $("settings-name"),
        settingsEmail: $("settings-email"),
        settingsPhone: $("settings-phone"),
        settingsChild: $("settings-child"),
        settingsPlan: $("settings-plan"),
        settingsTimeUsed: $("settings-time-used"),
        settingsTimeRemaining: $("settings-time-remaining"),
        btnUpgrade: $("btn-upgrade"),
        btnLogout: $("btn-logout"),

        // Modal
        modalTimesUp: $("modal-times-up"),
        modalTimesUpMsg: $("modal-times-up-msg"),
        btnModalUpgrade: $("btn-modal-upgrade"),
        btnModalDismiss: $("btn-modal-dismiss"),
    };

    // ===== INITIALIZATION =====
    function init() {
        loadUserData();
        bindEvents();

        if (state.user) {
            showScreen("dashboard");
            updateDashboard();
        } else {
            showScreen("register");
        }
    }

    // ===== PERSISTENCE =====
    function loadUserData() {
        try {
            const userData = localStorage.getItem(CONFIG.STORAGE_KEY_USER);
            if (userData) {
                state.user = JSON.parse(userData);
            }

            const usageData = localStorage.getItem(CONFIG.STORAGE_KEY_USAGE);
            if (usageData) {
                const usage = JSON.parse(usageData);
                state.usageSeconds = usage.seconds || 0;

                // Reset weekly usage if a new week has started
                if (usage.weekStart) {
                    const weekStart = new Date(usage.weekStart);
                    const now = new Date();
                    const daysSince = (now - weekStart) / (1000 * 60 * 60 * 24);
                    if (daysSince >= 7) {
                        state.usageSeconds = 0;
                        saveUsageData();
                    }
                }
            }

            const subData = localStorage.getItem(CONFIG.STORAGE_KEY_SUBSCRIPTION);
            if (subData) {
                const sub = JSON.parse(subData);
                state.isSubscribed = sub.active || false;
                state.subscriptionExpiry = sub.expiry ? new Date(sub.expiry) : null;

                // Check if subscription has expired
                if (state.subscriptionExpiry && new Date() > state.subscriptionExpiry) {
                    state.isSubscribed = false;
                    state.subscriptionExpiry = null;
                    saveSubscriptionData();
                }
            }
        } catch (e) {
            console.error("Error loading user data:", e);
        }
    }

    function saveUserData() {
        localStorage.setItem(CONFIG.STORAGE_KEY_USER, JSON.stringify(state.user));
    }

    function saveUsageData() {
        const stored = localStorage.getItem(CONFIG.STORAGE_KEY_USAGE);
        let weekStart;
        if (stored) {
            const parsed = JSON.parse(stored);
            weekStart = parsed.weekStart || new Date().toISOString();
        } else {
            weekStart = new Date().toISOString();
        }

        localStorage.setItem(CONFIG.STORAGE_KEY_USAGE, JSON.stringify({
            seconds: state.usageSeconds,
            weekStart: weekStart,
        }));
    }

    function saveSubscriptionData() {
        localStorage.setItem(CONFIG.STORAGE_KEY_SUBSCRIPTION, JSON.stringify({
            active: state.isSubscribed,
            expiry: state.subscriptionExpiry ? state.subscriptionExpiry.toISOString() : null,
        }));
    }

    // ===== EVENT BINDING =====
    function bindEvents() {
        // Registration
        els.registerForm.addEventListener("submit", handleRegister);

        // Dashboard
        els.btnStartSession.addEventListener("click", startSession);
        els.btnSettings.addEventListener("click", () => {
            updateSettings();
            showScreen("settings");
        });

        // Session
        els.btnEndSession.addEventListener("click", endSession);
        els.btnMic.addEventListener("click", toggleMic);

        // Paywall
        els.btnSubscribe.addEventListener("click", handleSubscribe);
        els.btnPaywallBack.addEventListener("click", () => {
            showScreen("dashboard");
            updateDashboard();
        });

        // Settings
        els.btnSettingsBack.addEventListener("click", () => {
            showScreen("dashboard");
            updateDashboard();
        });
        els.btnUpgrade.addEventListener("click", () => showScreen("paywall"));
        els.btnLogout.addEventListener("click", handleLogout);

        // Modal
        els.btnModalUpgrade.addEventListener("click", () => {
            els.modalTimesUp.style.display = "none";
            showScreen("paywall");
        });
        els.btnModalDismiss.addEventListener("click", () => {
            els.modalTimesUp.style.display = "none";
            showScreen("dashboard");
            updateDashboard();
        });
    }

    // ===== SCREEN MANAGEMENT =====
    function showScreen(name) {
        Object.values(screens).forEach(s => s.classList.remove("active"));
        if (screens[name]) {
            screens[name].classList.add("active");
        }
    }

    // ===== REGISTRATION =====
    function handleRegister(e) {
        e.preventDefault();

        const name = els.inputName.value.trim();
        const email = els.inputEmail.value.trim();
        const phone = els.inputPhone.value.trim();
        const childName = els.inputChildName.value.trim();

        if (!name || !email || !phone || !childName) return;

        state.user = { name, email, phone, childName };
        state.usageSeconds = 0;

        saveUserData();
        saveUsageData();

        showScreen("dashboard");
        updateDashboard();
    }

    // ===== DASHBOARD =====
    function updateDashboard() {
        if (!state.user) return;

        els.dashChildName.textContent = state.user.childName;

        const maxSeconds = getTotalAllowedSeconds();
        const remaining = Math.max(0, maxSeconds - state.usageSeconds);

        els.dashTimeRemaining.textContent = formatTime(remaining);

        // Update ring
        const circumference = 326.73; // 2 * PI * 52
        const fraction = remaining / maxSeconds;
        const offset = circumference * (1 - fraction);
        els.timeRingFill.style.strokeDashoffset = offset;

        if (fraction < 0.2) {
            els.timeRingFill.classList.add("low");
        } else {
            els.timeRingFill.classList.remove("low");
        }

        // Plan info
        if (state.isSubscribed) {
            els.dashPlanLabel.textContent = "Weekly Plan";
            els.dashPlanDetail.textContent = "60 minutes of math fun per week";
        } else {
            els.dashPlanLabel.textContent = "Free Trial";
            els.dashPlanDetail.textContent = "7 minutes of math fun";
        }

        // Disable start if no time left
        els.btnStartSession.disabled = remaining <= 0;
    }

    function getTotalAllowedSeconds() {
        return state.isSubscribed ? CONFIG.PAID_TIER_SECONDS : CONFIG.FREE_TIER_SECONDS;
    }

    // ===== SESSION MANAGEMENT =====
    function startSession() {
        const maxSeconds = getTotalAllowedSeconds();
        const remaining = maxSeconds - state.usageSeconds;

        if (remaining <= 0) {
            showPaywall();
            return;
        }

        state.sessionActive = true;
        state.sessionStartTime = Date.now();
        showScreen("session");

        // Set child name in session header
        els.sessionChildLabel.textContent = state.user.childName;

        // Update timer display
        updateSessionTimer();

        // Start the countdown timer
        state.sessionTimer = setInterval(() => {
            if (!state.sessionActive) return;

            // Calculate elapsed time this session
            const elapsed = Math.floor((Date.now() - state.sessionStartTime) / 1000);
            const totalUsed = state.usageSeconds + elapsed;
            const maxSec = getTotalAllowedSeconds();
            const remaining = Math.max(0, maxSec - totalUsed);

            // Update timer display
            els.sessionTimerDisplay.textContent = formatTime(remaining);

            // Low time warning (under 1 minute)
            if (remaining < 60) {
                els.timerDot.classList.add("low");
            } else {
                els.timerDot.classList.remove("low");
            }

            // Time's up
            if (remaining <= 0) {
                endSession();
                showTimesUpModal();
            }
        }, 1000);

        // Start ElevenLabs conversation
        startElevenLabsConversation();
    }

    function endSession() {
        if (!state.sessionActive) return;

        state.sessionActive = false;

        // Calculate and save elapsed time
        if (state.sessionStartTime) {
            const elapsed = Math.floor((Date.now() - state.sessionStartTime) / 1000);
            state.usageSeconds += elapsed;
            saveUsageData();
        }

        // Stop timer
        if (state.sessionTimer) {
            clearInterval(state.sessionTimer);
            state.sessionTimer = null;
        }

        // Stop ElevenLabs conversation
        stopElevenLabsConversation();

        // Reset UI
        els.avatarCircle.classList.remove("speaking");
        els.avatarPulse.classList.remove("active");
        els.btnMic.classList.remove("active");
        els.agentTranscript.innerHTML = "";
        els.agentStatus.textContent = "Tap the button below to start talking!";
        els.timerDot.classList.remove("low");

        showScreen("dashboard");
        updateDashboard();
    }

    function updateSessionTimer() {
        const maxSec = getTotalAllowedSeconds();
        const remaining = Math.max(0, maxSec - state.usageSeconds);
        els.sessionTimerDisplay.textContent = formatTime(remaining);
    }

    // ===== ELEVENLABS INTEGRATION =====
    function startElevenLabsConversation() {
        els.agentStatus.textContent = "Connecting to Math Buddy...";
        els.avatarPulse.classList.add("active");

        // Create the ElevenLabs convai widget element
        if (state.widgetElement) {
            state.widgetElement.remove();
        }

        state.widgetElement = document.createElement("elevenlabs-convai");
        state.widgetElement.setAttribute("agent-id", CONFIG.ELEVENLABS_AGENT_ID);
        els.widgetContainer.appendChild(state.widgetElement);

        // Listen for widget events
        setupWidgetEventListeners();

        // Update status after a brief delay
        setTimeout(() => {
            if (state.sessionActive) {
                els.agentStatus.textContent = "Math Buddy is ready! Start talking!";
                els.avatarCircle.classList.add("speaking");
            }
        }, 2000);
    }

    function setupWidgetEventListeners() {
        // The ElevenLabs widget dispatches custom events
        // Listen for conversation events on the widget element
        if (!state.widgetElement) return;

        state.widgetElement.addEventListener("elevenlabs-convai:call", (event) => {
            // Conversation is starting
            els.agentStatus.textContent = "Math Buddy is listening...";
            els.avatarPulse.classList.add("active");
        });

        state.widgetElement.addEventListener("elevenlabs-convai:end", () => {
            // Conversation ended
            els.agentStatus.textContent = "Session ended";
            els.avatarCircle.classList.remove("speaking");
            els.avatarPulse.classList.remove("active");
        });

        // Listen for agent status changes on the document
        document.addEventListener("elevenlabs-convai:status", (event) => {
            const detail = event.detail;
            if (detail && detail.status === "connected") {
                els.agentStatus.textContent = "Math Buddy is ready! Start talking!";
                els.avatarCircle.classList.add("speaking");
            } else if (detail && detail.status === "disconnected") {
                els.agentStatus.textContent = "Disconnected. Tap mic to reconnect.";
                els.avatarCircle.classList.remove("speaking");
                els.avatarPulse.classList.remove("active");
            }
        });

        // Listen for transcription messages
        document.addEventListener("elevenlabs-convai:message", (event) => {
            const detail = event.detail;
            if (detail) {
                addTranscriptBubble(detail.source || "agent", detail.message || "");
            }
        });
    }

    function stopElevenLabsConversation() {
        if (state.widgetElement) {
            state.widgetElement.remove();
            state.widgetElement = null;
        }
    }

    function toggleMic() {
        // The mic button provides visual feedback
        // The actual mic control is handled by the ElevenLabs widget
        els.btnMic.classList.toggle("active");

        if (els.btnMic.classList.contains("active")) {
            els.agentStatus.textContent = "Listening...";
            els.avatarPulse.classList.add("active");
        } else {
            els.agentStatus.textContent = "Tap mic to talk";
            els.avatarPulse.classList.remove("active");
        }
    }

    function addTranscriptBubble(role, text) {
        if (!text.trim()) return;

        const bubble = document.createElement("div");
        bubble.className = "transcript-bubble " + (role === "user" ? "user" : "agent");
        bubble.textContent = text;
        els.agentTranscript.appendChild(bubble);

        // Auto-scroll to bottom
        els.agentTranscript.scrollTop = els.agentTranscript.scrollHeight;

        // Limit transcript history (keep last 20 messages)
        while (els.agentTranscript.children.length > 20) {
            els.agentTranscript.removeChild(els.agentTranscript.firstChild);
        }
    }

    // ===== PAYWALL =====
    function showPaywall() {
        if (state.user) {
            els.paywallChildMsg.textContent =
                state.user.childName + " used all the free minutes.";
        }
        showScreen("paywall");
    }

    function showTimesUpModal() {
        els.modalTimesUp.style.display = "flex";
        if (state.user) {
            els.modalTimesUpMsg.textContent =
                state.user.childName + "'s session time is up.";
        }
    }

    function handleSubscribe() {
        // In production, this would trigger StoreKit / Apple IAP via Capacitor plugin.
        // For now, simulate a successful subscription.
        state.isSubscribed = true;
        const expiry = new Date();
        expiry.setDate(expiry.getDate() + 7); // 1 week from now
        state.subscriptionExpiry = expiry;

        // Reset usage for the new subscription period
        state.usageSeconds = 0;

        saveSubscriptionData();
        saveUsageData();

        showScreen("dashboard");
        updateDashboard();
    }

    // ===== SETTINGS =====
    function updateSettings() {
        if (!state.user) return;

        els.settingsName.textContent = state.user.name;
        els.settingsEmail.textContent = state.user.email;
        els.settingsPhone.textContent = state.user.phone;
        els.settingsChild.textContent = state.user.childName;

        els.settingsPlan.textContent = state.isSubscribed ? "Weekly ($9.99/wk)" : "Free Trial";

        const totalUsed = state.usageSeconds;
        els.settingsTimeUsed.textContent = formatTime(totalUsed);

        const maxSec = getTotalAllowedSeconds();
        const remaining = Math.max(0, maxSec - totalUsed);
        els.settingsTimeRemaining.textContent = formatTime(remaining);

        // Show/hide upgrade button based on subscription status
        els.btnUpgrade.style.display = state.isSubscribed ? "none" : "block";
    }

    function handleLogout() {
        if (!confirm("Sign out? Your usage data will be cleared.")) return;

        // End any active session
        if (state.sessionActive) {
            endSession();
        }

        // Clear all data
        localStorage.removeItem(CONFIG.STORAGE_KEY_USER);
        localStorage.removeItem(CONFIG.STORAGE_KEY_USAGE);
        localStorage.removeItem(CONFIG.STORAGE_KEY_SUBSCRIPTION);

        state.user = null;
        state.usageSeconds = 0;
        state.isSubscribed = false;
        state.subscriptionExpiry = null;

        // Reset form
        els.registerForm.reset();

        showScreen("register");
    }

    // ===== HELPERS =====
    function formatTime(totalSeconds) {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
    }

    // ===== START =====
    init();
})();
