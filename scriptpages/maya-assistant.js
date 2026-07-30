(function () {
    if (window.__mayaAssistantLoaded) {
        return;
    }

    window.__mayaAssistantLoaded = true;

    const STORAGE_KEY = 'bloomher-maya-assistant-history';
    const OPEN_KEY = 'bloomher-maya-assistant-open';
    const API_URL = window.__mayaAssistantApiUrl || '/api/maya/chat';

    const REFUSAL_MESSAGE = "I'm Maya, BloomHer's AI Women's Health Assistant. 💜\n\nI'm designed to help with questions about PCOS, PCOD, menstrual health, hormones, nutrition, women's wellness, and BloomHer features. Please ask me something related to women's health or the BloomHer app.";
    const WHO_AM_I_MESSAGE = "I'm Maya, your BloomHer AI Health Assistant. 💜 I'm here to support you with PCOS, PCOD, menstrual health, hormones, women's wellness, and everything related to BloomHer.";
    const EDUCATIONAL_NOTE = 'This information is educational and does not replace professional medical advice.';
    const EMERGENCY_MESSAGE = 'Please seek emergency medical care or contact local emergency services now. Severe bleeding, fainting, chest pain, difficulty breathing, severe abdominal pain, pregnancy emergencies, and suicidal thoughts need urgent in-person help.';

    const QUICK_TOPICS = [
        { label: 'PCOS support', prompt: 'How can I manage PCOS symptoms?' },
        { label: 'Period tracking', prompt: 'How should I track my period symptoms?' },
        { label: 'Nutrition', prompt: 'What foods help with hormonal balance?' },
        { label: 'Sleep tips', prompt: 'How can I improve sleep with hormonal changes?' },
    ];

    const INITIAL_MESSAGES = [
        {
            role: 'assistant',
            text: 'Hi, I\'m Maya. I can help with PCOS, PCOD, cycle tracking, ovulation, hormones, nutrition, exercise, stress, sleep, and BloomHer features.',
        },
        {
            role: 'assistant',
            text: 'If you share your concern, I\'ll keep the answer educational, simple, and focused on women\'s health.',
        },
    ];

    const DOMAINS = {
        pcos: ['pcos', 'pcod', 'polycystic ovary syndrome', 'polycystic ovarian syndrome'],
        cycle: ['period', 'menstrual', 'cycle', 'bleeding', 'spotting', 'cramp', 'cramps', 'flow'],
        ovulation: ['ovulation', 'ovulate', 'fertile', 'fertility awareness', 'luteal', 'ovary'],
        hormones: ['hormone', 'hormonal', 'thyroid', 'insulin', 'estrogen', 'progesterone'],
        nutrition: ['nutrition', 'diet', 'food', 'meal', 'protein', 'fiber', 'carb', 'carbs', 'sugar'],
        exercise: ['exercise', 'workout', 'fitness', 'strength', 'cardio', 'walking', 'gym'],
        weight: ['weight', 'bmi', 'fat loss', 'weight management', 'lose weight', 'gain weight'],
        symptoms: ['acne', 'hair fall', 'hair loss', 'facial hair', 'mood', 'anxiety', 'depression', 'stress', 'sleep'],
        bloomher: ['bloomher', 'tracker', 'reminder', 'symptom tracking', 'cycle insights', 'recommendations', 'app feature'],
        emergency: ['faint', 'fainting', 'chest pain', 'difficulty breathing', 'shortness of breath', 'suicidal', 'self-harm', 'pregnancy emergency', 'severe bleeding', 'heavy bleeding', 'severe abdominal pain'],
    };

    function normalize(value) {
        return String(value || '').toLowerCase().trim();
    }

    function containsAny(text, keywords) {
        return keywords.some((keyword) => text.includes(keyword));
    }

    function isGreeting(text) {
        return /^(hi|hello|hey|good morning|good afternoon|good evening)\b/.test(text);
    }

    function isWhoQuestion(text) {
        return /who are you|what are you|tell me about yourself/.test(text);
    }

    function isEmergency(text) {
        return containsAny(text, DOMAINS.emergency);
    }

    function isInScope(text) {
        const scopeKeywords = [
            ...DOMAINS.pcos,
            ...DOMAINS.cycle,
            ...DOMAINS.ovulation,
            ...DOMAINS.hormones,
            ...DOMAINS.nutrition,
            ...DOMAINS.exercise,
            ...DOMAINS.weight,
            ...DOMAINS.symptoms,
            ...DOMAINS.bloomher,
            'period tracker',
            'cycle tracking',
            'women\'s health',
            'women health',
            'reproductive health',
            'hormonal balance',
        ];

        return containsAny(text, scopeKeywords);
    }

    function formatBullets(title, bullets) {
        return [
            title,
            '',
            ...bullets.map((bullet) => `- ${bullet}`),
            '',
            EDUCATIONAL_NOTE,
        ].join('\n');
    }

    function pcosResponse() {
        return formatBullets('PCOS is a hormonal condition that often affects periods, ovulation, acne, hair, mood, and weight.', [
            'Tracking your cycle, symptoms, and moods can help you notice patterns to discuss with a clinician.',
            'Balanced meals with protein, fiber, and healthy fats can support steadier energy and blood sugar.',
            'Strength training and regular movement are often helpful when they feel sustainable for you.',
            'If your cycles are very irregular, symptoms are worsening, or you are worried, a gynecologist or endocrinologist can guide you.',
        ]);
    }

    function cycleResponse() {
        return formatBullets('For menstrual cycle tracking, focus on the pattern rather than a single day.', [
            'Log the first day of bleeding, the length of bleeding, flow strength, cramps, clots, headaches, and mood changes.',
            'Many cycles fall roughly between 21 and 35 days, but tracking your own baseline is more useful than comparing yourself to others.',
            'If bleeding is extremely heavy, very painful, or your periods stop for a long time, a healthcare professional should review it.',
        ]);
    }

    function ovulationResponse() {
        return formatBullets('Ovulation usually happens about 12 to 16 days before the next period, but this can vary.', [
            'Apps and calendar estimates are helpful, but they are less reliable with irregular cycles.',
            'Some people also use ovulation test strips, cervical mucus changes, or basal body temperature to learn their pattern.',
            'If you are trying to understand fertility timing, a gynecologist can help interpret irregular cycles safely.',
        ]);
    }

    function hormoneResponse() {
        return formatBullets('Hormonal health is influenced by sleep, stress, nutrition, activity, and underlying conditions like PCOS or thyroid issues.', [
            'Aim for steady routines instead of perfect routines.',
            'Pay attention to changes in acne, hair fall, cycle length, energy, mood, and cravings.',
            'If symptoms are persistent or new, getting checked by a qualified clinician is the right next step.',
        ]);
    }

    function nutritionResponse() {
        return formatBullets('For PCOS and hormonal balance, simple and consistent meals usually work better than restrictive dieting.', [
            'Build meals around protein, fiber-rich plants, and healthy fats.',
            'Choose slower-digesting carbs more often, especially if you notice energy crashes after meals.',
            'Drink enough water and avoid long gaps between meals if that helps your energy and cravings.',
            'If you have a specific weight, insulin, or cycle concern, a registered dietitian can personalize this safely.',
        ]);
    }

    function exerciseResponse() {
        return formatBullets('Exercise for women\'s hormonal health works best when it is sustainable and kind to your body.', [
            'Walking, cycling, swimming, yoga, and strength training can all be useful.',
            'If you have PCOS, strength training and regular movement are often a practical starting point.',
            'On low-energy or painful days, lighter movement and rest are both valid choices.',
        ]);
    }

    function weightResponse() {
        return formatBullets('With PCOS-related weight concerns, the goal is usually steady habits, not rapid changes.', [
            'Focus on sleep, regular meals, movement, and stress support before chasing strict restrictions.',
            'Small changes that you can repeat are usually more helpful than extreme plans.',
            'If weight changes are sudden or difficult to explain, a clinician can check for hormonal causes.',
        ]);
    }

    function symptomResponse() {
        return formatBullets('Acne, hair fall, hair growth changes, mood shifts, and stress can all be linked with hormones.', [
            'Tracking when symptoms get better or worse can help you spot triggers.',
            'Sleep, nutrition, and stress reduction can support the body, but they do not replace evaluation if symptoms persist.',
            'If hair loss or acne is severe, a gynecologist or dermatologist can help rule out treatable causes.',
        ]);
    }

    function sleepResponse() {
        return formatBullets('Sleep is one of the strongest everyday supports for cycle and hormonal health.', [
            'Try to keep a regular sleep and wake time when possible.',
            'Reduce caffeine later in the day if it affects your rest.',
            'A cool, dark room and a short wind-down routine can make sleep easier.',
        ]);
    }

    function stressResponse() {
        return formatBullets('Stress can affect cycles, cravings, sleep, and pain, so small calming habits matter.', [
            'Breathing exercises, journaling, stretching, and brief walks can help lower tension.',
            'If stress feels overwhelming, talking to a trusted person or mental health professional is a strong next step.',
            'If you ever feel unsafe or have thoughts of self-harm, seek urgent help right away.',
        ]);
    }

    function bloomherResponse() {
        return formatBullets('BloomHer can support your routine by helping you track and understand your cycle over time.', [
            'Use the tracker to log periods, symptoms, mood, and cycle patterns.',
            'Check reminders and insights to stay consistent with your wellness habits.',
            'Visit the diet, exercises, sleep, stress, expert, and community pages for more support.',
        ]);
    }

    function generalSupportResponse() {
        return [
            'I can help you with PCOS, PCOD, periods, ovulation, hormonal balance, nutrition, exercise, stress, sleep, fertility awareness, and BloomHer features.',
            '',
            EDUCATIONAL_NOTE,
        ].join('\n');
    }

    function generateResponse(input) {
        const text = normalize(input);

        if (!text) {
            return 'Ask me about PCOS, periods, ovulation, hormonal balance, nutrition, exercise, stress, sleep, fertility awareness, or BloomHer features.';
        }

        if (isEmergency(text)) {
            return EMERGENCY_MESSAGE;
        }

        if (isWhoQuestion(text)) {
            return WHO_AM_I_MESSAGE;
        }

        if (isGreeting(text)) {
            return generalSupportResponse();
        }

        if (containsAny(text, DOMAINS.bloomher)) {
            return bloomherResponse();
        }

        if (containsAny(text, DOMAINS.pcos)) {
            return pcosResponse();
        }

        if (containsAny(text, DOMAINS.cycle)) {
            return cycleResponse();
        }

        if (containsAny(text, DOMAINS.ovulation)) {
            return ovulationResponse();
        }

        if (containsAny(text, DOMAINS.hormones)) {
            return hormoneResponse();
        }

        if (containsAny(text, DOMAINS.nutrition)) {
            return nutritionResponse();
        }

        if (containsAny(text, DOMAINS.exercise)) {
            return exerciseResponse();
        }

        if (containsAny(text, DOMAINS.weight)) {
            return weightResponse();
        }

        if (containsAny(text, DOMAINS.symptoms)) {
            if (text.includes('sleep')) {
                return sleepResponse();
            }

            if (text.includes('stress') || text.includes('anxiety') || text.includes('mood') || text.includes('depression')) {
                return stressResponse();
            }

            return symptomResponse();
        }

        if (!isInScope(text)) {
            return REFUSAL_MESSAGE;
        }

        return generalSupportResponse();
    }

    function loadHistory() {
        try {
            const raw = window.localStorage.getItem(STORAGE_KEY);
            if (!raw) {
                return [...INITIAL_MESSAGES];
            }

            const parsed = JSON.parse(raw);
            if (!Array.isArray(parsed) || parsed.length === 0) {
                return [...INITIAL_MESSAGES];
            }

            return parsed.slice(-12);
        } catch (error) {
            return [...INITIAL_MESSAGES];
        }
    }

    function saveHistory(messages) {
        try {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-12)));
        } catch (error) {
            // Ignore storage failures.
        }
    }

    function setOpenState(isOpen) {
        try {
            window.localStorage.setItem(OPEN_KEY, isOpen ? 'true' : 'false');
        } catch (error) {
            // Ignore storage failures.
        }
    }

    function getOpenState() {
        try {
            return window.localStorage.getItem(OPEN_KEY) === 'true';
        } catch (error) {
            return false;
        }
    }

    function buildWidget() {
        const root = document.createElement('div');
        root.id = 'maya-assistant-root';
        root.innerHTML = `
            <button class="maya-launcher" type="button" aria-expanded="false" aria-controls="maya-assistant-panel">
                <span class="maya-launcher-dot"></span>
                <span>Ask Maya</span>
            </button>
            <section class="maya-panel" id="maya-assistant-panel" aria-label="Maya assistant" aria-hidden="true">
                <header class="maya-panel-header">
                    <div>
                        <p class="maya-eyebrow">BloomHer AI Health Assistant</p>
                        <h2>Maya</h2>
                    </div>
                    <button class="maya-close" type="button" aria-label="Close Maya assistant">×</button>
                </header>
                <p class="maya-disclaimer">Educational only. Maya supports PCOS, PCOD, menstrual health, hormones, nutrition, women's wellness, and BloomHer features.</p>
                <div class="maya-quick-replies" aria-label="Suggested questions"></div>
                <div class="maya-chat" role="log" aria-live="polite"></div>
                <form class="maya-input-row">
                    <label class="sr-only" for="maya-input">Ask Maya a women's health question</label>
                    <input id="maya-input" name="maya-input" type="text" placeholder="Ask about PCOS, periods, sleep, or BloomHer..." autocomplete="off">
                    <button type="submit">Send</button>
                </form>
            </section>
        `;
        return root;
    }

    function createBubble(text, role) {
        const bubble = document.createElement('div');
        bubble.className = `maya-bubble maya-${role}`;
        bubble.textContent = text;
        return bubble;
    }

    function renderMessages(chat, messages) {
        chat.innerHTML = '';
        messages.forEach((message) => {
            chat.appendChild(createBubble(message.text, message.role));
        });
        chat.scrollTop = chat.scrollHeight;
    }

    async function requestApiReply(prompt, history) {
        try {
            const response = await window.fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: prompt, history }),
            });

            if (!response.ok) {
                throw new Error(`Request failed with status ${response.status}`);
            }

            const data = await response.json();
            if (data && typeof data.reply === 'string' && data.reply.trim()) {
                return data.reply.trim();
            }
        } catch (error) {
            // Fall back to the local rule-based responder when the API is unavailable.
        }

        return generateResponse(prompt);
    }

    function applyStyles() {
        const style = document.createElement('style');
        style.textContent = `
            #maya-assistant-root {
                position: fixed;
                right: 1rem;
                bottom: 1rem;
                z-index: 9999;
                font-family: inherit;
            }

            .maya-launcher {
                display: inline-flex;
                align-items: center;
                gap: 0.55rem;
                border: 0;
                border-radius: 999px;
                padding: 0.9rem 1.15rem;
                background: linear-gradient(135deg, #f43f5e, #be185d);
                color: #fff;
                font-weight: 700;
                box-shadow: 0 18px 40px rgba(244, 63, 94, 0.3);
                cursor: pointer;
            }

            .maya-launcher-dot {
                width: 0.65rem;
                height: 0.65rem;
                border-radius: 999px;
                background: #fff;
                box-shadow: 0 0 0 0.45rem rgba(255, 255, 255, 0.18);
            }

            .maya-panel {
                width: min(380px, calc(100vw - 2rem));
                max-height: min(640px, calc(100vh - 7rem));
                margin-bottom: 0.85rem;
                border-radius: 1.25rem;
                background: rgba(255, 255, 255, 0.96);
                backdrop-filter: blur(18px);
                box-shadow: none;
                border: 0;
                display: none;
                overflow: hidden;
            }

            .maya-panel.is-open {
                display: flex;
                flex-direction: column;
            }

            .maya-panel-header {
                display: flex;
                align-items: flex-start;
                justify-content: space-between;
                gap: 1rem;
                padding: 1rem 1rem 0.5rem;
            }

            .maya-eyebrow {
                margin: 0 0 0.25rem;
                font-size: 0.76rem;
                letter-spacing: 0.12em;
                text-transform: uppercase;
                color: #be185d;
                font-weight: 700;
            }

            .maya-panel-header h2 {
                margin: 0;
                font-size: 1.3rem;
                line-height: 1.1;
                color: #111827;
            }

            .maya-close {
                width: 2.25rem;
                height: 2.25rem;
                border: 0;
                border-radius: 999px;
                background: rgba(244, 63, 94, 0.1);
                color: #be185d;
                font-size: 1.5rem;
                cursor: pointer;
            }

            .maya-disclaimer {
                margin: 0;
                padding: 0 1rem 0.75rem;
                color: #4b5563;
                font-size: 0.9rem;
            }

            .maya-quick-replies {
                display: flex;
                flex-wrap: wrap;
                gap: 0.5rem;
                padding: 0 1rem 0.75rem;
            }

            .maya-chip {
                border: 1px solid rgba(244, 63, 94, 0.16);
                background: #fff1f2;
                color: #9f1239;
                border-radius: 999px;
                padding: 0.45rem 0.7rem;
                font-size: 0.84rem;
                cursor: pointer;
            }

            .maya-chat {
                flex: 1;
                overflow-y: auto;
                display: flex;
                flex-direction: column;
                gap: 0.65rem;
                padding: 0 1rem 1rem;
            }

            .maya-bubble {
                max-width: 100%;
                white-space: pre-wrap;
                line-height: 1.5;
                border-radius: 1rem;
                padding: 0.8rem 0.9rem;
                font-size: 0.95rem;
            }

            .maya-assistant {
                background: #fff1f2;
                color: #7f1d1d;
                align-self: flex-start;
            }

            .maya-user {
                background: linear-gradient(135deg, #be185d, #f43f5e);
                color: #fff;
                align-self: flex-end;
            }

            .maya-input-row {
                display: grid;
                grid-template-columns: 1fr auto;
                gap: 0.5rem;
                padding: 0 1rem 1rem;
            }

            .maya-input-row input {
                width: 100%;
                border: 1px solid rgba(17, 24, 39, 0.14);
                border-radius: 999px;
                padding: 0.8rem 0.95rem;
                font: inherit;
                outline: none;
            }

            .maya-input-row input:focus {
                border-color: #f43f5e;
                box-shadow: 0 0 0 3px rgba(244, 63, 94, 0.16);
            }

            .maya-input-row button {
                border: 0;
                border-radius: 999px;
                padding: 0.8rem 1rem;
                background: #111827;
                color: #fff;
                cursor: pointer;
                font-weight: 700;
            }

            .sr-only {
                position: absolute;
                width: 1px;
                height: 1px;
                padding: 0;
                margin: -1px;
                overflow: hidden;
                clip: rect(0, 0, 0, 0);
                white-space: nowrap;
                border: 0;
            }

            @media (max-width: 480px) {
                #maya-assistant-root {
                    right: 0.75rem;
                    bottom: 0.75rem;
                }

                .maya-launcher {
                    width: 100%;
                    justify-content: center;
                }
            }
        `;
        document.head.appendChild(style);
    }

    function initialize() {
        applyStyles();

        const widget = buildWidget();
        document.body.appendChild(widget);

        const launcher = widget.querySelector('.maya-launcher');
        const panel = widget.querySelector('.maya-panel');
        const closeButton = widget.querySelector('.maya-close');
        const chat = widget.querySelector('.maya-chat');
        const form = widget.querySelector('.maya-input-row');
        const input = widget.querySelector('#maya-input');
        const quickReplies = widget.querySelector('.maya-quick-replies');

        let messages = loadHistory();

        function setPanelState(isOpen) {
            panel.classList.toggle('is-open', isOpen);
            panel.setAttribute('aria-hidden', String(!isOpen));
            launcher.setAttribute('aria-expanded', String(isOpen));
            setOpenState(isOpen);

            if (isOpen) {
                window.setTimeout(() => input.focus(), 0);
            }
        }

        function addMessage(role, text) {
            messages = [...messages, { role, text }];
            saveHistory(messages);
            renderMessages(chat, messages);
        }

        async function sendPrompt(prompt) {
            const trimmed = String(prompt || '').trim();
            if (!trimmed) {
                return;
            }

            addMessage('user', trimmed);
            const placeholder = createBubble('Thinking...', 'assistant');
            chat.appendChild(placeholder);
            chat.scrollTop = chat.scrollHeight;

            const response = await requestApiReply(trimmed, messages);
            placeholder.remove();
            messages = [...messages, { role: 'assistant', text: response }];
            saveHistory(messages);
            renderMessages(chat, messages);
        }

        QUICK_TOPICS.forEach((topic) => {
            const chip = document.createElement('button');
            chip.type = 'button';
            chip.className = 'maya-chip';
            chip.textContent = topic.label;
            chip.addEventListener('click', () => sendPrompt(topic.prompt));
            quickReplies.appendChild(chip);
        });

        launcher.addEventListener('click', () => setPanelState(!panel.classList.contains('is-open')));
        closeButton.addEventListener('click', () => setPanelState(false));

        form.addEventListener('submit', (event) => {
            event.preventDefault();
            sendPrompt(input.value);
            input.value = '';
            input.focus();
        });

        renderMessages(chat, messages);
        setPanelState(getOpenState());
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
})();