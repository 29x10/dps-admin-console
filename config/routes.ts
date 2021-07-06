export default [
  {
    name: 'log.list',
    icon: 'FileTextOutlined',
    path: '/logs',
    component: './LogList'
  },
  {
    name: 'syslog.source.list',
    icon: 'ImportOutlined',
    path: '/syslog_source',
    component: './SyslogSourceList'
  },
  {
    name: 'syslog.dest.list',
    icon: 'ExportOutlined',
    path: '/syslog_dest',
    component: './SyslogDestList'
  },
  {
    name: 'vault.list',
    icon: 'SafetyOutlined',
    path: '/vault',
    component: './VaultList'
  },
  {
    component: './404',
  },
];
