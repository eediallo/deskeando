DROP DATABASE IF EXISTS deskeando;
CREATE DATABASE deskeando;

\c deskeando;

CREATE TABLE desks(
   desk_id SERIAL PRIMARY KEY,
   desk_name TEXT
);

CREATE TABLE users(
   user_id SERIAL PRIMARY KEY,
   first_name TEXT,
   last_name TEXT
);

CREATE TABLE bookings(
   book_id SERIAL PRIMARY KEY,
   desk_id INTEGER NOT NULL REFERENCES desks(desk_id),
   user_id INTEGER NOT NULL REFERENCES users(user_id),
   from_date DATE NOT NULL,
   to_date DATE NOT NULL
);


INSERT INTO desks (desk_name) VALUES
('Desk A'),
('Desk B'),
('Desk C'),
('Desk D'),
('Desk E');

INSERT INTO users (first_name, last_name) VALUES
('Alice', 'Smith'),
('Bob', 'Johnson'),
('Charlie', 'Lee'),
('Diana', 'Brown'),
('Ethan', 'Wilson');

INSERT INTO bookings (desk_id, user_id, from_date, to_date) VALUES
(1, 1, '2025-07-01', '2025-07-01'),
(2, 2, '2025-07-02', '2025-07-02'),
(3, 3, '2025-07-03', '2025-07-03'),
(4, 4, '2025-07-04', '2025-07-04'),
(5, 5, '2025-07-05', '2025-07-05'),
(1, 2, '2025-07-06', '2025-07-06'),
(2, 3, '2025-07-07', '2025-07-07'),
(3, 1, '2025-07-08', '2025-07-08');
