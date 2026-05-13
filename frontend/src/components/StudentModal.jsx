import React, { useState, useEffect } from 'react';
import { Modal, message, Select, Input } from 'antd';
import axios from '../api/axiosConfig';

const StudentModal = ({ visible, onClose, onSuccess, initialData = null }) => {
  const [loading, setLoading] = useState(false);
  const [classes, setClasses] = useState([]);
  const [formData, setFormData] = useState({
    full_name: '',
    class_id: null,
    gender: 'FEMALE',
    phone: ''
  });

  const isEdit = !!initialData;

  useEffect(() => {
    if (visible) {
      // Load classes list
      axios.get('/api/v1/classes?limit=100').then(res => setClasses(res.data || []));

      // If Edit mode, pre-fill the form with existing data
      if (initialData) {
        setFormData({
          full_name: initialData.full_name || '',
          class_id: initialData.class_id || null,
          gender: initialData.gender || 'FEMALE',
          phone: initialData.phone || ''
        });
      } else {
        // If Create mode, reset form fields
        setFormData({ full_name: '', class_id: null, gender: 'FEMALE', phone: '' });
      }
    }
  }, [visible, initialData]);

  const handleConfirm = async () => {
    if (!formData.full_name || !formData.class_id) {
      return message.warning('Please fill in Name and Class');
    }

    // Check if there are any changes (For Edit mode)
    if (isEdit) {
      const isUnchanged =
        formData.full_name === initialData.full_name &&
        formData.class_id === initialData.class_id &&
        formData.gender === initialData.gender &&
        formData.phone === (initialData.phone || '');

      if (isUnchanged) {
        message.success('Update successful (no changes made)');
        onClose();
        return;
      }
    }

    setLoading(true);
    try {
      const payload = { ...formData, gender: formData.gender.toUpperCase() };

      if (isEdit) {
        await axios.put(`/api/v1/students/${initialData.id}`, payload);
        message.success('Student updated successfully');
      } else {
        await axios.post('/api/v1/students', payload);
        message.success('Student registered successfully');
      }

      onSuccess();
      onClose();
    } catch (err) {
      const errorData = err.response?.data;
      message.error(errorData?.message || 'Action failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      width={520}
      styles={{ body: { padding: '40px 50px' } }}
      centered
    >
      <div style={{ textAlign: 'center', marginBottom: 35 }}>
        <h2 style={ms.modalTitle}>{isEdit ? 'Edit Student' : 'New Student'}</h2>
        <p style={ms.modalSub}>{isEdit ? 'Modify student information' : 'Register a new student system'}</p>
      </div>

      <div style={ms.formStack}>
        <div style={ms.field}>
          <label style={ms.inputLabel}>Full Name *</label>
          <Input
            style={ms.input}
            value={formData.full_name}
            onChange={e => setFormData({...formData, full_name: e.target.value})}
          />
        </div>
        <div style={ms.field}>
          <label style={ms.inputLabel}>Class *</label>
          <Select
            style={{ width: '100%', height: 42 }}
            value={formData.class_id}
            onChange={val => setFormData({...formData, class_id: val})}
          >
            {classes.map(c => <Select.Option key={c.id} value={c.id}>{c.name}</Select.Option>)}
          </Select>
        </div>
        <div style={ms.field}>
          <label style={ms.inputLabel}>Gender</label>
          <Select
            style={{ width: '100%', height: 42 }}
            value={formData.gender}
            onChange={val => setFormData({...formData, gender: val})}
          >
            <Select.Option value="MALE">Male</Select.Option>
            <Select.Option value="FEMALE">Female</Select.Option>
          </Select>
        </div>
        <div style={ms.field}>
          <label style={ms.inputLabel}>Phone</label>
          <Input
            style={ms.input}
            value={formData.phone}
            onChange={e => setFormData({...formData, phone: e.target.value})}
          />
        </div>
      </div>

      <button style={ms.submitBtn} onClick={handleConfirm} disabled={loading}>
        {loading ? 'Processing...' : (isEdit ? 'Update Student' : 'Register Student')}
      </button>
    </Modal>
  );
};

const ms = {
  modalTitle: { fontSize: 24, fontWeight: 800, color: '#111', margin: 0 },
  modalSub: { fontSize: 14, color: '#6b7280', marginTop: 8 },
  formStack: { display: 'flex', flexDirection: 'column', gap: 20 },
  field: { display: 'flex', flexDirection: 'column', gap: 8 },
  inputLabel: { fontSize: 13, fontWeight: 600, color: '#374151' },
  input: { borderRadius: 10, padding: '10px 14px', border: '1px solid #d1d5db' },
  submitBtn: {
    width: '100%', marginTop: 30, padding: '14px', background: '#e91e8c',
    color: '#fff', border: 'none', borderRadius: 12, fontWeight: 700, cursor: 'pointer'
  }
};

export default StudentModal;