import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useGetAllCategoriesQuery } from 'store/slices/productSlice';

const Home: React.FC = () => {
  const { data, isLoading, error } = useGetAllCategoriesQuery({});

  if (isLoading) {
    return (
      <div>
        <div>загрузка...</div>
      </div>
    );
  }

  return (
    <div>
      Home age
      <ul>
        {data.map((p: any) => (
          <li key={p.id}>{p.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
