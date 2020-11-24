/**
 * License for SVG - https://fontawesome.com/license
 *
 * Pulled from here https://fontawesome.com/icons/underline?style=solid
 *
 * Modifcations: Rescaled, translated and stripped of default colors
 */

import React from "react";
import { Icon } from "outline-icons";

export default function UnderlineIcon(props) {
  return (
    <Icon {...props}>
      <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="underline" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
         <path transform="scale(0.6666)" transform-origin="50% 50%" d="M32 64h32v160c0 88.22 71.78 160 160 160s160-71.78 160-160V64h32a16 16 0 0 0 16-16V16a16 16 0 0 0-16-16H272a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h32v160a80 80 0 0 1-160 0V64h32a16 16 0 0 0 16-16V16a16 16 0 0 0-16-16H32a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16zm400 384H16a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16z" />
      </svg>
    </Icon>
  );
}
