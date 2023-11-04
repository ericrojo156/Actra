import React from 'react';
import Svg, {Path} from 'react-native-svg';

export default function ChartIcon(props: {fill: string}) {
  const {fill} = props;
  return (
    <Svg viewBox="-800 350 2500 2500" width="35.384cm" height="50.624cm">
      <Path
        fill-rule="evenodd"
        fill={fill}
        d="M1001.0,231.999 C667.699,231.999 334.299,231.999 1.0,231.999 C1.0,188.4 1.0,143.995 1.0,99.999 C10.323,67.356 68.315,9.244 101.0,0.0 C265.650,0.0 430.349,0.0 594.999,0.0 C696.989,0.0 799.10,0.0 901.0,0.0 C913.665,7.665 926.334,15.334 939.0,22.999 C961.90,39.617 992.812,71.48 1001.0,99.999 C1001.0,143.995 1001.0,188.4 1001.0,231.999 ZM1.0,349.0 C334.299,349.0 667.699,349.0 1001.0,349.0 C1001.0,471.987 1001.0,595.12 1001.0,718.0 C667.699,718.0 334.299,718.0 1.0,718.0 C1.0,595.12 1.0,471.987 1.0,349.0 ZM1.0,835.999 C334.299,835.999 667.699,835.999 1001.0,835.999 C1001.0,957.987 1001.0,1080.12 1001.0,1202.0 C1001.2,1268.879 1009.566,1328.821 980.999,1368.999 C964.156,1392.690 931.394,1426.389 901.0,1435.0 C842.339,1435.0 783.660,1435.0 724.999,1435.0 C580.347,1435.0 435.652,1435.0 290.999,1435.0 C227.672,1435.0 164.327,1435.0 101.0,1435.0 C83.739,1430.75 65.227,1413.568 52.0,1402.999 C-10.538,1353.34 0.996,1299.706 1.0,1191.999 C1.0,1073.345 1.0,954.654 1.0,835.999 Z"
      />
    </Svg>
  );
}
