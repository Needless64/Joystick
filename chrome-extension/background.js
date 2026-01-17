// Minimal background script for Mobile Touchpad Controller extension

// Initialize extension
chrome.runtime.onInstalled.addListener(() => {
    console.log('Mobile Touchpad Controller installed');
    
    // Set default settings
    chrome.storage.sync.set({
        serverPort: '3000',
        serverHost: 'localhost'
    });
});

// Handle messages
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getSettings') {
        chrome.storage.sync.get(['serverPort', 'serverHost'], (result) => {
            sendResponse({
                serverPort: result.serverPort || '3000',
                serverHost: result.serverHost || 'localhost'
            });
        });
        return true;
    }
});