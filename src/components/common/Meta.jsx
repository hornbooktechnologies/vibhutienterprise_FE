import React from 'react';
import { Helmet } from 'react-helmet-async';

const Meta = ({ title, description = "Vibhuti Full-Stack Portal" }) => {
  const fullTitle = title ? `${title} | Vibhuti` : "Vibhuti Portal";
  
  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta charSet="utf-8" />
    </Helmet>
  );
};

export default Meta;
