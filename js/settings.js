// Conduit Student Competency Assessment - Settings Module
// Manages app settings, profile, and data management

// Save profile information
function saveProfile() {
    const name = document.getElementById('teacher-name').value.trim();
    const school = document.getElementById('school-name').value.trim();
    const email = document.getElementById('email').value.trim();
    
    if (!name) {
        window.conduitApp.showNotification('Please enter your name', 'error');
        return;
    }
    
    const data = window.conduitApp.getConduitData();
    data.profile = {
        name,
        school,
        email
    };
    
    window.conduitApp.saveConduitData(data);
    
    // Update welcome message
    document.getElementById('current-user').textContent = `Welcome, ${name}!`;
    
    window.conduitApp.showNotification('Profile saved successfully!', 'success');
}

// Backup all data
function backupData() {
    const data = window.conduitApp.getConduitData();
    
    if (!data || (!data.assessments || data.assessments.length === 0)) {
        window.conduitApp.showNotification('No data to backup', 'error');
        return;
    }
    
    const backup = {
        ...data,
        backupDate: new Date().toISOString(),
        version: '2.0.0'
    };
    
    const filename = `conduit-backup-${new Date().toISOString().split('T')[0]}.json`;
    downloadBackup(backup, filename);
    
    window.conduitApp.showNotification('Backup created successfully!', 'success');
}

// Import data
function importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = function(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const importedData = JSON.parse(e.target.result);
                
                // Validate data structure
                if (!validateImportData(importedData)) {
                    window.conduitApp.showNotification('Invalid data format', 'error');
                    return;
                }
                
                // Confirm import
                const confirmMessage = `Import data containing ${importedData.assessments?.length || 0} assessments and ${importedData.students?.length || 0} students? This will replace current data.`;
                
                if (confirm(confirmMessage)) {
                    // Merge or replace data
                    mergeImportedData(importedData);
                    window.conduitApp.showNotification('Data imported successfully!', 'success');
                    
                    // Refresh UI
                    location.reload();
                }
            } catch (error) {
                console.error('Import error:', error);
                window.conduitApp.showNotification('Error importing data. Please check the file format.', 'error');
            }
        };
        
        reader.readAsText(file);
    };
    
    input.click();
}

// Clear all data
function clearAllData() {
    const confirmClear = confirm('⚠️ WARNING: This will permanently delete all assessment data, student records, and settings. This action cannot be undone. Are you sure?');
    
    if (!confirmClear) return;
    
    const doubleConfirm = confirm('Please confirm once more: Delete ALL data?');
    
    if (!doubleConfirm) return;
    
    // Create backup before clearing
    const data = window.conduitApp.getConduitData();
    if (data && data.assessments && data.assessments.length > 0) {
        const emergencyBackup = {
            ...data,
            backupDate: new Date().toISOString(),
            backupReason: 'Pre-clear emergency backup'
        };
        
        downloadBackup(emergencyBackup, `emergency-backup-${Date.now()}.json`);
        window.conduitApp.showNotification('Emergency backup created before clearing', 'info');
    }
    
    // Clear all data
    const freshData = {
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
    
    localStorage.setItem('conduit_data', JSON.stringify(freshData));
    
    window.conduitApp.showNotification('All data has been cleared', 'success');
    
    // Reload app
    setTimeout(() => {
        location.reload();
    }, 1500);
}

// Validate imported data structure
function validateImportData(data) {
    // Check required fields
    const requiredFields = ['version', 'assessments', 'students', 'settings', 'profile'];
    
    for (const field of requiredFields) {
        if (!(field in data)) {
            console.error(`Missing required field: ${field}`);
            return false;
        }
    }
    
    // Validate data types
    if (!Array.isArray(data.assessments) || !Array.isArray(data.students)) {
        console.error('Assessments and students must be arrays');
        return false;
    }
    
    // Validate version compatibility
    const majorVersion = parseInt(data.version.split('.')[0]);
    if (majorVersion < 2) {
        console.error('Data version is too old. Please update the data format.');
        return false;
    }
    
    return true;
}

// Merge imported data with existing data
function mergeImportedData(importedData) {
    const currentData = window.conduitApp.getConduitData();
    
    // Option to merge or replace
    const mergeOption = confirm('Merge with existing data? (OK = Merge, Cancel = Replace)');
    
    if (mergeOption) {
        // Merge data
        const mergedData = {
            version: importedData.version,
            assessments: [...currentData.assessments, ...importedData.assessments],
            students: [...new Set([...currentData.students, ...importedData.students])],
            templates: [...currentData.templates, ...importedData.templates],
            settings: importedData.settings,
            profile: importedData.profile
        };
        
        // Remove duplicate assessments based on ID
        const uniqueAssessments = [];
        const seenIds = new Set();
        
        mergedData.assessments.forEach(assessment => {
            if (!seenIds.has(assessment.id)) {
                uniqueAssessments.push(assessment);
                seenIds.add(assessment.id);
            }
        });
        
        mergedData.assessments = uniqueAssessments;
        
        window.conduitApp.saveConduitData(mergedData);
    } else {
        // Replace data
        window.conduitApp.saveConduitData(importedData);
    }
    
    // Update stats
    window.conduitApp.updateDataStats();
}

// Download backup file
function downloadBackup(data, filename) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Show help documentation
function showHelp() {
    const helpContent = `
        <div class="help-content">
            <h2>🔗 Conduit Help & Documentation</h2>
            
            <h3>Getting Started</h3>
            <ol>
                <li><strong>Set up your profile:</strong> Go to Settings and enter your name and school information.</li>
                <li><strong>Create an assessment:</strong> Navigate to the Assess tab to evaluate student work.</li>
                <li><strong>View progress:</strong> Check the Progress tab to see student growth over time.</li>
                <li><strong>Generate reports:</strong> Use the Reports tab to create detailed progress reports.</li>
            </ol>
            
            <h3>Key Features</h3>
            <ul>
                <li><strong>AI-Powered Analysis:</strong> Automatically connects student work to competency standards.</li>
                <li><strong>Progress Tracking:</strong> Monitor student growth across multiple assessments.</li>
                <li><strong>Competency Framework:</strong> Explore and customize learning standards by subject.</li>
                <li><strong>Offline Support:</strong> Works without internet connection; data syncs when online.</li>
            </ul>
            
            <h3>Assessment Methods</h3>
            <ul>
                <li><strong>Text Entry:</strong> Type or paste student work directly.</li>
                <li><strong>File Upload:</strong> Upload documents, PDFs, or images of student work.</li>
                <li><strong>Photo Capture:</strong> Take photos of physical work using your device camera.</li>
            </ul>
            
            <h3>Tips</h3>
            <ul>
                <li>Regular assessments help track progress more accurately.</li>
                <li>Use detailed descriptions for better AI analysis.</li>
                <li>Export data regularly for backup purposes.</li>
                <li>Check the Framework tab to understand competency standards.</li>
            </ul>
            
            <h3>Privacy & Data</h3>
            <p>All data is stored locally on your device. No student information is sent to external servers. 
            You have full control over your data and can export or delete it at any time.</p>
            
            <h3>Support</h3>
            <p>For additional help or to report issues, please refer to the documentation on GitHub.</p>
        </div>
    `;
    
    showModal('Help & Documentation', helpContent);
}

// Check for updates
function checkUpdates() {
    window.conduitApp.showNotification('Checking for updates...', 'info');
    
    // Simulate update check
    setTimeout(() => {
        window.conduitApp.showNotification('You are using the latest version (2.0.0)', 'success');
    }, 1500);
}

// Show about information
function showAbout() {
    const aboutContent = `
        <div class="about-content">
            <div style="text-align: center; margin-bottom: 2rem;">
                <div style="font-size: 4rem;">🔗</div>
                <h2>Conduit Student Competency Assessment</h2>
                <p style="font-style: italic;">Connecting Learning Through AI-Powered Assessment</p>
            </div>
            
            <div class="about-section">
                <h3>Version 2.0.0</h3>
                <p>Released: ${new Date().toLocaleDateString()}</p>
            </div>
            
            <div class="about-section">
                <h3>About Conduit</h3>
                <p>Conduit is an innovative assessment tool designed to help educators connect student work 
                to learning competencies through AI-powered analysis. Our mission is to make competency-based 
                assessment accessible, efficient, and insightful.</p>
            </div>
            
            <div class="about-section">
                <h3>Key Benefits</h3>
                <ul>
                    <li>Save time with automated competency mapping</li>
                    <li>Track student progress over time</li>
                    <li>Generate comprehensive reports</li>
                    <li>Work offline with full functionality</li>
                    <li>Maintain complete data privacy</li>
                </ul>
            </div>
            
            <div class="about-section">
                <h3>Technology</h3>
                <p>Built with modern web technologies for reliability and performance:</p>
                <ul>
                    <li>Progressive Web App (PWA) for offline functionality</li>
                    <li>Local storage for data privacy</li>
                    <li>Responsive design for all devices</li>
                    <li>AI simulation for competency analysis</li>
                </ul>
            </div>
            
            <div class="about-section">
                <h3>Credits</h3>
                <p>Developed with ❤️ for educators everywhere.</p>
                <p>Icons provided by emoji unicode standards.</p>
            </div>
            
            <div class="about-section" style="text-align: center; margin-top: 2rem;">
                <p style="color: var(--text-tertiary);">
                    © 2024 Conduit Student Competency Assessment<br>
                    Educational Technology Solutions
                </p>
            </div>
        </div>
    `;
    
    showModal('About Conduit', aboutContent);
}

// Show modal helper
function showModal(title, content) {
    const modalContainer = document.getElementById('modal-container');
    modalContainer.innerHTML = `
        <div class="modal">
            <div class="modal-header">
                <h3>${title}</h3>
                <button class="modal-close" onclick="closeModal()">✕</button>
            </div>
            <div class="modal-body">
                ${content}
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" onclick="closeModal()">Close</button>
            </div>
        </div>
    `;
    modalContainer.classList.add('active');
}

// Close modal
function closeModal() {
    const modalContainer = document.getElementById('modal-container');
    modalContainer.classList.remove('active');
    modalContainer.innerHTML = '';
}

// Initialize settings
document.addEventListener('DOMContentLoaded', function() {
    // Set up auto-save listener
    const autoSaveToggle = document.getElementById('auto-save');
    if (autoSaveToggle) {
        autoSaveToggle.addEventListener('change', function(e) {
            const data = window.conduitApp.getConduitData();
            data.settings.autoSave = e.target.checked;
            window.conduitApp.saveConduitData(data);
            window.conduitApp.showNotification(
                e.target.checked ? 'Auto-save enabled' : 'Auto-save disabled', 
                'success'
            );
        });
    }
    
    // Set up notifications toggle
    const notificationsToggle = document.getElementById('notifications');
    if (notificationsToggle) {
        notificationsToggle.addEventListener('change', function(e) {
            const data = window.conduitApp.getConduitData();
            data.settings.notifications = e.target.checked;
            window.conduitApp.saveConduitData(data);
            
            if (e.target.checked) {
                window.conduitApp.showNotification('Notifications enabled', 'success');
            }
        });
    }
    
    // Add CSS for modals
    const style = document.createElement('style');
    style.textContent = `
        .help-content h3,
        .about-content h3 {
            color: var(--primary-color);
            margin-top: 1.5rem;
            margin-bottom: 0.5rem;
        }
        
        .help-content ol,
        .help-content ul,
        .about-content ul {
            margin-left: 1.5rem;
            line-height: 1.8;
        }
        
        .about-section {
            margin-bottom: 1.5rem;
        }
        
        .modal-body {
            max-height: 70vh;
            overflow-y: auto;
        }
        
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1rem;
            padding-bottom: 1rem;
            border-bottom: 1px solid var(--border-color);
        }
        
        .modal-close {
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: var(--text-tertiary);
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: var(--transition);
        }
        
        .modal-close:hover {
            background: var(--bg-tertiary);
            color: var(--text-primary);
        }
        
        .modal-footer {
            margin-top: 2rem;
            padding-top: 1rem;
            border-top: 1px solid var(--border-color);
            display: flex;
            justify-content: flex-end;
            gap: 1rem;
        }
    `;
    document.head.appendChild(style);
});