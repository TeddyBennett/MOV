import  { useState } from 'react';
import Rating from '@mui/material/Rating';
import Box from '@mui/material/Box';




const labels = {
  0.5: 'Useless',
  1: 'Poor',
  1.5: 'Okay',
  2: 'Fair',
  2.5: 'Average',
  3: 'Good',
  3.5: 'Very Good',
  4: 'Great',
  4.5: 'Excellent',
  5: 'Perfect',
};

function HoverRating(props) {

  return (
  
    <Rating
      name="hover-feedback"
      value={props.value}
      precision={0.5}
      onChange={(event, newValue) => {
        props.setValue(newValue);
      }}
      onChangeActive={(event, newHover) => {
        props.setHover(newHover);
      }}
      />
  );
}

export default HoverRating;
