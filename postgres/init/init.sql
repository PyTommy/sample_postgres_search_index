-- DB作成
CREATE DATABASE sample_db;

-- 作成したDBに接続
\c sample_db;

-- テーブル作成
DROP TABLE IF EXISTS article;
CREATE TABLE article (
	id TEXT NOT NULL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
	tsv_en TSVECTOR
);

-- トリガー作成
CREATE TRIGGER tsvectorupdate_en BEFORE INSERT OR UPDATE 
  ON article FOR EACH ROW EXECUTE FUNCTION
  tsvector_update_trigger(tsv_en, 'pg_catalog.english', title, content);

-- インデックス作成
CREATE INDEX article_tsv_en_index ON article 