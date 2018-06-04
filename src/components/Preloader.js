import React from 'react';

const Preloader = () => (
  <div className="preloader-wrapper small active">
    <div className="spinner-layer spinner-green-only">
      <div className="circle-clipper left">
        <div className="circle">&nbsp;</div>
      </div>
      <div className="gap-patch">
        <div className="circle">&nbsp;</div>
      </div>
      <div className="circle-clipper right">
        <div className="circle">&nbsp;</div>
      </div>
    </div>
  </div>
);

export default Preloader;