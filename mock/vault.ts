import { Request, Response } from 'express';


function getVaults(req: Request, res: Response, u: string) {
  const tableListDataSource = [];
  tableListDataSource.push({
    id: 789,
    log_id: 3,
    mon_type: 1,
    mon_collectorextractor: 1,
    mon_endpointextractor: 2,
    description: 'some desc for log',
    logdir: '/cluster/logs/aaa',
    logret: 24,
    mon_agealert: 24,
    volumename: 'logs-',
    minreplicas: 2,
    numreplicas: 3,
    scheduleid: 4,
    acl_users: ['123'],
    acl_groups: ['456']
  } as API.VaultItem)

  const result = {
    data: tableListDataSource,
    total: tableListDataSource.length,
    success: true,
  };

  return res.json(result);
}

function newVault(req: Request, res: Response, u: string, b: Request) {
  return res.json();
}

function updateVault(req: Request, res: Response, u: string, b: Request) {
  return res.json();
}

function deleteVault(req: Request, res: Response) {
  return res.json();
}

export default {
  'GET /api/vaults': getVaults,
  'POST /api/vaults': newVault,
  'PUT /api/vaults/789': updateVault,
  'DELETE /api/vaults/789': deleteVault,
};
