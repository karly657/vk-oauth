import React from 'react';
import './styles.css';

const UserInfo = ({
  firstName,
  lastName,
  online,
  picture200,
  picture400,
  pictureMax,
}) => {
  return (
    <>
      <div className="circle">
        <div className="row d-flex justify-content-center">
          <img
            srcset={`${picture200} 200w,
              ${picture400} 400w,
              ${pictureMax}`}
            sizes="(max-width: 320px) 200px,
              (max-width: 480px) 400px,
              800px"
            src={pictureMax}
            alt="user pic"
            className="rounded-circle user-pic"
          />
        </div>
      </div>

      <div className="text-center user-info">
        <p className="mb-n1 font-weight-bold">
          {firstName} {lastName}
        </p>
        <p className="text-black-50">{online ? 'Online' : 'Offline'}</p>
      </div>
    </>
  );
};

export default UserInfo;
