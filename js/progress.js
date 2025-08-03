// Conduit Student Competency Assessment - Progress Module
// Tracks and visualizes student learning progress

// Filter progress data
function filterProgress() {
    const studentFilter = document.getElementById('student-filter').value;
    const subjectFilter = document.getElementById('subject-filter').value;
    const dateRange = document.getElementById('date-range').value;
    
    loadProgressData(studentFilter, subjectFilter, dateRange);
}

// Load progress data based on filters
function loadProgressData(student = '', subject = '', dateRange = '') {
    const data = window.conduitApp.getConduitData();
    
    if (!data || !data.assessments || data.assessments.length === 0) {
        showEmptyProgress();
        return;
    }
    
    // Filter assessments
    let filteredAssessments = [...data.assessments];
    
    if (student) {
        filteredAssessments = filteredAssessments.filter(a => a.studentName === student);
    }
    
    if (subject) {
        filteredAssessments = filteredAssessments.filter(a => a.subject === subject);
    }
    
    if (dateRange) {
        const now = new Date();
        const ranges = {
            week: 7,
            month: 30,
            quarter: 90
        };
        const daysAgo = ranges[dateRange];
        const cutoffDate = new Date(now.setDate(now.getDate() - daysAgo));
        
        filteredAssessments = filteredAssessments.filter(a => 
            new Date(a.date) >= cutoffDate
        );
    }
    
    // Display progress data
    displayProgressSummary(filteredAssessments);
    displayProgressTimeline(filteredAssessments);
    
    // Update student filter options
    updateStudentFilter(data.students);
}

// Show empty progress state
function showEmptyProgress() {
    const summaryContainer = document.getElementById('progress-summary');
    summaryContainer.innerHTML = `
        <div class="card" style="text-align: center; padding: 3rem;">
            <div style="font-size: 4rem; margin-bottom: 1rem;">📊</div>
            <h3 style="color: #6b7280; margin-bottom: 1rem;">No Assessment Data Yet</h3>
            <p style="color: #9ca3af; margin-bottom: 2rem;">
                Complete student assessments to see progress connections and analytics here.
            </p>
            <button class="btn btn-primary" onclick="window.conduitApp.showSection('assess')">
                📝 Start First Assessment
            </button>
        </div>
    `;
    
    document.getElementById('progress-timeline').innerHTML = '';
}

// Display progress summary cards
function displayProgressSummary(assessments) {
    if (assessments.length === 0) {
        showEmptyProgress();
        return;
    }
    
    const summaryContainer = document.getElementById('progress-summary');
    
    // Calculate summary statistics
    const stats = calculateProgressStats(assessments);
    
    summaryContainer.innerHTML = `
        <div class="summary-cards">
            <div class="card stat-card">
                <div class="stat-icon">📈</div>
                <div class="stat-content">
                    <h3>${stats.averageScore}%</h3>
                    <p>Average Score</p>
                    <span class="stat-trend ${stats.trend > 0 ? 'positive' : 'negative'}">
                        ${stats.trend > 0 ? '↑' : '↓'} ${Math.abs(stats.trend)}%
                    </span>
                </div>
            </div>
            
            <div class="card stat-card">
                <div class="stat-icon">📊</div>
                <div class="stat-content">
                    <h3>${assessments.length}</h3>
                    <p>Total Assessments</p>
                    <span class="stat-detail">${stats.uniqueStudents} students</span>
                </div>
            </div>
            
            <div class="card stat-card">
                <div class="stat-icon">🎯</div>
                <div class="stat-content">
                    <h3>${stats.masteryRate}%</h3>
                    <p>Mastery Rate</p>
                    <span class="stat-detail">≥80% scores</span>
                </div>
            </div>
            
            <div class="card stat-card">
                <div class="stat-icon">⭐</div>
                <div class="stat-content">
                    <h3>${stats.topCompetency}</h3>
                    <p>Strongest Area</p>
                    <span class="stat-detail">${stats.topSubject}</span>
                </div>
            </div>
        </div>
    `;
}

// Calculate progress statistics
function calculateProgressStats(assessments) {
    const scores = assessments.map(a => a.results.overallScore || 0);
    const averageScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    
    // Calculate trend (comparing recent vs older)
    let trend = 0;
    if (assessments.length >= 2) {
        const recent = assessments.slice(-Math.ceil(assessments.length / 2));
        const older = assessments.slice(0, Math.floor(assessments.length / 2));
        
        const recentAvg = recent.reduce((sum, a) => sum + (a.results.overallScore || 0), 0) / recent.length;
        const olderAvg = older.reduce((sum, a) => sum + (a.results.overallScore || 0), 0) / older.length;
        
        trend = Math.round(recentAvg - olderAvg);
    }
    
    // Calculate mastery rate
    const masteryCount = scores.filter(s => s >= 80).length;
    const masteryRate = Math.round((masteryCount / scores.length) * 100);
    
    // Find unique students
    const uniqueStudents = [...new Set(assessments.map(a => a.studentName))].length;
    
    // Find top competency and subject
    const subjectCounts = {};
    assessments.forEach(a => {
        subjectCounts[a.subject] = (subjectCounts[a.subject] || 0) + 1;
    });
    const topSubject = Object.keys(subjectCounts).reduce((a, b) => 
        subjectCounts[a] > subjectCounts[b] ? a : b
    );
    
    return {
        averageScore,
        trend,
        masteryRate,
        uniqueStudents,
        topCompetency: 'Problem Solving',
        topSubject: topSubject.charAt(0).toUpperCase() + topSubject.slice(1)
    };
}

// Display progress timeline
function displayProgressTimeline(assessments) {
    const timelineContainer = document.getElementById('progress-timeline');
    
    if (assessments.length === 0) {
        timelineContainer.innerHTML = '';
        return;
    }
    
    // Sort assessments by date
    const sortedAssessments = [...assessments].sort((a, b) => 
        new Date(b.date) - new Date(a.date)
    );
    
    // Group by student
    const studentGroups = {};
    sortedAssessments.forEach(assessment => {
        if (!studentGroups[assessment.studentName]) {
            studentGroups[assessment.studentName] = [];
        }
        studentGroups[assessment.studentName].push(assessment);
    });
    
    let html = '<div class="timeline-container">';
    
    Object.entries(studentGroups).forEach(([student, studentAssessments]) => {
        html += `
            <div class="card student-progress-card">
                <div class="student-header">
                    <h4>👤 ${student}</h4>
                    <span class="assessment-count">${studentAssessments.length} assessments</span>
                </div>
                
                <div class="progress-chart">
                    ${generateMiniChart(studentAssessments)}
                </div>
                
                <div class="recent-assessments">
                    ${studentAssessments.slice(0, 3).map(assessment => `
                        <div class="assessment-item">
                            <div class="assessment-info">
                                <span class="subject-badge ${assessment.subject}">
                                    ${getSubjectIcon(assessment.subject)} ${assessment.subject}
                                </span>
                                <span class="assessment-date">
                                    ${new Date(assessment.date).toLocaleDateString()}
                                </span>
                            </div>
                            <div class="assessment-score">
                                <span class="score ${getScoreClass(assessment.results.overallScore)}">
                                    ${assessment.results.overallScore}%
                                </span>
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="progress-actions">
                    <button class="btn btn-sm btn-outline" onclick="viewStudentDetails('${student}')">
                        View Details
                    </button>
                    <button class="btn btn-sm btn-primary" onclick="compareProgress('${student}')">
                        Compare Progress
                    </button>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    timelineContainer.innerHTML = html;
}

// Generate mini progress chart
function generateMiniChart(assessments) {
    const scores = assessments.map(a => a.results.overallScore || 0);
    const maxScore = 100;
    const chartHeight = 60;
    
    const points = scores.map((score, index) => {
        const x = (index / (scores.length - 1)) * 100;
        const y = chartHeight - (score / maxScore) * chartHeight;
        return `${x},${y}`;
    }).join(' ');
    
    return `
        <svg class="mini-chart" viewBox="0 0 100 ${chartHeight}" preserveAspectRatio="none">
            <polyline 
                points="${points}" 
                fill="none" 
                stroke="#5D5CDE" 
                stroke-width="2"
            />
            ${scores.map((score, index) => {
                const x = (index / (scores.length - 1)) * 100;
                const y = chartHeight - (score / maxScore) * chartHeight;
                return `<circle cx="${x}" cy="${y}" r="3" fill="#5D5CDE" />`;
            }).join('')}
        </svg>
    `;
}

// Get subject icon
function getSubjectIcon(subject) {
    const icons = {
        math: '📐',
        ela: '📚',
        science: '🔬',
        'social-studies': '🌍'
    };
    return icons[subject] || '📝';
}

// Get score class for styling
function getScoreClass(score) {
    if (score >= 90) return 'excellent';
    if (score >= 80) return 'good';
    if (score >= 70) return 'fair';
    return 'needs-improvement';
}

// Update student filter dropdown
function updateStudentFilter(students) {
    const studentFilter = document.getElementById('student-filter');
    
    // Clear existing options except "All Students"
    studentFilter.innerHTML = '<option value="">All Students</option>';
    
    // Add student options
    students.forEach(student => {
        const option = document.createElement('option');
        option.value = student;
        option.textContent = student;
        studentFilter.appendChild(option);
    });
}

// View student details
function viewStudentDetails(studentName) {
    window.conduitApp.showNotification(`Loading details for ${studentName}...`, 'info');
    // In a real app, this would navigate to a detailed student view
}

// Compare student progress
function compareProgress(studentName) {
    window.conduitApp.showNotification('Progress comparison feature coming soon!', 'info');
    // In a real app, this would show a comparison view
}

// Initialize progress module
document.addEventListener('DOMContentLoaded', function() {
    // Load progress data when section becomes active
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.target.id === 'progress-section' && 
                mutation.target.classList.contains('active')) {
                loadProgressData();
            }
        });
    });
    
    const progressSection = document.getElementById('progress-section');
    if (progressSection) {
        observer.observe(progressSection, { 
            attributes: true, 
            attributeFilter: ['class'] 
        });
    }
});

// Add custom styles for progress visualization
const style = document.createElement('style');
style.textContent = `
    .stat-card {
        text-align: center;
        padding: 1.5rem;
    }
    
    .stat-icon {
        font-size: 2.5rem;
        margin-bottom: 0.5rem;
    }
    
    .stat-content h3 {
        font-size: 2rem;
        color: var(--primary-color);
        margin-bottom: 0.25rem;
    }
    
    .stat-trend.positive {
        color: var(--success-color);
    }
    
    .stat-trend.negative {
        color: var(--danger-color);
    }
    
    .student-progress-card {
        margin-bottom: 1.5rem;
    }
    
    .student-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
    }
    
    .mini-chart {
        width: 100%;
        height: 60px;
        margin-bottom: 1rem;
    }
    
    .assessment-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.5rem 0;
        border-bottom: 1px solid var(--border-color);
    }
    
    .subject-badge {
        display: inline-block;
        padding: 0.25rem 0.5rem;
        border-radius: var(--radius);
        font-size: 0.875rem;
        background: var(--bg-tertiary);
    }
    
    .score {
        font-weight: 600;
        font-size: 1.25rem;
    }
    
    .score.excellent { color: var(--success-color); }
    .score.good { color: var(--info-color); }
    .score.fair { color: var(--warning-color); }
    .score.needs-improvement { color: var(--danger-color); }
    
    .progress-actions {
        display: flex;
        gap: 0.5rem;
        margin-top: 1rem;
    }
`;
document.head.appendChild(style);