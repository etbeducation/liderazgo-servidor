/**
 * Calculator Module
 * Handles score calculations and interpretation logic
 */

const Calculator = {
    // Dimension mapping (which questions belong to which dimension)
    dimensions: {
        1: [1, 2, 3, 4],        // Identidad y misión
        2: [5, 6, 7, 8],        // Escucha, relaciones y acompañamiento
        3: [9, 10, 11, 12],     // Corresponsabilidad y trabajo en equipo
        4: [13, 14, 15, 16],    // Formación, apoyo y crecimiento
        5: [17, 18, 19, 20]     // Discernimiento, justicia y testimonio
    },

    /**
     * Calculate total score from form data
     * @param {FormData} formData - Form data containing all responses
     * @returns {Object} - Object containing total score and individual responses
     */
    calculateTotalScore(formData) {
        let total = 0;
        const responses = {};

        for (let i = 1; i <= 20; i++) {
            const value = parseInt(formData.get(`q${i}`)) || 0;
            responses[`q${i}`] = value;
            total += value;
        }

        return {
            total,
            responses
        };
    },

    /**
     * Calculate scores by dimension
     * @param {Object} responses - Individual question responses
     * @returns {Object} - Scores for each dimension
     */
    calculateDimensionScores(responses) {
        const dimensionScores = {};

        for (let dim = 1; dim <= 5; dim++) {
            let score = 0;
            this.dimensions[dim].forEach(questionNum => {
                score += responses[`q${questionNum}`] || 0;
            });
            dimensionScores[dim] = score;
        }

        return dimensionScores;
    },

    /**
     * Get interpretation based on total score
     * @param {number} score - Total score (0-100)
     * @returns {Object} - Interpretation object with category and message
     */
    getInterpretation(score) {
        if (score >= 80 && score <= 100) {
            return {
                category: 'excellent',
                title: 'Práctica sólida de liderazgo servicial',
                message: 'Su práctica refleja una comprensión profunda y consistente del liderazgo servicial en la escuela católica. Conviene consolidar estas fortalezas y acompañar a otros desde la experiencia. Continúe siendo testimonio de servicio y formando a otros líderes servidores.'
            };
        } else if (score >= 60 && score <= 79) {
            return {
                category: 'good',
                title: 'Base favorable con áreas de crecimiento',
                message: 'Su práctica muestra una base sólida en liderazgo servicial, pero existen áreas que requieren mayor intencionalidad, consistencia o formación. Identifique las dimensiones con menor puntaje y establezca acciones concretas de mejora. El acompañamiento profesional puede ser de gran ayuda.'
            };
        } else if (score >= 40 && score <= 59) {
            return {
                category: 'fair',
                title: 'Prácticas parciales que requieren atención',
                message: 'Se evidencian prácticas parciales de liderazgo servicial. Es recomendable identificar prioridades concretas de crecimiento y establecer un plan de acción. Busque formación específica en las dimensiones con menor puntaje y solicite acompañamiento de líderes más experimentados.'
            };
        } else {
            return {
                category: 'needs-improvement',
                title: 'Requiere atención inmediata',
                message: 'Los resultados indican la necesidad de atención inmediata, acompañamiento estructurado y un plan de mejora personal o institucional. Es fundamental buscar formación intensiva en liderazgo servicial, mentoría cercana, y compromiso serio con el crecimiento personal y profesional.'
            };
        }
    },

    /**
     * Get dimension name by number
     * @param {number} dimNum - Dimension number (1-5)
     * @returns {string} - Dimension name
     */
    getDimensionName(dimNum) {
        const names = {
            1: 'Identidad y misión',
            2: 'Escucha, relaciones y acompañamiento',
            3: 'Corresponsabilidad y trabajo en equipo',
            4: 'Formación, apoyo y crecimiento',
            5: 'Discernimiento, justicia y testimonio'
        };
        return names[dimNum] || '';
    },

    /**
     * Get strongest and weakest dimensions
     * @param {Object} dimensionScores - Scores for each dimension
     * @returns {Object} - Strongest and weakest dimensions
     */
    getStrengthsAndWeaknesses(dimensionScores) {
        let strongest = { dimension: 1, score: dimensionScores[1] };
        let weakest = { dimension: 1, score: dimensionScores[1] };

        for (let dim = 2; dim <= 5; dim++) {
            if (dimensionScores[dim] > strongest.score) {
                strongest = { dimension: dim, score: dimensionScores[dim] };
            }
            if (dimensionScores[dim] < weakest.score) {
                weakest = { dimension: dim, score: dimensionScores[dim] };
            }
        }

        return {
            strongest: {
                dimension: strongest.dimension,
                name: this.getDimensionName(strongest.dimension),
                score: strongest.score
            },
            weakest: {
                dimension: weakest.dimension,
                name: this.getDimensionName(weakest.dimension),
                score: weakest.score
            }
        };
    },

    /**
     * Calculate percentage for dimension
     * @param {number} score - Dimension score (0-20)
     * @returns {number} - Percentage (0-100)
     */
    getPercentage(score, maxScore = 20) {
        return (score / maxScore) * 100;
    },

    /**
     * Prepare complete results object
     * @param {FormData} formData - Form data from assessment
     * @returns {Object} - Complete results object
     */
    prepareResults(formData) {
        const { total, responses } = this.calculateTotalScore(formData);
        const dimensionScores = this.calculateDimensionScores(responses);
        const interpretation = this.getInterpretation(total);
        const analysis = this.getStrengthsAndWeaknesses(dimensionScores);

        return {
            totalScore: total,
            responses: responses,
            dimensionScores: dimensionScores,
            interpretation: interpretation,
            analysis: analysis,
            timestamp: new Date().toISOString()
        };
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Calculator;
}
