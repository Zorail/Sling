import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { css, StyleSheet } from 'aphrodite';
import PropTypes from 'prop-types';
import { fetchRooms, createRoom, joinRoom } from '../../actions/rooms';
import Navbar from '../../components/Navbar';
import NewRoomForm from '../../components/NewRoomForm';
import RoomListItem from '../../components/RoomListItem';

const styles = StyleSheet.create({
  card: {
    maxWidth: '500px',
    padding: '3rem 4rem',
    margin: '2rem auto',
  },
});


class Home extends React.Component {
  componentDidMount() {
    const { fetchUserRooms } = this.props;
    fetchUserRooms();
  }

  handleNewRoomSubmit = (data) => {
    const { createUserRoom } = this.props;
    createUserRoom(data);
  };

  handleRoomJoin = (roomId) => {
    const { userJoinRoom } = this.props;
    userJoinRoom(roomId);
  }


  renderRooms = () => {
    const currentUserRoomIds = [];
    const { currentUserRooms, rooms } = this.props;
    currentUserRooms.map(room => currentUserRoomIds.push(room.id));

    return rooms.map(room => (
      <RoomListItem
        key={room.id}
        room={room}
        currentUserRoomIds={currentUserRoomIds}
      />
    ));
  }

  render() {
    return (
      <div style={{ flex: '1' }}>
        <Navbar />
        <div className={`card ${css(styles.card)}`}>
          <h3 style={{ marginBottom: '2rem', textAlign: 'center' }}>Create a new room</h3>
          <NewRoomForm onSubmit={this.handleNewRoomSubmit} />
        </div>
        <div className={`card ${css(styles.card)}`}>
          <h3 style={{ marginBottom: '2rem', textAlign: 'center' }}>Join a room</h3>
          {this.renderRooms()}
        </div>
      </div>
    );
  }
}

Home.defaultProps = {
  isAuthenticated: false,
  currentUser: {},
  currentUserRooms: [],
  rooms: [],
};

Home.propTypes = {
  isAuthenticated: PropTypes.bool,
  currentUser: PropTypes.instanceOf(Object),
  currentUserRooms: PropTypes.instanceOf(Array),
  rooms: PropTypes.instanceOf(Array),
  fetchUserRooms: PropTypes.func.isRequired,
  createUserRoom: PropTypes.func.isRequired,
  userJoinRoom: PropTypes.func.isRequired,
};

export default withRouter(connect(
  state => ({
    isAuthenticated: state.session.isAuthenticated,
    currentUser: state.session.currentUser,
  }),
  {
    createUserRoom: createRoom,
    fetchUserRooms: fetchRooms,
    userJoinRoom: joinRoom,
  },
)(Home));
