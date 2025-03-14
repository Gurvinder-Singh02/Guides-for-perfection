import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';

function App() {
  const [guidesActive, setGuidesActive] = useState(false);

  const toggleGuides = async () => {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    if (!guidesActive) {
      // Show guides
      chrome.scripting.executeScript({
        target: { tabId: tab.id! },
        func: injectDraggableTextarea,
      });
    } else {
      // Hide guides
      chrome.scripting.executeScript({
        target: { tabId: tab.id! },
        func: removeDraggableTextarea,
      });
    }

    setGuidesActive(!guidesActive);
  };

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => changeColorOnClick()}>Change Color</button>
        <button onClick={toggleGuides}>
          {guidesActive ? 'Hide Textarea' : 'Show Textarea'}
        </button>

        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

// Function to inject a draggable and resizable textarea
const injectDraggableTextarea = () => {
  // Check if textarea already exists
  if (document.getElementById('chrome-extension-textarea')) {
    return;
  }

  // Create container
  const container = document.createElement('div');
  container.id = 'chrome-extension-textarea';
  container.style.position = 'fixed';
  container.style.left = '50%';
  container.style.top = '20px';
  container.style.transform = 'translateX(-50%)';
  container.style.zIndex = '10000';
  container.style.background = 'transparent';

  // Create textarea
  const textarea = document.createElement('textarea');
  textarea.style.width = '300px';
  textarea.style.height = '150px';
  textarea.style.padding = '8px';
  textarea.style.border = '2px solid rgba(255, 0, 0, 0.9)';
  textarea.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
  textarea.style.fontSize = '14px';
  textarea.style.resize = 'both';
  textarea.style.overflow = 'auto';
  textarea.value = `Width: ${window.innerWidth}px\nHeight: ${window.innerHeight}px`;

  // Create drag handle
  const dragHandle = document.createElement('div');
  dragHandle.style.width = '100%';
  dragHandle.style.height = '20px';
  dragHandle.style.backgroundColor = 'rgba(255, 0, 0, 0.9)';
  dragHandle.style.cursor = 'move';
  dragHandle.style.position = 'relative';

  // Add title to the drag handle
  const title = document.createElement('div');
  title.textContent = 'Page Dimensions (Drag to Move)';
  title.style.color = 'white';
  title.style.fontSize = '12px';
  title.style.textAlign = 'center';
  title.style.lineHeight = '20px';
  title.style.userSelect = 'none';
  dragHandle.appendChild(title);

  // Update dimensions on resize
  window.addEventListener('resize', () => {
    textarea.value = `Width: ${window.innerWidth}px\nHeight: ${window.innerHeight}px`;
  });

  // Make container draggable
  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;

  dragHandle.addEventListener('mousedown', (e) => {
    isDragging = true;
    const rect = container.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
    container.style.transform = 'none'; // Remove the centering transform when dragging starts
    e.preventDefault();
  });

  document.addEventListener('mousemove', (e) => {
    if (isDragging) {
      container.style.left = `${e.clientX - offsetX}px`;
      container.style.top = `${e.clientY - offsetY}px`;
    }
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
  });

  // Assemble and add to page
  container.appendChild(dragHandle);
  container.appendChild(textarea);
  document.body.appendChild(container);
};

// Function to remove textarea
const removeDraggableTextarea = () => {
  const container = document.getElementById('chrome-extension-textarea');
  if (container) {
    document.body.removeChild(container);
  }
};

const changeColorOnClick = async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id! },
    func: () => {
      document.body.style.backgroundColor = 'green';
    },
  });
};

export default App;
