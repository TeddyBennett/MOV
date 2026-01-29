import React from 'react';
import Rating from '@mui/material/Rating';

interface HoverRatingProps {
  value: number | null;
  setValue: (value: number | null) => void;
  setHover: (hover: number) => void;
}

const HoverRating: React.FC<HoverRatingProps> = ({ value, setValue, setHover }) => {
  return (
    <Rating
      name="hover-feedback"
      value={value}
      precision={0.5}
      onChange={(_event, newValue) => {
        setValue(newValue);
      }}
      onChangeActive={(_event, newHover) => {
        setHover(newHover);
      }}
    />
  );
};

export default HoverRating;
