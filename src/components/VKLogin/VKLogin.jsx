import React from 'react';
import UserInfo from '@/components/UserInfo';
import FriendList from '@/components/FriendList';
import Header from '@/components/Header';

class VKLogin extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loggedStatus: false,
      userID: '',
      firstName: '',
      lastName: '',
      friendList: [],
      friendCount: '',
      online: false,
      errorMessage: '',
      userPicURL400: '',
      userPicURL200: '',
      userPicURLMax: '',
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
          this.setState({
            errorMessage: '',
            loggedStatus: true,
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
    window.VK.Auth.logout(() => {
      this.setState({
        loggedStatus: false,
      });
    });
  };

  getPersonalData = () => {
    window.VK.Api.call(
      'users.get',
      {
        user_ids: this.state.userID,
        fields: 'photo_200_orig,photo_400_orig,photo_max,online',
        v: '5.95',
      },
      r => {
        if (r.response) {
          this.setState({
            userPicURL400: r.response[0].photo_400_orig,
            userPicURL200: r.response[0].photo_200_orig,
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
        fields: 'first_name,last_name,photo_100',
        name_case: 'nom',
        v: '5.95',
      },
      r => {
        if (r.response) {
          this.setState({
            friendList: r.response.items,
            count: r.response.count,
          });
        }
      }
    );
  };

  render() {
    return (
      <>
        <div id="vk_api_transport" />
        <Header
          isLogged={this.state.loggedStatus}
          login={this.handleLogin}
          logout={this.handleLogout}
        />
        {this.state.loggedStatus ? (
          <>
            <UserInfo
              picture200={this.state.userPicURL200}
              picture400={this.state.userPicURL400}
              pictureMax={this.state.userPicURLMax}
              online={this.state.online}
              firstName={this.state.firstName}
              lastName={this.state.lastName}
            />
            <FriendList
              friendList={this.state.friendList}
              count={this.state.count}
            />
          </>
        ) : (
          <h3>Please, log in</h3>
        )}
        {this.state.errorMessage && <p className="text-danger">{this.state.errorMessage}</p>}
      </>
    );
  }
}

export default VKLogin;
