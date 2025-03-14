import { useState } from 'react';
import './App.css';

function App() {
  const [color, setColor] = useState('red');
  const [height, setHeight] = useState('100px');
  const [width, setWidth] = useState('100px');

  const createGuide = async () => {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: injectGuides,
      args: [color, height, width],
    });
  };
  const removeGuide = async () => {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: clearGuides,
    });
  };

  return (
    <main>
      <h1>Guides</h1>
      <p style={{ marginTop: '-20px' }}>
        For the perfectionists <br /> who tweak every Fu***kin pixels
      </p>

      <div
        className="card main"
        style={{
          width: '220px',
          height: '300px',
          margin: '0 auto',
        }}
      >
        <div style={{ display: 'flex', gap: '3px' }}>
          <button onClick={() => setColor('red')}>Red</button>
          <button onClick={() => setColor('blue')}>blue</button>
          <button onClick={() => setColor('limegreen')}>Green</button>

          <button
            onClick={() => {
              setColor('01');
              setHeight('100px');
              setWidth('97%');
            }}
          >
            01
          </button>
          <button
            onClick={() => {
              setColor('02');
              setWidth('100px');
              setHeight('97%');
            }}
          >
            02
          </button>
        </div>
        <input
          type="text"
          placeholder="Color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />
        Width:
        <input
          type="text"
          placeholder="Width"
          value={width}
          onChange={(e) => setWidth(e.target.value)}
        />
        Height:
        <input
          type="text"
          placeholder="Height"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
          style={{ marginBottom: '15px' }}
        />
        <button onClick={createGuide}>Add Resizable Guides</button>
        <button onClick={removeGuide}>Remove Last Guide</button>
      </div>

      <p className="read-the-docs">
        Extension Created by <a href="https://gxuri.in">© Gxuri</a>
      </p>
    </main>
  );
}

function injectGuides(color, height, width) {
  const guidesContainer = document.createElement('div');
  guidesContainer.id = 'guidesContainer';
  Object.assign(guidesContainer.style, {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    background: 'transparent',
    zIndex: '9999',
  });

  const textArea = document.createElement('textarea');
  Object.assign(textArea.style, {
    position: 'fixed',
    left: '50%',
    top: '50%',
    width: width || '200px',
    height: height || '50px',
    transform: 'translate(-50%, -50%)',
    border: `0.7px solid ${
      color === '01' ? 'red' : color === '02' ? 'green' : color
    }`,
    background:
      color === 'red'
        ? 'rgba(255, 0, 0, 0.1)'
        : color === 'blue'
        ? 'rgba(0, 0,255, 0.1)'
        : color === 'green'
        ? 'rgba(0, 255, 0, 0.1)'
        : 'transparent',
    color:
      color == '01' ? 'transparent' : color == '02' ? 'transparent' : color,
    fontSize: '10px',
    pointerEvents: 'auto',
    cursor: 'move',
    zIndex: '10000',
    resize: 'both',
    outline: 'none',
  });

  textArea.value = `Width: ${textArea.clientWidth}px\nHeight: ${textArea.clientHeight}px`;

  let isDragging = false,
    offsetX = 0,
    offsetY = 0;

  textArea.addEventListener('mousedown', (e) => {
    if (!e.metaKey) {
      isDragging = true;
      const rect = textArea.getBoundingClientRect();
      offsetX = e.clientX - rect.left;
      offsetY = e.clientY - rect.top;
    }
  });

  document.addEventListener('mousemove', (e) => {
    if (isDragging) {
      textArea.style.left = `${e.clientX - offsetX}px`;
      textArea.style.top = `${e.clientY - offsetY}px`;
      textArea.style.transform = 'none';
    }
  });

  document.addEventListener('mouseup', () => (isDragging = false));

  const observer = new ResizeObserver((entries) => {
    for (const entry of entries) {
      textArea.value = `Width: ${entry.contentRect.width}px\nHeight: ${entry.contentRect.height}px`;
    }
  });

  observer.observe(textArea);

  guidesContainer.appendChild(textArea);
  document.body.appendChild(guidesContainer);
}

function clearGuides() {
  const guides = document.querySelectorAll('#guidesContainer');
  const lastGuide = guides[guides.length - 1];

  if (lastGuide) {
    lastGuide.remove();
  }
}

export default App;
