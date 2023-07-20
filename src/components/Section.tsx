import React, { HTMLProps } from 'react';

type Props = HTMLProps<HTMLDivElement> & {
  title: string;
  extraActions?: React.ReactNode;
  headingStyle?: Props['style'];
};

export const Section: React.FC<Props> = ({
  className,
  title,
  extraActions,
  headingStyle,
  ...props
}) => {
  return (
    <>
      <header
        className="jp-SparkConnectExtension-section-header"
        style={headingStyle}
      >
        {title}
        {extraActions}
      </header>
      <div
        className={'jp-SparkConnectExtension-details ' + className || ''}
        {...props}
      >
        {props.children}
      </div>
    </>
  );
};
