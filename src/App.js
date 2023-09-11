import React, { useState, useEffect, useRef } from 'react';
import './App.css';


function App() {
  const [elements, setElements] = useState([]);
  const [editing, setEditing] = useState(null); // Unified editing state
  const inputRef = useRef(null);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editing]);

  const addElement = (type) => {
    setElements(prev => [...prev, { type, value: getDefault(type) }]);
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
      return newElements;
    });
    setEditing(null);
  };

  const generateHTML = () => {
    return elements.map(el => {
      switch (el.type) {
        case 'h1': return `<h1>${el.value}</h1>`;
        case 'p': return `<p>${el.value}</p>`;
        case 'a': return `<a href="${el.value.url}">${el.value.text}</a>`;
        case 'ul': return `<ul>${el.value.map(item => `<li>${item}</li>`).join('')}</ul>`;
        case 'img': return `<img src="${el.value}" alt="User uploaded image">`;
        default: return '';
      }
    }).join('');
  }

  const downloadHTML = () => {
    const blob = new Blob([generateHTML()], { type: 'text/html' });
    const href = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    link.download = 'website.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  
  

  return (
    <div className="App">
      <div className="controls-box">
            <button onClick={() => addElement('h1')}>Add H1</button>
            <button onClick={() => addElement('p')}>Add Paragraph</button>
            <button onClick={() => addElement('a')}>Add Link</button>
            <button onClick={() => addElement('ul')}>Add List</button>
            <button onClick={() => addElement('img')}>Add Image</button>
            <button onClick={downloadHTML}>Download Website</button>
        </div>

      <div className="preview-box">
        {elements.map((el, index) => {
          switch (el.type) {
            case 'h1':
            case 'p':
              return (
                <div key={index} onClick={() => setEditing({ index, value: el.value, type: el.type })}>
                  {el.value}
                </div>
              );
            case 'a':
              return (
                <a key={index} href={el.value.url} onClick={() => setEditing({ index, value: el.value, type: el.type })}>
                  {el.value.text}
                </a>
              );
            case 'ul':
              return (
                <ul key={index} onClick={() => setEditing({ index, value: el.value, type: el.type })}>
                  {el.value.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              );
            case 'img':
              return (
                <img key={index} src={el.value} alt="Preview" onClick={() => setEditing({ index, value: el.value, type: el.type })} />
              );
            default:
              return null;
          }
        })}
      </div>

      {editing && (
        <div className="editing-modal">
          {editing.type === 'h1' && (
            <input 
              ref={inputRef}
              value={editing.value}
              onChange={e => setEditing(prev => ({ ...prev, value: e.target.value }))}
            />
          )}
          {editing.type === 'p' && (
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
          {editing.type === 'img' && (
            <input 
              ref={inputRef}
              value={editing.value}
              onChange={e => setEditing(prev => ({ ...prev, value: e.target.value }))}
            />
          )}
          <button onClick={handleSave}>Save</button>
        </div>
      )}
    </div>
  );
}

export default App;
