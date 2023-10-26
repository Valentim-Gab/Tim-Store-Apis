CREATE TABLE gender (
	id_gender SERIAL PRIMARY KEY,
	name VARCHAR(20) NOT NULL,
	abbreviation CHAR NOT NULL
);

CREATE TABLE users (
	id_user UUID PRIMARY KEY UNIQUE NOT NULL,
	name VARCHAR(100) NOT NULL,
	last_name VARCHAR(100),
	email VARCHAR(100) UNIQUE NOT NULL,
	password TEXT NOT NULL,
	active BOOLEAN DEFAULT TRUE,
	cpf VARCHAR(14) UNIQUE,
	cnpj VARCHAR(18) UNIQUE,
	date_birth DATE,
	phone_number VARCHAR(25),
	role varchar(10)[],
	profile_image TEXT,
	id_gender INT NOT NULL,
	FOREIGN KEY (id_gender) REFERENCES gender (id_gender)
);

CREATE TABLE user_address (
	id_user_address UUID PRIMARY KEY UNIQUE NOT NULL,
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

/* Exemplo: Nike; Adidas; Mizuno. */
CREATE TABLE product_brand (
  id_product_brand SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL
);

/* Exemplo: XPP, PP; P; M; G; GG; XGG ot */
CREATE TABLE product_size (
  id_product_size SERIAL PRIMARY KEY,
  name VARCHAR(5)
);

/* Exemplo: Vermelho; Azul; Preto */
CREATE TABLE product_color (
  id_product_color SERIAL PRIMARY KEY,
  name VARCHAR(30) NOT NULL,
  hexadecimal_code VARCHAR(10)
);

/* Exemplo: Másculino; Feminino; Unissex; Infantil; Esporte/Academia. */
CREATE TABLE product_main_category (
  id_product_main_category SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);

/* Exemplo: Calçados; Roupas; Acessórios; Esporte. */
CREATE TABLE product_intermediate_category (
  id_product_intermediate_category SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);

/* Exemplo: Botas; Tênis; Camisas; Vestidos. */
CREATE TABLE product_subcategory (
  id_product_subcategory SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);

/* Exemplo: Vestido - Roupa - Feminina. */
CREATE TABLE categories_relation (
  id_categories_relation SERIAL PRIMARY KEY,
  description VARCHAR(100) NOT NULL,
  id_main_category INTEGER NOT NULL,
  id_intermediate_category INTEGER NOT NULL,
  id_subcategory INTEGER NOT NULL,
  FOREIGN KEY (id_product_main_category) REFERENCES product_main_category (id_product_main_category),
  FOREIGN KEY (id_product_intermediate_category) REFERENCES product_intermediate_category (id_product_intermediate_category),
  FOREIGN KEY (id_subcategory) REFERENCES subcategory (id_subcategory)
);

/* Exemplo: Vestido Curto */
CREATE TABLE product (
  id_product UUID UNIQUE PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  units INTEGER NOT NULL DEFAULT 1,
  price MONEY NOT NULL,
  main_image TEXT,
  images TEXT[],
  numeric_size INTEGER,
  id_product_brand INTEGER,
  id_product_size INTEGER NOT NULL,
  id_product_color INTEGER,
  FOREIGN KEY (id_product_brand) REFERENCES product_brand (id_product_brand),
  FOREIGN KEY (id_product_size) REFERENCES product_size (id_product_size),
  FOREIGN KEY (id_product_color) REFERENCES product_color (id_product_color)
);

/* Exemplo: Vestido Curto, Vestido - Roupa - Feminina. */
CREATE TABLE product_category_relation (
  id_product_category_relation SERIAL PRIMARY KEY,
  id_categories_relation INTEGER NOT NULL,
  id_product UUID NOT NULL,
  FOREIGN KEY (id_categories_relation) REFERENCES categories_relation (id_categories_relation),
  FOREIGN KEY (id_product) REFERENCES product (id_product)
);

CREATE TABLE product_sale (
  id_product_sale SERIAL PRIMARY KEY,
  units INTEGER NOT NULL DEFAULT 1,
  total_value MONEY NOT NULL,
  id_product UUID NOT NULL,
  id_user UUID NOT NULL,
  FOREIGN KEY (id_product) REFERENCES product (id_product),
  FOREIGN KEY (id_user) REFERENCES users (id_user)
);


/* CREATE INDEX idx_name_product ON product(name_product);  */

INSERT INTO gender (name, abbreviation) VALUES
('MASCULINO', 'M'), ('FEMININO', 'F'), ('OUTRO', 'O');

INSERT INTO users (id_user, name, email, password, id_sex, role) VALUES (
	'dc7fb99a-2f8a-46bb-a915-2a5fa911a155',
	'adm', 'adm@email.vale',
	'$2b$10$LKA.RVeztsScuvW0PSfrUOivtcl/UpSZ48RlrnOHAy2IzM9mgutx2',
	3, ARRAY['admin']
);

INSERT INTO product_brand (name) VALUES
('Nike'), ('Adidas');

INSERT INTO product_size (name) VALUES
('XP'), ('PP'), ('P'), ('M'), ('G'), ('GG'), ('XG');

INSERT INTO product_color (name, hexadecimal_code) VALUES
('Vermelho', '#FF0000'),
('Verde', '#00FF00'),
('Azul', '#0000FF'),
('Amarelo', '#FFFF00'),
('Rosa', '#FFC0CB'),
('Laranja', '#FFA500'),
('Roxo', '#800080'),
('Ciano', '#00FFFF'),
('Marrom', '#A52A2A'),
('Preto', '#000000'),
('Branco', '#FFFFFF'),
('Cinza', '#808080');

