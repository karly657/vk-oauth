import React from 'react';

const FriendList = ({ friendList, count }) => {
  const friends = friendList.map(fr => (
    <div className="col-11 col-md-5 col-lg-4 border border-white" key={fr.id}>
      <div className="row border border-white shadow-sm bg-white">
        <div className="col-4 p-0">
          <img src={fr.photo_100} alt="" className="border" />
        </div>
        <div className="col">
          <p className="font-weight-bold">
            {fr.first_name} {fr.last_name}
          </p>
          <p className="text-black-50">{fr.online ? 'Online' : 'Offline'}</p>
        </div>
      </div>
    </div>
  ));
  return (
    <div className="container">
      <div className="row justify-content-center">
      <div className="text-uppercase row mb-1">Friends ({count})</div>
      <div className="row justify-content-center">{friends}</div>
      
      </div>
    </div>
  );
};

export default FriendList;
