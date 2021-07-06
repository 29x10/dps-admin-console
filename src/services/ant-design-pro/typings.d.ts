// @ts-ignore
/* eslint-disable */

declare namespace API {
  type CurrentUser = {
    preferred_username?: string;
    picture?: string;
  };

  type LoginResult = {
    status?: string;
    type?: string;
    currentAuthority?: string;
  };

  type PageParams = {
    current?: number;
    pageSize?: number;
  };

  type LogItem = {
    id?: number;
    name: string;
    legacy_name: string;
    port: number;
  }

  type LogList = {
    data: LogItem[];
    total: number;
    success: boolean;
  }

  type SyslogSetting = {
    id: number;
    option_key?: string;
    option_value?: string;
  }

  type SyslogSourceItem = {
    id?: number;
    type: string;
    settings: SyslogSetting[];
    log_id: number;
  }

  type SyslogSourceList = {
    data: SyslogSourceItem[];
    total: number;
    success: boolean;
  }

  type SyslogDestItem = {
    id?: number;
    type: string;
    target: string;
    name: string;
    settings: SyslogSetting[];
    log_id: number;
  }

  type SyslogDestList = {
    data: SyslogDestItem[];
    total: number;
    success: boolean;
  }

  type VaultItem = {
    id?: number;
    mon_type: number;
    mon_collectorextractor: number;
    mon_endpointextractor: number;
    description: string;
    logdir: string;
    logret: number;
    mon_agealert: number;
    volumename: string;
    minreplicas: number;
    numreplicas: number;
    scheduleid: number
    log_id: number;
    acl_users: string[];
    acl_groups: string[];
  }

  type VaultList = {
    data: VaultItem[];
    total: number;
    success: boolean;
  }

  type RuleListItem = {
    key?: number;
    disabled?: boolean;
    href?: string;
    avatar?: string;
    name?: string;
    owner?: string;
    desc?: string;
    callNo?: number;
    status?: number;
    updatedAt?: string;
    createdAt?: string;
    progress?: number;
  };

  type RuleList = {
    data?: RuleListItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };

  type FakeCaptcha = {
    code?: number;
    status?: string;
  };

  type LoginParams = {
    username?: string;
    password?: string;
    autoLogin?: boolean;
    type?: string;
  };

  type ErrorResponse = {
    /** 业务约定的错误码 */
    errorCode: string;
    /** 业务上的错误信息 */
    errorMessage?: string;
    /** 业务上的请求是否成功 */
    success?: boolean;
  };

  type NoticeIconList = {
    data?: NoticeIconItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };

  type NoticeIconItemType = 'notification' | 'message' | 'event';

  type NoticeIconItem = {
    id?: string;
    extra?: string;
    key?: string;
    read?: boolean;
    avatar?: string;
    title?: string;
    status?: string;
    datetime?: string;
    description?: string;
    type?: NoticeIconItemType;
  };
}
