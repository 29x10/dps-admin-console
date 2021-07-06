import React from 'react';
import { useIntl, FormattedMessage } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';

import { log } from '@/services/ant-design-pro/api';


const TableList: React.FC = () => {
  const intl = useIntl();

  const columns: ProColumns<API.LogItem>[] = [
    {
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48,
    },
    {
      title: (
        <FormattedMessage
          id="pages.log.list.name.label"
          defaultMessage="name"
        />
      ),
      dataIndex: 'name',
      tip: 'Log type name in CDAC format',
    },
    {
      title: (
        <FormattedMessage
          id="pages.log.list.legacy_name.label"
          defaultMessage="legacy vault name"
        />
      ),
      dataIndex: 'legacy_name',
      tip: 'Log type name used in vault platform only',
    },
    {
      title: (
        <FormattedMessage
          id="pages.log.list.port.label"
          defaultMessage="port"
        />
      ),
      dataIndex: 'port',
      tip: 'The port that log listening to for syslog input',
    },
    {
      title: <FormattedMessage id="pages.log.list.action" defaultMessage="action" />,
      dataIndex: 'option',
      valueType: 'option',
      render: () => [
        <a key="view">
          <FormattedMessage id="pages.log.list.action.view" defaultMessage="view" />
        </a>,
        <a key="delete">
          <FormattedMessage id="pages.log.list.action.edit" defaultMessage="edit" />
        </a>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<API.LogItem, API.PageParams>
        headerTitle={intl.formatMessage({
          id: 'pages.log.list.title',
          defaultMessage: 'Log list',
        })}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        request={log}
        columns={columns}

      />
    </PageContainer>
  );
};

export default TableList;
