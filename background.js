// background.js - Creates the right-click menu
chrome.runtime.onInstalled.addListener(() => {
  console.log('Quick Text Tools installed!');
  
  // Create menu items
  const menuItems = [
    { id: 'uppercase', title: 'Convert to UPPERCASE' },
    { id: 'lowercase', title: 'Convert to lowercase' },
    { id: 'titlecase', title: 'Convert to Title Case' },
    { id: 'wordcount', title: 'Count Words' },
    { id: 'copyplain', title: 'Copy as Plain Text' }
  ];

  menuItems.forEach(item => {
    chrome.contextMenus.create({
      id: item.id,
      title: item.title,
      contexts: ['selection'] // Only show when text is selected
    });
  });
});

// Listen for menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  // Send message to content.js with the action and selected text
  chrome.tabs.sendMessage(tab.id, {
    action: info.menuItemId,
    text: info.selectionText
  });
});