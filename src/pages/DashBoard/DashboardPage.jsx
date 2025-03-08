import React, { useState, useEffect } from "react";
import { Button, Modal, Form, Input, Select, Card, message, Typography, Tag, Badge, Row, Col, Dropdown } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import axios from "axios";
import dayjs from "dayjs";
import api from "../../services/api";

const { Option } = Select;
const { Title, Text } = Typography;

const statusColors = {
  "In Progress": "#ffec3d",
  Done: "#52c41a",
  Paused: "#fa8c16",
  Revision: "#1890ff",
  Urgent: "#ff4d4f",
};

const DashboardPage = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [users, setUsers] = useState([]);
  
  const loadUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/users", {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.status === 200) {
        setUsers(response.data);
      }
    } catch (error) {
      message.error("Hubo un error al cargar los usuarios");
    }
  };

  useEffect(() => {
    loadUsers();
    loadTasks();
    
    const interval = setInterval(() => {
      loadTasks();
    }, 3000);

    return () => clearInterval(interval); 
  }, []);

  const loadTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/tasks", {
        headers: { Authorization: `Bearer ${token}` }
      });
  
      if (response.status === 200) {
        if (Array.isArray(response.data)) { 
          setTasks(response.data);
        } else {
          message.error("No se encontraron tareas.");
        }
      }
    } catch (error) {
      console.error("Error al obtener tareas:", error);
      message.error("Hubo un error al cargar las tareas");
    }
};

  


  const showModal = () => setIsModalVisible(true);
  const showDetailModal = (task) => {
    setSelectedTask(task);
    setIsDetailModalVisible(true);
  };

  const handleDetailModalCancel = () => setIsDetailModalVisible(false);

const onFinish = async (values) => {
  try {
    const token = localStorage.getItem("token");

    const taskData = {
      ...values,
      time: values.time || dayjs().toISOString(), 
    };

    const response = await api.post("/task", taskData, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (response.status === 201) {
      setTasks([...tasks, taskData]);
      setIsModalVisible(false);
      message.success("Tarea agregada correctamente");
    }
  } catch (error) {
    message.error("Hubo un error al agregar la tarea");
  }
};


  const handleStatusUpdate = async (taskId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.put(`/task/${taskId}`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
  
      if (response.status === 200) {
        setTasks(tasks.map(task => 
          task.id === taskId ? { ...task, status: newStatus } : task
        ));
        message.success("Estatus de tarea actualizado correctamente");
      }
    } catch (error) {
      message.error("Hubo un error al actualizar el estatus de la tarea");
    }
  };

  const groupedTasks = tasks.reduce((acc, task) => {
    // Clasificar tareas por su categoría
    if (task.dueDate && dayjs(task.dueDate).isBefore(dayjs())) {
      acc["Caducadas"] = acc["Caducadas"] || [];
      acc["Caducadas"].push(task);
    } else {
      if (task.category === "Personal") {
        acc["Personales"] = acc["Personales"] || [];
        acc["Personales"].push(task);
      } else if (task.category === "Group") {
        acc["Grupales"] = acc["Grupales"] || [];
        acc["Grupales"].push(task);
      } else {
        acc["Pendientes"] = acc["Pendientes"] || [];
        acc["Pendientes"].push(task);
      }
    }
    return acc;
  }, {});

  const handleEdit = (task) => {
    setSelectedTask(task);
    setIsModalVisible(true);
  };
  
  const handleUpdate = async (values) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.put(`/task/${selectedTask.id}`, values, {
        headers: { Authorization: `Bearer ${token}` }
      });
  
      if (response.status === 200) {
        setTasks(tasks.map(t => (t.id === selectedTask.id ? { ...t, ...values } : t)));
        setIsModalVisible(false);
        message.success("Tarea actualizada correctamente");
      }
    } catch (error) {
      message.error("Hubo un error al actualizar la tarea");
    }
  };

  const handleDelete = async (task) => {
    try {
      const confirmed = window.confirm("¿Estás seguro de que deseas eliminar esta tarea?");
      if (!confirmed) return;
  
      const token = localStorage.getItem("token");
      const response = await api.delete(`/task/${task.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
  
      if (response.status === 200) {
        setTasks(tasks.filter(t => t.id !== task.id));
        message.success("Tarea eliminada correctamente");
      }
    } catch (error) {
      message.error("Hubo un error al eliminar la tarea");
    }
  };

  const columns = [
    { title: "Nombre", dataIndex: "name", key: "name" },
    { title: "Estatus", dataIndex: "status", key: "status" },
    { title: "Descripción", dataIndex: "description", key: "description" },
    { title: "Hora", dataIndex: "time", key: "time", render: (text) => dayjs(text).format("YYYY-MM-DD HH:mm") },
    { title: "Categoria", dataIndex: "category", key: "category" },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <Title level={2}>Dashboard</Title>
      <Row gutter={16} style={{ marginBottom: "20px" }}>
        <Col span={8}>
          <Badge count={tasks.length} style={{ backgroundColor: "#52c41a" }}>
            <Title level={4}>Todas las Tareas</Title>
          </Badge>
        </Col>
      </Row>

      {Object.keys(groupedTasks).map((category) => (
        <div key={category} style={{ marginBottom: "20px" }}>
          <Title level={4} style={{ borderBottom: "2px solid #ddd", paddingBottom: "5px" }}>
            {category} <Badge count={groupedTasks[category].length} style={{ backgroundColor: "#1890ff" }} />
          </Title>

          <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
            {groupedTasks[category].map((task) => (
              <Card
                key={task.id}
                title={task.name}
                style={{
                  width: 280,
                  borderRadius: 10,
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                  borderLeft: `5px solid ${statusColors[task.status] || "#ccc"}`,
                }}
                hoverable
                extra={
                  <Dropdown
                    menu={{
                      items: [
                        { key: "In Progress", label: "In Progress" },
                        { key: "Done", label: "Done" },
                        { key: "Paused", label: "Paused" },
                        { key: "Revision", label: "Revision" },
                        { key: "Urgent", label: "Urgent" },
                      ],
                      onClick: ({ key }) => handleStatusUpdate(task.id, key),
                    }}
                  >
                    <Tag color={statusColors[task.status]}>{task.status}</Tag>
                  </Dropdown>
                }
              >
                <Text strong>Descripción:</Text> <Text type="secondary">{task.description}</Text>
                <br />
                <Text strong>Tiempo:</Text> <Text type="secondary">{dayjs(task.time).format("YYYY-MM-DD HH:mm")}</Text>
                <br />
                <Text strong>Asignado a:</Text>{" "}
                <Text type="secondary">{users.find((u) => u.id === task.assignedUser)?.name || "Sin asignar"}</Text>
              </Card>
            ))}
          </div>
        </div>
      ))}

      <Button
        type="primary"
        shape="circle"
        icon={<PlusOutlined />}
        style={{
          position: "fixed",
          bottom: 20,
          right: 20,
          width: 60,
          height: 60,
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)",
        }}
        onClick={showModal}
      />
      <Modal
        title={selectedTask ? "Editar Tarea" : "Agregar Nueva Tarea"}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={700}
      >
        <Form
          initialValues={selectedTask || {}}
          onFinish={selectedTask ? handleUpdate : onFinish}
          layout="vertical"
        >
          <Form.Item label="Nombre" name="name" rules={[{ required: true, message: "Por favor ingresa el nombre" }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Descripción" name="description" rules={[{ required: true, message: "Por favor ingresa la descripción" }]}>
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item label="Estatus" name="status" rules={[{ required: true, message: "Por favor selecciona el estatus" }]}>
            <Select>
              {Object.keys(statusColors).map((status) => (
                <Option key={status} value={status}>{status}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Categoria" name="category" rules={[{ required: true, message: "Por favor selecciona la categoría" }]}>
            <Select>
              <Option value="Personal">Personal</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Fecha de Vencimiento" name="dueDate">
            <Input type="date" />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            {selectedTask ? "Actualizar Tarea" : "Agregar Tarea"}
          </Button>
        </Form>
      </Modal>

      {selectedTask && (
        <Modal
          title="Detalles de la Tarea"
          visible={isDetailModalVisible}
          onCancel={handleDetailModalCancel}
          footer={null}
          width={700}
        >
          <div>
            <Text strong>Nombre:</Text> <Text>{selectedTask.name}</Text>
            <br />
            <Text strong>Descripción:</Text> <Text>{selectedTask.description}</Text>
            <br />
            <Text strong>Estatus:</Text> <Text>{selectedTask.status}</Text>
            <br />
            <Text strong>Fecha de Vencimiento:</Text> <Text>{dayjs(selectedTask.dueDate).format("YYYY-MM-DD")}</Text>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default DashboardPage;
