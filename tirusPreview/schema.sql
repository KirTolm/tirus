drop table if exists post;
create table post (
    id integer primary key autoincrement,
    title text,
    content text not null
);