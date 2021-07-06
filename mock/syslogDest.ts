import { Request, Response } from 'express';


function getSyslogDests(req: Request, res: Response, u: string) {
  const tableListDataSource = [];
  tableListDataSource.push({
    id: 456,
    log_id: 3,
    type: 'tcp',
    name: 'nifi',
    target: '10.1.12.34',
    settings: [{ option_key: '123', option_value: '456', id: 1}, {option_key: '789', option_value: '9101', id: 2}]
  } as API.SyslogDestItem)

  const result = {
    data: tableListDataSource,
    total: tableListDataSource.length,
    success: true,
  };

  return res.json(result);
}

function newSyslogDest(req: Request, res: Response, u: string, b: Request) {
  const body = (b && b.body) || req.body;
  const { type, log_id, target, name, settings } = body;

  return res.json({
    type,
    log_id,
    target,
    name,
    settings
  })
}

function updateSyslogDest(req: Request, res: Response, u: string, b: Request) {
  const body = (b && b.body) || req.body;

  const { type, log_id, target, name, settings } = body;

  return res.json({
    type,
    log_id,
    target,
    name,
    settings
  })
}

function deleteSyslogDest(req: Request, res: Response) {
  return res.json();
}

export default {
  'GET /api/destinations': getSyslogDests,
  'POST /api/destinations': newSyslogDest,
  'PUT /api/destinations/456': updateSyslogDest,
  'DELETE /api/destinations/456': deleteSyslogDest,
};
