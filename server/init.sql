ALTER USER postgres PASSWORD 'admin1';

CREATE DATABASE food_pantry;

CREATE TABLE client_id_map (
  true_id integer not null,
  duplicate_id integer unique not null,
  CONSTRAINT true_dupe_unique UNIQUE(true_id,duplicate_id)
);

CREATE TABLE clients (
  id integer unique not null,
  firstname varchar(128),
  lastname varchar(128),
  phone varchar(11),
  badphone varchar(56),
  thisfamilycount integer,
  youthcount integer,
  eldercount integer,
  address varchar(512),
  active boolean default true,
  mapped boolean default false,
  permanent boolean default null
);

CREATE TABLE registrations (
  id integer unique not null,
  phone varchar(10),
  badphone varchar(56),
  families integer,
  call_in_time timestamp,
  time_slot_id integer,
  create_date timestamp,
  check_in_time timestamp,
  client_id integer
);

-- RESET CLIENTS 
-- UPDATE clients set (mapped, permanent) = (false, null) WHERE id IN (SELECT id FROM clients WHERE mapped = true);
-- DELETE FROM client_id_map;

ALTER TABLE client_id_map ADD CONSTRAINT fk_client_id_true FOREIGN KEY (true_id) REFERENCES clients(id);
ALTER TABLE client_id_map ADD CONSTRAINT fk_client_id_dupe FOREIGN KEY (duplicate_id) REFERENCES clients(id);

