// =====================================================
// LOST SIGNAL - Horror ARG Website JavaScript
// =====================================================

// Console Easter Egg
console.log('%cSIGNAL INITIALIZATION', 'font-size: 20px; color: #ff0000;');
console.log('%csignal.init(1987, 87.3);', 'color: #888;');
console.log('%c// The year everything changed', 'color: #444;');
console.log('%c// The frequency that shouldn\'t exist', 'color: #444;');
console.log('%cThey are watching.', 'color: #8b0000;');

// ============================================
// Global State & Configuration
// ============================================
const state = {
    loaded: false,
    entered: false,
    audioEnabled: false,
    audioContext: null,
    audioNodes: {},
    signalStrength: 0,
    integrity: 67,
    secretFound: false,
    passwordAttempts: 0,
    correctPassword: '1987',
    visitDuration: 0,
    glitchInterval: null,
    ambientTriggers: 0
};

// Creepy messages for subtitles
const creepyMessages = [
    'Can you hear it?',
    'The signal is getting stronger.',
    'Don\'t close your eyes.',
    'They know you found this.',
    'The frequency never stopped.',
    'It\'s been waiting since 1987.',
    'You weren\'t supposed to find this.',
    'Look behind you.',
    'The static hides secrets.',
    'Do not trust the silence.'
];

// ============================================
// Custom Cursor
// ============================================
const cursor = document.getElementById('customCursor');
let cursorVisible = true;

document.addEventListener('mousemove', (e) => {
    if (cursor) {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    }

    // Update CSS variables for mouse light effect
    document.documentElement.style.setProperty('--mouse-x', e.clientX + 'px');
    document.documentElement.style.setProperty('--mouse-y', e.clientY + 'px');
});

// Cursor flicker
setInterval(() => {
    if (cursor && Math.random() < 0.05) {
        cursor.classList.add('flicker');
        setTimeout(() => cursor.classList.remove('flicker'), 100);
    }
}, 500);

// ============================================
// Loading Screen
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    const glitchText = document.getElementById('glitchText');
    const enterBtn = document.getElementById('enterBtn');

    if (glitchText && enterBtn) {
        // Type out the loading message
        const message = "If you found this website... you were not supposed to.";
        let i = 0;

        function typeChar() {
            if (i < message.length) {
                glitchText.textContent = message.substring(0, i + 1);
                glitchText.setAttribute('data-text', glitchText.textContent);
                i++;

                // Random delay for creepy typing effect
                const delay = Math.random() * 100 + 50;
                setTimeout(typeChar, delay);
            } else {
                // Show enter button after typing
                setTimeout(() => {
                    enterBtn.classList.remove('hidden');
                    enterBtn.style.animation = 'fadeIn 1s ease-out';
                }, 1000);
            }
        }

        // Start typing after a delay
        setTimeout(typeChar, 1000);

        // Enter button click
        enterBtn.addEventListener('click', () => {
            enterMainSite();
        });
    }

    // Initialize all interactive elements
    initializeInteractiveElements();
});

// ============================================
// Enter Main Site
// ============================================
function enterMainSite() {
    const loadingScreen = document.getElementById('loadingScreen');
    const mainContainer = document.getElementById('mainContainer');
    const glitchFlash = document.getElementById('glitchFlash');

    if (loadingScreen && mainContainer) {
        // Trigger glitch flash
        if (glitchFlash) {
            glitchFlash.style.opacity = '1';
            glitchFlash.style.animation = 'glitchFlash 0.5s';
        }

        // Screen shake effect
        document.body.style.animation = 'screenShake 0.5s';

        setTimeout(() => {
            loadingScreen.style.opacity = '0';
            loadingScreen.style.transition = 'opacity 1s';

            setTimeout(() => {
                loadingScreen.style.display = 'none';
                mainContainer.classList.remove('hidden');
                state.entered = true;

                // Start ambient effects
                startAmbientEffects();

                // Resume audio context if needed
                if (state.audioEnabled && state.audioContext) {
                    state.audioContext.resume();
                }
            }, 1000);

            if (glitchFlash) {
                glitchFlash.style.opacity = '0';
            }

            document.body.style.animation = '';
        }, 500);
    }
}

// ============================================
// Audio System (Web Audio API)
// ============================================
function initAudio() {
    state.audioContext = new (window.AudioContext || window.webkitAudioContext)();

    // Create audio nodes
    const masterGain = state.audioContext.createGain();
    masterGain.gain.value = 0.3;
    masterGain.connect(state.audioContext.destination);
    state.audioNodes.masterGain = masterGain;

    // Static noise generator
    const bufferSize = 2 * state.audioContext.sampleRate;
    const noiseBuffer = state.audioContext.createBuffer(1, bufferSize, state.audioContext.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
    }

    state.audioNodes.noiseBuffer = noiseBuffer;

    // Low frequency hum
    state.audioNodes.hum = createHum(state.audioContext, masterGain, 60);

    state.loaded = true;
}

function createHum(ctx, destination, frequency) {
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.value = frequency;

    gain.gain.value = 0.05;

    oscillator.connect(gain);
    gain.connect(destination);

    return { oscillator, gain };
}

function playStatic(duration = 0.5) {
    if (!state.audioContext || !state.audioEnabled) return;

    const noiseSource = state.audioContext.createBufferSource();
    noiseSource.buffer = state.audioNodes.noiseBuffer;

    const gainNode = state.audioContext.createGain();
    gainNode.gain.value = 0.1;

    // Low-pass filter for radio static effect
    const filter = state.audioContext.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 2000;

    noiseSource.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(state.audioNodes.masterGain);

    noiseSource.start(state.audioContext.currentTime);
    noiseSource.stop(state.audioContext.currentTime + duration);
}

function playTone(frequency, duration = 0.3) {
    if (!state.audioContext || !state.audioEnabled) return;

    const oscillator = state.audioContext.createOscillator();
    const gain = state.audioContext.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.value = frequency;

    gain.gain.setValueAtTime(0.1, state.audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, state.audioContext.currentTime + duration);

    oscillator.connect(gain);
    gain.connect(state.audioNodes.masterGain);

    oscillator.start(state.audioContext.currentTime);
    oscillator.stop(state.audioContext.currentTime + duration);
}

function startAmbientAudio() {
    if (!state.audioContext || !state.audioEnabled) return;

    // Start low frequency hum
    if (state.audioNodes.hum) {
        state.audioNodes.hum.oscillator.start();
    }

    // Occasional static bursts
    setInterval(() => {
        if (state.audioEnabled && Math.random() < 0.3) {
            playStatic(Math.random() * 2 + 0.5);
        }
    }, 5000);

    // Occasional tones
    setInterval(() => {
        if (state.audioEnabled && Math.random() < 0.2) {
            playTone(873, 0.2); // 87.3 Hz frequency reference
        }
    }, 10000);
}

// ============================================
// Audio Controls
// ============================================
const muteBtn = document.getElementById('muteBtn');

if (muteBtn) {
    muteBtn.addEventListener('click', () => {
        if (!state.audioContext) {
            initAudio();
        }

        state.audioEnabled = !state.audioEnabled;

        const muteIcon = muteBtn.querySelector('.mute-icon');
        const muteText = muteBtn.querySelector('.mute-text');

        if (state.audioEnabled) {
            if (muteIcon) muteIcon.textContent = '🔊';
            if (muteText) muteText.textContent = 'Disable Audio';
            muteBtn.classList.add('active');

            if (state.audioContext.state === 'suspended') {
                state.audioContext.resume();
            }

            if (state.entered) {
                startAmbientAudio();
            }

            playStatic(0.3);
        } else {
            if (muteIcon) muteIcon.textContent = '🔇';
            if (muteText) muteText.textContent = 'Enable Audio';
            muteBtn.classList.remove('active');
        }
    });
}

// ============================================
// Navigation
// ============================================
const navItems = document.querySelectorAll('.nav-item');

navItems.forEach(item => {
    item.addEventListener('click', () => {
        const page = item.dataset.page;

        if (page) {
            // Add loading effect
            triggerGlitchFlash();

            // Play sound
            playStatic(0.2);

            // Navigate after a short delay
            setTimeout(() => {
                window.location.href = page + '.html';
            }, 300);
        }
    });

    // Random glitch on hover
    item.addEventListener('mouseenter', () => {
        if (Math.random() < 0.3) {
            item.style.animation = 'navGlitch 0.2s';
            setTimeout(() => item.style.animation = '', 200);
        }
    });
});

// ============================================
// Interactive Elements
// ============================================
function initializeInteractiveElements() {
    // File items
    const fileItems = document.querySelectorAll('.file-item');

    fileItems.forEach(item => {
        item.addEventListener('click', () => {
            const isSecret = item.dataset.secret === 'true';

            if (isSecret) {
                // Secret file clicked
                triggerGlitchFlash();
                showWarning('This file is corrupted beyond recovery.');
                playTone(150, 0.5);
            } else {
                // Normal file
                const fileName = item.querySelector('.file-name');
                if (fileName) {
                    showAccessDenied();
                }
            }
        });
    });

    // Terminal interaction
    const terminalWindow = document.querySelector('.terminal-window');
    if (terminalWindow) {
        setInterval(() => {
            addTerminalLine();
        }, 5000);
    }

    // Corrupted text hover reveals
    const corruptedTexts = document.querySelectorAll('.entry-text.corrupted');
    corruptedTexts.forEach(text => {
        const originalText = text.textContent;
        const hiddenText = text.dataset.text || '[RECOVERING...]';

        text.addEventListener('mouseenter', () => {
            text.textContent = hiddenText;
            text.style.color = '#ff0000';
            playTone(200, 0.1);
        });

        text.addEventListener('mouseleave', () => {
            text.textContent = originalText;
            text.style.color = '';
        });
    });

    // Password modal triggers
    const secretItems = document.querySelectorAll('[data-secret="true"]');
    secretItems.forEach(item => {
        item.addEventListener('dblclick', () => {
            showPasswordModal();
        });
    });

    // Password modal
    const passwordModal = document.getElementById('passwordModal');
    const passwordSubmit = document.getElementById('passwordSubmit');
    const passwordCancel = document.getElementById('passwordCancel');
    const passwordInput = document.getElementById('passwordInput');

    if (passwordSubmit && passwordModal) {
        passwordSubmit.addEventListener('click', () => {
            checkPassword();
        });
    }

    if (passwordCancel && passwordModal) {
        passwordCancel.addEventListener('click', () => {
            passwordModal.classList.add('hidden');
        });
    }

    if (passwordInput) {
        passwordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                checkPassword();
            }
        });
    }

    // Video controls
    const controlBtns = document.querySelectorAll('.control-btn');
    controlBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.dataset.action;
            handleVideoControl(action);
        });
    });

    // Hover reveal
    const hoverReveals = document.querySelectorAll('.hover-reveal');
    hoverReveals.forEach(item => {
        item.addEventListener('mouseenter', () => {
            const message = item.dataset.message;
            if (message) {
                item.textContent = message;
                item.style.color = '#ff0000';
            }
        });

        item.addEventListener('mouseleave', () => {
            item.textContent = 'Move cursor here';
            item.style.color = '';
        });
    });

    // Signal value update
    updateSignalValue();

    // Integrity decay
    setInterval(() => {
        decayIntegrity();
    }, 10000);

    // Secret page detection
    detectSecretPage();
}

// ============================================
// Terminal
// ============================================
function addTerminalLine() {
    const terminalContent = document.querySelector('.terminal-content');
    if (!terminalContent) return;

    const lines = [
        '> Scanning frequency band...',
        '> Signal fluctuation detected',
        '> Attempting signal lock...',
        '> Noise interference increasing',
        '> Partial data stream captured',
        '> Connection unstable',
        '> Remote host not responding',
        '> Retrying connection...',
        '> ERROR: Protocol violation',
        '> WARNING: Unauthorized access logged'
    ];

    const randomLine = lines[Math.floor(Math.random() * lines.length)];

    const newLine = document.createElement('p');
    newLine.className = 'terminal-line';

    if (randomLine.includes('ERROR') || randomLine.includes('WARNING')) {
        newLine.classList.add(randomLine.includes('ERROR') ? 'error' : 'warning');
    }

    newLine.textContent = randomLine;

    // Remove the typing cursor line temporarily
    const typingLine = terminalContent.querySelector('.typing');
    if (typingLine) {
        terminalContent.insertBefore(newLine, typingLine);
    } else {
        terminalContent.appendChild(newLine);
    }

    // Scroll to bottom
    terminalContent.scrollTop = terminalContent.scrollHeight;
}

// ============================================
// Password System
// ============================================
function showPasswordModal() {
    const modal = document.getElementById('passwordModal');
    if (modal) {
        modal.classList.remove('hidden');
        playStatic(0.3);
    }
}

function checkPassword() {
    const passwordInput = document.getElementById('passwordInput');
    const modal = document.getElementById('passwordModal');

    if (!passwordInput || !modal) return;

    const password = passwordInput.value;

    state.passwordAttempts++;

    if (password === state.correctPassword) {
        // Correct password
        modal.classList.add('hidden');
        showSecretPage();
    } else {
        // Wrong password
        passwordInput.value = '';
        passwordInput.style.borderColor = '#ff0000';

        if (state.passwordAttempts >= 3) {
            showAccessDenied();
            modal.classList.add('hidden');
        }
    }
}

// ============================================
// Effects & Animations
// ============================================
function triggerGlitchFlash() {
    const flash = document.getElementById('glitchFlash');
    if (!flash) return;

    flash.style.opacity = '1';
    flash.style.transition = 'opacity 0.1s';

    setTimeout(() => {
        flash.style.opacity = '0';
    }, 100);

    // Random chance of false color glitch
    if (Math.random() < 0.3) {
        document.body.classList.add('glitch-false-color');
        setTimeout(() => {
            document.body.classList.remove('glitch-false-color');
        }, 500);
    }
}

function showWarning(message) {
    const popup = document.getElementById('warningPopup');
    const popupMessage = popup?.querySelector('.popup-message');

    if (popup) {
        if (popupMessage && message) {
            popupMessage.textContent = message;
        }

        popup.classList.remove('hidden');

        // Auto close after 5 seconds
        setTimeout(() => {
            popup.classList.add('hidden');
        }, 5000);
    }

    const closeBtn = popup?.querySelector('.popup-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            popup.classList.add('hidden');
        });
    }
}

function showAccessDenied() {
    const accessDenied = document.getElementById('accessDenied');
    if (accessDenied) {
        accessDenied.classList.remove('hidden');
        playTone(100, 0.8);

        setTimeout(() => {
            accessDenied.classList.add('hidden');
        }, 2000);
    }
}

function showSecretPage() {
    const secretPage = document.getElementById('secretPage');
    if (secretPage) {
        secretPage.classList.remove('hidden');
        state.secretFound = true;

        // Auto close after some time
        setTimeout(() => {
            secretPage.classList.add('hidden');
        }, 10000);
    }
}

// ============================================
// Video Controls
// ============================================
function handleVideoControl(action) {
    const videoStatic = document.querySelector('.video-static-animated');

    switch (action) {
        case 'play':
            if (videoStatic) {
                videoStatic.style.animationPlayState = 'running';
            }
            playStatic(1);
            showSubtitle('SIGNAL SEARCHING...');
            break;

        case 'pause':
            if (videoStatic) {
                videoStatic.style.animationPlayState = 'paused';
            }
            showSubtitle('PAUSED');
            break;

        case 'stop':
            if (videoStatic) {
                videoStatic.style.animationPlayState = 'paused';
            }
            showSubtitle('STOPPED');
            break;

        case 'rewind':
            triggerGlitchFlash();
            showSubtitle('REWINDING...');
            break;

        case 'forward':
            triggerGlitchFlash();
            showSubtitle('FAST FORWARDING...');
            break;
    }
}

// ============================================
// Subtitles
// ============================================
function showSubtitle(text) {
    const subtitle = document.getElementById('subtitle');
    if (subtitle) {
        subtitle.textContent = text;
        subtitle.style.display = 'block';

        setTimeout(() => {
            subtitle.style.display = 'none';
        }, 3000);
    }
}

// ============================================
// Signal Value
// ============================================
function updateSignalValue() {
    const signalValue = document.getElementById('signalValue');
    if (!signalValue) return;

    const statuses = [
        'SEARCHING...',
        '87.3 MHz DETECTED',
        'INTERFERENCE',
        'NO SIGNAL',
        'PARTIAL LOCK',
        'UNSTABLE',
        'SIGNAL LOST'
    ];

    setInterval(() => {
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
        signalValue.textContent = randomStatus;

        if (randomStatus === '87.3 MHz DETECTED') {
            signalValue.style.color = '#ff0000';
            playTone(873, 0.2);
        } else {
            signalValue.style.color = '';
        }
    }, 3000);
}

// ============================================
// Integrity Decay
// ============================================
function decayIntegrity() {
    const integrityFill = document.getElementById('integrityFill');
    const integrityValue = document.getElementById('integrityValue');

    if (!integrityFill || !integrityValue) return;

    // Slowly decay
    state.integrity = Math.max(0, state.integrity - Math.random() * 2);

    const percent = Math.round(state.integrity);
    integrityFill.style.width = percent + '%';
    integrityValue.textContent = percent + '%';

    // Warning when low
    if (percent < 20) {
        integrityValue.style.color = '#ff0000';
    }
}

// ============================================
// Ambient Effects
// ============================================
function startAmbientEffects() {
    // Track visit duration
    setInterval(() => {
        state.visitDuration++;
    }, 1000);

    // Random subtitle messages
    setInterval(() => {
        if (Math.random() < 0.3 && state.visitDuration > 10) {
            const randomMessage = creepyMessages[Math.floor(Math.random() * creepyMessages.length)];
            showSubtitle(randomMessage);
        }
    }, 15000);

    // Random glitch effects
    state.glitchInterval = setInterval(() => {
        const chance = Math.min(0.05 + (state.visitDuration * 0.001), 0.3);

        if (Math.random() < chance) {
            triggerRandomGlitch();
        }
    }, 5000);

    // Escalating intensity over time
    setInterval(() => {
        if (state.visitDuration > 30) {
            document.querySelector('.noise-layer')?.classList.add('heavy');
        }

        if (state.visitDuration > 60) {
            document.querySelector('.scanlines')?.classList.add('intense');
        }
    }, 10000);
}

function triggerRandomGlitch() {
    const effects = [
        glitchScreen,
        glitchText,
        glitchCursor,
        showHiddenMessage,
        triggerGlitchFlash
    ];

    const randomEffect = effects[Math.floor(Math.random() * effects.length)];
    randomEffect();

    // Play sound
    playStatic(0.3);
}

function glitchScreen() {
    document.body.style.filter = 'invert(1)';
    setTimeout(() => {
        document.body.style.filter = '';
    }, 50);

    setTimeout(() => {
        document.body.style.filter = 'hue-rotate(180deg)';
        setTimeout(() => {
            document.body.style.filter = '';
        }, 50);
    }, 100);
}

function glitchText() {
    const elements = document.querySelectorAll('.title, .page-title, .warning-title, .transmission-header');
    elements.forEach(el => {
        el.style.transform = `translate(${Math.random() * 10 - 5}px, ${Math.random() * 10 - 5}px)`;
        el.style.textShadow = `${Math.random() * 4 - 2}px 0 #ff00ff, ${Math.random() * 4 - 2}px 0 #00ffff`;

        setTimeout(() => {
            el.style.transform = '';
            el.style.textShadow = '';
        }, 200);
    });
}

function glitchCursor() {
    if (cursor) {
        cursor.style.opacity = '0';
        setTimeout(() => {
            cursor.style.opacity = '1';
        }, 100);
    }
}

function showHiddenMessage() {
    const message = document.getElementById('hiddenMessage');
    if (message) {
        message.style.opacity = '1';
        setTimeout(() => {
            message.style.opacity = '0';
        }, 1000);
    }
}

// ============================================
// Special Page Detection
// ============================================
function detectSecretPage() {
    // Detect camera feed page
    const cameraPage = document.getElementById('cameraPage');
    if (cameraPage) {
        // Camera page special effects
        setInterval(() => {
            const cameras = document.querySelectorAll('.camera-screen');
            cameras.forEach(cam => {
                if (Math.random() < 0.1) {
                    cam.style.filter = 'brightness(0.5)';
                    setTimeout(() => {
                        cam.style.filter = '';
                    }, 100);
                }
            });
        }, 3000);
    }

    // Detect do not open page
    const doNotOpenPage = document.getElementById('doNotOpenPage');
    if (doNotOpenPage) {
        initDoNotOpenPage();
    }

    // Detect logs page
    const logsPage = document.getElementById('logsPage');
    if (logsPage) {
        initLogsPage();
    }
}

// ============================================
// Do Not Open Page Special Effects
// ============================================
function initDoNotOpenPage() {
    // Update user info
    const browserSpan = document.getElementById('userBrowser');
    const screenSpan = document.getElementById('userScreen');

    if (browserSpan) {
        browserSpan.textContent = navigator.userAgent.split(' ')[0] || 'UNKNOWN';
    }

    if (screenSpan) {
        screenSpan.textContent = `${window.screen.width}x${window.screen.height}`;
    }

    // Signal strength countdown
    const signalFill = document.getElementById('signalFill');
    const signalPercent = document.getElementById('signalPercent');
    const countdownTimer = document.getElementById('countdownTimer');
    const escapeLink = document.getElementById('escapeLink');
    const finalInstruction = document.getElementById('finalInstruction');

    let signal = 0;
    let timeRemaining = 60;

    const signalInterval = setInterval(() => {
        signal = Math.min(100, signal + 1);

        if (signalFill) signalFill.style.width = signal + '%';
        if (signalPercent) signalPercent.textContent = signal + '%';

        if (signal >= 100) {
            clearInterval(signalInterval);

            // Show escape option
            if (escapeLink) {
                escapeLink.classList.remove('hidden');
            }

            if (finalInstruction) {
                finalInstruction.classList.remove('hidden');
            }

            document.getElementById('redOverlay')?.classList.remove('hidden');

            showSubtitle('TRANSMISSION COMPLETE');
        }
    }, 1000);

    // Countdown timer
    const countdownInterval = setInterval(() => {
        timeRemaining--;
        if (countdownTimer) {
            const minutes = Math.floor(timeRemaining / 60);
            const seconds = timeRemaining % 60;
            countdownTimer.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }

        if (timeRemaining <= 0) {
            clearInterval(countdownInterval);
        }
    }, 1000);

    // Disturbing text flash
    setInterval(() => {
        const disturbingText = document.getElementById('disturbingText');
        if (disturbingText && Math.random() < 0.1) {
            disturbingText.classList.remove('hidden');
            setTimeout(() => {
                disturbingText.classList.add('hidden');
            }, 500);
        }
    }, 5000);

    // Intense glitch effects
    setInterval(() => {
        triggerRandomGlitch();
    }, 8000);
}

// ============================================
// Logs Page Effects
// ============================================
function initLogsPage() {
    // Scroll through logs with flicker
    const logTerminal = document.querySelector('.log-terminal');
    if (logTerminal) {
        logTerminal.addEventListener('scroll', () => {
            if (Math.random() < 0.1) {
                triggerGlitchFlash();
            }
        });
    }
}

// ============================================
// Page Load Detection
// ============================================
window.addEventListener('load', () => {
    // Check which page we're on
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    // Apply page-specific effects
    if (currentPage !== 'index.html') {
        state.entered = true;
        startAmbientEffects();

        // Initialize audio on page interaction
        document.addEventListener('click', () => {
            if (!state.audioContext) {
                initAudio();
            }
        }, { once: true });
    }
});

// ============================================
// Beforeunload Warning
// ============================================
window.addEventListener('beforeunload', (e) => {
    if (state.visitDuration > 60 && state.entered) {
        const message = 'The signal will find you again.';
        e.returnValue = message;
        return message;
    }
});

// ============================================
// Page Visibility
// ============================================
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // User tabbed away
        showSubtitle('You cannot escape.');
    } else {
        // User returned
        if (state.entered) {
            showSubtitle('You came back.');
            triggerGlitchFlash();
        }
    }
});

// ============================================
// Initial Setup
// ============================================
console.log('%cTHE SIGNAL IS ACTIVE', 'color: #ff0000; font-weight: bold;');
console.log('%cWelcome to Lost Signal.', 'color: #888;');
console.log('%cType signal.help() for commands.', 'color: #555;');

// Add helper commands to window for console exploration
window.signal = {
    init: () => console.log('Signal initialized.'),
    help: () => console.log('%cAvailable commands:\n  signal.trace() - Show origin\n  signal.frequency() - Display frequency\n  signal.year() - Remember the year\n  signal.exit() - No escape', 'color: #888;'),
    trace: () => console.log('%cOrigin: Unknown Location\nCoordinates: [REDACTED]', 'color: #ff0000;'),
    frequency: () => console.log('%c87.3 MHz', 'color: #ff0000; font-size: 20px;'),
    year: () => console.log('%c1987. The year everything changed.', 'color: #8b0000;'),
    exit: () => console.log('%cThere is no exit.', 'color: #ff0000;')
};

