import React from 'react';
import {
  createSearchParams,
  useSearchParams,
  useNavigate,
} from 'react-router-dom';
import { List, ListItem, ListItemButton, ListItemText } from '@mui/material';

import { useGetAllCategoriesQuery } from 'store/slices/productSlice';
import CategoriesSkeleton from './CategoriesSkeleton';

import styles from './categoriesList.module.css';

const CategoriesList: React.FC = (props) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const { data, isLoading, error } = useGetAllCategoriesQuery({});

  const isActive = (id: number) => Number(searchParams?.get('cat_id')) === id;

  const goTo = (id: number) => () =>
    navigate({
      pathname: '/products',
      search: createSearchParams({ page: '1', cat_id: String(id) }).toString(),
    });

  return (
    <div>
      {isLoading ? (
        <CategoriesSkeleton />
      ) : (
        <div>
          <List>
            {data.map((cat: any) => (
              <ListItem
                key={cat.id}
                disablePadding
                className={isActive(cat.id) ? styles.itemActive : styles.item}
              >
                <ListItemButton onClick={goTo(cat.id)}>
                  <ListItemText primary={cat.name} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </div>
      )}
    </div>
  );
};

export default CategoriesList;
