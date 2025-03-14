import { useState } from 'react';
import { MoveHorizontal, MoveVertical } from 'lucide-react';

function App() {
  const [color, setColor] = useState('#ff0000');
  const [transparent, setTransparent] = useState(true);
  const [height, setHeight] = useState('10%');
  const [width, setWidth] = useState('10%');

  const createGuide = async () => {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    const left = '50%';
    const top = '50%';

    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: injectGuides,
      args: [transparent, color, height, width, top, left],
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
    <main className=" gap-2 pt-5 w-[300px] fcc">
      <h1 className="text-4xl gap-2 fc font-medium tracking-tight">
        <img src="/icons/icon128.png" width={40} alt="icon" /> Guides
      </h1>
      <p className="fcc mb-3 text-center  w-full">
        For the perfectionists <br /> who tweak every Fu*******kin pixels
      </p>

      <div className="w-full gap-2 px-5 fcc">
        <div className="fc gap-1">
          <button onClick={() => setColor('#ff0000')}>Red</button>
          <button onClick={() => setColor('#0000ff')}>blue</button>
          <button onClick={() => setColor('#00E40B')}>Green</button>

          <button
            onClick={() => {
              setTransparent((x) => !x);
            }}
            className={
              !transparent
                ? 'bg-white! text-black! text-nowrap '
                : 'text-nowrap'
            }
          >
            Bg {!transparent ? 'None' : 'fill'}
          </button>
          <button
            className="h-full py-3"
            onClick={() => {
              setWidth(100 + '%');
            }}
          >
            <MoveHorizontal size={15} />
          </button>
          <button
            className="h-full py-3"
            onClick={() => {
              setHeight(100 + '%');
            }}
          >
            <MoveVertical size={15} />
          </button>
        </div>
        <div className="w-full fc  ">
          <input
            type="text"
            placeholder="Color"
            className="h-[37px]"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
          <input
            className="px-0  h-10  "
            value={color}
            type="color"
            onChange={(e) => setColor(e.target.value)}
          />
        </div>
        <div className="flex justify-between w-full mt-3 gap-2">
          Width:{' '}
          <input
            type="range"
            min="0%"
            max="100%"
            value={parseInt(width)}
            onChange={(e) => setWidth(e.target.value + '%')}
          />
        </div>
        <input
          type="text"
          placeholder="Width"
          value={width}
          onChange={(e) => setWidth(e.target.value + '%')}
        />
        <div className="flex justify-between w-full mt-3 gap-2">
          Height:
          <input
            type="range"
            min="0"
            max="100"
            value={parseInt(height)}
            onChange={(e) => setHeight(e.target.value + '%')}
          />
        </div>
        <input
          type="text"
          placeholder="Height"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
        />
        <p className=" text-center opacity-45 text-[10px] ">
          Click to drag The Guide <br />
          Press and Hold ⌘ on corner to resize
        </p>
        <button className="w-full py-2!" onClick={createGuide}>
          Add Resizable Guides
        </button>
        <button className="w-full py-2!" onClick={removeGuide}>
          Remove Last Guide
        </button>
      </div>

      <p className=" mt-7 mb-3 opacity-45 text-[10px] ">
        Created by ⌘ &nbsp;
        <a className="text-blue-500" href="https://gxuri.in">
          © Gxuri
        </a>
      </p>
    </main>
  );
}

function injectGuides(transparent, color, height, width, top, left) {
  const textArea = document.createElement('textarea');
  Object.assign(textArea.style, {
    position: 'fixed',
    left: top || '50%',
    top: left || '50%',
    width: width || '200px',
    height: height || '50px',
    transform: 'translate(-50%, -50%)',
    border: `0.7px solid ${color}`,
    background: !transparent ? 'transparent' : `${color}44`,
    color: !transparent ? 'transparent' : color,
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

  textArea.addEventListener('mousedown', (e: any) => {
    if (!e.metaKey) {
      isDragging = true;
      const rect = textArea.getBoundingClientRect();
      offsetX = e.clientX - rect.left;
      offsetY = e.clientY - rect.top;
    }
  });

  textArea.addEventListener('keydown', (e: any) => {
    if (e.key == 'Alt') {
      console.dir(textArea);
      injectGuides(
        transparent,
        color,
        textArea.offsetHeight + 'px',
        textArea.offsetWidth + 'px',
        Number(textArea.style.top.slice(0, -2)) + 1 + 'px',
        Number(textArea.style.left.slice(0, -2)) + 1 + 'px'
      );
    }
    if (e.key == 'Backspace') {
      textArea.remove();
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

  document.body.appendChild(textArea);
}

function clearGuides() {
  const guides = document.querySelectorAll('textarea');
  const lastGuide = guides[guides.length - 1];

  if (lastGuide) {
    lastGuide.remove();
  }
}

export default App;
