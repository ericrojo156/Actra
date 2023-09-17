import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import * as ColorPalette from '../src/ColorPalette';

const RightArrow = (props: any) => (
  <Svg
    width={40}
    height={24}
    xmlns="http://www.w3.org/2000/svg"
    fillRule="evenodd"
    clipRule="evenodd"
    {...props}>
    <Path
      d="M28.883 12l-5.527 6.235.644.765 9-7.521-9-7.479-.645.764 5.529 6.236H7v1h21.883z"
      fill={ColorPalette.OffWhite_RGBSerialized}
    />
  </Svg>
);

export default RightArrow;
