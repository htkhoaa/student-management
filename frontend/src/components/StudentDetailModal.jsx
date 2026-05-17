import React from 'react';
import { Modal, Descriptions, Badge } from 'antd';

const StudentDetailsModal = ({ visible, data, onClose }) => {
  // Render nothing if no student data is provided
  if (!data) return null;

  return (
    <Modal
      title="Student Profile"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={600}
      centered
    >
      <div style={{ padding: '10px 0' }}>
        <Descriptions
          bordered
          column={1}
          labelStyle={{ fontWeight: 600, width: 150, background: '#f9fafb' }}
        >
          {/* Student Account Information */}
          <Descriptions.Item label="Student ID">
            {data.username}
          </Descriptions.Item>

          <Descriptions.Item label="Full Name">
            {data.full_name}
          </Descriptions.Item>

          <Descriptions.Item label="Email Address">
            {data.email}
          </Descriptions.Item>

          <Descriptions.Item label="Gender">
            <span style={{ textTransform: 'capitalize' }}>
              {data.gender?.toLowerCase()}
            </span>
          </Descriptions.Item>

          {/* Academic Information */}
          <Descriptions.Item label="Class">
            {data.class_name}
          </Descriptions.Item>

          <Descriptions.Item label="Phone Number">
            {data.phone || 'N/A'}
          </Descriptions.Item>

          {/* Account Status */}
          <Descriptions.Item label="Status">
            {data.is_active ? (
              <Badge status="success" text="Active" />
            ) : (
              <Badge status="error" text="Inactive" />
            )}
          </Descriptions.Item>
        </Descriptions>
      </div>
    </Modal>
  );
};

export default StudentDetailsModal;