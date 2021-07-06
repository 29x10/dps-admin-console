import { Request, Response } from 'express';


function getSyslogSources(req: Request, res: Response, u: string) {
  const tableListDataSource = [];
  tableListDataSource.push({
    id: 123,
    log_id: 3,
    type: 'tcp',
    settings: [{ option_key: '123', option_value: '456', id: 1}, {option_key: '789', option_value: '9101', id: 2}]
  } as API.SyslogSourceItem)

  const result = {
    data: tableListDataSource,
    total: tableListDataSource.length,
    success: true,
  };

  return res.json(result);
}

function newSyslogSource(req: Request, res: Response, u: string, b: Request) {
  const body = (b && b.body) || req.body;
  const { type, log_id, settings } = body;

  return res.json({
    type,
    log_id,
    settings
  })
}

function updateSyslogSource(req: Request, res: Response, u: string, b: Request) {
  const body = (b && b.body) || req.body;
  const { type, log_id, settings } = body;

  return res.json({
    type,
    log_id,
    settings
  })
}

function deleteSyslogSource(req: Request, res: Response) {
  return res.json();
}

export default {
  'GET /api/sources': getSyslogSources,
  'POST /api/sources': newSyslogSource,
  'PUT /api/sources/123': updateSyslogSource,
  'DELETE /api/sources/123': deleteSyslogSource,
};
