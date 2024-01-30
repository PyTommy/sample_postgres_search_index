import { Knex } from 'knex';
import { getKnex } from './db';
import { v4 as uuid } from 'uuid';

describe('検証', () => {
  let knex: Knex;

  beforeAll(async () => {
    knex = await getKnex();
  });

  beforeEach(async () => {
    await deleteAllData(knex);
  });

  afterAll(async () => {
    await knex.destroy();
  });

  async function createData(data: { title: string; content: string }) {
    return await knex('article').insert({
      id: uuid(),
      title: data.title,
      content: data.content,
    });
  }

  async function searchEn(text: string) {
    return await knex('article')
      .select('*')
      .whereRaw(`tsv_en @@ to_tsquery('${text}')`);
  }

  async function getAll() {
    return await knex('article').select('*');
  }

  test.each<{
    title: string;
    content: string;
    searchText: string;
  }>([
    {
      title: 'this is tommy',
      content: 'this is tommy',
      searchText: 'tommy', // OK
    },
    {
      title: 'this is tommy',
      content: 'this is tommy',
      searchText: 'is', // 失敗: isのようなBe動詞は検索対象から除外されているみたい。
    },
    {
      title: 'Exploring the Depths of PostgreSQLs pg_catalog Schema',
      content:
        'Delve into the intricate world of PostgreSQLs pg_catalog schema, uncovering the hidden treasures of database metadata and system functionalities.',
      searchText: 'PostgreSQLs', // OK
    },
    {
      title: 'Exploring the Depths of PostgreSQLs pg_catalog Schema',
      content:
        'Delve into the intricate world of PostgreSQLs pg_catalog schema, uncovering the hidden treasures of database metadata and system functionalities.',
      searchText: 'the', // 失敗: isのようなBe動詞は検索対象から除外されているみたい。
    },
  ])(
    'タイトル: $title, 文章: $content, 検索テキスト: $searchText',
    async ({ title, content, searchText }) => {
      // Arrange
      await createData({ title, content });

      // Assert
      expect(await searchEn(searchText)).toEqual(await getAll());
    }
  );
});

async function deleteAllData(knex: Knex) {
  return await knex.raw('DELETE FROM article');
}
