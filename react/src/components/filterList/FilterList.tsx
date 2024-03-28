import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useGetCategoryByIdQuery } from 'store/slices/productSlice';
import FilterDrawer from './FilterDrawer';
import FilterPropertyItem from './FilterPropertyItem';

interface ProductFilterProps {
  categoryId: number;
  queries: { [key: string]: string };
}

type Attribute = {
  [key: string]: any;
};

type OptionType = {
  id: number;
  value: string;
  alias: string;
  quantity: number;
  checked: boolean;
};

type AttributeType = {
  id: number;
  name: string;
  alias: string;
  options: {
    [key: string]: OptionType;
  };
};

interface IFilterFormState {
  [key: string]: AttributeType;
}

const mapToFilterState = (data: any[]): IFilterFormState => {
  const attributes = JSON.parse(JSON.stringify(data));
  const state: IFilterFormState = {};

  for (let i = 0; i < attributes.length; i++) {
    const options: any = {};
    if (attributes[i].options?.length) {
      for (let j = 0; j < attributes[i].options.length; j++) {
        const opt = attributes[i].options[j];
        options[opt.alias] = opt;
        options[opt.alias].checked = false;
      }
    }

    attributes[i].options = options;
    state[attributes[i].alias] = attributes[i];
  }
  return state;
};

export const FilterList: React.FC<ProductFilterProps> = ({
  categoryId,
  queries,
}) => {
  const [filterOpen, setFilterOpen] = useState<boolean>(false);

  const filterOpenHandler = () => {
    setFilterOpen(!filterOpen);
  };

  const { data, isLoading, error } = useGetCategoryByIdQuery(categoryId);

  const [sorting, setSorting] = useState<string>('');

  const sortHandler = (event: SelectChangeEvent<string>) => {
    setSorting(event.target.value);
  };

  const formMethods = useForm<{ attributes: Attribute[] }>({
    defaultValues: { attributes: [] },
  });

  const { control, handleSubmit, reset } = formMethods;

  useEffect(() => {
    if (!isLoading) {
      const initialFilterState = mapToFilterState(data.attributes);
      console.log(initialFilterState);
    }
  }, [isLoading]);

  return (
    <Box
      sx={{ width: { sm: 240 }, flexShrink: { sm: 0 } }}
      aria-label="mailbox folders"
    >
      <FilterDrawer
        drawerWidth={240}
        filterOpen={filterOpen}
        handleFilterClose={filterOpenHandler}
      >
        <div>
          {isLoading ? (
            <div>...загрузка</div>
          ) : (
            <FormProvider {...formMethods}>
              <div>
                {data.name}
                <FormControl sx={{ m: 1 }} size="small">
                  <InputLabel id="select-label">Отсортировать</InputLabel>
                  <Select
                    labelId="select-label"
                    value={sorting}
                    label="sortProductsBy"
                    onChange={sortHandler}
                  >
                    <MenuItem value="">
                      <em>Невыбрано</em>
                    </MenuItem>
                    <MenuItem value="priceDown">Сначало дорогие</MenuItem>
                    <MenuItem value="priceUp">Сначало дешевые</MenuItem>
                    <MenuItem value="popular">Популярные</MenuItem>
                  </Select>
                </FormControl>

                <div className="property-list">
                  {data.attributes.map((attr: any) => {
                    return (
                      <FilterPropertyItem key={attr.id} attribute={attr} />
                    );
                  })}
                </div>
              </div>
            </FormProvider>
          )}
        </div>
      </FilterDrawer>
    </Box>
  );
};
