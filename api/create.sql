drop table if exists todo;
create table todo (
    id integer primary key autoincrement not null, 
    name text not null, 
    completed boolean not null default false,
    sort integer not null default 0
);
insert into todo(name,sort) values('Get all contingencies squared away', 0);
insert into todo(name,sort) values('Clear the title', 1);
insert into todo(name,sort) values('Get final mortgage approval', 2);
insert into todo(name,sort) values('Review your closing disclosure', 3);
insert into todo(name,sort) values('Do a final walk-through', 4);
insert into todo(name,sort) values('Bring the necessary documentation to closing', 5);