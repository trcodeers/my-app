import React, { useState, useRef } from 'react';
import './panel.css';

function Panel(props) {
  const { menuItems, handleChange, onSearch } = props
  
  const [selectedItemIndex, setSelectedItemIndex] = useState(-1);
  const [displaySuggestions, setDisplaySugestions] = useState(true)
  const [inputValue, setInputValue] = useState('')
  const menuRef = useRef(null);
  const menuItemRefs = useRef([]);

  const handleInput = (event) => {
    const input = event.target;
  
    if (event.key === 'ArrowUp') {
      event.preventDefault(); // Prevents cursor from moving to the beginning of the input field
      if (selectedItemIndex > 0) {
        setSelectedItemIndex(selectedItemIndex - 1);
        scrollSelectedItemIntoView(selectedItemIndex - 1);
      }
    } else if (event.key === 'ArrowDown') {
      event.preventDefault(); // Prevents cursor from moving to the end of the input field
      if (selectedItemIndex < menuItems.length - 1) {
        setSelectedItemIndex(selectedItemIndex + 1);
        scrollSelectedItemIntoView(selectedItemIndex + 1);
      }
    }
    else if (event.key === 'Enter') {
        console.log('Enter', input.value)
        onSearch(input.value)
        input.blur()
    }
  };
  

  const onClickItem = (item) =>{
    setInputValue(item)
    console.log('item', item)
    setDisplaySugestions(false)
    onSearch(item)
  }

  const inputChange = (e) =>{
    setInputValue(e.target.value)
    handleChange(e)
  }

  const scrollSelectedItemIntoView = (index) => {
    if (menuRef.current && menuItemRefs.current[index]) {
      const selectedMenuItemRef = menuItemRefs.current[index];
      const menuContainer = menuRef.current;
      const menuItemTop = selectedMenuItemRef.offsetTop;
      const menuItemBottom = selectedMenuItemRef.offsetTop + selectedMenuItemRef.offsetHeight;
      const menuContainerTop = menuContainer.scrollTop;
      const menuContainerBottom = menuContainerTop + menuContainer.offsetHeight;

      if (menuItemTop < menuContainerTop) {
        menuContainer.scrollTop = menuItemTop;
      } else if (menuItemBottom > menuContainerBottom) {
        menuContainer.scrollTop = menuItemBottom - menuContainer.offsetHeight;
      }
    }
  };

  return (
    <div>
      <input
        placeholder='Search here...'
        style={{ width: '255px', height: '35px', borderRadius: '1%', }} 
        type="text" 
        onChange={inputChange}
        value={inputValue}
        onKeyUp={handleInput}
        onFocus={() => setDisplaySugestions(true)}
        // onBlur={() => setDisplaySugestions(false)}
      />
      {menuItems && displaySuggestions && <div ref={menuRef} className='menu-list'>
        {menuItems.map((item, index) => (
          <div
          ref={(ref) => {
            menuItemRefs.current[index] = ref;
          }}
            onClick={() => onClickItem(item)}
            key={index}
            className={(index === selectedItemIndex ? 'selected' : '') + ' menu-item'}
          >
            {item}
          </div>
        ))}
      </div>}
    </div>
  );
}

export default Panel;
