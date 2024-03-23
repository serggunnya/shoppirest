import React from 'react';

import CategoriesList from '../categoriesList/CategoriesList';
import CategoryContentHolder from './CategoryContentHolder';
import CategoryDrawer from './CategoryDrawer';

interface CategoryMenuProps {
  desktopMenuOpen: boolean;
  mobileMenuOpen: boolean;
  handleDesktopMenuClose: () => void;
  handleMobileMenuClose: () => void;
}

export const CategoryMenu: React.FC<CategoryMenuProps> = (props) => {
  const {
    desktopMenuOpen,
    mobileMenuOpen,
    handleDesktopMenuClose,
    handleMobileMenuClose,
  } = props;

  return (
    <aside>
      <CategoryDrawer
        drawerWidth={240}
        desktopMenuOpen={desktopMenuOpen}
        mobileMenuOpen={mobileMenuOpen}
        handleMobileMenuClose={handleMobileMenuClose}
      >
        <CategoryContentHolder handleDesktopMenuClose={handleDesktopMenuClose}>
          <CategoriesList />
        </CategoryContentHolder>
      </CategoryDrawer>
    </aside>
  );
};
