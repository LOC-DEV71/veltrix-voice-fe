// Global Audio Manager for Veltrix Voice SaaS
// Stop all active audio playbacks across the entire app whenever a new audio is started.

let currentGlobalAudio = null;
const listeners = new Set();

export const playAudioGlobal = (audioInstance, onStopCallback) => {
    // 1. Tắt ngay âm thanh toàn cục đang phát trước đó nếu có
    if (currentGlobalAudio && currentGlobalAudio !== audioInstance) {
        try {
            currentGlobalAudio.pause();
            currentGlobalAudio.currentTime = 0;
        } catch (e) {}
    }

    // 2. Thông báo tất cả listeners để reset state UI (nút Play/Pause)
    listeners.forEach(callback => {
        try {
            callback(audioInstance);
        } catch(e) {}
    });

    // 3. Gán audio mới làm audio toàn cục
    currentGlobalAudio = audioInstance;

    // Tự động giải phóng khi bài đọc kết thúc
    if (audioInstance) {
        const handleEnded = () => {
            if (currentGlobalAudio === audioInstance) {
                currentGlobalAudio = null;
            }
            if (onStopCallback) onStopCallback();
        };
        audioInstance.onended = handleEnded;
    }
};

export const stopAllAudiosGlobal = () => {
    if (currentGlobalAudio) {
        try {
            currentGlobalAudio.pause();
            currentGlobalAudio.currentTime = 0;
        } catch (e) {}
        currentGlobalAudio = null;
    }
    listeners.forEach(callback => {
        try {
            callback(null);
        } catch(e) {}
    });
};

export const registerAudioListener = (callback) => {
    listeners.add(callback);
    return () => listeners.delete(callback);
};
