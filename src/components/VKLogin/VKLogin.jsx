import React from 'react';

class VKLogin extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loggedStatus: false,
      userID: '',
      firstName: '',
      lastName: '',
      friendList: [],
      online: false,
      errorMessage: '',
    };
  }

  componentDidMount() {
    window.vkAsyncInit = () => {
      window.VK.init({
        apiId: 7031686,
      });

      window.VK.Observer.subscribe('auth.statusChange', response => {
        this.statusChangeCallback(response);
      });
      this.checkLoginStatus();
    };

    setTimeout(() => {
      var el = document.createElement('script');
      el.type = 'text/javascript';
      el.src = 'https://vk.com/js/api/openapi.js?161';
      el.async = true;
      document.getElementById('vk_api_transport').appendChild(el);
    }, 0);
  }

  statusChangeCallback = response => {
    if (response.status === 'connected') {
      console.log(response);
      this.setState({
        loggedStatus: true,
        userID: response.session.mid,
      });
      this.getPersonalData();
      this.getFriends();
    } else {
      this.setState({
        loggedStatus: false,
      });
    }
  };

  checkLoginStatus = () => {
    window.VK.Auth.getLoginStatus(response =>
      this.statusChangeCallback(response)
    );
  };

  handleLogin = () => {
    window.VK.Auth.login(
      response => {
        if (response.session) {
          console.log(response);
          this.setState({
            errorMessage: '',
          });
        } else {
          this.setState({
            errorMessage: 'User clicked Cancel in the login window.',
          });
        }
      },
      [window.VK.access.FRIENDS]
    );
  };

  handleLogout = () => {
    window.VK.Auth.logout();
  };

  getPersonalData = () => {
    window.VK.Api.call(
      'users.get',
      {
        user_ids: this.state.userID,
        fields: 'photo_100,online',
        v: '5.95',
      },
      r => {
        if (r.response) {
          this.setState({
            picture: r.response[0].photo_100,
            firstName: r.response[0].first_name,
            lastName: r.response[0].last_name,
            online: r.response[0].online,
          });
        }
      }
    );
  };

  getFriends = () => {
    window.VK.Api.call(
      'friends.get',
      {
        user_ids: this.state.userID,
        order: 'hints',
        fields: 'first_name,last_name',
        name_case: 'nom',
        count: '10',
        v: '5.95',
      },
      r => {
        if (r.response) {
          this.setState({
            friendList: r.response.items,
          });
        }
      }
    );
  };

  showData = () => {
    if (this.state.loggedStatus) {
      const friends = this.state.friendList.map(friend => {
        const fullName = `${friend.first_name} ${friend.last_name}`;
        return <li key={friend.id}>{fullName}</li>;
      });
      const fullName = `${this.state.firstName} ${this.state.lastName}`;

      return (
        <div className="row">
          <div className="col-auto">
            <img
              className="img-thumbnail"
              src={this.state.picture}
              alt="avatar"
              width="300"
            />
          </div>
          <div className="col">
            <h3>{fullName}</h3>
            {this.state.online ? <p>Online</p> : <p>Offline</p>}
            <ul className="list-unstyled">{friends}</ul>
          </div>
        </div>
      );
    }
  };

  render() {
    return (
      <>
        <div id="vk_api_transport" />
        <div>{this.showData()}</div>
        {this.state.loggedStatus ? (
          <button className="btn btn-primary" onClick={this.handleLogout}>
            Logout
          </button>
        ) : (
          <button className="btn btn-primary" onClick={this.handleLogin}>
            Login
          </button>
        )}
        {this.state.errorMessage ? <p>{this.state.errorMessage}</p> : (null)}
      </>
    );
  }
}

export default VKLogin;
