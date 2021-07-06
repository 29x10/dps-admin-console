import React, {useEffect, useState} from 'react';
import ProForm, {
  ProFormSelect, ModalForm,
} from '@ant-design/pro-form';
import type { ProColumns} from "@ant-design/pro-table";
import {EditableProTable} from "@ant-design/pro-table";

export type UpdateFormProps = {
  onSubmit: (id: number | undefined, syslogSource: API.SyslogSourceItem) => Promise<void>;
  updateModalVisible: boolean;
  values: Partial<API.SyslogSourceItem>;
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
      title='Update Source'
      submitter={{
        searchConfig: {
          resetText: 'Cancel',
          submitText: 'Update'
        }
      }}
      onVisibleChange={props.onVisibleChange}
      visible={props.updateModalVisible}
      onFinish={async (value: API.SyslogSourceItem) => {
        await props.onSubmit(props.values.id, value);
      }}
    >
      <ProForm.Group>
        <ProFormSelect
          name="type"
          label="Type"
          valueEnum={{
            tcp: 'TCP',
            udp: 'UDP',
          }}
          width="md"
          placeholder="Please select source protocol type"
          rules={[{ required: true, message: 'Please select source protocol type' }]}
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
