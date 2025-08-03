// Conduit Student Competency Assessment - Reports Module
// Generates reports and handles data export

// Initialize reports section
document.addEventListener('DOMContentLoaded', function() {
    // Update report dropdowns when section becomes active
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.target.id === 'reports-section' && 
                mutation.target.classList.contains('active')) {
                updateReportOptions();
            }
        });
    });
    
    const reportsSection = document.getElementById('reports-section');
    if (reportsSection) {
        observer.observe(reportsSection, { 
            attributes: true, 
            attributeFilter: ['class'] 
        });
    }
});

// Update report options based on available data
function updateReportOptions() {
    const data = window.conduitApp.getConduitData();
    
    if (!data || !data.students || data.students.length === 0) {
        showEmptyReports();
        return;
    }
    
    // Update student dropdown
    const studentSelect = document.getElementById('report-student');
    studentSelect.innerHTML = '<option value="">Choose a student...</option>';
    
    data.students.forEach(student => {
        const option = document.createElement('option');
        option.value = student;
        option.textContent = student;
        studentSelect.appendChild(option);
    });
    
    // Update analytics if data exists
    if (data.assessments && data.assessments.length > 0) {
        updateAnalyticsDashboard(data.assessments);
    }
}

// Show empty reports state
function showEmptyReports() {
    const analyticsContainer = document.getElementById('analytics-dashboard');
    analyticsContainer.innerHTML = `
        <div style="text-align: center; padding: 2rem; color: #6b7280;">
            <div style="font-size: 3rem; margin-bottom: 1rem;">📊</div>
            <p>Complete assessments to generate reports and view analytics.</p>
            <button class="btn btn-primary" onclick="window.conduitApp.showSection('assess')">
                Start Assessment
            </button>
        </div>
    `;
}

// Generate individual student report
function generateIndividualReport() {
    const studentName = document.getElementById('report-student').value;
    
    if (!studentName) {
        window.conduitApp.showNotification('Please select a student', 'error');
        return;
    }
    
    const data = window.conduitApp.getConduitData();
    const studentAssessments = data.assessments.filter(a => a.studentName === studentName);
    
    if (studentAssessments.length === 0) {
        window.conduitApp.showNotification('No assessments found for this student', 'error');
        return;
    }
    
    // Create report content
    const reportContent = createIndividualReport(studentName, studentAssessments);
    
    // Show preview and download options
    showReportPreview(reportContent, `${studentName} - Progress Report`);
    
    window.conduitApp.showNotification('Report generated successfully!', 'success');
}

// Create individual report content
function createIndividualReport(studentName, assessments) {
    const latestAssessment = assessments[assessments.length - 1];
    const averageScore = Math.round(
        assessments.reduce((sum, a) => sum + (a.results.overallScore || 0), 0) / assessments.length
    );
    
    const reportDate = new Date().toLocaleDateString();
    const profile = window.conduitApp.getConduitData().profile;
    
    return `
        <div class="report-container">
            <div class="report-header">
                <h1>🔗 Conduit Student Progress Report</h1>
                <div class="report-meta">
                    <p><strong>Student:</strong> ${studentName}</p>
                    <p><strong>Teacher:</strong> ${profile.name || 'Not specified'}</p>
                    <p><strong>School:</strong> ${profile.school || 'Not specified'}</p>
                    <p><strong>Report Date:</strong> ${reportDate}</p>
                </div>
            </div>
            
            <div class="report-section">
                <h2>📊 Overall Performance Summary</h2>
                <div class="performance-summary">
                    <div class="metric">
                        <span class="metric-value">${averageScore}%</span>
                        <span class="metric-label">Average Score</span>
                    </div>
                    <div class="metric">
                        <span class="metric-value">${assessments.length}</span>
                        <span class="metric-label">Total Assessments</span>
                    </div>
                    <div class="metric">
                        <span class="metric-value">${getMasteryLevel(averageScore)}</span>
                        <span class="metric-label">Mastery Level</span>
                    </div>
                </div>
            </div>
            
            <div class="report-section">
                <h2>📈 Progress Over Time</h2>
                <div class="progress-chart-container">
                    ${generateProgressChart(assessments)}
                </div>
            </div>
            
            <div class="report-section">
                <h2>🎯 Competency Analysis</h2>
                ${generateCompetencyAnalysis(assessments)}
            </div>
            
            <div class="report-section">
                <h2>💪 Strengths & Growth Areas</h2>
                <div class="strengths-growth">
                    <div class="strengths">
                        <h3>Strengths</h3>
                        <ul>
                            ${getUniqueStrengths(assessments).map(s => `<li>${s}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="growth">
                        <h3>Areas for Growth</h3>
                        <ul>
                            ${getUniqueGrowthAreas(assessments).map(a => `<li>${a}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            </div>
            
            <div class="report-section">
                <h2>💡 Recommendations</h2>
                <div class="recommendations">
                    ${generateRecommendations(assessments)}
                </div>
            </div>
            
            <div class="report-footer">
                <p>This report was generated by Conduit Student Competency Assessment</p>
                <p>Connecting Learning Through AI-Powered Assessment</p>
            </div>
        </div>
    `;
}

// Generate class overview report
function generateClassReport() {
    const data = window.conduitApp.getConduitData();
    
    if (!data.assessments || data.assessments.length === 0) {
        window.conduitApp.showNotification('No assessment data available', 'error');
        return;
    }
    
    const includeProgress = document.getElementById('ca-includeProgress').checked;
    const includeCompetencies = document.getElementById('ca-includeCompetencies').checked;
    const includeRecommendations = document.getElementById('ca-includeRecommendations').checked;
    
    const reportContent = createClassReport(data, {
        includeProgress,
        includeCompetencies,
        includeRecommendations
    });
    
    showReportPreview(reportContent, 'Class Overview Report');
    window.conduitApp.showNotification('Class report generated!', 'success');
}

// Create class report content
function createClassReport(data, options) {
    const reportDate = new Date().toLocaleDateString();
    const profile = data.profile;
    
    // Calculate class statistics
    const classStats = calculateClassStats(data.assessments);
    
    let reportContent = `
        <div class="report-container">
            <div class="report-header">
                <h1>📚 Class Overview Report</h1>
                <div class="report-meta">
                    <p><strong>Teacher:</strong> ${profile.name || 'Not specified'}</p>
                    <p><strong>School:</strong> ${profile.school || 'Not specified'}</p>
                    <p><strong>Report Date:</strong> ${reportDate}</p>
                    <p><strong>Total Students:</strong> ${data.students.length}</p>
                </div>
            </div>
    `;
    
    if (options.includeProgress) {
        reportContent += `
            <div class="report-section">
                <h2>📊 Class Progress Summary</h2>
                <div class="class-summary">
                    <div class="metric">
                        <span class="metric-value">${classStats.averageScore}%</span>
                        <span class="metric-label">Class Average</span>
                    </div>
                    <div class="metric">
                        <span class="metric-value">${classStats.totalAssessments}</span>
                        <span class="metric-label">Total Assessments</span>
                    </div>
                    <div class="metric">
                        <span class="metric-value">${classStats.masteryRate}%</span>
                        <span class="metric-label">Mastery Rate</span>
                    </div>
                </div>
                
                <h3>Student Performance Distribution</h3>
                <div class="distribution">
                    ${generateDistributionChart(classStats.distribution)}
                </div>
            </div>
        `;
    }
    
    if (options.includeCompetencies) {
        reportContent += `
            <div class="report-section">
                <h2>🎯 Competency Breakdown</h2>
                ${generateClassCompetencyAnalysis(data.assessments)}
            </div>
        `;
    }
    
    if (options.includeRecommendations) {
        reportContent += `
            <div class="report-section">
                <h2>💡 Class-Wide Recommendations</h2>
                <ul>
                    <li>Focus on areas where less than 70% of students show mastery</li>
                    <li>Provide enrichment for students exceeding expectations</li>
                    <li>Consider differentiated instruction for varied skill levels</li>
                    <li>Regular formative assessments to track progress</li>
                </ul>
            </div>
        `;
    }
    
    reportContent += `
            <div class="report-footer">
                <p>Generated by Conduit Student Competency Assessment</p>
            </div>
        </div>
    `;
    
    return reportContent;
}

// Export student data
function exportStudentData() {
    const studentName = document.getElementById('report-student').value;
    
    if (!studentName) {
        window.conduitApp.showNotification('Please select a student', 'error');
        return;
    }
    
    const data = window.conduitApp.getConduitData();
    const studentData = {
        student: studentName,
        assessments: data.assessments.filter(a => a.studentName === studentName),
        exportDate: new Date().toISOString()
    };
    
    downloadJSON(studentData, `${studentName}-assessment-data.json`);
    window.conduitApp.showNotification('Student data exported!', 'success');
}

// Export all data
function exportAllData() {
    const data = window.conduitApp.getConduitData();
    
    if (!data.assessments || data.assessments.length === 0) {
        window.conduitApp.showNotification('No data to export', 'error');
        return;
    }
    
    const exportData = {
        ...data,
        exportDate: new Date().toISOString(),
        version: '2.0.0'
    };
    
    downloadJSON(exportData, `conduit-all-data-${new Date().toISOString().split('T')[0]}.json`);
    window.conduitApp.showNotification('All data exported successfully!', 'success');
}

// Update analytics dashboard
function updateAnalyticsDashboard(assessments) {
    const analyticsContainer = document.getElementById('analytics-dashboard');
    
    // Group assessments by subject
    const subjectData = {};
    assessments.forEach(a => {
        if (!subjectData[a.subject]) {
            subjectData[a.subject] = {
                count: 0,
                totalScore: 0,
                students: new Set()
            };
        }
        subjectData[a.subject].count++;
        subjectData[a.subject].totalScore += a.results.overallScore || 0;
        subjectData[a.subject].students.add(a.studentName);
    });
    
    // Create analytics display
    let analyticsHTML = '<div class="analytics-grid">';
    
    Object.entries(subjectData).forEach(([subject, data]) => {
        const avgScore = Math.round(data.totalScore / data.count);
        analyticsHTML += `
            <div class="analytics-card">
                <h4>${getSubjectIcon(subject)} ${subject.charAt(0).toUpperCase() + subject.slice(1)}</h4>
                <div class="analytics-stats">
                    <div class="stat">
                        <span class="stat-value">${avgScore}%</span>
                        <span class="stat-label">Avg Score</span>
                    </div>
                    <div class="stat">
                        <span class="stat-value">${data.count}</span>
                        <span class="stat-label">Assessments</span>
                    </div>
                    <div class="stat">
                        <span class="stat-value">${data.students.size}</span>
                        <span class="stat-label">Students</span>
                    </div>
                </div>
            </div>
        `;
    });
    
    analyticsHTML += '</div>';
    analyticsContainer.innerHTML = analyticsHTML;
}

// Helper functions
function getMasteryLevel(score) {
    if (score >= 90) return 'Advanced';
    if (score >= 80) return 'Proficient';
    if (score >= 70) return 'Developing';
    return 'Beginning';
}

function generateProgressChart(assessments) {
    const scores = assessments.map(a => a.results.overallScore || 0);
    const dates = assessments.map(a => new Date(a.date).toLocaleDateString());
    
    // Simple SVG chart
    const chartWidth = 400;
    const chartHeight = 200;
    const padding = 20;
    
    const points = scores.map((score, index) => {
        const x = (index / (scores.length - 1)) * (chartWidth - 2 * padding) + padding;
        const y = chartHeight - (score / 100) * (chartHeight - 2 * padding) - padding;
        return `${x},${y}`;
    }).join(' ');
    
    return `
        <svg width="${chartWidth}" height="${chartHeight}" class="progress-chart">
            <polyline points="${points}" fill="none" stroke="#5D5CDE" stroke-width="2"/>
            ${scores.map((score, index) => {
                const x = (index / (scores.length - 1)) * (chartWidth - 2 * padding) + padding;
                const y = chartHeight - (score / 100) * (chartHeight - 2 * padding) - padding;
                return `
                    <circle cx="${x}" cy="${y}" r="4" fill="#5D5CDE"/>
                    <text x="${x}" y="${y - 10}" text-anchor="middle" font-size="12">${score}%</text>
                `;
            }).join('')}
        </svg>
    `;
}

function generateCompetencyAnalysis(assessments) {
    // Aggregate competency data
    const competencyMap = {};
    
    assessments.forEach(assessment => {
        if (assessment.results.competencyLevels) {
            assessment.results.competencyLevels.forEach(comp => {
                if (!competencyMap[comp.name]) {
                    competencyMap[comp.name] = [];
                }
                competencyMap[comp.name].push(comp.level);
            });
        }
    });
    
    let html = '<div class="competency-grid">';
    
    Object.entries(competencyMap).forEach(([competency, levels]) => {
        const avgLevel = (levels.reduce((a, b) => a + b, 0) / levels.length).toFixed(1);
        html += `
            <div class="competency-card">
                <h4>${competency}</h4>
                <div class="level-indicator">
                    <span class="level-value">Level ${avgLevel}/4</span>
                    <div class="level-bar">
                        <div class="level-fill" style="width: ${(avgLevel/4)*100}%"></div>
                    </div>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    return html;
}

function getUniqueStrengths(assessments) {
    const allStrengths = [];
    assessments.forEach(a => {
        if (a.results.strengths) {
            allStrengths.push(...a.results.strengths);
        }
    });
    return [...new Set(allStrengths)].slice(0, 5);
}

function getUniqueGrowthAreas(assessments) {
    const allAreas = [];
    assessments.forEach(a => {
        if (a.results.areasForGrowth) {
            allAreas.push(...a.results.areasForGrowth);
        }
    });
    return [...new Set(allAreas)].slice(0, 5);
}

function generateRecommendations(assessments) {
    const latestAssessment = assessments[assessments.length - 1];
    if (latestAssessment.results.recommendations) {
        return `<ul>${latestAssessment.results.recommendations.map(r => `<li>${r}</li>`).join('')}</ul>`;
    }
    return '<p>Continue regular practice and assessment.</p>';
}

function calculateClassStats(assessments) {
    const scores = assessments.map(a => a.results.overallScore || 0);
    const averageScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    const masteryCount = scores.filter(s => s >= 80).length;
    
    // Calculate distribution
    const distribution = {
        advanced: scores.filter(s => s >= 90).length,
        proficient: scores.filter(s => s >= 80 && s < 90).length,
        developing: scores.filter(s => s >= 70 && s < 80).length,
        beginning: scores.filter(s => s < 70).length
    };
    
    return {
        averageScore,
        totalAssessments: assessments.length,
        masteryRate: Math.round((masteryCount / scores.length) * 100),
        distribution
    };
}

function generateDistributionChart(distribution) {
    const total = Object.values(distribution).reduce((a, b) => a + b, 0);
    
    return `
        <div class="distribution-bars">
            <div class="bar-item">
                <div class="bar" style="height: ${(distribution.advanced/total)*100}%"></div>
                <span>Advanced (${distribution.advanced})</span>
            </div>
            <div class="bar-item">
                <div class="bar" style="height: ${(distribution.proficient/total)*100}%"></div>
                <span>Proficient (${distribution.proficient})</span>
            </div>
            <div class="bar-item">
                <div class="bar" style="height: ${(distribution.developing/total)*100}%"></div>
                <span>Developing (${distribution.developing})</span>
            </div>
            <div class="bar-item">
                <div class="bar" style="height: ${(distribution.beginning/total)*100}%"></div>
                <span>Beginning (${distribution.beginning})</span>
            </div>
        </div>
    `;
}

function generateClassCompetencyAnalysis(assessments) {
    // This would aggregate competency data across all students
    return '<p>Competency analysis across all students shows varied proficiency levels.</p>';
}

// Show report preview
function showReportPreview(content, title) {
    const modal = document.createElement('div');
    modal.className = 'modal-container active';
    modal.innerHTML = `
        <div class="modal report-preview">
            <div class="modal-header">
                <h3>${title}</h3>
                <button class="modal-close" onclick="this.closest('.modal-container').remove()">✕</button>
            </div>
            <div class="modal-body">
                ${content}
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" onclick="printReport()">🖨️ Print</button>
                <button class="btn btn-success" onclick="downloadReportPDF('${title}')">📄 Download PDF</button>
                <button class="btn btn-secondary" onclick="this.closest('.modal-container').remove()">Close</button>
            </div>
        </div>
    `;
    
    document.getElementById('modal-container').appendChild(modal);
}

// Print report
function printReport() {
    window.print();
}

// Download report as PDF (simulated)
function downloadReportPDF(title) {
    window.conduitApp.showNotification('PDF generation feature coming soon!', 'info');
    // In a real app, this would use a PDF library
}

// Download JSON data
function downloadJSON(data, filename) {
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

// Get subject icon helper
function getSubjectIcon(subject) {
    const icons = {
        math: '📐',
        ela: '📚',
        science: '🔬',
        'social-studies': '🌍'
    };
    return icons[subject] || '📝';
}