// eslint-disable-next-line import/no-extraneous-dependencies
import { Request, Response } from 'express';

// mock tableListDataSource
const genList = (current: number, pageSize: number) => {
  const tableListDataSource: API.LogItem[] = [];

  for (let i = 0; i < pageSize; i += 1) {
    const index = (current - 1) * 10 + i;
    tableListDataSource.push({
      id: index,
      name: `Log ${index}`,
      legacy_name: `Vault ${index}`,
      port: Math.floor(Math.random() * 1000),
    } as API.LogItem);
  }
  tableListDataSource.reverse();
  return tableListDataSource;
};

let tableListDataSource = genList(1, 100);

function getRule(req: Request, res: Response, u: string) {
  const { current = 1, pageSize = 10 } = req.query;

  let dataSource = [...tableListDataSource].slice(
    ((current as number) - 1) * (pageSize as number),
    (current as number) * (pageSize as number),
  );
  const result = {
    data: dataSource,
    total: tableListDataSource.length,
    success: true,
  };

  return res.json(result);
}

export default {
  'GET /api/logs': getRule,
};
