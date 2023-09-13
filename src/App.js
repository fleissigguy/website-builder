import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [elements, setElements] = useState([]);
  const [editing, setEditing] = useState(null); 
  const [coords, setCoords] = useState({ x: 0, y: 0 }); 
  const [isLocked, setIsLocked] = useState(false); // New state for lock mode
  const inputRef = useRef(null);
  const previewBoxRef = useRef(null);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editing]);

  const addElement = (type) => {
    setElements(prev => [...prev, { type, value: getDefault(type), position: {...coords} }]);
  };


  const getDefault = (type) => {
    switch (type) {
      case 'h1': return 'Sample H1';
      case 'p': return 'Sample Paragraph';
      case 'a': return { text: 'Sample Link', url: '#' };
      case 'ul': return ['Item 1', 'Item 2', 'Item 3'];
      case 'img': return "https://via.placeholder.com/150";
      default: return '';
    }
  };

  const handleSave = () => {
    setElements(prevElements => {
      const newElements = [...prevElements];
      newElements[editing.index].value = editing.value;
      newElements[editing.index].position = {...coords};
      return newElements;
    });
    setEditing(null);
  };

  // This function adjusts the coordinates only if the click is within the preview box
  const handlePosition = (event) => {
    if (previewBoxRef.current && previewBoxRef.current.contains(event.target)) {
      const bounds = previewBoxRef.current.getBoundingClientRect();
      setCoords({ x: event.clientX - bounds.left, y: event.clientY - bounds.top });
    }
  };

  return (
    <div className="App">
      <div className="controls-box">
        <label>X: <input type="number" value={coords.x} onChange={(e) => setCoords({...coords, x: parseInt(e.target.value)})} /></label>
        <label>Y: <input type="number" value={coords.y} onChange={(e) => setCoords({...coords, y: parseInt(e.target.value)})} /></label>
        <button onClick={() => addElement('h1')}>Add H1</button>
        <button onClick={() => addElement('p')}>Add Paragraph</button>
        <button onClick={() => addElement('a')}>Add Link</button>
        <button onClick={() => addElement('ul')}>Add List</button>
        <button onClick={() => addElement('img')}>Add Image</button>
        <button onClick={() => setIsLocked(!isLocked)}>
          {isLocked ? 'Unlock Editor' : 'Lock Editor'}
        </button>
      </div>

      <div className="preview-box" onClick={isLocked ? null : handlePosition} ref={previewBoxRef}>
        {elements.map((el, index) => {
          return (
            <div 
              key={index}
              style={{ position: 'absolute', left: `${el.position.x}px`, top: `${el.position.y}px` }}
              onClick={isLocked ? null : () => {
                setEditing({ index, value: el.value, type: el.type });
                setCoords(el.position);
              }}
            >

              {el.type === 'h1' && <h1>{el.value}</h1>}
              {el.type === 'p' && <p>{el.value}</p>}
              {el.type === 'a' && <a href={el.value.url}>{el.value.text}</a>}
              {el.type === 'ul' && <ul>{el.value.map((item, i) => <li key={i}>{item}</li>)}</ul>}
              {el.type === 'img' && <img src={el.value} alt="Preview" />}
            </div>
          );
        })}
      </div>

      {editing && (
        <div className="editing-modal">
          <div>
            <label>X: <input type="number" value={coords.x} onChange={(e) => setCoords({...coords, x: parseInt(e.target.value)})} /></label>
            <label>Y: <input type="number" value={coords.y} onChange={(e) => setCoords({...coords, y: parseInt(e.target.value)})} /></label>
          </div>
          {['h1', 'p', 'img'].includes(editing.type) && (
            <input 
              ref={inputRef} 
              value={editing.value} 
              onChange={e => setEditing(prev => ({ ...prev, value: e.target.value }))}
            />
          )}
          {editing.type === 'a' && (
            <div>
              <input 
                ref={inputRef} 
                value={editing.value.text} 
                onChange={e => setEditing(prev => ({ ...prev, value: { ...prev.value, text: e.target.value } }))}
              />
              <input 
                value={editing.value.url} 
                onChange={e => setEditing(prev => ({ ...prev, value: { ...prev.value, url: e.target.value } }))}
              />
            </div>
          )}
          {editing.type === 'ul' && (
            <div>
              {editing.value.map((item, idx) => (
                <input 
                  key={idx}
                  ref={inputRef}
                  value={item}
                  onChange={e => {
                    const newList = [...editing.value];
                    newList[idx] = e.target.value;
                    setEditing(prev => ({ ...prev, value: newList }));
                  }}
                />
              ))}
            </div>
          )}
          <button onClick={handleSave}>Save</button>
        </div>
      )}
    </div>
  );
}

export default App;
