import React, { useContext, useEffect, useState } from 'react';
import { ConfigContext } from '../../../contexts/ConfigContext';
import useWindowSize from '../../../hooks/useWindowSize';

import NavLogo from './NavLogo';
import NavContent from './NavContent';
import navigation from '../../../menu-items';

const Navigation = () => {
  const configContext = useContext(ConfigContext);
  const { collapseMenu } = configContext.state;
  const windowSize = useWindowSize();

  const [idSession, setIdSession] = useState(null);

  // Récupérer l'idSession depuis localStorage
  useEffect(() => {
    const storedIdSession = localStorage.getItem('idSession');
    if (storedIdSession) {
      setIdSession(storedIdSession);
    }
  }, []);


  // Générer le menu dynamique
  const dynamicMenuItems = navigation.items.map((group) => ({
    ...group,
    children: group.children.map((item) => ({
      ...item,
      url: item.url.includes(':idSession')
        ? item.url.replace(':idSession', idSession)
        : item.url,
    })),
  }));

  let navClass = ['pcoded-navbar'];
  if (windowSize.width < 992 && collapseMenu) {
    navClass = [...navClass, 'mob-open'];
  } else if (collapseMenu) {
    navClass = [...navClass, 'navbar-collapsed'];
  }

  let navBarClass = ['navbar-wrapper'];

  let navContent = (
    <div className={navBarClass.join(' ')} style={{ backgroundColor: '#296aa3' }}>
      <NavLogo />
      <NavContent navigation={dynamicMenuItems} />
    </div>
  );

  if (windowSize.width < 992) {
    navContent = (
      <div className="navbar-wrapper">
        <NavLogo />
        <NavContent navigation={dynamicMenuItems} />
      </div>
    );
  }

  return (
    <React.Fragment>
      <nav className={navClass.join(' ')}>{navContent}</nav>
    </React.Fragment>
  );
};

export default Navigation;
