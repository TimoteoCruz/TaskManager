import React, { useState, useEffect } from "react";
import { Button, Modal, Form, Input, Select, Card, message, Typography, Tag, Badge, Row, Col, Table } from "antd";
import { PlusOutlined, FilterOutlined, BellOutlined, EditOutlined, DeleteOutlined, UserAddOutlined } from "@ant-design/icons";
import axios from "axios";
import dayjs from "dayjs";
import { jwtDecode } from "jwt-decode";
import { Dropdown } from "antd";


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
  const [groups, setGroups] = useState([]);
  const [isGroupModalVisible, setIsGroupModalVisible] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [groupUsers, setGroupUsers] = useState([]);


const loadUsers = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get("http://localhost:3000/users", {
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
  loadGroups();
}, []);

const token = localStorage.getItem('token');

if (token) {
  try {
    // Decodificar el token para obtener el payload
    const decoded = jwtDecode(token);
    const userId = decoded.uid; 
    
    // Guardar el userId en localStorage
    localStorage.setItem('userId', userId);

    console.log('userId del token:', userId);

  } catch (error) {
    console.error("Error al decodificar el token", error);
  }
}


 const loadGroups = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get("http://localhost:3000/groups", {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (response.status === 200) {
      setGroups(response.data);
    }
  } catch (error) {
    message.error("Hubo un error al cargar los grupos");
  }
};

  const showModal = () => setIsModalVisible(true);
  const showDetailModal = (task) => {
    setSelectedTask(task);
    setIsDetailModalVisible(true);
  };
  const showUserModal = (task) => {
    setSelectedTask(task);
  };
  const handleDetailModalCancel = () => setIsDetailModalVisible(false);

const loadTasks = async () => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:3000/tasks", {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (response.status === 200) {
            // Asegúrate de que response.data contiene la propiedad 'tasks' y que sea un array
            if (Array.isArray(response.data.tasks)) {
                setTasks(response.data.tasks); // Establece las tareas correctamente
            } else {
                message.error("No se encontraron tareas.");
            }
        }
    } catch (error) {
        message.error("Hubo un error al cargar las tareas");
    }
};



  useEffect(() => {
    loadTasks();
  }, []);

  const onFinish = async (values) => {
    try {
      const token = localStorage.getItem("token");
      const endpoint = hasPermission
        ? `http://localhost:3000/group/${values.groupId}/task` // Si tiene permisos, usa el endpoint del grupo
        : "http://localhost:3000/task"; // Si no tiene permisos, usa el endpoint general de tareas
  
      const response = await axios.post(endpoint, values, {
        headers: { Authorization: `Bearer ${token}` }
      });
  
      if (response.status === 201) {
        setTasks([...tasks, values]);
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
      const response = await axios.put(`http://localhost:3000/task/${taskId}`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
  
      if (response.status === 200) {
        // Actualiza la lista de tareas con el nuevo estado
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
    acc[task.category] = acc[task.category] || [];
    acc[task.category].push(task);
    return acc;
  }, {});

  const handleEdit = (task) => {
    setSelectedTask(task);
    setIsModalVisible(true);
  };
  
  const handleUpdate = async (values) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(`http://localhost:3000/task/${selectedTask.id}`, values, {
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
      const response = await axios.delete(`http://localhost:3000/task/${task.id}`, {
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

  const handleCreateGroup = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post("http://localhost:3000/group", { groupName, users: groupUsers }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.status === 201) {
        message.success("Grupo creado correctamente");
        setIsGroupModalVisible(false);
        loadGroups();
      }
    } catch (error) {
      message.error("Hubo un error al crear el grupo");
    }
  };
  const userId = localStorage.getItem('userId');
  
  const hasPermission = userId && groups.some(group => group.creatorId === userId);
console.log("hasPermission:", hasPermission);


  const handleGroupModalCancel = () => setIsGroupModalVisible(false);
  
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
    <Title level={4}>Grupos</Title>
    {groups.length > 0 ? (
      <div>
        {groups.map((group) => (
          <Tag key={group.id} color="blue" style={{ marginBottom: "5px" }}>
            {group.groupName}
          </Tag>
        ))}
      </div>
    ) : (
      <Text>No perteneces a ningún grupo.</Text>
    )}
  </Col>
</Row>


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
  title={selectedTask ? "Editar Tarea" : "Agregar Tarea"}
  open={isModalVisible}
  onCancel={() => {
    setIsModalVisible(false);
    setSelectedTask(null);
  }}
  footer={null}
>
  <Form
    layout="vertical"
    initialValues={selectedTask || {}}
    onFinish={selectedTask ? handleUpdate : onFinish}
  >

<Form.Item 
  name="groupId" 
  label="Selecciona un Grupo" 
  rules={[{ required: hasPermission, message: "Selecciona un grupo" }]}
>
  {hasPermission ? (
    <Select placeholder="Selecciona un grupo">
      {groups.map((group) => (
        <Option key={group.id} value={group.id}>
          {group.groupName}
        </Option>
      ))}
    </Select>
  ) : (
    <Text>No tienes permisos para asignar grupos.</Text>
  )}
</Form.Item>

<Form.Item 
  name="assignedUser" 
  label="Usuario Asignado" 
  rules={[{ required: hasPermission, message: "Selecciona un usuario asignado" }]}
>
  {hasPermission ? (
    <Select placeholder="Selecciona un usuario">
      {users.map((user) => (
        <Option key={user.id} value={user.id}>
          {user.email}
        </Option>
      ))}
    </Select>
  ) : (
    <Text>No tienes permisos para asignar un usuario.</Text>
  )}
</Form.Item>

    <Form.Item name="name" label="Nombre de la Tarea" rules={[{ required: true, message: "Introduce un nombre" }]}>
      <Input />
    </Form.Item>
    <Form.Item name="description" label="Descripción">
      <Input.TextArea rows={3} />
    </Form.Item>
    <Form.Item name="time" label="Recordarme">
      <Input type="datetime-local" />
    </Form.Item>
    <Form.Item name="status" label="Estatus" rules={[{ required: true, message: "Selecciona un estatus" }]}>
      <Select>
        <Option value="In Progress">En progreso</Option>
        <Option value="Done">Hecho</Option>
        <Option value="Paused">Pausado</Option>
        <Option value="Revision">Revisión</Option>
        <Option value="Urgent">Urgente</Option>
      </Select>
    </Form.Item>
    <Form.Item name="category" label="Categoría" rules={[{ required: true, message: "Selecciona una categoría" }]}>
  <Select placeholder="Selecciona una categoría">
    <Option value="Trabajo">Trabajo</Option>
    <Option value="Estudio">Estudio</Option>
    <Option value="Personal">Personal</Option>
  </Select>
</Form.Item>
    <Form.Item>
      <Button type="primary" htmlType="submit">
        {selectedTask ? "Actualizar Tarea" : "Crear Tarea"}
      </Button>
    </Form.Item>
  </Form>
</Modal>


      {selectedTask && (
        <Modal
          title="Detalle de Tarea"
          open={isDetailModalVisible}
          onCancel={handleDetailModalCancel}
          footer={null}
          bodyStyle={{ padding: "20px", animation: "fadeIn 0.5s ease" }}
          centered
        >
          <Table
            columns={columns}
            dataSource={[selectedTask]}
            pagination={false}
            rowKey="name"
            bordered
            style={{ marginTop: "20px" }}
          />
        </Modal>
      )}
      <Button
        type="dark"
        shape="circle"
        icon={<PlusOutlined />}
        style={{
          position: "fixed",
          bottom: 20,
          right: 150,
          width: 60,
          height: 60,
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)",
        }}
        onClick={() => setIsGroupModalVisible(true)}
      />
    <Modal
        title="Crear Grupo"
        visible={isGroupModalVisible}
        onCancel={handleGroupModalCancel}
        footer={null}
      >
        <Form onFinish={handleCreateGroup} layout="vertical">
          <Form.Item
            label="Nombre del Grupo"
            name="groupName"
            rules={[{ required: true, message: "Introduce un nombre para el grupo" }]}
          >
            <Input onChange={(e) => setGroupName(e.target.value)} />
          </Form.Item>

          <Form.Item
            label="Usuarios"
            name="users"
            rules={[{ required: true, message: "Selecciona al menos un usuario" }]}
          >
            <Select
              mode="multiple"
              allowClear
              placeholder="Selecciona los usuarios"
              onChange={setGroupUsers}
            >
              {users.map((user) => (
                <Option key={user.id} value={user.id}>
                  {user.email}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
            Crear Grupo
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default DashboardPage;
