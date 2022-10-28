drop table if exists zones
drop table if exists samples

create table zones (
	id	SERIAL primary key,
	name varchar(200) not null,
	url varchar(200) not null,
	topX float not null,
	topY float not null,
	leftX float not null,
	leftY float not null,
    bottomX float not null,
    bottomY float not null,
    rightX float not null,
    rightY float not null
)

create table samples (
	id SERIAL primary key,
	name varchar(200) not null,
	zone_id SERIAL,
	CONSTRAINT fk_zone
      FOREIGN KEY(zone_id) 
	  REFERENCES zones(id)
)