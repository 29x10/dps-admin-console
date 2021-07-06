import React, {useEffect, useRef, useState} from 'react';
import { FormattedMessage } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import type {ActionType, ProColumns} from '@ant-design/pro-table';
import ProTable, {EditableProTable} from '@ant-design/pro-table';

import {syslogDest, log, addSyslogDest, updateSyslogDest, deleteSyslogDest} from '@/services/ant-design-pro/api';
import {Badge, Button, Drawer, List, message} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import ProForm, {
  ModalForm,
  ProFormSelect, ProFormText,
} from "@ant-design/pro-form";
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';
import UpdateForm from "@/pages/SyslogDestList/components/UpdateForm";


const handleAdd = async (fields: API.SyslogDestItem) => {
  const hide = message.loading('Creating');
  try {
    await addSyslogDest(fields);
    hide();
    message.success('Create Success');
    return true;
  } catch (error) {
    hide();
    message.error('Create failed');
    return false;
  }
};

const handleUpdate = async (id: number | undefined, fields: API.SyslogDestItem) => {
  const hide = message.loading('Updating');
  try {
    await updateSyslogDest(id, fields)
    hide();
    message.success('Update Success');
    return true;
  } catch (error) {
    hide();
    message.error('Update failed！');
    return false;
  }
};

const handleRemove = async (item: API.SyslogDestItem | undefined) => {
  const hide = message.loading('Deleting');
  try {
    await deleteSyslogDest(item?.id);
    hide();
    message.success('Delete Success');
    return true;
  } catch (error) {
    hide();
    message.error('Delete failed');
    return false;
  }
};

const TableList: React.FC = () => {

  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  const [logs, setLogs] = useState<API.LogItem[]>([]);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<API.SyslogDestItem>();
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();

  useEffect(() => {
    const fetchData = async () => {
      const result = await log({pageSize: 100, current: 1})
      setLogs(result.data);
    };
    fetchData().then(() => {});
  }, []);

  const columns: ProColumns<API.SyslogDestItem>[] = [
    {
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48,
    },
    {
      title: 'id',
      dataIndex: 'id',
      hideInSearch: true,
      render: (dom, entity) => {
        return (
          <a
            onClick={() => {
              setCurrentRow(entity);
              setShowDetail(true);
            }}
          >
            {dom}
          </a>
        );
      },
    },
    {
      title: 'log name',
      dataIndex: 'log_id',
      renderText: (val: string) => {
        const logMatched = logs.find((logItem) => logItem.id === parseInt(val, 10));
        return logMatched ? logMatched.name : 'N/A';
      },
      hideInSearch: true,
      tip: 'Corresponding CDAC log name'
    },
    {
      title: 'log id',
      dataIndex: 'log_id',
      tip: 'Corresponding CDAC log id'
    },
    {
      title: 'name',
      dataIndex: 'name',
      tip: 'category of destination',
      valueType: 'select',
      valueEnum: {
        vault: 'Vault',
        nifi: 'Nifi',
        hunt: 'Hunt',
        splunk: 'Splunk',
        secure_splunk: 'Secure Splunk',
        laas: 'Laas',
      }
    },
    {
      title: 'type',
      dataIndex: 'type',
      tip: 'Protocol of syslog destination',
      valueType: 'select',
      valueEnum: {
        tcp: { text: 'TCP'},
        udp: { text: 'UDP'},
        file: { text: 'FILE'}
      }
    },
    {
      title: 'target',
      dataIndex: 'target',
      tip: 'target of destination',
    },
    {
      title: 'settings',
      dataIndex: 'settings',
      render: (dom, entity) => {
        return (
          <List
            size="small"
            bordered={true}
            dataSource={entity.settings}
            renderItem={item => <List.Item><Badge status="processing" text={`${item.option_key}(${item.option_value})`}/></List.Item>}
          />
        );
      },
      hideInTable: true,
      hideInSearch: true,
    },
    {
      title: 'action',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a key="edit"
           onClick={() => {
             handleUpdateModalVisible(true);
             setCurrentRow(record);
           }}
        >
          edit
        </a>,
        <a key="delete"
           onClick={async () => {
             await handleRemove(record);
           }}
        >
          delete
        </a>,
      ],
    },
  ];

  const syslogSettingsColumns: ProColumns<API.SyslogSetting>[] = [
    {
      title: 'option key',
      dataIndex: 'option_key',
    },
    {
      title: 'option value',
      dataIndex: 'option_value',
    },
    {
      title: 'action',
      valueType: 'option',
      render: () => {
        return null;
      },
    },
  ];

  return (
    <PageContainer>
      <ProTable<API.SyslogDestItem, API.PageParams>
        headerTitle='Syslog Destination List'
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        request={syslogDest}
        columns={columns}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              handleModalVisible(true);
            }}
          >
            <PlusOutlined />
            <FormattedMessage id="pages.searchTable.new" defaultMessage="New" />
          </Button>,
        ]}
      />
      <ModalForm
        title='New Destination'
        submitter={{
          searchConfig: {
            resetText: 'Cancel',
            submitText: 'Submit'
          }
        }}
        visible={createModalVisible}
        onVisibleChange={handleModalVisible}
        onFinish={async (value: API.SyslogDestItem) => {
          const success = await handleAdd(value as API.SyslogDestItem);
          if (success) {
            handleModalVisible(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
      >
        <ProForm.Group>
          <ProFormSelect
            name="name"
            label="Name"
            valueEnum={{
              vault: 'Vault',
              nifi: 'Nifi',
              hunt: 'Hunt',
              splunk: 'Splunk',
              secure_splunk: 'Secure Splunk',
              laas: 'Laas',
            }}
            width="md"
            placeholder="Please select destination type"
            rules={[{ required: true, message: 'Please select destination type' }]}
          />
          <ProFormText
            name="target"
            label="Target"
            width="md"
            placeholder="Please input target"
            rules={[
              {
                required: true,
                message: 'Please input target',
              },
            ]}
          />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormSelect
            name="type"
            label="Type"
            valueEnum={{
              tcp: 'TCP',
              udp: 'UDP',
              file: 'FILE'
            }}
            width="md"
            placeholder="Please select destination type"
            rules={[{ required: true, message: 'Please select destination type' }]}
          />
          <ProFormSelect
            name="log_id"
            label="Log"
            showSearch
            request={async () => {
              return logs.map(logItem => {
                  return {label: logItem.name, value: logItem.id}
                }
              )
            }}
            width="md"
            placeholder="Please select associated log"
            rules={[{ required: true, message: 'Please select associated log' }]}
          />
        </ProForm.Group>
        <ProForm.Item
          label="Settings"
          name="settings"
          initialValue={[]}
          trigger="onValuesChange"
        >
          <EditableProTable<API.SyslogSetting>
            rowKey="id"
            toolBarRender={false}
            columns={syslogSettingsColumns}
            recordCreatorProps={{
              newRecordType: 'dataSource',
              position: 'bottom',
              record: () => ({
                id: Date.now()
              }),
              creatorButtonText: 'add',
            }}
            editable={{
              type: 'multiple',
              editableKeys,
              onChange: setEditableRowKeys,
              deletePopconfirmMessage: 'Delete it?',
              actionRender: (row, config, defaultDoms) => {
                return [defaultDoms.delete];
              },
            }}
          />
        </ProForm.Item>
      </ModalForm>
      <UpdateForm
        logs={logs}
        onSubmit={async (id: number | undefined, value) => {
          const success = await handleUpdate(id, value)
          if (success) {
            handleModalVisible(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onVisibleChange={handleUpdateModalVisible}
        updateModalVisible={updateModalVisible}
        values={currentRow || {}}
      />
      <Drawer
        width={600}
        visible={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.id && (
          <ProDescriptions
            column={2}
            title={`Destination: ${currentRow?.id}`}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.id,
            }}
            columns={columns as ProDescriptionsItemProps<API.SyslogDestItem>[]}
            extra={null}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default TableList;
