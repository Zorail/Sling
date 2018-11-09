import React from 'react';
import moment from 'moment';
import groupBy from 'lodash/groupBy';
import mapKeys from 'lodash/mapKeys';
import { css, StyleSheet } from 'aphrodite';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import Message from '../Message';

const styles = StyleSheet.create({
  container: {
    flex: '1',
    padding: '10px 10px 0 10px',
    background: '#fff',
    overflowY: 'auto',
  },

  dayDivider: {
    position: 'relative',
    margin: '1rem 0',
    textAlign: 'center',
    '::after': {
      position: 'absolute',
      top: '50%',
      right: '0',
      left: '0',
      height: '1px',
      background: 'rgb(240,240,240)',
      content: '""',
    },
  },

  dayText: {
    zIndex: '1',
    position: 'relative',
    background: '#fff',
    padding: '0 12px',
  },
});

class MessageList extends React.Component {
  constructor(props) {
    super(props);
    this.container = React.createRef();
    this.handleScroll = debounce(this.handleScroll, 200);
  }

  componentDidMount() {
    this.container.current.addEventListener('scroll', this.handleScroll);
  }

  componentWillReceiveProps(nextProps) {
    const { messages } = this.props;
    if (messages.length !== nextProps.messages.length) {
      this.maybeScrollToBottom();
    }
  }

  componentWillUnmount() {
    this.container.current.removeEventListener('scroll', this.handleScroll);
  }

  maybeScrollToBottom = () => {
    if (this.container.current.scrollHeight - this.container.current.scrollTop < this.container.current.clientHeight + 50) {
      this.scrollToBottom();
    }
  }

  scrollToBottom = () => {
    setTimeout(() => {
      this.container.current.scrollTop = this.container.current.scrollHeight;
    });
  }

  handleScroll = () => {
    const { moreMessages } = this.props;
    if (moreMessages && this.container.current.scrollTop < 20) {
      const { onLoadMore } = this.props;
      onLoadMore();
    }
  }

  renderMessages = messages => messages.map(message => <Message key={message.id} message={message} />);

  renderDays = () => {
    const { messages } = this.props;
    messages.map((message) => {
      message.day = moment(message.inserted_at).format('MMMM do');
      return message;
    });
    const dayGroups = groupBy(messages, 'day');
    const days = [];
    mapKeys(dayGroups, (value, key) => {
      days.push({ date: key, messages: value });
    });
    const today = moment().format('MMMM Do');
    const yesterday = moment().subtract(1, 'days').format('MMMM Do');
    return days.map(day => (
      <div key={day.date}>
        <div className={css(styles.dayDivider)}>
          <span className={css(styles.dayText)}>
            {day.date === today && 'Today'}
            {day.date === yesterday && 'Yesterday'}
            {![today, yesterday].includes(day.date) && day.date}
          </span>
        </div>
        {this.renderMessages(day.messages)}
      </div>
    ));
  }

  render() {
    const { moreMessages, loadingOlderMessages, onLoadMore } = this.props;
    return (
      <div className={css(styles.container)} ref={this.container}>
        {moreMessages && (
          <div style={{ textAlign: 'center' }}>
            <button
              type="button"
              className="btn btn-link btn-sm"
              onClick={onLoadMore}
              disabled={loadingOlderMessages}
            >
              {loadingOlderMessages ? 'Loading' : 'Load more'}
            </button>
          </div>
        )}
        {this.renderDays()}
      </div>
    );
  }
}

MessageList.defaultProps = {
  messages: [],
  loadingOlderMessages: false,
  moreMessages: false,
};

MessageList.propTypes = {
  messages: PropTypes.instanceOf(Array),
  onLoadMore: PropTypes.func.isRequired,
  loadingOlderMessages: PropTypes.bool,
  moreMessages: PropTypes.bool,
};

export default MessageList;
