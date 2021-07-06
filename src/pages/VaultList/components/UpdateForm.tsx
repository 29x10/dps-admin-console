import React from 'react';
import ProForm, {
  ProFormSelect, ModalForm, ProFormText, ProFormRadio, ProFormDigit, ProFormTextArea
} from '@ant-design/pro-form';

export type UpdateFormProps = {
  onSubmit: (id: number | undefined, vault: API.VaultItem) => Promise<void>;
  updateModalVisible: boolean;
  values: Partial<API.VaultItem>;
  logs: API.LogItem[];
  onVisibleChange: (visible: boolean) => void;
};

const UpdateForm: React.FC<UpdateFormProps> = (props) => {

  return (
    <ModalForm
      title='Update Vault'
      submitter={{
        searchConfig: {
          resetText: 'Cancel',
          submitText: 'Update'
        }
      }}
      onVisibleChange={props.onVisibleChange}
      visible={props.updateModalVisible}
      onFinish={async (value: API.VaultItem) => {
        await props.onSubmit(props.values.id, value);
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
          initialValue={props.values.mon_type}
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
          initialValue={props.values.mon_collectorextractor}
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
          initialValue={props.values.mon_endpointextractor}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormText
          name="logdir"
          label="Log Location"
          width="md"
          placeholder="Please input log location"
          rules={[{ required: true, message: 'Please input log location' }]}
          initialValue={props.values.logdir}
        />
        <ProFormDigit
          name="logret"
          label="Log Retention"
          width="md"
          placeholder="Please input log retention in hour unit"
          rules={[{ required: true, message: 'Please input log retention in hour unit' }]}
          initialValue={props.values.logret}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormDigit
          name="mon_agealert"
          label="Alert Threshold"
          width="md"
          placeholder="Please input alert threshold"
          rules={[{ required: true, message: 'Please input alert threshold' }]}
          initialValue={props.values.mon_agealert}
        />
        <ProFormText
          name="volumename"
          label="Volume Name"
          width="md"
          placeholder="Please input MapR volume name"
          rules={[{ required: true, message: 'Please input MapR volume name' }]}
          initialValue={props.values.volumename}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormDigit
          name="minreplicas"
          label="Minimum Replicas"
          width="md"
          placeholder="Please input volume minimum replica number"
          rules={[{ required: true, message: 'Please input volume minimum replica number' }]}
          initialValue={props.values.minreplicas}
        />
        <ProFormDigit
          name="numreplicas"
          label="Number of Replicas"
          width="md"
          placeholder="Please input volume replica number"
          rules={[{ required: true, message: 'Please input volume replica number' }]}
          initialValue={props.values.numreplicas}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormDigit
          name="scheduleid"
          label="Schedule ID"
          width="md"
          placeholder="Please input volume scheduler ID"
          rules={[{ required: true, message: 'Please input volume scheduler ID' }]}
          initialValue={props.values.scheduleid}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormTextArea
          name="description"
          label="Description"
          width="xl"
          placeholder="Please input log description"
          rules={[{ required: true, message: 'Please input log description' }]}
          initialValue={props.values.description}
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
          initialValue={props.values.acl_users}
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
          initialValue={props.values.acl_groups}
        />
      </ProForm.Group>
    </ModalForm>
  );
};

export default UpdateForm;
