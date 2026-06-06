// Lost Signal - Horror ARG Website JavaScript

console.log('%cSIGNAL INITIALIZATION', 'font-size: 20px; color: #ff0000;');
console.log('%csignal.init(1987, 87.3);', 'color: #888;');
console.log('%cThey are watching.', 'color: #8b0000;');

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
    glitchInterval: null
};

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

// Custom Cursor
const cursor = document.getElementById('customCursor');

document.addEventListener('mousemove', (e) => {
    if (cursor) {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    }
});

setInterval(() => {
    if (cursor && Math.random() < 0.05) {
        cursor.classList.add('flicker');
        setTimeout(() => cursor.classList.remove('flicker'), 100);
    }
}, 500);

// Loading Screen
document.addEventListener('DOMContentLoaded', () => {
    const glitchText = document.getElementById('glitchText');
    const enterBtn = document.getElementById('enterBtn');

    if (glitchText && enterBtn) {
        const message = "If you found this website... you were not supposed to.";
        let i = 0;

        function typeChar() {
            if (i < message.length) {
                glitchText.textContent = message.substring(0, i + 1);
                glitchText.setAttribute('data-text', glitchText.textContent);
                i++;
                const delay = Math.random() * 100 + 50;
                setTimeout(typeChar, delay);
            } else {
                setTimeout(() => {
                    enterBtn.classList.remove('hidden');
                    enterBtn.style.animation = 'fadeIn 1s ease-out';
                }, 1000);
            }
        }

        setTimeout(typeChar, 1000);

        enterBtn.addEventListener('click', () => {
            enterMainSite();
        });
    }

    initializeInteractiveElements();
});

function enterMainSite() {
    const loadingScreen = document.getElementById('loadingScreen');
    const mainContainer = document.getElementById('mainContainer');
    const glitchFlash = document.getElementById('glitchFlash');

    if (loadingScreen && mainContainer) {
        if (glitchFlash) {
            glitchFlash.style.opacity = '1';
            glitchFlash.style.transition = 'opacity 0.5s';
        }

        setTimeout(() => {
            loadingScreen.style.opacity = '0';
            loadingScreen.style.transition = 'opacity 1s';

            setTimeout(() => {
                loadingScreen.style.display = 'none';
                mainContainer.classList.remove('hidden');
                state.entered = true;
                startAmbientEffects();

                if (state.audioEnabled && state.audioContext) {
                    state.audioContext.resume();
                }
            }, 1000);

            if (glitchFlash) glitchFlash.style.opacity = '0';
        }, 500);
    }
}

// Audio System
function initAudio() {
    state.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const masterGain = state.audioContext.createGain();
    masterGain.gain.value = 0.3;
    masterGain.connect(state.audioContext.destination);
    state.audioNodes.masterGain = masterGain;

    const bufferSize = 2 * state.audioContext.sampleRate;
    const noiseBuffer = state.audioContext.createBuffer(1, bufferSize, state.audioContext.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
    }
    state.audioNodes.noiseBuffer = noiseBuffer;
    state.loaded = true;
}

function playStatic(duration = 0.5) {
    if (!state.audioContext || !state.audioEnabled) return;

    const noiseSource = state.audioContext.createBufferSource();
    noiseSource.buffer = state.audioNodes.noiseBuffer;

    const gainNode = state.audioContext.createGain();
    gainNode.gain.value = 0.1;

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

    setInterval(() => {
        if (state.audioEnabled && Math.random() < 0.3) {
            playStatic(Math.random() * 2 + 0.5);
        }
    }, 5000);

    setInterval(() => {
        if (state.audioEnabled && Math.random() < 0.2) {
            playTone(873, 0.2);
        }
    }, 10000);
}

// Audio Controls
const muteBtn = document.getElementById('muteBtn');

if (muteBtn) {
    muteBtn.addEventListener('click', () => {
        if (!state.audioContext) initAudio();
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
            if (state.entered) startAmbientAudio();
            playStatic(0.3);
        } else {
            if (muteIcon) muteIcon.textContent = '🔇';
            if (muteText) muteText.textContent = 'Enable Audio';
            muteBtn.classList.remove('active');
        }
    });
}

// Navigation
const navItems = document.querySelectorAll('.nav-item');
navItems.forEach(item => {
    item.addEventListener('click', () => {
        const page = item.dataset.page;
        if (page) {
            triggerGlitchFlash();
            playStatic(0.2);
            setTimeout(() => {
                window.location.href = page + '.html';
            }, 300);
        }
    });
});

// Interactive Elements
function initializeInteractiveElements() {
    const fileItems = document.querySelectorAll('.file-item');
    fileItems.forEach(item => {
        item.addEventListener('click', () => {
            const isSecret = item.dataset.secret === 'true';
            if (isSecret) {
                triggerGlitchFlash();
                showWarning('This file is corrupted beyond recovery.');
                playTone(150, 0.5);
            } else {
                showAccessDenied();
            }
        });
    });

    const terminalWindow = document.querySelector('.terminal-window');
    if (terminalWindow) {
        setInterval(addTerminalLine, 5000);
    }

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

    const secretItems = document.querySelectorAll('[data-secret="true"]');
    secretItems.forEach(item => {
        item.addEventListener('dblclick', () => {
            showPasswordModal();
        });
    });

    const passwordSubmit = document.getElementById('passwordSubmit');
    const passwordCancel = document.getElementById('passwordCancel');
    const passwordInput = document.getElementById('passwordInput');
    const passwordModal = document.getElementById('passwordModal');

    if (passwordSubmit) {
        passwordSubmit.addEventListener('click', checkPassword);
    }

    if (passwordCancel && passwordModal) {
        passwordCancel.addEventListener('click', () => {
            passwordModal.classList.add('hidden');
        });
    }

    if (passwordInput) {
        passwordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') checkPassword();
        });
    }

    const controlBtns = document.querySelectorAll('.control-btn');
    controlBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            handleVideoControl(btn.dataset.action);
        });
    });

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

    updateSignalValue();
    setInterval(decayIntegrity, 10000);
    detectSecretPage();
}

// Terminal
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

    if (randomLine.includes('ERROR')) newLine.classList.add('error');
    if (randomLine.includes('WARNING')) newLine.classList.add('warning');

    newLine.textContent = randomLine;
    const typingLine = terminalContent.querySelector('.typing');
    if (typingLine) {
        terminalContent.insertBefore(newLine, typingLine);
    } else {
        terminalContent.appendChild(newLine);
    }

    terminalContent.scrollTop = terminalContent.scrollHeight;
}

// Password System
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
        modal.classList.add('hidden');
        showSecretPage();
    } else {
        passwordInput.value = '';
        passwordInput.style.borderColor = '#ff0000';

        if (state.passwordAttempts >= 3) {
            showAccessDenied();
            modal.classList.add('hidden');
        }
    }
}

// Effects
function triggerGlitchFlash() {
    const flash = document.getElementById('glitchFlash');
    if (!flash) return;

    flash.style.opacity = '1';
    flash.style.transition = 'opacity 0.1s';

    setTimeout(() => {
        flash.style.opacity = '0';
    }, 100);

    if (Math.random() < 0.3) {
        document.body.classList.add('glitch-false-color');
        setTimeout(() => document.body.classList.remove('glitch-false-color'), 500);
    }
}

function showWarning(message) {
    const popup = document.getElementById('warningPopup');
    const popupMessage = popup?.querySelector('.popup-message');

    if (popup) {
        if (popupMessage && message) popupMessage.textContent = message;
        popup.classList.remove('hidden');
        setTimeout(() => popup.classList.add('hidden'), 5000);
    }

    const closeBtn = popup?.querySelector('.popup-close');
    if (closeBtn) {
        closeBtn.onclick = () => popup.classList.add('hidden');
    }
}

function showAccessDenied() {
    const accessDenied = document.getElementById('accessDenied');
    if (accessDenied) {
        accessDenied.classList.remove('hidden');
        playTone(100, 0.8);
        setTimeout(() => accessDenied.classList.add('hidden'), 2000);
    }
}

function showSecretPage() {
    const secretPage = document.getElementById('secretPage');
    if (secretPage) {
        secretPage.classList.remove('hidden');
        state.secretFound = true;
        setTimeout(() => secretPage.classList.add('hidden'), 10000);
    }
}

// Video Controls
function handleVideoControl(action) {
    const videoStatic = document.querySelector('.video-static-animated');

    switch (action) {
        case 'play':
            if (videoStatic) videoStatic.style.animationPlayState = 'running';
            playStatic(1);
            showSubtitle('SIGNAL SEARCHING...');
            break;
        case 'pause':
            if (videoStatic) videoStatic.style.animationPlayState = 'paused';
            showSubtitle('PAUSED');
            break;
        case 'stop':
            if (videoStatic) videoStatic.style.animationPlayState = 'paused';
            showSubtitle('STOPPED');
            break;
        case 'rewind':
        case 'forward':
            triggerGlitchFlash();
            showSubtitle(action === 'rewind' ? 'REWINDING...' : 'FAST FORWARDING...');
            break;
    }
}

// Subtitles
function showSubtitle(text) {
    const subtitle = document.getElementById('subtitle');
    if (subtitle) {
        subtitle.textContent = text;
        subtitle.style.display = 'block';
        setTimeout(() => subtitle.style.display = 'none', 3000);
    }
}

// Signal Value
function updateSignalValue() {
    const signalValue = document.getElementById('signalValue');
    if (!signalValue) return;

    const statuses = ['SEARCHING...', '87.3 MHz DETECTED', 'INTERFERENCE', 'NO SIGNAL', 'PARTIAL LOCK', 'UNSTABLE', 'SIGNAL LOST'];

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

// Integrity Decay
function decayIntegrity() {
    const integrityFill = document.getElementById('integrityFill');
    const integrityValue = document.getElementById('integrityValue');

    if (!integrityFill || !integrityValue) return;

    state.integrity = Math.max(0, state.integrity - Math.random() * 2);
    const percent = Math.round(state.integrity);
    integrityFill.style.width = percent + '%';
    integrityValue.textContent = percent + '%';

    if (percent < 20) integrityValue.style.color = '#ff0000';
}

// Ambient Effects
function startAmbientEffects() {
    setInterval(() => state.visitDuration++, 1000);

    setInterval(() => {
        if (Math.random() < 0.3 && state.visitDuration > 10) {
            const randomMessage = creepyMessages[Math.floor(Math.random() * creepyMessages.length)];
            showSubtitle(randomMessage);
        }
    }, 15000);

    state.glitchInterval = setInterval(() => {
        const chance = Math.min(0.05 + (state.visitDuration * 0.001), 0.3);
        if (Math.random() < chance) triggerRandomGlitch();
    }, 5000);

    setInterval(() => {
        if (state.visitDuration > 30) document.querySelector('.noise-layer')?.classList.add('heavy');
        if (state.visitDuration > 60) document.querySelector('.scanlines')?.classList.add('intense');
    }, 10000);
}

function triggerRandomGlitch() {
    const effects = [glitchScreen, glitchText, glitchCursor, showHiddenMessage, triggerGlitchFlash];
    const randomEffect = effects[Math.floor(Math.random() * effects.length)];
    randomEffect();
    playStatic(0.3);
}

function glitchScreen() {
    document.body.style.filter = 'invert(1)';
    setTimeout(() => document.body.style.filter = '', 50);
    setTimeout(() => {
        document.body.style.filter = 'hue-rotate(180deg)';
        setTimeout(() => document.body.style.filter = '', 50);
    }, 100);
}

function glitchText() {
    const elements = document.querySelectorAll('.title, .page-title, .warning-title');
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
        setTimeout(() => cursor.style.opacity = '1', 100);
    }
}

function showHiddenMessage() {
    const message = document.getElementById('hiddenMessage');
    if (message) {
        message.style.opacity = '1';
        setTimeout(() => message.style.opacity = '0', 1000);
    }
}

// Special Page Detection
function detectSecretPage() {
    const cameraPage = document.getElementById('cameraPage');
    if (cameraPage) {
        setInterval(() => {
            const cameras = document.querySelectorAll('.camera-screen');
            cameras.forEach(cam => {
                if (Math.random() < 0.1) {
                    cam.style.filter = 'brightness(0.5)';
                    setTimeout(() => cam.style.filter = '', 100);
                }
            });
        }, 3000);
    }

    const doNotOpenPage = document.getElementById('doNotOpenPage');
    if (doNotOpenPage) initDoNotOpenPage();

    const logsPage = document.getElementById('logsPage');
    if (logsPage) initLogsPage();
}

// Do Not Open Page
function initDoNotOpenPage() {
    const browserSpan = document.getElementById('userBrowser');
    const screenSpan = document.getElementById('userScreen');

    if (browserSpan) browserSpan.textContent = navigator.userAgent.split(' ')[0] || 'UNKNOWN';
    if (screenSpan) screenSpan.textContent = `${window.screen.width}x${window.screen.height}`;

    const signalFill = document.getElementById('signalFill');
    const signalPercent = document.getElementById('signalPercent');
    const countdownTimer = document.getElementById('countdownTimer');
    const escapeLink = document.getElementById('escapeLink');

    let signal = 0;
    let timeRemaining = 60;

    const signalInterval = setInterval(() => {
        signal = Math.min(100, signal + 1);

        if (signalFill) signalFill.style.width = signal + '%';
        if (signalPercent) signalPercent.textContent = signal + '%';

        if (signal >= 100) {
            clearInterval(signalInterval);
            if (escapeLink) escapeLink.classList.remove('hidden');
            document.getElementById('redOverlay')?.classList.remove('hidden');
            showSubtitle('TRANSMISSION COMPLETE');
        }
    }, 1000);

    const countdownInterval = setInterval(() => {
        timeRemaining--;
        if (countdownTimer) {
            const minutes = Math.floor(timeRemaining / 60);
            const seconds = timeRemaining % 60;
            countdownTimer.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }
        if (timeRemaining <= 0) clearInterval(countdownInterval);
    }, 1000);

    setInterval(triggerRandomGlitch, 8000);
}

// Logs Page
function initLogsPage() {
    const logTerminal = document.querySelector('.log-terminal');
    if (logTerminal) {
        logTerminal.addEventListener('scroll', () => {
            if (Math.random() < 0.1) triggerGlitchFlash();
        });
    }
}

// Page Load Detection
window.addEventListener('load', () => {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    if (currentPage !== 'index.html') {
        state.entered = true;
        startAmbientEffects();

        document.addEventListener('click', () => {
            if (!state.audioContext) initAudio();
        }, { once: true });
    }
});

// Page Visibility
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        showSubtitle('You cannot escape.');
    } else {
        if (state.entered) {
            showSubtitle('You came back.');
            triggerGlitchFlash();
        }
    }
});

// Console Helpers
console.log('%cTHE SIGNAL IS ACTIVE', 'color: #ff0000; font-weight: bold;');
console.log('%cType signal.help() for commands.', 'color: #555;');

window.signal = {
    init: () => console.log('Signal initialized.'),
    help: () => console.log('%cAvailable commands:\n  signal.trace() - Show origin\n  signal.frequency() - Display frequency\n  signal.year() - Remember the year\n  signal.exit() - No escape', 'color: #888;'),
    trace: () => console.log('%cOrigin: Unknown Location\nCoordinates: [REDACTED]', 'color: #ff0000;'),
    frequency: () => console.log('%c87.3 MHz', 'color: #ff0000; font-size: 20px;'),
    year: () => console.log('%c1987. The year everything changed.', 'color: #8b0000;'),
    exit: () => console.log('%cThere is no exit.', 'color: #ff0000;')
};
