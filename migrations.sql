CREATE TABLE sex (
	id_sex SERIAL PRIMARY KEY,
	descr_sex VARCHAR(20) NOT NULL,
	abbr_sex CHAR NOT NULL
);

CREATE TABLE users (
	id_user UUID PRIMARY KEY NOT NULL,
	name VARCHAR(100) NOT NULL,
	last_name VARCHAR(100),
	email VARCHAR(100) NOT NULL,
	password VARCHAR(50) NOT NULL,
	active BOOLEAN DEFAULT TRUE,
	cpf VARCHAR(14),
	cnpj VARCHAR(18),
	date_birth DATE,
	phone_number VARCHAR(25),
	role varchar(10)[],
	id_sex INT NOT NULL,
	FOREIGN KEY (id_sex) REFERENCES sex (id_sex)
);

CREATE TABLE user_address (
	id_user_address UUID PRIMARY KEY NOT NULL,
	cep VARCHAR(9) NOT NULL,
	number int NOT NULL,
	street VARCHAR(50) NOT NULL,
	neighborhood VARCHAR(50) NOT NULL,
	complement VARCHAR(100) NOT NULL,
	city VARCHAR(100) NOT NULL,
	state VARCHAR(100) NOT NULL,
	country VARCHAR(50) NOT NULL,
	selected_address BOOLEAN NOT NULL DEFAULT FALSE,
	home_address BOOLEAN NOT NULL DEFAULT FALSE,
	work_address BOOLEAN NOT NULL DEFAULT FALSE,
	id_user UUID NOT NULL,
	FOREIGN KEY (id_user) REFERENCES users (id_user)
);

INSERT INTO sex (descr_sex, abbr_sex) VALUES
('MASCULINO', 'M'),
('FEMININO', 'F'),
('OUTRO', 'O');