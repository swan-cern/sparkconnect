import React from 'react';
import ReactSelect, { Props as ReactSelectProps } from 'react-select';

const selectStyles = {
  control: (provided: any, state: any) => ({
    ...provided,
    borderRadius: 0,
    borderColor: 'var(--jp-border-color1)',
    background: 'var(--jp-layout-color1)'
  }),
  singleValue: (provided: any, state: any) => ({
    ...provided,
    color: 'var(--jp-ui-font-color1)'
  }),
  menu: (provided: any, state: any) => ({
    ...provided,
    background: 'var(--jp-layout-color1)',
    color: 'var(--jp-ui-font-color1)',
    zIndex: '9999 !important;'
  }),
  option: (provided: any, { isFocused, isSelected }: any) => ({
    ...provided,
    background: isFocused
      ? isSelected
        ? provided.background
        : 'var(--jp-layout-color2)'
      : provided.background,
    ':active': {
      ...provided[':active'],
      background: isSelected ? provided.background : 'var(--jp-layout-color2)'
    }
  })
};

const Select: React.FC<ReactSelectProps> = props => {
  return <ReactSelect {...props} styles={selectStyles} />;
};

export default Select;
