// Conduit Student Competency Assessment - Assessment Module
// Handles AI analysis and competency mapping

// Main analysis function
async function analyzeWork() {
    // Validate form
    if (!validateAssessmentForm()) {
        return;
    }
    
    // Get form data
    const formData = collectFormData();
    
    // Show progress
    showAnalysisProgress();
    
    // Simulate AI analysis (in real app, this would call an API)
    simulateAnalysis(formData);
}

// Quick assessment function
function quickAssess() {
    if (!validateAssessmentForm()) {
        return;
    }
    
    const formData = collectFormData();
    showAnalysisProgress();
    
    // Simulate quick analysis
    setTimeout(() => {
        generateQuickResults(formData);
    }, 2000);
}

// Validate assessment form
function validateAssessmentForm() {
    const studentName = document.getElementById('student-name').value.trim();
    const subject = document.getElementById('subject-select').value;
    
    // Check student name
    if (!studentName) {
        document.getElementById('student-name-error').textContent = 'Student name is required';
        window.conduitApp.showNotification('Please enter the student name', 'error');
        return false;
    } else {
        document.getElementById('student-name-error').textContent = '';
    }
    
    // Check subject
    if (!subject) {
        window.conduitApp.showNotification('Please select a subject', 'error');
        return false;
    }
    
    // Check work content based on upload method
    const uploadMethod = document.querySelector('input[name="uploadMethod"]:checked').value;
    
    if (uploadMethod === 'text') {
        const workContent = document.getElementById('work-content').value.trim();
        if (!workContent) {
            window.conduitApp.showNotification('Please enter the student work content', 'error');
            return false;
        }
    } else if (uploadMethod === 'file') {
        const fileList = document.getElementById('file-list');
        if (fileList.classList.contains('hidden') || fileList.children.length === 0) {
            window.conduitApp.showNotification('Please upload at least one file', 'error');
            return false;
        }
    } else if (uploadMethod === 'photo') {
        const photos = document.getElementById('captured-photos');
        if (photos.children.length === 0) {
            window.conduitApp.showNotification('Please capture at least one photo', 'error');
            return false;
        }
    }
    
    return true;
}

// Collect form data
function collectFormData() {
    return {
        studentName: document.getElementById('student-name').value.trim(),
        subject: document.getElementById('subject-select').value,
        gradeLevel: document.getElementById('grade-level').value,
        assessmentDate: document.getElementById('assessment-date').value,
        workDescription: document.getElementById('work-description').value,
        workContent: document.getElementById('work-content').value,
        uploadMethod: document.querySelector('input[name="uploadMethod"]:checked').value,
        detailedAnalysis: document.getElementById('detailed-analysis').checked,
        includeSuggestions: document.getElementById('include-suggestions').checked,
        comparePeers: document.getElementById('compare-peers').checked
    };
}

// Show analysis progress
function showAnalysisProgress() {
    document.getElementById('analysis-progress').classList.remove('hidden');
    document.getElementById('analysis-results').classList.add('hidden');
    
    // Reset progress
    document.getElementById('progress-fill').style.width = '0%';
    document.querySelectorAll('.step').forEach(step => step.classList.remove('active'));
    
    // Start progress animation
    animateProgress();
}

// Animate progress bar
function animateProgress() {
    const steps = [
        { width: 25, step: 'step-1', title: 'Processing student work...', desc: 'Extracting content and context' },
        { width: 50, step: 'step-2', title: 'Analyzing competencies...', desc: 'Identifying skill demonstrations' },
        { width: 75, step: 'step-3', title: 'Connecting to standards...', desc: 'Mapping to learning frameworks' },
        { width: 100, step: 'step-4', title: 'Generating insights...', desc: 'Creating personalized recommendations' }
    ];
    
    let currentStep = 0;
    
    const interval = setInterval(() => {
        if (currentStep < steps.length) {
            const step = steps[currentStep];
            document.getElementById('progress-fill').style.width = step.width + '%';
            document.getElementById(step.step).classList.add('active');
            document.getElementById('progress-title').textContent = step.title;
            document.getElementById('progress-description').textContent = step.desc;
            currentStep++;
        } else {
            clearInterval(interval);
        }
    }, 1500);
}

// Simulate AI analysis
function simulateAnalysis(formData) {
    setTimeout(() => {
        generateDetailedResults(formData);
    }, 6000);
}

// Generate detailed results
function generateDetailedResults(formData) {
    const results = {
        overallScore: Math.floor(Math.random() * 20) + 80,
        competencyLevels: generateCompetencyLevels(formData.subject),
        strengths: generateStrengths(formData.subject),
        areasForGrowth: generateAreasForGrowth(formData.subject),
        connections: generateConnections(formData.subject),
        recommendations: formData.includeSuggestions ? generateRecommendations(formData.subject) : null,
        peerComparison: formData.comparePeers ? generatePeerComparison() : null
    };
    
    displayResults(results, formData);
    
    // Save assessment
    if (document.getElementById('auto-save').checked) {
        saveAssessment(formData, results);
    }
}

// Generate quick results
function generateQuickResults(formData) {
    const results = {
        overallScore: Math.floor(Math.random() * 20) + 80,
        quickSummary: generateQuickSummary(formData.subject),
        nextSteps: generateNextSteps(formData.subject)
    };
    
    displayQuickResults(results, formData);
}

// Generate competency levels
function generateCompetencyLevels(subject) {
    const competencies = getSubjectCompetencies(subject);
    return competencies.map(comp => ({
        name: comp,
        level: Math.floor(Math.random() * 4) + 1,
        progress: Math.floor(Math.random() * 30) + 70
    }));
}

// Get subject-specific competencies
function getSubjectCompetencies(subject) {
    const competencyMap = {
        math: [
            'Number Sense & Operations',
            'Algebraic Thinking',
            'Geometry & Measurement',
            'Data Analysis & Probability',
            'Problem Solving & Reasoning'
        ],
        ela: [
            'Reading Comprehension',
            'Writing & Composition',
            'Speaking & Listening',
            'Language Conventions',
            'Research & Inquiry'
        ],
        science: [
            'Scientific Method & Inquiry',
            'Physical Sciences',
            'Life Sciences',
            'Earth & Space Sciences',
            'Engineering & Technology'
        ],
        'social-studies': [
            'Historical Thinking',
            'Geographic Reasoning',
            'Civic Understanding',
            'Economic Literacy',
            'Global Perspectives'
        ]
    };
    
    return competencyMap[subject] || ['General Competency 1', 'General Competency 2', 'General Competency 3'];
}

// Generate strengths
function generateStrengths(subject) {
    const strengthOptions = {
        math: [
            'Shows strong computational skills',
            'Demonstrates clear mathematical reasoning',
            'Applies concepts to solve problems effectively',
            'Uses multiple strategies to find solutions'
        ],
        ela: [
            'Writes with clarity and organization',
            'Shows strong vocabulary usage',
            'Demonstrates reading comprehension',
            'Engages effectively in discussions'
        ],
        science: [
            'Forms clear hypotheses',
            'Records observations systematically',
            'Makes connections between concepts',
            'Shows curiosity and asks questions'
        ],
        'social-studies': [
            'Analyzes historical events thoughtfully',
            'Makes connections between past and present',
            'Shows understanding of different perspectives',
            'Demonstrates geographic awareness'
        ]
    };
    
    const strengths = strengthOptions[subject] || ['Shows engagement', 'Demonstrates understanding'];
    return strengths.slice(0, Math.floor(Math.random() * 2) + 2);
}

// Generate areas for growth
function generateAreasForGrowth(subject) {
    const growthOptions = {
        math: [
            'Could show more work in problem-solving',
            'Needs practice with word problems',
            'Should review multiplication facts',
            'Would benefit from checking answers'
        ],
        ela: [
            'Could expand vocabulary usage',
            'Needs to support ideas with evidence',
            'Should practice editing for grammar',
            'Would benefit from reading more complex texts'
        ],
        science: [
            'Could include more detailed observations',
            'Needs to explain reasoning more clearly',
            'Should use scientific vocabulary',
            'Would benefit from drawing diagrams'
        ],
        'social-studies': [
            'Could provide more historical context',
            'Needs to cite sources',
            'Should consider multiple perspectives',
            'Would benefit from using maps and timelines'
        ]
    };
    
    const areas = growthOptions[subject] || ['Continue practicing', 'Seek additional challenges'];
    return areas.slice(0, Math.floor(Math.random() * 2) + 1);
}

// Generate learning connections
function generateConnections(subject) {
    return [
        {
            standard: `${subject.toUpperCase()}.${Math.floor(Math.random() * 10) + 1}.${Math.floor(Math.random() * 5) + 1}`,
            description: 'Core standard connection identified',
            strength: Math.floor(Math.random() * 30) + 70
        },
        {
            standard: `${subject.toUpperCase()}.${Math.floor(Math.random() * 10) + 1}.${Math.floor(Math.random() * 5) + 1}`,
            description: 'Supporting standard connection',
            strength: Math.floor(Math.random() * 30) + 60
        }
    ];
}

// Generate recommendations
function generateRecommendations(subject) {
    const recommendations = {
        math: [
            'Practice with Khan Academy Math exercises',
            'Use manipulatives for hands-on learning',
            'Try math journaling to explain thinking',
            'Play math games to reinforce concepts'
        ],
        ela: [
            'Read 20 minutes daily at appropriate level',
            'Keep a writing journal',
            'Practice vocabulary with word games',
            'Participate in book discussions'
        ],
        science: [
            'Conduct simple home experiments',
            'Keep a science observation journal',
            'Watch educational science videos',
            'Visit science museums or nature centers'
        ],
        'social-studies': [
            'Explore historical documentaries',
            'Create timeline projects',
            'Discuss current events at home',
            'Use interactive map applications'
        ]
    };
    
    return recommendations[subject] || ['Continue regular practice', 'Seek enrichment opportunities'];
}

// Generate peer comparison
function generatePeerComparison() {
    return {
        percentile: Math.floor(Math.random() * 30) + 65,
        gradeLevel: ['At grade level', 'Above grade level', 'Approaching grade level'][Math.floor(Math.random() * 3)],
        growth: Math.floor(Math.random() * 20) + 10
    };
}

// Generate quick summary
function generateQuickSummary(subject) {
    return `Student demonstrates solid understanding of ${subject} concepts with room for continued growth. Work shows engagement and effort.`;
}

// Generate next steps
function generateNextSteps(subject) {
    return [
        'Continue current learning path',
        'Focus on identified growth areas',
        'Seek additional practice opportunities'
    ];
}

// Display detailed results
function displayResults(results, formData) {
    document.getElementById('analysis-progress').classList.add('hidden');
    document.getElementById('analysis-results').classList.remove('hidden');
    
    const resultsContent = document.getElementById('results-content');
    
    let html = `
        <div class="results-summary">
            <h4>Assessment Summary for ${formData.studentName}</h4>
            <p>Subject: ${formData.subject.charAt(0).toUpperCase() + formData.subject.slice(1)}</p>
            <p>Date: ${new Date(formData.assessmentDate).toLocaleDateString()}</p>
            
            <div class="overall-score">
                <h2>${results.overallScore}%</h2>
                <p>Overall Competency Score</p>
            </div>
        </div>
        
        <div class="competency-breakdown">
            <h4>🎯 Competency Levels</h4>
            ${results.competencyLevels.map(comp => `
                <div class="competency-item">
                    <div class="competency-header">
                        <span>${comp.name}</span>
                        <span>Level ${comp.level}/4</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${comp.progress}%"></div>
                    </div>
                </div>
            `).join('')}
        </div>
        
        <div class="strengths-section">
            <h4>💪 Identified Strengths</h4>
            <ul>
                ${results.strengths.map(strength => `<li>${strength}</li>`).join('')}
            </ul>
        </div>
        
        <div class="growth-section">
            <h4>🌱 Areas for Growth</h4>
            <ul>
                ${results.areasForGrowth.map(area => `<li>${area}</li>`).join('')}
            </ul>
        </div>
        
        <div class="connections-section">
            <h4>🔗 Learning Standard Connections</h4>
            ${results.connections.map(conn => `
                <div class="connection-item">
                    <strong>${conn.standard}</strong>: ${conn.description} (${conn.strength}% alignment)
                </div>
            `).join('')}
        </div>
    `;
    
    if (results.recommendations) {
        html += `
            <div class="recommendations-section">
                <h4>💡 Recommendations</h4>
                <ul>
                    ${results.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                </ul>
            </div>
        `;
    }
    
    if (results.peerComparison) {
        html += `
            <div class="peer-comparison">
                <h4>📊 Grade Level Comparison</h4>
                <p>Performance: ${results.peerComparison.gradeLevel}</p>
                <p>Percentile: ${results.peerComparison.percentile}th</p>
                <p>Growth Rate: +${results.peerComparison.growth}% this term</p>
            </div>
        `;
    }
    
    resultsContent.innerHTML = html;
    
    window.conduitApp.showNotification('✅ Analysis complete! Results are ready.', 'success');
}

// Display quick results
function displayQuickResults(results, formData) {
    document.getElementById('analysis-progress').classList.add('hidden');
    document.getElementById('analysis-results').classList.remove('hidden');
    
    const resultsContent = document.getElementById('results-content');
    
    resultsContent.innerHTML = `
        <div class="quick-results">
            <h4>Quick Assessment for ${formData.studentName}</h4>
            <div class="overall-score">
                <h2>${results.overallScore}%</h2>
                <p>Quick Competency Score</p>
            </div>
            <p>${results.quickSummary}</p>
            <h4>Recommended Next Steps:</h4>
            <ul>
                ${results.nextSteps.map(step => `<li>${step}</li>`).join('')}
            </ul>
            <p class="note">For detailed analysis, use the full "Analyze with AI" option.</p>
        </div>
    `;
    
    window.conduitApp.showNotification('⚡ Quick assessment complete!', 'success');
}

// Save assessment
function saveAssessment(formData, results) {
    const data = window.conduitApp.getConduitData();
    
    const assessment = {
        id: Date.now().toString(),
        date: formData.assessmentDate,
        studentName: formData.studentName,
        subject: formData.subject,
        gradeLevel: formData.gradeLevel,
        results: results,
        timestamp: new Date().toISOString()
    };
    
    data.assessments.push(assessment);
    
    // Add student if new
    if (!data.students.includes(formData.studentName)) {
        data.students.push(formData.studentName);
    }
    
    window.conduitApp.saveConduitData(data);
    window.conduitApp.updateDataStats();
}

// Additional UI functions
function regenerateAnalysis() {
    const confirmRegen = confirm('Are you sure you want to regenerate the analysis?');
    if (confirmRegen) {
        analyzeWork();
    }
}

function viewDetailed() {
    // In a real app, this would open a detailed view
    window.conduitApp.showNotification('Detailed view coming soon!', 'info');
}

function saveProgress() {
    window.conduitApp.showNotification('Progress saved successfully!', 'success');
}

function generateReport() {
    window.conduitApp.showNotification('Generating PDF report...', 'info');
    // In a real app, this would generate a PDF
}

function shareResults() {
    window.conduitApp.showNotification('Share feature coming soon!', 'info');
}

function startNewAssessment() {
    if (confirm('Start a new assessment? Current data will be saved.')) {
        // Reset form
        document.getElementById('student-form').reset();
        document.getElementById('work-description').value = '';
        document.getElementById('work-content').value = '';
        document.getElementById('char-count').textContent = '0';
        
        // Clear files and photos
        document.getElementById('file-list').innerHTML = '';
        document.getElementById('file-list').classList.add('hidden');
        document.getElementById('captured-photos').innerHTML = '';
        
        // Hide results
        document.getElementById('analysis-results').classList.add('hidden');
        
        // Reset to text entry
        document.getElementById('method-text').checked = true;
        handleUploadMethodChange({ target: { value: 'text' } });
        
        window.conduitApp.showNotification('Ready for new assessment!', 'success');
    }
}

function saveTemplate() {
    const templateName = prompt('Enter a name for this assessment template:');
    if (templateName) {
        const data = window.conduitApp.getConduitData();
        const template = {
            name: templateName,
            subject: document.getElementById('subject-select').value,
            gradeLevel: document.getElementById('grade-level').value,
            description: document.getElementById('work-description').value,
            created: new Date().toISOString()
        };
        
        data.templates.push(template);
        window.conduitApp.saveConduitData(data);
        window.conduitApp.showNotification('Template saved successfully!', 'success');
    }
}