import { Box, Card, CardContent, CardMedia, Typography } from '@mui/material';
import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

interface IProduct {
  id: number;
  name: string;
}

interface IProductItemProps {
  product: IProduct;
}

const ProductCard: React.FC<IProductItemProps> = (props) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  return (
    <Card sx={{ display: 'flex' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <CardContent sx={{ flex: '1 0 auto' }}>
          <Typography component="div" variant="h5">
            {props.product.name}
          </Typography>
        </CardContent>
      </Box>
      <CardMedia
        component="img"
        image="/"
        sx={{ width: 150, height: 150 }}
        alt=""
      />
    </Card>
  );
};

export default ProductCard;
