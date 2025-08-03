// Conduit Student Competency Assessment - Framework Module
// Manages competency frameworks and learning standards

// Show framework for selected subject
function showFramework(subject) {
    // Update tab selection
    document.querySelectorAll('.framework-tab').forEach(tab => {
        tab.classList.remove('active');
        if (tab.getAttribute('data-subject') === subject) {
            tab.classList.add('active');
        }
    });
    
    // Load framework content
    const frameworkContent = document.getElementById('framework-content');
    frameworkContent.innerHTML = generateFrameworkContent(subject);
    
    // Add event listeners to new elements
    setupFrameworkListeners();
}

// Generate framework content based on subject
function generateFrameworkContent(subject) {
    const frameworks = {
        math: {
            title: '📐 Mathematics Competency Framework',
            description: 'Connecting mathematical thinking and problem-solving skills',
            domains: [
                {
                    name: 'Number Sense & Operations',
                    icon: '🔢',
                    competencies: [
                        'Understand place value and number relationships',
                        'Perform operations with whole numbers, fractions, and decimals',
                        'Apply properties of operations',
                        'Estimate and assess reasonableness of results'
                    ]
                },
                {
                    name: 'Algebraic Thinking',
                    icon: '📊',
                    competencies: [
                        'Recognize and analyze patterns',
                        'Understand and use variables',
                        'Solve equations and inequalities',
                        'Model real-world situations algebraically'
                    ]
                },
                {
                    name: 'Geometry & Measurement',
                    icon: '📏',
                    competencies: [
                        'Identify and classify shapes and their properties',
                        'Understand spatial relationships',
                        'Apply measurement concepts and units',
                        'Use geometric reasoning to solve problems'
                    ]
                },
                {
                    name: 'Data Analysis & Probability',
                    icon: '📈',
                    competencies: [
                        'Collect, organize, and display data',
                        'Interpret graphs and charts',
                        'Understand measures of central tendency',
                        'Apply basic probability concepts'
                    ]
                },
                {
                    name: 'Problem Solving & Reasoning',
                    icon: '💭',
                    competencies: [
                        'Apply problem-solving strategies',
                        'Communicate mathematical thinking',
                        'Make connections between concepts',
                        'Justify solutions and reasoning'
                    ]
                }
            ]
        },
        ela: {
            title: '📚 English Language Arts Framework',
            description: 'Building literacy connections across reading, writing, speaking, and listening',
            domains: [
                {
                    name: 'Reading Comprehension',
                    icon: '📖',
                    competencies: [
                        'Identify main ideas and supporting details',
                        'Make inferences and draw conclusions',
                        'Analyze text structure and features',
                        'Compare and contrast texts'
                    ]
                },
                {
                    name: 'Writing & Composition',
                    icon: '✍️',
                    competencies: [
                        'Organize ideas with clear structure',
                        'Develop and support arguments',
                        'Use appropriate voice and style',
                        'Revise and edit effectively'
                    ]
                },
                {
                    name: 'Speaking & Listening',
                    icon: '🗣️',
                    competencies: [
                        'Present ideas clearly and effectively',
                        'Listen actively and respond appropriately',
                        'Participate in collaborative discussions',
                        'Adapt speech to audience and purpose'
                    ]
                },
                {
                    name: 'Language Conventions',
                    icon: '📝',
                    competencies: [
                        'Apply grammar rules correctly',
                        'Use punctuation and capitalization',
                        'Spell grade-appropriate words',
                        'Expand vocabulary and word choice'
                    ]
                },
                {
                    name: 'Research & Inquiry',
                    icon: '🔍',
                    competencies: [
                        'Formulate research questions',
                        'Locate and evaluate sources',
                        'Synthesize information',
                        'Cite sources appropriately'
                    ]
                }
            ]
        },
        science: {
            title: '🔬 Science Competency Framework',
            description: 'Connecting scientific inquiry with real-world phenomena',
            domains: [
                {
                    name: 'Scientific Method & Inquiry',
                    icon: '🔬',
                    competencies: [
                        'Ask testable questions',
                        'Design and conduct investigations',
                        'Analyze and interpret data',
                        'Draw evidence-based conclusions'
                    ]
                },
                {
                    name: 'Physical Sciences',
                    icon: '⚛️',
                    competencies: [
                        'Understand matter and its properties',
                        'Explore forces and motion',
                        'Investigate energy and its transformations',
                        'Apply chemistry concepts'
                    ]
                },
                {
                    name: 'Life Sciences',
                    icon: '🌱',
                    competencies: [
                        'Understand living systems and organisms',
                        'Explore ecosystems and interactions',
                        'Investigate heredity and evolution',
                        'Apply health and biology concepts'
                    ]
                },
                {
                    name: 'Earth & Space Sciences',
                    icon: '🌍',
                    competencies: [
                        'Understand Earth\'s systems',
                        'Explore weather and climate',
                        'Investigate space and celestial bodies',
                        'Apply environmental science concepts'
                    ]
                },
                {
                    name: 'Engineering & Technology',
                    icon: '⚙️',
                    competencies: [
                        'Define problems and design solutions',
                        'Build and test prototypes',
                        'Optimize designs based on constraints',
                        'Apply technology appropriately'
                    ]
                }
            ]
        },
        'social-studies': {
            title: '🌍 Social Studies Framework',
            description: 'Connecting past, present, and future through civic understanding',
            domains: [
                {
                    name: 'Historical Thinking',
                    icon: '📜',
                    competencies: [
                        'Analyze historical events and contexts',
                        'Evaluate primary and secondary sources',
                        'Understand cause and effect relationships',
                        'Make connections across time periods'
                    ]
                },
                {
                    name: 'Geographic Reasoning',
                    icon: '🗺️',
                    competencies: [
                        'Use maps and geographic tools',
                        'Understand human-environment interactions',
                        'Analyze spatial patterns and relationships',
                        'Apply location and place concepts'
                    ]
                },
                {
                    name: 'Civic Understanding',
                    icon: '🏛️',
                    competencies: [
                        'Understand government structures and functions',
                        'Know rights and responsibilities',
                        'Analyze political processes',
                        'Engage in civic participation'
                    ]
                },
                {
                    name: 'Economic Literacy',
                    icon: '💰',
                    competencies: [
                        'Understand basic economic concepts',
                        'Analyze supply and demand',
                        'Explore economic systems',
                        'Apply personal finance skills'
                    ]
                },
                {
                    name: 'Global Perspectives',
                    icon: '🌐',
                    competencies: [
                        'Understand cultural diversity',
                        'Analyze global interconnections',
                        'Evaluate international issues',
                        'Develop cultural competence'
                    ]
                }
            ]
        }
    };
    
    const framework = frameworks[subject];
    if (!framework) return '<p>Framework not found</p>';
    
    let html = `
        <div class="framework-header">
            <h3>${framework.title}</h3>
            <p>${framework.description}</p>
        </div>
        
        <div class="framework-actions">
            <button class="btn btn-primary" onclick="exportFramework('${subject}')">
                📁 Export Framework
            </button>
            <button class="btn btn-secondary" onclick="printFramework('${subject}')">
                🖨️ Print Framework
            </button>
            <button class="btn btn-outline" onclick="customizeFramework('${subject}')">
                ✏️ Customize
            </button>
        </div>
    `;
    
    // Add domains and competencies
    framework.domains.forEach((domain, index) => {
        html += `
            <div class="card framework-domain">
                <div class="domain-header" onclick="toggleDomain(${index})">
                    <h4>
                        <span class="domain-icon">${domain.icon}</span>
                        ${domain.name}
                    </h4>
                    <span class="toggle-icon" id="toggle-${index}">▼</span>
                </div>
                <div class="domain-content" id="domain-${index}">
                    <div class="competency-list">
                        ${domain.competencies.map((comp, compIndex) => `
                            <div class="competency-item">
                                <input type="checkbox" id="${subject}-${index}-${compIndex}" 
                                       class="competency-check" 
                                       data-subject="${subject}"
                                       data-domain="${index}"
                                       data-competency="${compIndex}">
                                <label for="${subject}-${index}-${compIndex}">
                                    ${comp}
                                </label>
                                <div class="competency-actions">
                                    <button class="btn-icon" onclick="viewCompetencyDetails('${subject}', ${index}, ${compIndex})" title="View Details">
                                        🔍
                                    </button>
                                    <button class="btn-icon" onclick="addToAssessment('${subject}', ${index}, ${compIndex})" title="Add to Assessment">
                                        ➕
                                    </button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    
                    <div class="domain-footer">
                        <button class="btn btn-sm btn-outline" onclick="selectAllInDomain(${index}, true)">
                            Select All
                        </button>
                        <button class="btn btn-sm btn-outline" onclick="selectAllInDomain(${index}, false)">
                            Deselect All
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
    
    // Add grade-level progression
    html += `
        <div class="card">
            <h4>📊 Grade-Level Progression</h4>
            <div class="progression-chart">
                <p>Select competencies above to see grade-level progression pathways</p>
                <div id="progression-display"></div>
            </div>
        </div>
    `;
    
    return html;
}

// Toggle domain expansion
function toggleDomain(index) {
    const content = document.getElementById(`domain-${index}`);
    const toggleIcon = document.getElementById(`toggle-${index}`);
    
    if (content.style.display === 'none' || !content.style.display) {
        content.style.display = 'block';
        toggleIcon.textContent = '▲';
    } else {
        content.style.display = 'none';
        toggleIcon.textContent = '▼';
    }
}

// Select/deselect all competencies in a domain
function selectAllInDomain(domainIndex, select) {
    const checkboxes = document.querySelectorAll(`[data-domain="${domainIndex}"]`);
    checkboxes.forEach(checkbox => {
        checkbox.checked = select;
    });
    updateSelectedCount();
}

// View competency details
function viewCompetencyDetails(subject, domainIndex, competencyIndex) {
    // In a real app, this would show detailed information
    window.conduitApp.showNotification('Competency details view coming soon!', 'info');
}

// Add competency to assessment
function addToAssessment(subject, domainIndex, competencyIndex) {
    window.conduitApp.showNotification('Added to assessment criteria!', 'success');
    // In a real app, this would add the competency to the current assessment
}

// Export framework
function exportFramework(subject) {
    window.conduitApp.showNotification(`Exporting ${subject} framework...`, 'info');
    // In a real app, this would export to PDF or CSV
}

// Print framework
function printFramework(subject) {
    window.print();
}

// Customize framework
function customizeFramework(subject) {
    window.conduitApp.showNotification('Framework customization coming soon!', 'info');
}

// Setup framework event listeners
function setupFrameworkListeners() {
    const checkboxes = document.querySelectorAll('.competency-check');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateSelectedCount);
    });
}

// Update selected competencies count
function updateSelectedCount() {
    const selected = document.querySelectorAll('.competency-check:checked').length;
    const progressionDisplay = document.getElementById('progression-display');
    
    if (selected > 0) {
        progressionDisplay.innerHTML = `
            <div class="selected-info">
                <p><strong>${selected} competencies selected</strong></p>
                <div class="progression-levels">
                    <div class="level">
                        <span class="level-number">1</span>
                        <span class="level-label">Beginning</span>
                    </div>
                    <div class="level-arrow">→</div>
                    <div class="level">
                        <span class="level-number">2</span>
                        <span class="level-label">Developing</span>
                    </div>
                    <div class="level-arrow">→</div>
                    <div class="level">
                        <span class="level-number">3</span>
                        <span class="level-label">Proficient</span>
                    </div>
                    <div class="level-arrow">→</div>
                    <div class="level">
                        <span class="level-number">4</span>
                        <span class="level-label">Advanced</span>
                    </div>
                </div>
                <button class="btn btn-primary btn-sm" onclick="createCustomRubric()">
                    Create Custom Rubric
                </button>
            </div>
        `;
    } else {
        progressionDisplay.innerHTML = '<p>Select competencies above to see grade-level progression pathways</p>';
    }
}

// Create custom rubric
function createCustomRubric() {
    const selected = document.querySelectorAll('.competency-check:checked');
    if (selected.length === 0) {
        window.conduitApp.showNotification('Please select competencies first', 'error');
        return;
    }
    
    window.conduitApp.showNotification(`Creating rubric with ${selected.length} competencies...`, 'success');
    // In a real app, this would generate a custom rubric
}

// Initialize framework section
document.addEventListener('DOMContentLoaded', function() {
    // Set up initial framework view if needed
    const frameworkSection = document.getElementById('framework-section');
    if (frameworkSection && frameworkSection.classList.contains('active')) {
        // Load default framework
        showFramework('math');
    }
});