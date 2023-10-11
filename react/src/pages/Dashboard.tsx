import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const [products, setProducts] = useState<any>([]);

  const fetchData = async () => {
    const data = await fetch(`${process.env.REACT_APP_API}/api/v1/products`);

    const json = await data.json();
    setProducts(json.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      Dashbord Page
      <ul>
        {products.map((p: any) => (
          <li>{p.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
