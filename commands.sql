CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author text,
    url  text NOT NULL,
    title text NOT NULL,
    likes integer default 0
);

insert into blogs(author, url, title) values ('Levy', 'tottenham.com', 'kane is gone');
insert into blogs(author, url, title) values ('Levy', 'tottenham.com', 'sonny remains');