import { MeshProps } from '@react-three/fiber';

export type CubeProps = MeshProps & {
  position: [number, number, number];
  isLived: boolean;
  isCurrentYear: boolean;
  innerWidth: number;
  outerWidth: number;
};
