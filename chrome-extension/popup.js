// Popup script for Mobile Touchpad Controller extension
document.addEventListener('DOMContentLoaded', function() {
    const statusEl = document.getElementById('status');
    const statusText = document.getElementById('statusText');
    const enableBtn = document.getElementById('enableBtn');
    const disableBtn = document.getElementById('disableBtn');
    const openMobileBtn = document.getElementById('openMobileBtn');
    const mobileUrl = document.getElementById('mobileUrl');
    const serverPort = document.getElementById('serverPort');
    const serverHost = document.getElementById('serverHost');
    
    let currentTab = null;
    let serverStatus = 'disconnected';
    let extensionEnabled = true;
    
    // Load settings
    chrome.storage.sync.get(['serverPort', 'serverHost', 'extensionDisabled'], function(result) {
        if (result.serverPort) serverPort.value = result.serverPort;
        if (result.serverHost) serverHost.value = result.serverHost;
        extensionEnabled = !result.extensionDisabled;
        updateMobileUrl();
        checkServerStatus();
        updateButtonStates();
    });
    
    // Save settings on change
    serverPort.addEventListener('change', saveSettings);
    serverHost.addEventListener('change', saveSettings);
    
    function saveSettings() {
        chrome.storage.sync.set({
            serverPort: serverPort.value,
            serverHost: serverHost.value
        });
        updateMobileUrl();
        checkServerStatus();
    }
    
    function updateMobileUrl() {
        const host = serverHost.value || 'localhost';
        const port = serverPort.value || '3000';
        
        if (host === 'localhost' || host === '127.0.0.1') {
            mobileUrl.innerHTML = `http://YOUR-IP:${port}/mobile<br><small style="color: #666;">Replace YOUR-IP with your computer's IP</small>`;
        } else {
            mobileUrl.textContent = `http://${host}:${port}/mobile`;
        }
    }
    
    function updateButtonStates() {
        if (extensionEnabled) {
            enableBtn.style.display = 'none';
            disableBtn.style.display = 'block';
        } else {
            enableBtn.style.display = 'block';
            disableBtn.style.display = 'none';
        }
    }
    
    function updateStatus(status, text) {
        serverStatus = status;
        statusEl.className = `status ${status}`;
        statusText.textContent = text;
    }
    
    function checkServerStatus() {
        const host = serverHost.value || 'localhost';
        const port = serverPort.value || '3000';
        
        // Try to connect to WebSocket to check if server is running
        const ws = new WebSocket(`ws://${host}:${port}/?role=desktop`);
        
        const timeout = setTimeout(() => {
            ws.close();
            if (extensionEnabled) {
                updateStatus('disconnected', 'Server not running - Extension enabled but waiting for server');
            } else {
                updateStatus('disconnected', 'Extension disabled');
            }
        }, 3000);
        
        ws.onopen = function() {
            clearTimeout(timeout);
            ws.close();
            
            if (extensionEnabled) {
                // Check if controller is active on current tab
                chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                    currentTab = tabs[0];
                    chrome.tabs.sendMessage(currentTab.id, {action: 'checkStatus'}, function(response) {
                        if (chrome.runtime.lastError) {
                            updateStatus('connected', 'Server running - Auto-activating on tabs');
                        } else if (response && response.active) {
                            updateStatus('active', 'Auto-active on this tab');
                        } else {
                            updateStatus('connected', 'Server running - Auto-activating on tabs');
                        }
                    });
                });
            } else {
                updateStatus('connected', 'Server running but extension disabled');
            }
        };
        
        ws.onerror = function() {
            clearTimeout(timeout);
            if (extensionEnabled) {
                updateStatus('disconnected', 'Server not running - Extension enabled but waiting for server');
            } else {
                updateStatus('disconnected', 'Extension disabled');
            }
        };
    }
    
    // Enable extension globally
    enableBtn.addEventListener('click', function() {
        extensionEnabled = true;
        chrome.storage.sync.set({ extensionDisabled: false });
        
        // Send enable message to all tabs
        chrome.tabs.query({}, function(tabs) {
            tabs.forEach(function(tab) {
                chrome.tabs.sendMessage(tab.id, {action: 'globalEnable'}, function() {
                    // Ignore errors for tabs that don't have the content script
                });
            });
        });
        
        updateButtonStates();
        checkServerStatus();
    });
    
    // Disable extension globally
    disableBtn.addEventListener('click', function() {
        extensionEnabled = false;
        chrome.storage.sync.set({ extensionDisabled: true });
        
        // Send disable message to all tabs
        chrome.tabs.query({}, function(tabs) {
            tabs.forEach(function(tab) {
                chrome.tabs.sendMessage(tab.id, {action: 'globalDisable'}, function() {
                    // Ignore errors for tabs that don't have the content script
                });
            });
        });
        
        updateButtonStates();
        updateStatus('disconnected', 'Extension disabled');
    });
    
    // Open mobile controller
    openMobileBtn.addEventListener('click', function() {
        const host = serverHost.value || 'localhost';
        const port = serverPort.value || '3000';
        chrome.tabs.create({ url: `http://${host}:${port}/mobile` });
    });
    
    // Check status periodically
    setInterval(checkServerStatus, 5000);
});