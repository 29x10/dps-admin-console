// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

/** 获取当前的用户 GET /api/currentUser */
export async function currentUser(options?: { [key: string]: any }) {
  return request<API.CurrentUser>('/api/currentUser', {
    method: 'GET',
    redirect: 'manual',
    ...(options || {}),
  }).catch((error) => {
    window.location.replace('/oauth2/authorization/oidc')
  });
}

export async function log(
  params: {
    current?: number;
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<API.LogList>('/api/logs', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function addSyslogSource(body: API.SyslogSourceItem, options?: { [key: string]: any }) {
  return request<API.SyslogSourceItem>('/api/sources', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

export async function updateSyslogSource(source_id: number | undefined, body: API.SyslogSourceItem, options?: { [key: string]: any }) {
  return request<API.SyslogSourceItem>(`/api/sources/${source_id}`, {
    method: 'PUT',
    data: body,
    ...(options || {}),
  });
}

export async function deleteSyslogSource(source_id: number | undefined, options?: { [key: string]: any }) {
  return request<Record<string, any>>(`/api/sources/${source_id}`, {
    method: 'DELETE',
    ...(options || {}),
  });
}

export async function syslogSource(
  params: {
    current?: number;
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<API.SyslogSourceList>('/api/sources', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function addSyslogDest(body: API.SyslogDestItem, options?: { [key: string]: any }) {
  return request<API.SyslogDestItem>('/api/destinations', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

export async function updateSyslogDest(id: number | undefined, body: API.SyslogDestItem, options?: { [key: string]: any }) {
  return request<API.SyslogDestItem>(`/api/destinations/${id}`, {
    method: 'PUT',
    data: body,
    ...(options || {}),
  });
}

export async function deleteSyslogDest(id: number | undefined, options?: { [key: string]: any }) {
  return request<Record<string, any>>(`/api/destinations/${id}`, {
    method: 'DELETE',
    ...(options || {}),
  });
}


export async function syslogDest(
  params: {
    current?: number;
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<API.SyslogDestList>('/api/destinations', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}


export async function addVault(body: API.VaultItem, options?: { [key: string]: any }) {
  return request<API.SyslogDestItem>('/api/vaults', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

export async function updateVault(id: number | undefined, body: API.VaultItem, options?: { [key: string]: any }) {
  return request<API.SyslogDestItem>(`/api/vaults/${id}`, {
    method: 'PUT',
    data: body,
    ...(options || {}),
  });
}

export async function deleteVault(id: number | undefined, options?: { [key: string]: any }) {
  return request<Record<string, any>>(`/api/vaults/${id}`, {
    method: 'DELETE',
    ...(options || {}),
  });
}

export async function vault(
  params: {
    current?: number;
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<API.VaultItem>('/api/vaults', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function acl_users(
  params: {
    query?: string;
  },
) {
  return request<API.VaultItem>('/api/users', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}
