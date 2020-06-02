import React, { Fragment, useState, useEffect } from 'react';
import Container from '@material-ui/core/Container';
import propTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';

export default function Layout({children}) {
  return (
    <Container>
      { children ? children :<Typography>Missing...</Typography>}
    </Container>
  );
}

// PropTypes exports a range of validators that can be used to make sure the data you receive is valid.
Layout.propTypes = {
  children: propTypes.element.isRequired
}