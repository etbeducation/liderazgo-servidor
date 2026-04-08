/**
 * Main Application Module
 * Handles UI interactions, form submission, and results display
 */

// Global state
let assessmentResults = null;
let userInformation = null;

/**
 * Start the assessment - show assessment section
 */
function startAssessment() {
    document.getElementById('welcome-section').classList.remove('active');
    document.getElementById('assessment-section').classList.add('active');
    updateProgress();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Update progress bar based on completed questions
 */
function updateProgress() {
    const form = document.getElementById('assessment-form');
    const totalQuestions = 20;
    let answeredQuestions = 0;

    for (let i = 1; i <= totalQuestions; i++) {
        const questionAnswered = form.querySelector(`input[name="q${i}"]:checked`);
        if (questionAnswered) {
            answeredQuestions++;
        }
    }

    const percentage = (answeredQuestions / totalQuestions) * 100;
    document.getElementById('progress-fill').style.width = percentage + '%';
    document.getElementById('current-question').textContent = answeredQuestions;
}

/**
 * Handle assessment form submission
 */
document.addEventListener('DOMContentLoaded', function() {
    const assessmentForm = document.getElementById('assessment-form');
    
    // Add change listeners to all radio buttons for progress tracking
    const radioButtons = assessmentForm.querySelectorAll('input[type="radio"]');
    radioButtons.forEach(radio => {
        radio.addEventListener('change', updateProgress);
    });

    // Handle form submission
    assessmentForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Calculate results
        const formData = new FormData(assessmentForm);
        assessmentResults = Calculator.prepareResults(formData);
        
        // Show user info modal
        showUserInfoModal();
    });

    // Handle user info form submission
    const userInfoForm = document.getElementById('user-info-form');
    userInfoForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get user information
        userInformation = {
            name: document.getElementById('user-name').value,
            email: document.getElementById('user-email').value
        };

        // Hide modal
        hideUserInfoModal();

        // Show loading state
        showLoadingState();

        // Send data to Google Sheets
        try {
            await SheetsIntegration.submitData(userInformation, assessmentResults);
            console.log('Data submitted successfully');
        } catch (error) {
            console.error('Error submitting data:', error);
            // Continue to show results even if submission fails
        }

        // Display results
        displayResults();
    });
});

/**
 * Show user info modal
 */
function showUserInfoModal() {
    const modal = document.getElementById('user-info-modal');
    modal.classList.add('active');
}

/**
 * Hide user info modal
 */
function hideUserInfoModal() {
    const modal = document.getElementById('user-info-modal');
    modal.classList.remove('active');
}

/**
 * Show loading state
 */
function showLoadingState() {
    // Could add a loading spinner here if desired
    console.log('Loading results...');
}

/**
 * Display results section with calculated scores
 */
function displayResults() {
    // Hide assessment section
    document.getElementById('assessment-section').classList.remove('active');
    
    // Show results section
    const resultsSection = document.getElementById('results-section');
    resultsSection.classList.add('active');
    
    // Display total score
    document.getElementById('total-score').textContent = assessmentResults.totalScore;
    
    // Display interpretation
    displayInterpretation();
    
    // Display dimension scores
    displayDimensionScores();
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Display interpretation based on score
 */
function displayInterpretation() {
    const interpretationBox = document.getElementById('interpretation');
    const interpretation = assessmentResults.interpretation;
    
    interpretationBox.className = 'interpretation-box ' + interpretation.category;
    interpretationBox.innerHTML = `
        <h4>${interpretation.title}</h4>
        <p>${interpretation.message}</p>
    `;
}

/**
 * Display dimension scores with animated bars
 */
function displayDimensionScores() {
    const dimensionScores = assessmentResults.dimensionScores;
    
    for (let i = 1; i <= 5; i++) {
        const score = dimensionScores[i];
        const percentage = Calculator.getPercentage(score, 20);
        
        // Update score text
        document.getElementById(`dim${i}-score`).textContent = `${score}/20`;
        
        // Animate score bar
        const scoreBar = document.getElementById(`dim${i}-bar`);
        setTimeout(() => {
            scoreBar.style.width = percentage + '%';
        }, 100 * i); // Stagger animation
    }
}

/**
 * Download results as PDF
 */
async function downloadPDF() {
    if (!window.jspdf || !window.jspdf.jsPDF) {
        alert('El generador de PDF no está disponible. Por favor, recargue la página e intente nuevamente.');
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    let yPosition = 20;
    const lineHeight = 7;
    const pageWidth = 190;
    
    // Title
    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
    doc.text('Resultados de Autoevaluación', 105, yPosition, { align: 'center' });
    yPosition += lineHeight * 1.5;
    
    doc.setFontSize(14);
    doc.text('Liderazgo Servidor en la Escuela Católica', 105, yPosition, { align: 'center' });
    yPosition += lineHeight * 2;
    
    // User info
    doc.setFontSize(11);
    doc.setFont(undefined, 'normal');
    doc.text(`Nombre: ${userInformation.name}`, 20, yPosition);
    yPosition += lineHeight;
    doc.text(`Email: ${userInformation.email}`, 20, yPosition);
    yPosition += lineHeight;
    doc.text(`Fecha: ${new Date().toLocaleDateString('es-PR')}`, 20, yPosition);
    yPosition += lineHeight * 2;
    
    // Total score
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('Puntaje Total', 20, yPosition);
    yPosition += lineHeight;
    
    doc.setFontSize(24);
    doc.setTextColor(37, 99, 235); // Primary blue
    doc.text(`${assessmentResults.totalScore}/100`, 20, yPosition);
    yPosition += lineHeight * 2;
    
    // Interpretation
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('Interpretación:', 20, yPosition);
    yPosition += lineHeight;
    
    doc.setFontSize(11);
    doc.setFont(undefined, 'normal');
    const interpretationLines = doc.splitTextToSize(assessmentResults.interpretation.message, pageWidth - 40);
    doc.text(interpretationLines, 20, yPosition);
    yPosition += (interpretationLines.length * lineHeight) + lineHeight;
    
    // Dimension scores
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('Puntaje por Dimensión:', 20, yPosition);
    yPosition += lineHeight * 1.5;
    
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    
    for (let i = 1; i <= 5; i++) {
        const dimensionName = Calculator.getDimensionName(i);
        const score = assessmentResults.dimensionScores[i];
        
        doc.text(`${i}. ${dimensionName}`, 25, yPosition);
        doc.text(`${score}/20`, 170, yPosition);
        yPosition += lineHeight;
    }
    
    yPosition += lineHeight;
    
    // Strongest and weakest
    doc.setFontSize(11);
    doc.setFont(undefined, 'bold');
    doc.text('Análisis:', 20, yPosition);
    yPosition += lineHeight;
    
    doc.setFont(undefined, 'normal');
    doc.text(`Fortaleza: ${assessmentResults.analysis.strongest.name} (${assessmentResults.analysis.strongest.score}/20)`, 25, yPosition);
    yPosition += lineHeight;
    doc.text(`Área de mejora: ${assessmentResults.analysis.weakest.name} (${assessmentResults.analysis.weakest.score}/20)`, 25, yPosition);
    yPosition += lineHeight * 2;
    
    // Footer
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text('Dr. Raúl R. Nieves Rivera', 105, 280, { align: 'center' });
    
    // Save PDF
    const fileName = `Resultados_Liderazgo_Servidor_${userInformation.name.replace(/\s/g, '_')}.pdf`;
    doc.save(fileName);
}

/**
 * Send results to user's email
 */
async function emailResults() {
    alert('Funcionalidad de envío por correo en desarrollo.\n\nPor ahora, puede descargar el PDF y enviarlo manualmente.');
    
    // Future implementation would use a backend service like:
    // - EmailJS
    // - SendGrid
    // - AWS SES
    // - Or the same Google Apps Script
}

/**
 * Reset assessment and start over
 */
function resetAssessment() {
    if (confirm('¿Está seguro de que desea realizar una nueva evaluación? Se perderán los resultados actuales.')) {
        // Reset global state
        assessmentResults = null;
        userInformation = null;
        
        // Reset form
        document.getElementById('assessment-form').reset();
        document.getElementById('user-info-form').reset();
        
        // Clear reflection fields
        document.getElementById('reflection1').value = '';
        document.getElementById('reflection2').value = '';
        document.getElementById('reflection3').value = '';
        document.getElementById('reflection4').value = '';
        
        // Reset progress
        document.getElementById('progress-fill').style.width = '0%';
        document.getElementById('current-question').textContent = '0';
        
        // Show welcome section
        document.getElementById('results-section').classList.remove('active');
        document.getElementById('assessment-section').classList.remove('active');
        document.getElementById('welcome-section').classList.add('active');
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

/**
 * Initialize app
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('Herramienta de Autoevaluación - Liderazgo Servidor');
    console.log('Dr. Raúl R. Nieves Rivera');
    
    // Test Google Sheets connection (optional)
    // Uncomment to test on load
    /*
    SheetsIntegration.testConnection().then(result => {
        if (result.success) {
            console.log('✓ Google Sheets conectado');
        } else {
            console.warn('⚠ Google Sheets no configurado:', result.message);
        }
    });
    */
});
