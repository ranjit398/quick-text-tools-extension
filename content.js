// content.js - Does the actual work
let floatingPanel = null;

// Listen for messages from background.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const { action, text } = request;
  
  switch(action) {
    case 'uppercase':
      replaceSelection(text.toUpperCase());
      break;
    case 'lowercase':
      replaceSelection(text.toLowerCase());
      break;
    case 'titlecase':
      replaceSelection(toTitleCase(text));
      break;
    case 'wordcount':
      const words = countWords(text);
      showFloatingPanel(`Words: ${words} | Characters: ${text.length}`);
      break;
    case 'copyplain':
      copyPlainText(text);
      break;
  }
});

// Replace selected text with new text
function replaceSelection(newText) {
  const selection = window.getSelection();
  if (selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    range.deleteContents();
    range.insertNode(document.createTextNode(newText));
  }
  showFloatingPanel('Text updated!', 'success');
}

// Convert text to Title Case
function toTitleCase(str) {
  return str.toLowerCase().split(' ').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
}

// Count words in text
function countWords(text) {
  return text.trim().split(/\s+/).filter(w => w.length > 0).length;
}

// Copy text without formatting
function copyPlainText(text) {
  navigator.clipboard.writeText(text).then(() => {
    showFloatingPanel('Copied as plain text!', 'success');
  });
}

// Show floating notification panel
function showFloatingPanel(message, type = 'info') {
  // Remove old panel if exists
  if (floatingPanel) floatingPanel.remove();
  
  // Create new panel
  floatingPanel = document.createElement('div');
  floatingPanel.className = `qt-floating-panel qt-${type}`;
  floatingPanel.innerHTML = message;
  document.body.appendChild(floatingPanel);
  
  // Auto-hide after 3 seconds
  setTimeout(() => {
    if (floatingPanel) {
      floatingPanel.style.opacity = '0';
      setTimeout(() => floatingPanel?.remove(), 300);
    }
  }, 3000);
}