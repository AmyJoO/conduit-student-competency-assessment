// Conduit Student Competency Assessment - Main App
// Version 2.0.0

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔗 Conduit Student Competency Assessment - Initializing...');
    
    // Initialize the app
    initializeApp();
    
    // Set up event listeners
    setupEventListeners();
    
    // Check for saved data
    loadSavedData();
    
    // Hide loading screen
    setTimeout(() => {
        document.getElementById('app-loading').classList.add('hidden');
        document.getElementById('app-content').classList.remove('hidden');
        showNotification('Welcome to Conduit! Ready to connect learning through assessment.', 'success');
    }, 1500);
});

// Initialize the application
function initializeApp() {
    // Set current date
    const dateInput = document.getElementById('assessment-date');
    if (dateInput) {
        dateInput.value = new Date().toISOString().split('T')[0];
    }
    
    // Initialize local storage structure if needed
    if (!localStorage.getItem('conduit_data')) {
        const initialData = {
            version: '2.0.0',
            assessments: [],
            students: [],
            templates: [],
            settings: {
                autoSave: true,
                darkMode: false,
                notifications: true
            },
            profile: {
                name: '',
                school: '',
                email: ''
            }
        };
        localStorage.setItem('conduit_data', JSON.stringify(initialData));
    }
    
    // Update last updated date
    const lastUpdated = document.getElementById('last-updated');
    if (lastUpdated) {
        lastUpdated.textContent = new Date().toLocaleDateString();
    }
    
    // Check online status
    updateOnlineStatus();
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
}

// Set up event listeners
function setupEventListeners() {
    // Upload method selection
    const uploadMethods = document.querySelectorAll('input[name="uploadMethod"]');
    uploadMethods.forEach(method => {
        method.addEventListener('change', handleUploadMethodChange);
    });
    
    // Text content character counter
    const workContent = document.getElementById('work-content');
    if (workContent) {
        workContent.addEventListener('input', updateCharacterCount);
    }
    
    // File drop zone
    const dropZone = document.getElementById('drop-zone');
    if (dropZone) {
        dropZone.addEventListener('dragover', handleDragOver);
        dropZone.addEventListener('dragleave', handleDragLeave);
        dropZone.addEventListener('drop', handleFileDrop);
        dropZone.addEventListener('click', () => triggerFileInput());
    }
    
    // Settings toggles
    const darkModeToggle = document.getElementById('dark-mode');
    if (darkModeToggle) {
        darkModeToggle.addEventListener('change', toggleDarkMode);
    }
}

// Navigation function
function showSection(sectionName) {
    // Hide all sections
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected section
    const selectedSection = document.getElementById(`${sectionName}-section`);
    if (selectedSection) {
        selectedSection.classList.add('active');
    }
    
    // Update navigation buttons
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-section') === sectionName) {
            btn.classList.add('active');
        }
    });
    
    // Scroll to top
    window.scrollTo(0, 0);
}

// Handle upload method changes
function handleUploadMethodChange(event) {
    const method = event.target.value;
    
    // Hide all upload interfaces
    document.querySelectorAll('.upload-interface').forEach(interface => {
        interface.classList.remove('active');
    });
    
    // Show selected interface
    const selectedInterface = document.getElementById(`${method}-${method === 'text' ? 'entry' : method === 'file' ? 'upload' : 'capture'}`);
    if (selectedInterface) {
        selectedInterface.classList.add('active');
    }
}

// Update character count
function updateCharacterCount() {
    const content = document.getElementById('work-content');
    const charCount = document.getElementById('char-count');
    if (content && charCount) {
        charCount.textContent = content.value.length;
    }
}

// File handling functions
function triggerFileInput() {
    document.getElementById('file-input').click();
}

function handleDragOver(e) {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
}

function handleDragLeave(e) {
    e.currentTarget.classList.remove('drag-over');
}

function handleFileDrop(e) {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
}

function handleFiles(files) {
    const fileList = document.getElementById('file-list');
    fileList.classList.remove('hidden');
    
    files.forEach(file => {
        if (validateFile(file)) {
            displayFile(file);
        }
    });
}

function validateFile(file) {
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain', 'image/jpeg', 'image/png'];
    const maxSize = 10 * 1024 * 1024; // 10MB
    
    if (!validTypes.includes(file.type)) {
        showNotification('Invalid file type. Please upload PDF, DOC, DOCX, TXT, JPG, or PNG files.', 'error');
        return false;
    }
    
    if (file.size > maxSize) {
        showNotification('File size exceeds 10MB limit.', 'error');
        return false;
    }
    
    return true;
}

function displayFile(file) {
    const fileList = document.getElementById('file-list');
    const fileItem = document.createElement('div');
    fileItem.className = 'file-item';
    
    const fileIcon = file.type.includes('image') ? '🖼️' : '📄';
    const fileSize = (file.size / 1024).toFixed(1) + ' KB';
    
    fileItem.innerHTML = `
        <div class="file-info">
            <span class="file-icon">${fileIcon}</span>
            <div>
                <div class="file-name">${file.name}</div>
                <div class="file-size">${fileSize}</div>
            </div>
        </div>
        <button class="btn btn-sm btn-danger" onclick="removeFile(this)">Remove</button>
    `;
    
    fileList.appendChild(fileItem);
}

// Camera functions
let stream = null;

function startCamera() {
    const video = document.getElementById('camera-preview');
    const startBtn = document.getElementById('start-camera');
    const captureBtn = document.getElementById('capture-photo');
    const stopBtn = document.getElementById('stop-camera');
    
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        .then(mediaStream => {
            stream = mediaStream;
            video.srcObject = stream;
            video.classList.remove('hidden');
            
            startBtn.classList.add('hidden');
            captureBtn.classList.remove('hidden');
            stopBtn.classList.remove('hidden');
        })
        .catch(err => {
            console.error('Camera error:', err);
            showNotification('Unable to access camera. Please check permissions.', 'error');
        });
}

function capturePhoto() {
    const video = document.getElementById('camera-preview');
    const canvas = document.getElementById('photo-canvas');
    const photos = document.getElementById('captured-photos');
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    
    const photoData = canvas.toDataURL('image/jpeg');
    
    const photoItem = document.createElement('div');
    photoItem.className = 'photo-item';
    photoItem.innerHTML = `
        <img src="${photoData}" alt="Captured photo">
        <button class="photo-remove" onclick="removePhoto(this)">✕</button>
    `;
    
    photos.appendChild(photoItem);
    showNotification('Photo captured successfully!', 'success');
}

function stopCamera() {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        stream = null;
    }
    
    const video = document.getElementById('camera-preview');
    const startBtn = document.getElementById('start-camera');
    const captureBtn = document.getElementById('capture-photo');
    const stopBtn = document.getElementById('stop-camera');
    
    video.classList.add('hidden');
    startBtn.classList.remove('hidden');
    captureBtn.classList.add('hidden');
    stopBtn.classList.add('hidden');
}

// Remove functions
function removeFile(button) {
    button.parentElement.remove();
    
    const fileList = document.getElementById('file-list');
    if (fileList.children.length === 0) {
        fileList.classList.add('hidden');
    }
}

function removePhoto(button) {
    button.parentElement.remove();
}

// Dark mode toggle
function toggleDarkMode(event) {
    const isDark = event.target.checked;
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    
    // Save preference
    const data = getConduitData();
    data.settings.darkMode = isDark;
    saveConduitData(data);
}

// Data management functions
function getConduitData() {
    const data = localStorage.getItem('conduit_data');
    return data ? JSON.parse(data) : null;
}

function saveConduitData(data) {
    localStorage.setItem('conduit_data', JSON.stringify(data));
}

function loadSavedData() {
    const data = getConduitData();
    if (!data) return;
    
    // Load profile
    if (data.profile.name) {
        document.getElementById('teacher-name').value = data.profile.name;
        document.getElementById('current-user').textContent = `Welcome, ${data.profile.name}!`;
    }
    if (data.profile.school) {
        document.getElementById('school-name').value = data.profile.school;
    }
    if (data.profile.email) {
        document.getElementById('email').value = data.profile.email;
    }
    
    // Load settings
    document.getElementById('auto-save').checked = data.settings.autoSave;
    document.getElementById('dark-mode').checked = data.settings.darkMode;
    document.getElementById('notifications').checked = data.settings.notifications;
    
    if (data.settings.darkMode) {
        document.documentElement.setAttribute('data-theme', 'dark');
    }
    
    // Update stats
    updateDataStats();
}

// Update data statistics
function updateDataStats() {
    const data = getConduitData();
    if (!data) return;
    
    document.getElementById('total-assessments').textContent = data.assessments.length;
    document.getElementById('total-students').textContent = data.students.length;
    
    // Calculate data size
    const dataSize = new Blob([JSON.stringify(data)]).size;
    const sizeInKB = (dataSize / 1024).toFixed(1);
    document.getElementById('data-size').textContent = `${sizeInKB} KB`;
}

// Notification system
function showNotification(message, type = 'info') {
    const container = document.getElementById('notification-container');
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️';
    notification.innerHTML = `${icon} ${message}`;
    
    container.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Update online/offline status
function updateOnlineStatus() {
    const indicator = document.getElementById('offline-indicator');
    if (navigator.onLine) {
        indicator.classList.add('hidden');
    } else {
        indicator.classList.remove('hidden');
    }
}

// Export functions for use in other modules
window.conduitApp = {
    showNotification,
    getConduitData,
    saveConduitData,
    updateDataStats,
    showSection
};