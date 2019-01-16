-- Used to add all missions to availble missions
INSERT INTO `riot-2018`.available_mission (mission_id, date_expired) select mission_id, DATE_ADD(NOW(), INTERVAL duration_hours HOUR) from mission;
