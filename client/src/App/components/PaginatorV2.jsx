import React, { useState, useEffect } from 'react';
import useKeyPress from '../../lib/hooks/useKeyPress';
import css from './Paginator.module.css';

export default function Paginator({ items, itemsPerPage, renderItem }) {
  const [ currentPage, setCurrentPage ] = useState(1);
  const [ inputVal, setInputVal ] = useState('1');
  const leftPress = useKeyPress("ArrowLeft");
  const rightPress = useKeyPress("ArrowRight");
  const pageCount = Math.ceil(items.length / itemsPerPage)

  // assert currentPage is compatible with pageCount = (items/itemsPerPage);
  useEffect(() => {
    if (pageCount > 0 && currentPage > pageCount) {
      setCurrentPage(pageCount);
      setInputVal(pageCount);
    }
  }, [pageCount, currentPage]);

  // Left arrow button
  useEffect(() => {
    if (currentPage > 1 && leftPress) {
      const page = currentPage - 1;
      setCurrentPage(page);
      setInputVal(page);
    }
  }, [leftPress]);

  // right arrow button
  useEffect(() => {
    if (currentPage < pageCount && rightPress) {
      const page = currentPage + 1;
      setCurrentPage(page);
      setInputVal(page);
    }
  }, [rightPress]);

  const handlePageTurn = (direction) => {
    const page = currentPage + direction;
    if (page > pageCount || page < 1) {
      return;
    }
    setCurrentPage(page);
    setInputVal(page);
  }

  const handleKeyDown = ev => {
    if (ev.keyCode === 13) {
      setPageFromInput();
    }
  }
  const handleInput = ev => setInputVal(ev.target.value);
  const handleFocus = (ev) => ev.target.select();
  const handleBlur = () => setPageFromInput(true);
  const setPageFromInput = resetInput => {
    const val = Number(inputVal);
    if (isNaN(val) || val > pageCount || val < 1) {
      if (resetInput) {
        setInputVal(currentPage);
      }
      return;
    }
    setCurrentPage(val);
  }

  // Logic for displaying items
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const visibleItems = items.slice(indexOfFirst, indexOfLast);

  const renderItems = visibleItems.map((item, index) => {
    return renderItem(item, index);
  });

  const handlePrev = handlePageTurn.bind(this,-1);
  const handleNext = handlePageTurn.bind(this,1);

  return (
    <div className={css.container}>
      {pageCount? 
        <>
          <ul>
            {renderItems}
          </ul>
          <div className={css.page_controls}>
            <div className={css.page_display}>
              {`page ${currentPage} of ${pageCount}`}
            </div>
            <ul id="page-numbers" className={css.button_container}>
              <li
                onClick={handlePrev}
                className={css.pager_button}
              >
                {'<'}
              </li>
              <li className={css.page_input_wrap}>
                <input
                  value={inputVal}
                  onChange={handleInput}
                  onKeyDown={handleKeyDown}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  className={css.page_input}
                />
              </li>
              <li
                onClick={handleNext}
                className={css.pager_button}
              >
                {'>'}
              </li>
            </ul>
          </div>
        </>
        : void 0}
    </div>
  );
}

Paginator.defaultProps = {
  items: [],
  itemsPerPage: 10,
  renderItem: (item,index) => <li key={index}>{item}</li>
}