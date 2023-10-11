import React from 'react';

import Header from '../../components/header/Header';

type IProps = {
  children: any;
};

const AppLayout: React.FC<IProps> = (props) => {
  return (
    <div className="app">
      <Header />
      <main className="app__content">{props.children}</main>
      <footer>Footer</footer>
    </div>
  );
};

export default AppLayout;
