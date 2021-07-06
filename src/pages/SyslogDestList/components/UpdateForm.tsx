import React, {useEffect, useState} from 'react';
import ProForm, {
  ProFormSelect, ModalForm, ProFormText,
} from '@ant-design/pro-form';
import type { ProColumns} from "@ant-design/pro-table";
import {EditableProTable} from "@ant-design/pro-table";

export type UpdateFormProps = {
  onSubmit: (id: number | undefined, syslogDest: API.SyslogDestItem) => Promise<void>;
  updateModalVisible: boolean;
  values: Partial<API.SyslogDestItem>;
  logs: API.LogItem[];
  onVisibleChange: (visible: boolean) => void;
};

const UpdateForm: React.FC<UpdateFormProps> = (props) => {

  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);

  useEffect(() => {
    const keys: React.Key[] = props.values.settings?.map(
      (setting) => setting.id as React.Key
    ) || [];
    setEditableRowKeys(keys);
  }, [props.values]);

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
    <ModalForm
      title='Update Destination'
      submitter={{
        searchConfig: {
          resetText: 'Cancel',
          submitText: 'Update'
        }
      }}
      onVisibleChange={props.onVisibleChange}
      visible={props.updateModalVisible}
      onFinish={async (value: API.SyslogDestItem) => {
        await props.onSubmit(props.values.id, value);
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
          initialValue={props.values.name}
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
          initialValue={props.values.target}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormSelect
          name="type"
          label="Type"
          valueEnum={{
            tcp: 'TCP',
            udp: 'UDP',
          }}
          width="md"
          placeholder="Please select destination type"
          rules={[{ required: true, message: 'Please select destination type' }]}
          initialValue={props.values.type}
        />
        <ProFormSelect
          name="log_id"
          label="Log"
          showSearch
          request={async () => {
            return props.logs.map(logItem => {
                return {label: logItem.name, value: logItem.id}
              }
            )
          }}
          width="md"
          placeholder="Please select associated log"
          rules={[{ required: true, message: 'Please select associated log' }]}
          initialValue={props.values.log_id}
        />
      </ProForm.Group>

      <ProForm.Item
        label="Settings"
        name="settings"
        initialValue={props.values.settings}
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
              id: Date.now(),
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
  );
};

export default UpdateForm;
