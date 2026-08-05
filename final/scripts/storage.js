/* ==========================================================================
   LocalStorage Management Module
   ========================================================================== */

const STORAGE_KEY = 'morning_bliss_estimate';

export function saveEstimateToStorage(estimateData) {
    try {
        const payload = {
            ...estimateData,
            updatedAt: new Date().toISOString()
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
        return true;
    } catch (error) {
        console.error('Error saving to localStorage:', error);
        return false;
    }
}

export function getStoredEstimate() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Error reading from localStorage:', error);
        return null;
    }
}

export function clearStoredEstimate() {
    try {
        localStorage.removeItem(STORAGE_KEY);
        return true;
    } catch (error) {
        console.error('Error clearing localStorage:', error);
        return false;
    }
}