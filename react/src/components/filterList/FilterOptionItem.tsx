import React from 'react';

interface FilterOptionItemProps {
  option: any;
}

const FilterOptionItem: React.FC<FilterOptionItemProps> = ({ option }) => {
  return (
    <div className="option" key={option.id}>
      <input type="checkbox" name={option.alias} />
      <span>{option.value}</span>
      <span>({option.quantity})</span>
    </div>
  );
};

export default FilterOptionItem;
