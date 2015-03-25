-- #Migration alter_events
-- #UP
ALTER TABLE events ADD COLUMN user_id integer;
ALTER TABLE events ADD CONSTRAINT userfk FOREIGN KEY (user_id) REFERENCES users (id) MATCH FULL;

-- #DOWN
ALTER TABLE events DROP CONNECTION userfk;
ALTER TABLE events DROP COLUMN user_id;
