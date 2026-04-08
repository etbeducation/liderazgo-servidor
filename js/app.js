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
    const leftMargin = 20;
    const rightMargin = 20;
    
    // Header with colors
    doc.setFillColor(37, 99, 235); // Primary blue
    doc.rect(0, 0, 210, 45, 'F');
    
    // Title in white
    doc.setFontSize(20);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text('Resultados de Autoevaluación', 105, 15, { align: 'center' });
    
    doc.setFontSize(14);
    doc.text('Liderazgo Servidor en la Escuela Católica', 105, 25, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setFont(undefined, 'italic');
    doc.text('Dr. Raúl R. Nieves Rivera', 105, 35, { align: 'center' });
    
    // Reset text color
    doc.setTextColor(0, 0, 0);
    yPosition = 55;
    
    // User info box
    doc.setFillColor(219, 234, 254); // Light blue background
    doc.rect(leftMargin, yPosition, pageWidth - 40, 22, 'F');
    
    doc.setFontSize(11);
    doc.setFont(undefined, 'bold');
    doc.text('Información del Participante', leftMargin + 5, yPosition + 7);
    
    doc.setFont(undefined, 'normal');
    doc.setFontSize(10);
    doc.text(`Nombre: ${userInformation.name}`, leftMargin + 5, yPosition + 13);
    doc.text(`Email: ${userInformation.email}`, leftMargin + 5, yPosition + 18);
    
    const fechaActual = new Date().toLocaleDateString('es-PR', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    doc.text(`Fecha: ${fechaActual}`, leftMargin + 5, yPosition + 23);
    
    yPosition += 32;
    
    // Total Score - Large and prominent
    doc.setFillColor(219, 234, 254);
    doc.rect(leftMargin, yPosition, pageWidth - 40, 30, 'F');
    
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(37, 99, 235);
    doc.text('PUNTAJE TOTAL', 105, yPosition + 10, { align: 'center' });
    
    doc.setFontSize(32);
    doc.text(`${assessmentResults.totalScore}`, 105, yPosition + 22, { align: 'center' });
    
    doc.setFontSize(14);
    doc.setTextColor(100, 116, 139);
    doc.text('/ 100', 125, yPosition + 22);
    
    yPosition += 40;
    doc.setTextColor(0, 0, 0);
    
    // Interpretation box
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('Interpretación', leftMargin, yPosition);
    yPosition += 7;
    
    // Color-coded interpretation
    let boxColor;
    switch(assessmentResults.interpretation.category) {
        case 'excellent':
            boxColor = [209, 250, 229]; // Green
            break;
        case 'good':
            boxColor = [219, 234, 254]; // Blue
            break;
        case 'fair':
            boxColor = [254, 243, 199]; // Yellow
            break;
        case 'needs-improvement':
            boxColor = [254, 226, 226]; // Red
            break;
        default:
            boxColor = [241, 245, 249]; // Gray
    }
    
    doc.setFillColor(boxColor[0], boxColor[1], boxColor[2]);
    doc.rect(leftMargin, yPosition, pageWidth - 40, 5, 'F');
    
    doc.setFontSize(11);
    doc.setFont(undefined, 'bold');
    doc.text(assessmentResults.interpretation.title, leftMargin + 3, yPosition + 3.5);
    yPosition += 7;
    
    doc.setFont(undefined, 'normal');
    doc.setFontSize(10);
    const interpretationLines = doc.splitTextToSize(
        assessmentResults.interpretation.message, 
        pageWidth - 46
    );
    doc.text(interpretationLines, leftMargin + 3, yPosition);
    yPosition += (interpretationLines.length * 5) + 8;
    
    // Dimension scores
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('Puntaje por Dimensión', leftMargin, yPosition);
    yPosition += 8;
    
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    
    const dimensionNames = [
        'I. Identidad y misión',
        'II. Escucha, relaciones y acompañamiento',
        'III. Corresponsabilidad y trabajo en equipo',
        'IV. Formación, apoyo y crecimiento',
        'V. Discernimiento, justicia y testimonio'
    ];
    
    for (let i = 1; i <= 5; i++) {
        const score = assessmentResults.dimensionScores[i];
        const percentage = (score / 20) * 100;
        
        // Dimension name
        doc.setFont(undefined, 'bold');
        doc.text(dimensionNames[i-1], leftMargin, yPosition);
        
        // Score
        doc.setFont(undefined, 'normal');
        doc.text(`${score}/20`, pageWidth - 5, yPosition, { align: 'right' });
        
        yPosition += 5;
        
        // Progress bar
        doc.setDrawColor(226, 232, 240);
        doc.setFillColor(226, 232, 240);
        doc.rect(leftMargin, yPosition - 2, pageWidth - 40, 3, 'F');
        
        // Filled portion
        doc.setFillColor(37, 99, 235);
        doc.rect(leftMargin, yPosition - 2, ((pageWidth - 40) * percentage / 100), 3, 'F');
        
        yPosition += 6;
    }
    
    yPosition += 5;
    
    // Analysis section
    doc.setFontSize(11);
    doc.setFont(undefined, 'bold');
    doc.text('Análisis', leftMargin, yPosition);
    yPosition += 7;
    
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(16, 185, 129); // Green
    doc.text('✓ ', leftMargin, yPosition);
    doc.setTextColor(0, 0, 0);
    doc.text(`Fortaleza: ${assessmentResults.analysis.strongest.name}`, leftMargin + 5, yPosition);
    doc.setFont(undefined, 'bold');
    doc.text(`(${assessmentResults.analysis.strongest.score}/20)`, pageWidth - 5, yPosition, { align: 'right' });
    
    yPosition += 6;
    
    doc.setFont(undefined, 'normal');
    doc.setTextColor(239, 68, 68); // Red
    doc.text('⚠ ', leftMargin, yPosition);
    doc.setTextColor(0, 0, 0);
    doc.text(`Área de mejora: ${assessmentResults.analysis.weakest.name}`, leftMargin + 5, yPosition);
    doc.setFont(undefined, 'bold');
    doc.text(`(${assessmentResults.analysis.weakest.score}/20)`, pageWidth - 5, yPosition, { align: 'right' });
    
    // Footer
    doc.setDrawColor(203, 213, 225);
    doc.line(leftMargin, 275, pageWidth, 275);
    
    doc.setFontSize(9);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text('© 2025 Dr. Raúl R. Nieves Rivera', leftMargin, 282);
    doc.text('Powered by EdTech Believers LLC', pageWidth, 282, { align: 'right' });
    
    doc.setFontSize(8);
    doc.setFont(undefined, 'italic');
    const footerNote = 'Esta herramienta tiene propósito formativo, no punitivo.';
    doc.text(footerNote, 105, 287, { align: 'center' });
    
    // Save PDF
    const fileName = `Liderazgo_Servidor_${userInformation.name.replace(/\s/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
}

/**
 * Send results to user's email
 */

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
