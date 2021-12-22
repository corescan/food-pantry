import { Component } from 'react';
import css from './Paginator.module.css';

const getPageCount = (props) => {
  return Math.ceil(props.items.length / props.itemsPerPage);
}

export default class Paginator extends Component {
  constructor() {
    super();
    this.state = {
      currentPage: 1,
      inputVal: 1
    };

    this.handleInput = this.handleInput.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.setPageFromInput = this.setPageFromInput.bind(this);
  }

  static getDerivedStateFromProps(props, state) {
    // check that currentPage is still valid page
    const pageCount = getPageCount(props);
    if (pageCount > 0 && state.currentPage > pageCount) {
      return {
        ...state,
        currentPage: pageCount,
        inputVal: pageCount
      };
    }

    // Return null to indicate no change to state.
    return null;
  }

  handlePagerClick(direction) {
    const page = this.state.currentPage + direction;
    if (page > getPageCount(this.props) || page < 1) {
      return;
    }
    this.setState({
      currentPage: page,
      inputVal: page
    });
  }

  handleKeyDown(event) {
    if (event.keyCode === 13) {
      this.setPageFromInput();
    }
  }

  handleFocus(event) {
    event.target.select();
  }

  handleBlur() {
    this.setPageFromInput(true);
  }

  setPageFromInput(resetInput) {
    const val = Number(this.state.inputVal);
    if (isNaN(val) || val > getPageCount(this.props) || val < 1) {
      if (resetInput) {
        this.setState({
          inputVal: this.state.currentPage
        })
      }
      return;
    }
    this.setState({
      currentPage: val
    });
  }

  handleInput(event) {
    const input = event.target.value;
    this.setState({
      inputVal: input
    });
  }

  render() {
    const { currentPage, inputVal } = this.state;
    const { items, itemsPerPage } = this.props;

    // Logic for displaying items
    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const visibleItems = items.slice(indexOfFirst, indexOfLast);

    const renderItems = visibleItems.map((item, index) => {
      return this.props.renderItem(item, index);
    });

    const pageCount = getPageCount(this.props);
    const handlePrev = this.handlePagerClick.bind(this,-1);
    const handleNext = this.handlePagerClick.bind(this,1);

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
                    onChange={this.handleInput}
                    onKeyDown={this.handleKeyDown}
                    onFocus={this.handleFocus}
                    onBlur={this.handleBlur}
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
}

Paginator.defaultProps = {
  items: [],
  itemsPerPage: 10,
  renderItem: (item,index) => <li key={index}>{item}</li>
}