// ===== Hanuman Chalisa Kids App - Main Logic =====

(function () {
    "use strict";

    // ===== STATE =====
    const state = {
        currentVerse: 0,
        stars: 0,
        isPlaying: false,
        isRecording: false,
        hasListened: false,
        attemptCount: 0,
        versesCompleted: new Set(),
        speechSynthesis: window.speechSynthesis,
        recognition: null,
        hindiVoice: null,
        englishVoice: null,
        mediaRecorder: null,
        audioChunks: [],
        recordedAudioURL: null,
        audioStream: null,
        blessingCount: 0,       // tracks how many blessing screens shown
    };

    // ===== DOM ELEMENTS =====
    const $ = (id) => document.getElementById(id);
    const screens = {
        start: $("start-screen"),
        learn: $("learn-screen"),
        blessing: $("blessing-screen"),
        celebration: $("celebration-screen"),
    };
    const els = {
        startBtn: $("start-btn"),
        homeBtn: $("home-btn"),
        listenBtn: $("listen-btn"),
        listenSlowBtn: $("listen-slow-btn"),
        myTurnBtn: $("my-turn-btn"),
        skipBtn: $("skip-btn"),
        stopRecordingBtn: $("stop-recording-btn"),
        prevBtn: $("prev-btn"),
        nextBtn: $("next-btn"),
        restartBtn: $("restart-btn"),
        continueBtn: $("continue-btn"),
        enableAudioBtn: $("enable-audio-btn"),
        progressBar: $("progress-bar"),
        progressText: $("progress-text"),
        starCount: $("star-count"),
        starsEarned: $("stars-earned"),
        guideMessage: $("guide-message"),
        verseNumber: $("verse-number"),
        verseHindi: $("verse-hindi"),
        verseTranslit: $("verse-translit"),
        verseMeaning: $("verse-meaning"),
        verseCard: $("verse-card"),
        highlightWord: $("highlight-word"),
        recordingIndicator: $("recording-indicator"),
        feedbackArea: $("feedback-area"),
        feedbackContent: $("feedback-content"),
        speechBubble: $("speech-bubble"),
        confettiContainer: $("confetti-container"),
        finalStars: $("final-stars"),
        audioPermission: $("audio-permission"),
        playbackBtn: $("playback-btn"),
        aiHanumanImage: $("ai-hanuman-image"),
        blessingMessage: $("blessing-message"),
        newsContext: $("news-context"),
    };

    // ===== INITIALIZATION =====
    function init() {
        setupSpeechSynthesis();
        setupSpeechRecognition();
        bindEvents();
    }

    function setupSpeechSynthesis() {
        // Load voices (may be async)
        function loadVoices() {
            const voices = state.speechSynthesis.getVoices();
            // Try to find Hindi voice
            state.hindiVoice = voices.find(v => v.lang.startsWith("hi")) || null;
            // English voice for transliteration
            state.englishVoice = voices.find(v => v.lang.startsWith("en") && v.name.includes("Female"))
                || voices.find(v => v.lang.startsWith("en-IN"))
                || voices.find(v => v.lang.startsWith("en"))
                || null;
        }
        loadVoices();
        if (state.speechSynthesis.onvoiceschanged !== undefined) {
            state.speechSynthesis.onvoiceschanged = loadVoices;
        }
    }

    function setupSpeechRecognition() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            console.warn("Speech recognition not supported");
            return;
        }

        state.recognition = new SpeechRecognition();
        state.recognition.continuous = true;
        state.recognition.interimResults = true;
        // Try Hindi first, fallback to English
        state.recognition.lang = "hi-IN";

        state.recognition.onresult = handleRecognitionResult;
        state.recognition.onerror = handleRecognitionError;
        state.recognition.onend = handleRecognitionEnd;
    }

    // ===== EVENT BINDING =====
    function bindEvents() {
        els.startBtn.addEventListener("click", startLearning);
        if (els.homeBtn) {
            els.homeBtn.addEventListener("click", goHome);
        }
        els.listenBtn.addEventListener("click", () => speakVerse(1.0));
        els.listenSlowBtn.addEventListener("click", () => speakVerse(0.6));
        els.myTurnBtn.addEventListener("click", startRecording);
        els.skipBtn.addEventListener("click", skipToNext);
        els.stopRecordingBtn.addEventListener("click", stopRecording);
        els.prevBtn.addEventListener("click", goToPrevVerse);
        els.nextBtn.addEventListener("click", goToNextVerse);
        els.restartBtn.addEventListener("click", restartApp);
        if (els.continueBtn) {
            els.continueBtn.addEventListener("click", continueFromBlessing);
        }
        if (els.playbackBtn) {
            els.playbackBtn.addEventListener("click", playbackRecording);
        }
        if (els.enableAudioBtn) {
            els.enableAudioBtn.addEventListener("click", () => {
                // Unlock audio context for mobile
                const utterance = new SpeechSynthesisUtterance(" ");
                utterance.volume = 0;
                state.speechSynthesis.speak(utterance);
                els.audioPermission.style.display = "none";
            });
        }

        // Add magical click effect on verse card
        if (els.verseCard) {
            els.verseCard.addEventListener("click", createMagicalSparkles);
        }
    }

    // ===== SCREEN MANAGEMENT =====
    function showScreen(name) {
        Object.values(screens).forEach(s => s.classList.remove("active"));
        screens[name].classList.add("active");
    }

    // ===== START LEARNING =====
    function startLearning() {
        showScreen("learn");
        state.currentVerse = 0;
        state.stars = 0;
        state.versesCompleted.clear();
        updateStarDisplay();
        loadVerse(0);
    }

    // ===== VERSE LOADING =====
    function loadVerse(index) {
        if (index < 0 || index >= HANUMAN_CHALISA.length) return;

        state.currentVerse = index;
        state.hasListened = false;
        state.attemptCount = 0;
        state.isPlaying = false;
        state.isRecording = false;

        // Clear recording state
        state.recordedAudioURL = null;
        state.audioChunks = [];

        const verse = HANUMAN_CHALISA[index];

        // Update verse display
        els.verseNumber.textContent = verse.section;
        els.verseHindi.textContent = verse.hindi;
        els.verseTranslit.textContent = verse.transliteration;
        els.verseMeaning.textContent = verse.meaning;

        // Reset card state
        els.verseCard.classList.remove("listening", "speaking", "success");
        els.highlightWord.classList.remove("visible");
        els.recordingIndicator.classList.remove("active");
        hideFeedback();

        // Hide playback button for new verse
        if (els.playbackBtn) {
            els.playbackBtn.style.display = "none";
        }

        // Update progress
        updateProgress();
        updateNavButtons();

        // Guide message
        const msg = randomFrom(ENCOURAGE_MESSAGES.start);
        setGuideMessage(msg);

        // Disable my-turn until they listen
        els.myTurnBtn.disabled = true;
        els.myTurnBtn.style.opacity = "0.5";

        // Add karaoke-style words to transliteration
        renderKaraokeWords();

        // Animate card entry
        els.verseCard.style.animation = "none";
        els.verseCard.offsetHeight; // reflow
        els.verseCard.style.animation = "slide-up 0.4s ease";
    }

    function renderKaraokeWords() {
        const verse = HANUMAN_CHALISA[state.currentVerse];
        const words = verse.transliteration.split(/\s+/);
        els.verseTranslit.innerHTML = words
            .map((w, i) => `<span class="word-span" data-idx="${i}">${w}</span>`)
            .join(" ");
    }

    // ===== TEXT-TO-SPEECH =====
    function speakVerse(rate) {
        if (state.isPlaying) {
            state.speechSynthesis.cancel();
            state.isPlaying = false;
            els.verseCard.classList.remove("speaking");
            resetKaraokeWords();
            return;
        }

        const verse = HANUMAN_CHALISA[state.currentVerse];

        // Cancel any ongoing speech
        state.speechSynthesis.cancel();

        state.isPlaying = true;
        els.verseCard.classList.add("speaking");
        disableControls(true);

        // Speak only the original Hindi/Sanskrit text
        const hindiUtterance = new SpeechSynthesisUtterance(verse.hindi);
        hindiUtterance.rate = rate;
        hindiUtterance.pitch = 1.1; // slightly higher for friendliness
        hindiUtterance.volume = 1.0;

        // Use Hindi voice if available
        if (state.hindiVoice) {
            hindiUtterance.voice = state.hindiVoice;
        }

        hindiUtterance.onend = () => {
            state.isPlaying = false;
            state.hasListened = true;
            els.verseCard.classList.remove("speaking");
            disableControls(false);

            // Enable My Turn button
            els.myTurnBtn.disabled = false;
            els.myTurnBtn.style.opacity = "1";

            setGuideMessage("Great listening! Now it's YOUR turn! Press the microphone! 🎤");

            // Pulse the My Turn button
            els.myTurnBtn.classList.add("pulse-btn");
            setTimeout(() => els.myTurnBtn.classList.remove("pulse-btn"), 3000);
        };

        hindiUtterance.onerror = () => {
            state.isPlaying = false;
            els.verseCard.classList.remove("speaking");
            disableControls(false);
            els.myTurnBtn.disabled = false;
            els.myTurnBtn.style.opacity = "1";
            state.hasListened = true;
        };

        state.speechSynthesis.speak(hindiUtterance);
    }

    function speakTransliteration(verse, rate) {
        const utterance = new SpeechSynthesisUtterance(verse.speakText);
        utterance.rate = rate;
        utterance.pitch = 1.1;
        utterance.volume = 1.0;

        if (state.englishVoice) {
            utterance.voice = state.englishVoice;
        }

        // Karaoke word highlighting
        const words = verse.speakText.split(/\s+/);
        const wordSpans = els.verseTranslit.querySelectorAll(".word-span");
        let wordIndex = 0;

        utterance.onboundary = (event) => {
            if (event.name === "word" && wordIndex < wordSpans.length) {
                // Remove previous highlights
                wordSpans.forEach(s => s.classList.remove("active"));
                wordSpans[wordIndex].classList.add("active");
                if (wordIndex > 0) wordSpans[wordIndex - 1].classList.add("done");
                wordIndex++;
            }
        };

        utterance.onend = () => {
            state.isPlaying = false;
            state.hasListened = true;
            els.verseCard.classList.remove("speaking");
            disableControls(false);

            // Enable My Turn button
            els.myTurnBtn.disabled = false;
            els.myTurnBtn.style.opacity = "1";

            // Mark all words as done
            wordSpans.forEach(s => {
                s.classList.remove("active");
                s.classList.add("done");
            });

            setGuideMessage("Great listening! Now it's YOUR turn! Press the microphone! 🎤");

            // Pulse the My Turn button
            els.myTurnBtn.classList.add("pulse-btn");
            setTimeout(() => els.myTurnBtn.classList.remove("pulse-btn"), 3000);
        };

        utterance.onerror = () => {
            state.isPlaying = false;
            els.verseCard.classList.remove("speaking");
            disableControls(false);
            els.myTurnBtn.disabled = false;
            els.myTurnBtn.style.opacity = "1";
            state.hasListened = true;
        };

        state.speechSynthesis.speak(utterance);
    }

    function resetKaraokeWords() {
        const wordSpans = els.verseTranslit.querySelectorAll(".word-span");
        wordSpans.forEach(s => {
            s.classList.remove("active", "done");
        });
    }

    // ===== SPEECH RECOGNITION =====
    async function startRecording() {
        if (state.isRecording) return;

        // Hide playback button when starting new recording
        if (els.playbackBtn) {
            els.playbackBtn.style.display = "none";
        }

        // Clear previous recording
        state.audioChunks = [];
        state.recordedAudioURL = null;

        // Request microphone access and start recording
        try {
            state.audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });

            // Start MediaRecorder for actual audio recording
            state.mediaRecorder = new MediaRecorder(state.audioStream);

            state.mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    state.audioChunks.push(event.data);
                }
            };

            state.mediaRecorder.onstop = () => {
                // Create audio blob and URL
                const audioBlob = new Blob(state.audioChunks, { type: 'audio/webm' });
                state.recordedAudioURL = URL.createObjectURL(audioBlob);

                // Show playback button
                if (els.playbackBtn) {
                    els.playbackBtn.style.display = "inline-flex";
                }

                // Stop audio stream tracks
                if (state.audioStream) {
                    state.audioStream.getTracks().forEach(track => track.stop());
                }
            };

            state.mediaRecorder.start();

        } catch (error) {
            console.error("Error accessing microphone:", error);
            setGuideMessage("Oops! Please allow microphone access so I can hear you sing! 🎤");
            return;
        }

        state.isRecording = true;
        state.speechSynthesis.cancel();
        state.isPlaying = false;

        els.verseCard.classList.add("listening");
        els.recordingIndicator.classList.add("active");
        disableControls(true);

        setGuideMessage("I'm listening! Sing the verse now! 🎵");

        // Reset words for tracking
        resetKaraokeWords();

        state._recognizedText = "";
        state._recognitionTimeout = null;

        // Also start speech recognition for transcription (if available)
        if (state.recognition) {
            try {
                state.recognition.start();
            } catch (e) {
                // Already started
                console.warn("Recognition already running:", e);
            }
        }

        // Auto-stop after 15 seconds if child doesn't press done
        state._autoStopTimer = setTimeout(() => {
            if (state.isRecording) {
                stopRecording();
            }
        }, 15000);
    }

    function stopRecording() {
        if (!state.isRecording) return;

        state.isRecording = false;
        els.verseCard.classList.remove("listening");
        els.recordingIndicator.classList.remove("active");
        disableControls(false);

        clearTimeout(state._autoStopTimer);

        // Stop MediaRecorder
        if (state.mediaRecorder && state.mediaRecorder.state !== "inactive") {
            state.mediaRecorder.stop();
        }

        // Stop speech recognition
        if (state.recognition) {
            try {
                state.recognition.stop();
            } catch (e) {
                // Already stopped
            }
        }

        // Evaluate what was heard
        evaluateAttempt(state._recognizedText || "");
    }

    function handleRecognitionResult(event) {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
        }
        state._recognizedText = transcript;

        // Show partial recognition by highlighting words
        highlightRecognizedWords(transcript);
    }

    function handleRecognitionError(event) {
        console.warn("Recognition error:", event.error);

        if (event.error === "not-allowed") {
            setGuideMessage("Oops! Please allow microphone access so I can hear you sing! 🎤");
        }

        if (state.isRecording) {
            // If error during recording, be forgiving for kids
            setTimeout(() => {
                if (state.isRecording) {
                    stopRecording();
                }
            }, 1000);
        }
    }

    function handleRecognitionEnd() {
        if (state.isRecording) {
            // Restart if still supposed to be recording
            try {
                state.recognition.start();
            } catch (e) {
                stopRecording();
            }
        }
    }

    function highlightRecognizedWords(transcript) {
        const wordSpans = els.verseTranslit.querySelectorAll(".word-span");
        const spoken = transcript.toLowerCase().replace(/[,.\/#!$%\^&\*;:{}=\-_`~()]/g, "");
        const spokenWords = spoken.split(/\s+/).filter(w => w.length > 0);

        // Simple matching: highlight words that sound similar
        const verse = HANUMAN_CHALISA[state.currentVerse];
        const verseWords = verse.speakText.toLowerCase().split(/\s+/);

        let matchCount = 0;
        verseWords.forEach((vw, i) => {
            if (i < wordSpans.length) {
                const matched = spokenWords.some(sw => fuzzyMatch(sw, vw));
                if (matched) {
                    wordSpans[i].classList.add("done");
                    matchCount++;
                }
            }
        });
    }

    // ===== PLAYBACK RECORDING =====
    function playbackRecording() {
        if (!state.recordedAudioURL) {
            setGuideMessage("No recording to play back yet! Try recording first! 🎤");
            return;
        }

        // Create and play audio element
        const audio = new Audio(state.recordedAudioURL);

        setGuideMessage("Playing back your recording! 🎵");
        els.playbackBtn.disabled = true;
        disableControls(true);

        audio.onended = () => {
            setGuideMessage("That was you singing! Great job! 🌟");
            els.playbackBtn.disabled = false;
            disableControls(false);
        };

        audio.onerror = () => {
            setGuideMessage("Oops! Couldn't play the recording.");
            els.playbackBtn.disabled = false;
            disableControls(false);
        };

        audio.play();
    }

    // ===== EVALUATION =====
    function evaluateAttempt(transcript) {
        state.attemptCount++;
        const verse = HANUMAN_CHALISA[state.currentVerse];
        const verseWords = verse.speakText.toLowerCase().split(/\s+/);
        const spokenWords = transcript.toLowerCase()
            .replace(/[,.\/#!$%\^&\*;:{}=\-_`~()]/g, "")
            .split(/\s+/)
            .filter(w => w.length > 0);

        // Calculate match score
        let matches = 0;
        verseWords.forEach(vw => {
            if (spokenWords.some(sw => fuzzyMatch(sw, vw))) {
                matches++;
            }
        });

        const score = verseWords.length > 0 ? matches / verseWords.length : 0;

        // Be generous with scoring for 5-year-olds!
        // Also consider: if child spoke any words at all, that's effort
        const hasEffort = spokenWords.length > 0 || transcript.length > 0;

        if (score >= 0.3 || (hasEffort && state.attemptCount >= 2)) {
            // Great job! (Be encouraging for kids)
            showFeedback("great", randomFrom(ENCOURAGE_MESSAGES.great));
            awardStar();
            markVerseCompleted();
            els.verseCard.classList.add("success");
            createFloatingStar();
        } else if (hasEffort || state.attemptCount >= 1) {
            // Good try
            showFeedback("good", randomFrom(ENCOURAGE_MESSAGES.good));
            // After 2 attempts, give star anyway (kids should feel accomplished)
            if (state.attemptCount >= 2) {
                awardStar();
                markVerseCompleted();
                els.verseCard.classList.add("success");
                createFloatingStar();
            }
        } else {
            // Encourage to try again
            showFeedback("try-again", randomFrom(ENCOURAGE_MESSAGES.tryAgain));
        }
    }

    function fuzzyMatch(spoken, expected) {
        // Simple fuzzy matching for speech recognition inaccuracies
        if (!spoken || !expected) return false;
        spoken = spoken.toLowerCase().trim();
        expected = expected.toLowerCase().trim();

        // Exact match
        if (spoken === expected) return true;

        // One contains the other
        if (spoken.includes(expected) || expected.includes(spoken)) return true;

        // Remove common suffixes/prefixes
        if (spoken.length >= 3 && expected.length >= 3) {
            // Check if first 3 chars match (good enough for kids)
            if (spoken.substring(0, 3) === expected.substring(0, 3)) return true;

            // Levenshtein-like: allow 2 char difference for words > 4 chars
            if (expected.length > 4 && levenshteinDistance(spoken, expected) <= 2) return true;
            if (expected.length <= 4 && levenshteinDistance(spoken, expected) <= 1) return true;
        }

        return false;
    }

    function levenshteinDistance(a, b) {
        const matrix = [];
        for (let i = 0; i <= b.length; i++) matrix[i] = [i];
        for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
        for (let i = 1; i <= b.length; i++) {
            for (let j = 1; j <= a.length; j++) {
                if (b[i - 1] === a[j - 1]) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1,
                        matrix[i][j - 1] + 1,
                        matrix[i - 1][j] + 1
                    );
                }
            }
        }
        return matrix[b.length][a.length];
    }

    // ===== FEEDBACK =====
    function showFeedback(type, message) {
        els.feedbackArea.className = "feedback-area visible " + type;
        els.feedbackContent.textContent = message;
        setGuideMessage(message);
    }

    function hideFeedback() {
        els.feedbackArea.className = "feedback-area";
    }

    // ===== STARS & REWARDS =====
    function awardStar() {
        state.stars++;
        updateStarDisplay();
    }

    function updateStarDisplay() {
        els.starCount.textContent = state.stars;
        // Bounce animation
        els.starsEarned.style.animation = "none";
        els.starsEarned.offsetHeight;
        els.starsEarned.style.animation = "bounce 0.5s ease";
    }

    function createFloatingStar() {
        const star = document.createElement("div");
        star.className = "floating-star";
        star.textContent = "⭐";
        star.style.left = Math.random() * 80 + 10 + "%";
        star.style.top = "60%";
        document.body.appendChild(star);
        setTimeout(() => star.remove(), 1500);
    }

    function markVerseCompleted() {
        state.versesCompleted.add(state.currentVerse);
    }

    // ===== HOME NAVIGATION =====
    function goHome() {
        state.speechSynthesis.cancel();
        if (state.mediaRecorder && state.mediaRecorder.state !== "inactive") {
            state.mediaRecorder.stop();
        }
        if (state.recognition) {
            try {
                state.recognition.stop();
            } catch (e) {}
        }
        showScreen("start");
    }

    // ===== NAVIGATION =====
    function goToNextVerse() {
        if (state.currentVerse < HANUMAN_CHALISA.length - 1) {
            state.speechSynthesis.cancel();

            // Check if we should show divine blessing
            const nextVerse = state.currentVerse + 1;
            if ((nextVerse + 1) % 7 === 0 && nextVerse > 0) {
                showDivineBlessing();
            } else {
                loadVerse(nextVerse);
            }
        } else {
            showCelebration();
        }
    }

    function goToPrevVerse() {
        if (state.currentVerse > 0) {
            state.speechSynthesis.cancel();
            loadVerse(state.currentVerse - 1);
        }
    }

    function skipToNext() {
        goToNextVerse();
    }

    function updateProgress() {
        const progress = ((state.currentVerse + 1) / HANUMAN_CHALISA.length) * 100;
        els.progressBar.style.width = progress + "%";
        els.progressText.textContent = `Verse ${state.currentVerse + 1} of ${HANUMAN_CHALISA.length}`;
    }

    function updateNavButtons() {
        els.prevBtn.disabled = state.currentVerse === 0;
        els.nextBtn.textContent = state.currentVerse === HANUMAN_CHALISA.length - 1
            ? "Finish! 🎉"
            : "Next ▶";
    }

    // ===== DIVINE BLESSING SCREEN =====
    async function showDivineBlessing() {
        showScreen("blessing");

        // Reset image state
        const loadingEl = document.querySelector(".image-loading");
        const container = document.querySelector(".ai-hanuman-container");
        if (loadingEl) loadingEl.classList.remove("hidden");
        if (container) container.classList.remove("revealed");
        if (els.aiHanumanImage) {
            els.aiHanumanImage.classList.remove("loaded");
            els.aiHanumanImage.src = "";
        }

        // Speak blessing
        const blessingText = "Divine blessings from Lord Hanuman! You are doing wonderfully!";
        const utterance = new SpeechSynthesisUtterance(blessingText);
        utterance.rate = 0.85;
        utterance.pitch = 1.1;
        if (state.englishVoice) utterance.voice = state.englishVoice;
        state.speechSynthesis.speak(utterance);

        // Get AI-generated divine image
        try {
            const imageData = await generateDivineImage();

            // Update title with deity name
            const titleEl = document.querySelector(".blessing-title");
            if (titleEl) titleEl.textContent = `${imageData.character} Blesses You 🙏`;

            if (els.blessingMessage) {
                els.blessingMessage.textContent = imageData.message;
            }
            if (els.newsContext) {
                els.newsContext.textContent = imageData.context;
            }

            if (els.aiHanumanImage) {
                const container = els.aiHanumanImage.closest(".ai-hanuman-container");
                els.aiHanumanImage.onload = () => {
                    if (loadingEl) loadingEl.classList.add("hidden");
                    els.aiHanumanImage.classList.add("loaded");
                    if (container) container.classList.add("revealed");
                };
                els.aiHanumanImage.onerror = () => {
                    els.aiHanumanImage.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Ravivarmapress.jpg/960px-Ravivarmapress.jpg";
                    if (container) container.classList.add("revealed");
                };
                // Set src after handlers are attached
                els.aiHanumanImage.src = imageData.imageUrl;
            }

        } catch (error) {
            console.error("Error generating divine image:", error);
            if (loadingEl) loadingEl.classList.add("hidden");
            if (els.aiHanumanImage) {
                els.aiHanumanImage.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Ravivarmapress.jpg/960px-Ravivarmapress.jpg";
                els.aiHanumanImage.classList.add("loaded");
            }
        }

        // Add magical particles
        createDivineParticles();
    }

    function continueFromBlessing() {
        const nextVerse = state.currentVerse + 1;
        if (nextVerse < HANUMAN_CHALISA.length) {
            loadVerse(nextVerse);
            showScreen("learn");
        } else {
            showCelebration();
        }
    }

    // Divine character rotation: Hanuman → Ram → Sita → Hanuman...
    const DIVINE_CHARACTERS = [
        {
            name: "Lord Hanuman",
            messages: [
                "Lord Hanuman watches over you with boundless love 🙏",
                "Hanuman ji fills your heart with strength and courage ✨",
                "Jai Hanuman! Your devotion brings divine blessings 🌟",
            ],
            prompts: [
                "Lord Hanuman, divine Hindu deity, sitting in meditation on lotus flower, golden divine light rays, intricate ornate temple background, sacred saffron colors, majestic and serene, high detail digital art, spiritual illustration",
                "Mighty Lord Hanuman flying through clouds carrying mountain, divine warrior, glowing aura, sacred hindu art, gold and saffron colors, peaceful expression, children friendly spiritual art",
                "Lord Hanuman with folded hands in devotion, chest open showing Ram and Sita inside heart, divine golden glow, lotus flowers, sacred temple setting, warm spiritual colors",
                "Lord Hanuman powerful and majestic, sacred flame in hand, divine radiance, ancient indian art style, gold ornaments, serene face, lotus throne, spiritual children illustration",
            ]
        },
        {
            name: "Lord Ram",
            messages: [
                "Lord Ram blesses you with wisdom and righteousness 🙏",
                "Sri Ram's divine grace shines upon your journey ✨",
                "Jai Shri Ram! May truth and courage guide your path 🌟",
            ],
            prompts: [
                "Lord Ram, noble Hindu deity, standing with bow and arrow, wearing golden crown and silk garments, divine radiance, lotus flowers, sacred saffron and gold colors, serene majestic expression, children friendly spiritual art",
                "Lord Shri Ram seated on golden throne, divine king, lotus flowers, golden ornaments, peaceful gentle expression, warm sacred light, ancient india, spiritual illustration for children",
                "Lord Ram and divine light, sacred blue skin, gentle noble face, golden crown, colorful flowers, temple background, spiritual aura, soft warm colors, peaceful devotional art",
            ]
        },
        {
            name: "Mother Sita",
            messages: [
                "Mother Sita's grace and love surround you always 🙏",
                "Sita Mata blesses your devotion with pure love ✨",
                "The divine mother smiles upon your sacred learning 🌟",
            ],
            prompts: [
                "Goddess Sita, graceful Hindu deity, wearing beautiful sari, flower garland, gentle loving expression, golden divine glow, lotus flowers, sacred temple, warm saffron colors, spiritual children illustration",
                "Mother Sita seated gracefully, sacred Hindu goddess, soft divine light, colorful flowers, golden ornaments, peaceful serene face, ancient india setting, devotional spiritual art",
                "Goddess Sita standing in garden of flowers, divine radiance, wearing red and gold sari, lotus in hand, gentle smile, sacred aura, warm golden light, beautiful spiritual illustration",
            ]
        }
    ];

    async function generateDivineImage() {
        state.blessingCount++;
        const charIndex = (state.blessingCount - 1) % DIVINE_CHARACTERS.length;
        const character = DIVINE_CHARACTERS[charIndex];

        const prompt = randomFrom(character.prompts);
        const seed = Math.floor(Math.random() * 999999);
        const width = 512;
        const height = 512;

        const encodedPrompt = encodeURIComponent(prompt);
        const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&seed=${seed}&nologo=true&model=flux`;

        const todayDate = new Date().toLocaleDateString('en-IN', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });

        const contexts = [
            `A unique divine vision just for you on ${todayDate}`,
            `${character.name} appears uniquely for you today`,
            `A sacred vision on this blessed day — ${todayDate}`,
        ];

        return {
            imageUrl,
            character: character.name,
            message: randomFrom(character.messages),
            context: randomFrom(contexts),
        };
    }

    // ===== MAGICAL EFFECTS =====
    function createDivineParticles() {
        const colors = ["#FFD700", "#FFA500", "#FF8C42", "#FFE5B4"];
        const container = document.querySelector(".blessing-screen-content");
        if (!container) return;

        for (let i = 0; i < 30; i++) {
            setTimeout(() => {
                const particle = document.createElement("div");
                particle.style.position = "absolute";
                particle.style.width = "6px";
                particle.style.height = "6px";
                particle.style.borderRadius = "50%";
                particle.style.backgroundColor = randomFrom(colors);
                particle.style.left = Math.random() * 100 + "%";
                particle.style.top = Math.random() * 100 + "%";
                particle.style.opacity = "0.8";
                particle.style.pointerEvents = "none";
                particle.style.animation = `divine-particle ${2 + Math.random() * 2}s ease-out forwards`;
                container.appendChild(particle);

                setTimeout(() => particle.remove(), 4000);
            }, i * 50);
        }
    }

    function createMagicalSparkles(event) {
        const colors = ["#FFD700", "#FFA500", "#FF69B4", "#87CEEB"];

        for (let i = 0; i < 5; i++) {
            const sparkle = document.createElement("div");
            sparkle.textContent = "✨";
            sparkle.style.position = "fixed";
            sparkle.style.left = event.clientX + "px";
            sparkle.style.top = event.clientY + "px";
            sparkle.style.pointerEvents = "none";
            sparkle.style.fontSize = "20px";
            sparkle.style.zIndex = "1000";
            sparkle.style.animation = `sparkle-burst ${0.8 + Math.random() * 0.4}s ease-out forwards`;
            sparkle.style.setProperty("--angle", Math.random() * 360 + "deg");
            document.body.appendChild(sparkle);

            setTimeout(() => sparkle.remove(), 1200);
        }
    }

    // ===== CELEBRATION =====
    function showCelebration() {
        showScreen("celebration");
        els.finalStars.textContent = state.stars;
        createConfetti();

        // Speak congratulation
        const congrats = new SpeechSynthesisUtterance(
            "Wow! You completed the Hanuman Chalisa! Jai Hanuman! You are amazing!"
        );
        congrats.rate = 0.9;
        congrats.pitch = 1.2;
        if (state.englishVoice) congrats.voice = state.englishVoice;
        state.speechSynthesis.speak(congrats);
    }

    function createConfetti() {
        const colors = ["#FF6B35", "#FF9933", "#FFD166", "#06D6A0", "#118AB2", "#7B2D8E", "#FF69B4", "#E63946"];
        els.confettiContainer.innerHTML = "";

        for (let i = 0; i < 50; i++) {
            const piece = document.createElement("div");
            piece.className = "confetti-piece";
            piece.style.left = Math.random() * 100 + "%";
            piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            piece.style.animationDelay = Math.random() * 3 + "s";
            piece.style.animationDuration = (Math.random() * 2 + 2) + "s";
            const size = Math.random() * 8 + 6;
            piece.style.width = size + "px";
            piece.style.height = size + "px";
            if (Math.random() > 0.5) piece.style.borderRadius = "50%";
            els.confettiContainer.appendChild(piece);
        }
    }

    // ===== RESTART =====
    function restartApp() {
        state.speechSynthesis.cancel();
        showScreen("start");
    }

    // ===== HELPERS =====
    function setGuideMessage(text) {
        // Guide removed, but keep function for compatibility
        console.log("Guide message:", text);
    }

    function disableControls(disabled) {
        els.listenBtn.disabled = disabled;
        els.listenSlowBtn.disabled = disabled;
        if (!state.hasListened && disabled === false) {
            els.myTurnBtn.disabled = true;
        } else {
            els.myTurnBtn.disabled = disabled;
        }
        els.skipBtn.disabled = disabled;
    }

    function randomFrom(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    // ===== KEYBOARD SHORTCUTS (for parents/testing) =====
    document.addEventListener("keydown", (e) => {
        if (screens.learn.classList.contains("active")) {
            switch (e.key) {
                case " ":
                    e.preventDefault();
                    if (!state.isRecording && !state.isPlaying) speakVerse(1.0);
                    break;
                case "ArrowRight":
                    goToNextVerse();
                    break;
                case "ArrowLeft":
                    goToPrevVerse();
                    break;
                case "m":
                    if (!state.isRecording) startRecording();
                    else stopRecording();
                    break;
            }
        }
    });

    // ===== START =====
    init();
})();
