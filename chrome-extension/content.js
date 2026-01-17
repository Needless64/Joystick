// Content script for Mobile Touchpad Controller extension
console.log('Mobile Touchpad Controller content script loading...');

(function() {
    'use strict';
    
    // Prevent multiple instances
    if (window.mobileTouchpadContentScript) {
        return;
    }
    window.mobileTouchpadContentScript = true;
    
    // Auto-activate controller when page loads
    let autoActivateTimeout;
    
    function autoActivateController() {
        // Check if extension is globally disabled
        chrome.storage.sync.get(['extensionDisabled'], (result) => {
            if (!result.extensionDisabled && !window.mobileTouchpadController) {
                // Get server settings and auto-activate
                chrome.storage.sync.get(['serverPort', 'serverHost'], (settings) => {
                    const host = settings.serverHost || 'localhost';
                    const port = settings.serverPort || '3000';
                    
                    // Auto-inject the touchpad controller
                    injectTouchpadController(host, port);
                });
            }
        });
    }
    
    // Auto-activate after page loads
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            autoActivateTimeout = setTimeout(autoActivateController, 1000);
        });
    } else {
        autoActivateTimeout = setTimeout(autoActivateController, 1000);
    }
    
    // Listen for messages from the extension popup
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        try {
            if (request.action === 'checkStatus') {
                // Check if touchpad controller is active
                const isActive = window.mobileTouchpadController && window.mobileTouchpadController.active;
                sendResponse({ active: isActive });
            } else if (request.action === 'activate') {
                // Manually activate (in case auto-activation failed)
                chrome.storage.sync.get(['serverPort', 'serverHost'], (settings) => {
                    const host = settings.serverHost || 'localhost';
                    const port = settings.serverPort || '3000';
                    injectTouchpadController(host, port);
                    sendResponse({ success: true });
                });
                return true;
            } else if (request.action === 'deactivate') {
                // Deactivate the touchpad controller
                if (window.mobileTouchpadController) {
                    window.mobileTouchpadController.destroy();
                    sendResponse({ success: true });
                } else {
                    sendResponse({ success: false, error: 'Controller not active' });
                }
            } else if (request.action === 'globalDisable') {
                // Globally disable extension
                chrome.storage.sync.set({ extensionDisabled: true });
                if (window.mobileTouchpadController) {
                    window.mobileTouchpadController.destroy();
                }
                sendResponse({ success: true });
            } else if (request.action === 'globalEnable') {
                // Globally enable extension
                chrome.storage.sync.set({ extensionDisabled: false });
                // Auto-activate on current tab
                setTimeout(autoActivateController, 500);
                sendResponse({ success: true });
            }
        } catch (error) {
            console.error('Content script message handling error:', error);
            sendResponse({ success: false, error: error.message });
        }
        
        return true; // Keep message channel open for async response
    });
    
    // Clean up on page unload
    window.addEventListener('beforeunload', function() {
        if (autoActivateTimeout) {
            clearTimeout(autoActivateTimeout);
        }
        if (window.mobileTouchpadController) {
            window.mobileTouchpadController.destroy();
        }
    });
    
    // Handle page visibility changes
    document.addEventListener('visibilitychange', function() {
        if (window.mobileTouchpadController) {
            if (document.hidden) {
                // Page is hidden, pause controller
                if (window.mobileTouchpadController.indicator) {
                    window.mobileTouchpadController.indicator.style.opacity = '0.5';
                }
            } else {
                // Page is visible, resume controller
                if (window.mobileTouchpadController.indicator) {
                    window.mobileTouchpadController.indicator.style.opacity = '1';
                }
            }
        }
    });
    
    // Function to inject touchpad controller (moved from popup.js)
    function injectTouchpadController(host, port) {
        // Remove existing controller if any
        if (window.mobileTouchpadController) {
            window.mobileTouchpadController.destroy();
        }
        
        // Create the touchpad controller
        window.mobileTouchpadController = {
            ws: null,
            mouseX: window.innerWidth / 2,
            mouseY: window.innerHeight / 2,
            indicator: null,
            cursor: null,
            active: true,
            
            init: function() {
                this.createUI();
                this.connectWebSocket(host, port);
            },
            
            createUI: function() {
                // Create indicator
                this.indicator = document.createElement('div');
                this.indicator.style.cssText = `
                    position: fixed;
                    top: 10px;
                    right: 10px;
                    background: #28a745;
                    color: white;
                    padding: 8px 12px;
                    border-radius: 6px;
                    z-index: 999999;
                    font-size: 12px;
                    font-family: -apple-system, BlinkMacSystemFont, sans-serif;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.3);
                    pointer-events: none;
                `;
                this.indicator.textContent = '📱 Mobile Touchpad Auto-Active';
                document.body.appendChild(this.indicator);
                
                // Create virtual cursor
                this.cursor = document.createElement('div');
                this.cursor.id = 'mobileTouchpadCursor';
                this.cursor.style.cssText = `
                    position: fixed;
                    width: 12px;
                    height: 12px;
                    background: #ff4444;
                    border: 2px solid white;
                    border-radius: 50%;
                    pointer-events: none;
                    z-index: 999998;
                    box-shadow: 0 0 10px rgba(0,0,0,0.5);
                    transition: all 0.1s ease;
                `;
                document.body.appendChild(this.cursor);
                
                this.updateCursor();
            },
            
            connectWebSocket: function(host, port) {
                // Determine server URL
                let serverUrl;
                if (host.includes('vercel.app') || host.includes('http')) {
                    serverUrl = host.startsWith('http') ? host : `https://${host}`;
                } else {
                    serverUrl = `http://${host}:${port}`;
                }
                
                // Use Server-Sent Events for receiving messages
                this.eventSource = new EventSource(`${serverUrl}/api/events?role=desktop`);
                
                this.eventSource.onopen = () => {
                    this.indicator.style.background = '#28a745';
                    this.indicator.textContent = '📱 Mobile Touchpad Connected';
                };
                
                this.eventSource.onmessage = (event) => {
                    const data = JSON.parse(event.data);
                    if (data.type !== 'ping' && data.type !== 'connected') {
                        this.handleMessage(data);
                    }
                };
                
                this.eventSource.onerror = () => {
                    this.indicator.style.background = '#ffc107';
                    this.indicator.textContent = '📱 Mobile Touchpad Reconnecting...';
                    
                    // Try to reconnect after 2 seconds
                    setTimeout(() => {
                        if (this.active) {
                            this.connectWebSocket(host, port);
                        }
                    }, 2000);
                };
            },
            
            handleMessage: function(data) {
                if (data.type === 'mouseMove') {
                    this.moveMouseCursor(data.x, data.y);
                } else if (data.type === 'joystick') {
                    this.scrollPage(data.y);
                } else if (data.type === 'click') {
                    this.simulateClick(data.button, data.action);
                }
            },
            
            moveMouseCursor: function(deltaX, deltaY) {
                this.mouseX = Math.max(10, Math.min(window.innerWidth - 10, this.mouseX + deltaX * 3));
                this.mouseY = Math.max(10, Math.min(window.innerHeight - 10, this.mouseY + deltaY * 3));
                this.updateCursor();
                
                // Dispatch mouse move event
                const event = new MouseEvent('mousemove', {
                    clientX: this.mouseX,
                    clientY: this.mouseY,
                    bubbles: true
                });
                document.dispatchEvent(event);
            },
            
            scrollPage: function(deltaY) {
                if (Math.abs(deltaY) > 0.1) {
                    window.scrollBy({
                        top: deltaY * 20,
                        behavior: 'smooth'
                    });
                }
            },
            
            simulateClick: function(button, action) {
                const eventType = action === 'down' ? 'mousedown' : 
                                 action === 'up' ? 'mouseup' : 'click';
                
                const event = new MouseEvent(eventType, {
                    button: button === 'left' ? 0 : 2,
                    clientX: this.mouseX,
                    clientY: this.mouseY,
                    bubbles: true,
                    cancelable: true
                });
                
                const element = document.elementFromPoint(this.mouseX, this.mouseY);
                if (element) {
                    element.dispatchEvent(event);
                } else {
                    document.dispatchEvent(event);
                }
            },
            
            updateCursor: function() {
                if (this.cursor) {
                    this.cursor.style.left = (this.mouseX - 6) + 'px';
                    this.cursor.style.top = (this.mouseY - 6) + 'px';
                }
            },
            
            destroy: function() {
                this.active = false;
                
                if (this.ws) {
                    this.ws.close();
                    this.ws = null;
                }
                
                if (this.eventSource) {
                    this.eventSource.close();
                    this.eventSource = null;
                }
                
                if (this.indicator) {
                    this.indicator.remove();
                    this.indicator = null;
                }
                
                if (this.cursor) {
                    this.cursor.remove();
                    this.cursor = null;
                }
                
                window.mobileTouchpadController = null;
            }
        };
        
        // Initialize the controller
        window.mobileTouchpadController.init();
    }
    
    // Add utility functions to the global scope
    window.mobileTouchpadUtils = {
        // Get current controller status
        getStatus: function() {
            return window.mobileTouchpadController ? {
                active: window.mobileTouchpadController.active,
                connected: window.mobileTouchpadController.ws && 
                          window.mobileTouchpadController.ws.readyState === WebSocket.OPEN
            } : { active: false, connected: false };
        },
        
        // Get cursor position
        getCursorPosition: function() {
            return window.mobileTouchpadController ? {
                x: window.mobileTouchpadController.mouseX,
                y: window.mobileTouchpadController.mouseY
            } : null;
        },
        
        // Manually trigger a click at current cursor position
        click: function(button = 'left') {
            if (window.mobileTouchpadController) {
                window.mobileTouchpadController.simulateClick(button, 'click');
            }
        }
    };
    
    console.log('Mobile Touchpad Controller content script loaded successfully');
})();