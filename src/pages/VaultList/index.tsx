import React, {useEffect, useRef, useState} from 'react';
import { FormattedMessage } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import type {ActionType, ProColumns} from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';

import {vault, log, addVault, updateVault, deleteVault} from '@/services/ant-design-pro/api';
import {Button, Drawer, message} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import ProForm, {
  ModalForm,
  ProFormSelect, ProFormText, ProFormRadio, ProFormTextArea, ProFormDigit
} from "@ant-design/pro-form";
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';
import UpdateForm from "@/pages/VaultList/components/UpdateForm";


const handleAdd = async (fields: API.VaultItem) => {
  const hide = message.loading('Creating');
  try {
    await addVault(fields);
    hide();
    message.success('Create Success');
    return true;
  } catch (error) {
    hide();
    message.error('Create failed');
    return false;
  }
};

const handleUpdate = async (id: number | undefined, fields: API.VaultItem) => {
  const hide = message.loading('Updating');
  try {
    await updateVault(id, fields)
    hide();
    message.success('Update Success');
    return true;
  } catch (error) {
    hide();
    message.error('Update failed！');
    return false;
  }
};

const handleRemove = async (item: API.VaultItem | undefined) => {
  const hide = message.loading('Deleting');
  try {
    await deleteVault(item?.id);
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
  const [logs, setLogs] = useState<API.LogItem[]>([]);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<API.VaultItem>();
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();

  useEffect(() => {
    const fetchData = async () => {
      const result = await log({pageSize: 100, current: 1})
      setLogs(result.data);
    };
    fetchData().then(() => {});
  }, []);

  const columns: ProColumns<API.VaultItem>[] = [
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
      title: 'monitor type',
      dataIndex: 'mon_type',
      tip: 'type of monitor',
      valueType: 'radio',
      valueEnum: {
        1: 'Collector',
        2: 'Endpoint'
      }
    },
    {
      title: 'collector regex',
      dataIndex: 'mon_collectorextractor',
      tip: 'regular expression of collector extractor',
      valueType: 'select',
      valueEnum: {
        1: '^.*/((itsilogc|ivapp).*?)-.*$',
        2: '^.*/(.*?)/\\d{4}/\\d{2}/\\d{2}/.*$',
        3: '^.*logc.*?-(.*?)-.*$'
      }
    },
    {
      title: 'endpoint regex',
      dataIndex: 'mon_endpointextractor',
      tip: 'regular expression of endpoint extractor',
      valueType: 'select',
      valueEnum: {
        1: '^.*/((itsilogc|ivapp).*?)-.*$',
        2: '^.*/(.*?)/\\d{4}/\\d{2}/\\d{2}/.*$',
        3: '^.*logc.*?-(.*?)-.*$'
      }
    },
    {
      title: 'description',
      dataIndex: 'description',
      hideInTable: true,
      hideInSearch: true,
    },
    {
      title: 'log location',
      dataIndex: 'logdir'
    },
    {
      title: 'retention hour',
      dataIndex: 'logret',
      tip: 'log retention in hour unit'
    },
    {
      title: 'alert threshold',
      dataIndex: 'mon_agealert',
      tip: 'no data alert threshold in hour unit',
    },
    {
      title: 'volume name',
      dataIndex: 'volumename',
      tip: 'MapR volume name, where the data stored',
    },
    {
      title: 'minreplicas',
      dataIndex: 'minreplicas',
      tip: 'MapR volume minimal replication number',
      hideInTable: true

    },
    {
      title: 'numreplicas',
      dataIndex: 'numreplicas',
      tip: 'MapR volume number of replication',
      hideInTable: true
    },
    {
      title: 'scheduleid',
      dataIndex: 'scheduleid',
      tip: 'MapR volume scheduler ID',
      hideInTable: true
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

  return (
    <PageContainer>
      <ProTable<API.VaultItem, API.PageParams>
        headerTitle='Vault List'
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        request={vault}
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
        onFinish={async (value: API.VaultItem) => {
          const success = await handleAdd(value as API.VaultItem);
          if (success) {
            handleModalVisible(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
      >
        <ProForm.Group>
          <ProFormRadio.Group
            name="mon_type"
            label="Monitor Type"
            width="md"
            options={[
              {
                label: 'Collector',
                value: 1,
              },
              {
                label: 'Collector',
                value: 2,
              },
            ]}
            rules={[{ required: true, message: 'Please select monitor type' }]}
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
        <ProForm.Group>
          <ProFormSelect
            name="mon_collectorextractor"
            label="Collector Regex"
            valueEnum={{
              1: '^.*/((itsilogc|ivapp).*?)-.*$',
              2: '^.*/(.*?)/\\d{4}/\\d{2}/\\d{2}/.*$',
              3: '^.*logc.*?-(.*?)-.*$'
            }}
            width="md"
            placeholder="Please select collector regular expression"
            rules={[{ required: true, message: 'Please select collector regular expression' }]}
          />
          <ProFormSelect
            name="mon_endpointextractor"
            label="Endpoint Regex"
            valueEnum={{
              1: '^.*/((itsilogc|ivapp).*?)-.*$',
              2: '^.*/(.*?)/\\d{4}/\\d{2}/\\d{2}/.*$',
              3: '^.*logc.*?-(.*?)-.*$'
            }}
            width="md"
            placeholder="Please select endpoint regular expression"
            rules={[{ required: true, message: 'Please select endpoint regular expression' }]}
          />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormText
            name="logdir"
            label="Log Location"
            width="md"
            placeholder="Please input log location"
            rules={[{ required: true, message: 'Please input log location' }]}
          />
          <ProFormDigit
            name="logret"
            label="Log Retention"
            width="md"
            placeholder="Please input log retention in hour unit"
            rules={[{ required: true, message: 'Please input log retention in hour unit' }]}
          />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormDigit
            name="mon_agealert"
            label="Alert Threshold"
            width="md"
            placeholder="Please input alert threshold"
            rules={[{ required: true, message: 'Please input alert threshold' }]}
          />
          <ProFormText
            name="volumename"
            label="Volume Name"
            width="md"
            placeholder="Please input MapR volume name"
            rules={[{ required: true, message: 'Please input MapR volume name' }]}
          />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormDigit
            name="minreplicas"
            label="Minimum Replicas"
            width="md"
            placeholder="Please input volume minimum replica number"
            rules={[{ required: true, message: 'Please input volume minimum replica number' }]}
          />
          <ProFormDigit
            name="numreplicas"
            label="Number of Replicas"
            width="md"
            placeholder="Please input volume replica number"
            rules={[{ required: true, message: 'Please input volume replica number' }]}
          />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormDigit
            name="scheduleid"
            label="Schedule ID"
            width="md"
            placeholder="Please input volume scheduler ID"
            rules={[{ required: true, message: 'Please input volume scheduler ID' }]}
          />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormTextArea
            name="description"
            label="Description"
            width="xl"
            placeholder="Please input log description"
            rules={[{ required: true, message: 'Please input log description' }]}
          />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormSelect
            name="acl_users"
            label="ACL Users"
            fieldProps={{
              mode: 'multiple',
            }}
            showSearch
            request={async ({ keyWords }) => {
              return [
                {
                  label: '123',
                  value: '123'
                },
                {
                  label: '456',
                  value: '567'
                }
              ]
            }}
            width="xl"
            placeholder="Please input acl users"
            rules={[{ required: true, message: 'Please input acl users', type: 'array' }]}
          />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormSelect
            name="acl_groups"
            label="ACL Groups"
            fieldProps={{
              mode: 'multiple',
            }}
            showSearch
            request={async ({ keyWords }) => {
              return [
                {
                  label: '123',
                  value: '123'
                },
                {
                  label: '456',
                  value: '567'
                }
              ]
            }}
            width="xl"
            placeholder="Please input acl groups"
            rules={[{ required: true, message: 'Please input acl groups', type: 'array' }]}
          />
        </ProForm.Group>


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
            columns={columns as ProDescriptionsItemProps<API.VaultItem>[]}
            extra={null}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default TableList;
