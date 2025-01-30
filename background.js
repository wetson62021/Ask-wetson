chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "ask-weston",
    title: "Ask Weston",
    contexts: ["selection"],
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "ask-weston" && info.selectionText) {
    getGeminiResponse(info.selectionText, tab.id);
  }
});

async function getGeminiResponse(selectedText, tabId) {
  //create a nodejs file that can query an api endpoint in gemini

  const apiUrl = `https://ects-computerprogramming.com/api/googleapis/gemini/?prompt=${encodeURIComponent(
    selectedText
  )}`;

  try {
    const response = await fetch(apiUrl, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch response: ${response.statusText}`);
    }

    const data = await response.json();
    const answer = data.response || "No answer provided";

    chrome.scripting.executeScript({
      target: { tabId: tabId },
      func: (answer) => {
        alert(`Weston Says: ${answer}`);
      },
      args: [answer],
    });
  } catch (error) {
    console.error("Error fetching from Gemini:", error);

    chrome.scripting.executeScript({
      target: { tabId: tabId },
      func: (errorMessage) => {
        alert(`Error: ${errorMessage}`);
      },
      args: [error.message],
    });
  }
}
