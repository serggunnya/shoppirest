import React from 'react';
import FilterOptionItem from './FilterOptionItem';

interface FilterPropertyItemProps {
  attribute: any;
}

const FilterPropertyItem: React.FC<FilterPropertyItemProps> = ({
  attribute,
}) => {
  return (
    <div className="property" key={attribute.id}>
      {attribute.name}
      {Array.isArray(attribute.options) ? (
        <div>
          {attribute.options.map((option: any) => (
            <FilterOptionItem key={option.id} option={option} />
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default FilterPropertyItem;
