import { buildingSafetyOrdinances } from './ordinances/buildingSafety';
import { fireProtectionOrdinances } from './ordinances/fireProtection';
import { environmentalOrdinances } from './ordinances/environmental';
import { urbanPlanningOrdinances } from './ordinances/urbanPlanning';
import { disasterPreventionOrdinances } from './ordinances/disasterPrevention';
import { Ordinance } from '../types/ordinance';

export const dummyOrdinances: Ordinance[] = [
  ...buildingSafetyOrdinances,
  ...fireProtectionOrdinances,
  ...environmentalOrdinances,
  ...urbanPlanningOrdinances,
  ...disasterPreventionOrdinances,
];