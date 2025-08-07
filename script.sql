DROP DATABASE IF EXISTS deskeando;
CREATE DATABASE deskeando;

\c deskeando;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE "desk"(
   id uuid default uuid_generate_v4() PRIMARY KEY,
   "name" text not null
);

CREATE TABLE "user" (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    "first_name" text,
    "last_name" text,
    "email" text not null UNIQUE,
    "password" VARCHAR(255)
);

CREATE TABLE "booking"(
   id uuid default uuid_generate_v4() PRIMARY KEY,
   "desk_id" uuid NOT NULL REFERENCES "desk"(id) on delete cascade,
   "user_id" uuid NOT NULL REFERENCES "user"(id) on delete cascade,
   "from_date" timestamp with time zone not null,
   "to_date" timestamp with time zone not null
);

-- Prevent two users from booking the same desk at the same time
-- This ensures only one booking per desk per date
CREATE UNIQUE INDEX unique_desk_date ON booking (desk_id, from_date);


INSERT INTO "desk" (id, name) VALUES
('b142a09d-76f7-4140-a401-52a7bc5f22c5','Desk 1'),
('5edac634-6a5b-4f38-89d0-b10161e66186', 'Desk 2'),
('7c5fa573-16bf-4b91-b90a-3c8303a6e14f', 'Desk 3'),
('db4f01e4-9d64-4732-a099-9664db206f08','Desk 4'),
('5b3d6606-4dd1-4e01-92fb-889303c5939a','Desk 5');

INSERT INTO "user" (id, first_name, last_name, email, password) VALUES
('26136694-7c90-41c3-9787-b7f0bd776a23', 'Alice', 'Smith', 'alice@gmail.com', 'sosecret'),
('c6dbfcba-a714-4f26-a658-f6292ca7586e','Bob', 'Johnson', 'bob@gmail.cl', 'sosecret'),
('fbd8d766-73b9-4cd0-b11e-8fb507ca0d53','Charlie', 'Lee', 'charlie@gmail.com', 'sosecret'),
('82f7e975-c803-4fb8-be96-4f7c9bfa6a0c','Diana', 'Brown', 'diana@gmail.com', 'sosecret'),
('35abf422-88d4-4de4-aa02-7294e8ac796e','Ethan', 'Wilson', 'ethan@gmail.com', 'sosecret');

INSERT INTO "booking" (desk_id, user_id, from_date, to_date) VALUES
('b142a09d-76f7-4140-a401-52a7bc5f22c5', '26136694-7c90-41c3-9787-b7f0bd776a23', '2025-07-01', '2025-07-01'),
('5edac634-6a5b-4f38-89d0-b10161e66186', 'c6dbfcba-a714-4f26-a658-f6292ca7586e', '2025-07-02', '2025-07-02'),
('7c5fa573-16bf-4b91-b90a-3c8303a6e14f', 'fbd8d766-73b9-4cd0-b11e-8fb507ca0d53', '2025-07-03', '2025-07-03'),
('db4f01e4-9d64-4732-a099-9664db206f08', '82f7e975-c803-4fb8-be96-4f7c9bfa6a0c', '2025-07-04', '2025-07-04'),
('5b3d6606-4dd1-4e01-92fb-889303c5939a', '35abf422-88d4-4de4-aa02-7294e8ac796e', '2025-07-05', '2025-07-05')