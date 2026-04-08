/**
 * Google Sheets Integration Module
 * Handles data submission to Google Sheets via Apps Script
 */

const SheetsIntegration = {
    // This URL will be replaced with your actual Google Apps Script Web App URL
    // See README.md for setup instructions
    SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbxgj-hemDAr7CGRKQa8omQkpYto-b_Ns8MrbNHCkp4AzOJjGLn5EIRBZwAKC27hyIQi/exec',

    /**
     * Send data to Google Sheets
     * @param {Object} data - Complete assessment data
     * @returns {Promise} - Fetch promise
     */
    async sendToSheets(data) {
        // Check if URL is configured
        if (this.SCRIPT_URL === 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') {
            console.warn('Google Sheets integration not configured. Data will not be saved.');
            console.log('Data that would be sent:', data);
            return Promise.resolve({ 
                success: false, 
                message: 'Google Sheets not configured',
                mockSuccess: true 
            });
        }

        try {
            const response = await fetch(this.SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors', // Google Apps Script requires this
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            // Note: With 'no-cors', we can't read the response
            // We assume success if no error is thrown
            return { success: true, message: 'Datos guardados exitosamente' };
            
        } catch (error) {
            console.error('Error sending data to Google Sheets:', error);
            throw new Error('No se pudieron guardar los datos. Por favor, intente nuevamente.');
        }
    },

    /**
     * Format data for Google Sheets submission
     * @param {Object} userInfo - User name and email
     * @param {Object} results - Assessment results
     * @returns {Object} - Formatted data object
     */
    formatDataForSheets(userInfo, results) {
        const timestamp = new Date();
        
        // Prepare individual responses array
        const responsesArray = [];
        for (let i = 1; i <= 20; i++) {
            responsesArray.push(results.responses[`q${i}`] || 0);
        }

        // Prepare dimension scores array
        const dimensionScoresArray = [];
        for (let i = 1; i <= 5; i++) {
            dimensionScoresArray.push(results.dimensionScores[i] || 0);
        }

        return {
            timestamp: timestamp.toISOString(),
            dateFormatted: this.formatDate(timestamp),
            timeFormatted: this.formatTime(timestamp),
            nombre: userInfo.name,
            email: userInfo.email,
            puntajeTotal: results.totalScore,
            interpretacion: results.interpretation.title,
            categoria: results.interpretation.category,
            // Dimension scores
            dim1_score: results.dimensionScores[1],
            dim2_score: results.dimensionScores[2],
            dim3_score: results.dimensionScores[3],
            dim4_score: results.dimensionScores[4],
            dim5_score: results.dimensionScores[5],
            // Individual responses
            responses: responsesArray,
            // Analysis
            fortaleza_dimension: results.analysis.strongest.name,
            fortaleza_puntaje: results.analysis.strongest.score,
            debilidad_dimension: results.analysis.weakest.name,
            debilidad_puntaje: results.analysis.weakest.score
        };
    },

    /**
     * Format date as DD/MM/YYYY
     * @param {Date} date - Date object
     * @returns {string} - Formatted date
     */
    formatDate(date) {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    },

    /**
     * Format time as HH:MM:SS
     * @param {Date} date - Date object
     * @returns {string} - Formatted time
     */
    formatTime(date) {
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    },

    /**
     * Main submission handler
     * @param {Object} userInfo - User information
     * @param {Object} results - Assessment results
     * @returns {Promise} - Promise that resolves when data is sent
     */
    async submitData(userInfo, results) {
        const formattedData = this.formatDataForSheets(userInfo, results);
        
        try {
            const response = await this.sendToSheets(formattedData);
            return response;
        } catch (error) {
            console.error('Submission error:', error);
            throw error;
        }
    },

    /**
     * Test connection to Google Sheets
     * @returns {Promise} - Test result
     */
    async testConnection() {
        if (this.SCRIPT_URL === 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') {
            return {
                success: false,
                message: 'URL de Google Apps Script no configurada'
            };
        }

        try {
            const testData = {
                test: true,
                timestamp: new Date().toISOString(),
                message: 'Test de conexión'
            };

            await fetch(this.SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(testData)
            });

            return {
                success: true,
                message: 'Conexión exitosa con Google Sheets'
            };
        } catch (error) {
            return {
                success: false,
                message: 'Error de conexión: ' + error.message
            };
        }
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SheetsIntegration;
}
