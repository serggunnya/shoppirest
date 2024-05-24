import React from "react";

import { Controller, useFormContext } from "react-hook-form";

interface FilterPropertyItemProps {
	attribute: any;
}

const FilterPropertyItem: React.FC<FilterPropertyItemProps> = ({ attribute }) => {
	const { control } = useFormContext();

	return (
		<div className="property" key={attribute.id}>
			{attribute.name}
			{Array.isArray(attribute.options) ? (
				<div>
					{attribute.options.map((option: any) => (
						<Controller
							key={option.id}
							name={`[${attribute.alias}][${option.alias}]`}
							control={control}
							render={({ field: { value, onChange } }) => (
								<div className="option" key={option.id}>
									<input type="checkbox" onChange={onChange} checked={value} />
									<span>{option.value}</span>
									<span>({option.quantity})</span>
								</div>
							)}
						/>
					))}
				</div>
			) : null}
		</div>
	);
};

export default FilterPropertyItem;
