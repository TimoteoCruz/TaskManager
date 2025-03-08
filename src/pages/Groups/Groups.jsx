"use client"

import api from "../../services/api"
import { useState, useEffect } from "react"
import { Row, Col, Typography, Card, Button, Modal, Input, message, Form, Select } from "antd"

const { Title, Text } = Typography
const { Option } = Select

const getRandomColor = () => {
  const colors = [
    "#FF6F61",
    "#6B5B95",
    "#88B04B",
    "#F7CAC9",
    "#92A8D1",
    "#F7B7A3",
    "#FFB6C1",
    "#D9A7C7",
    "#FFD700",
    "#FF6347",
    "#32CD32",
    "#8A2BE2",
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}

const getUserIdFromToken = () => {
  const token = localStorage.getItem("token")
  if (!token) return null

  try {
    const [, payload] = token.split(".")
    const decodedPayload = JSON.parse(atob(payload))
    return decodedPayload.uid
  } catch (error) {
    console.error("Error al decodificar el token:", error)
    return null
  }
}

const userId = getUserIdFromToken()
console.log("ID del usuario logueado:", userId)

const Groups = () => {
  const [groups, setGroups] = useState([])
  const [isGroupModalVisible, setIsGroupModalVisible] = useState(false)
  const [groupName, setGroupName] = useState("")
  const [groupUsers, setGroupUsers] = useState([])
  const [userEmails, setUserEmails] = useState({})
  const [isTaskModalVisible, setIsTaskModalVisible] = useState(false)
  const [taskName, setTaskName] = useState("")
  const [selectedGroupId, setSelectedGroupId] = useState(null)
  const [selectedTask, setSelectedTask] = useState(null)
  const [allUsers, setAllUsers] = useState([]) 

  const [userId, setUserId] = useState(getUserIdFromToken())

  useEffect(() => {
    const handleStorageChange = () => {
      setUserId(getUserIdFromToken())
    }

    window.addEventListener("storage", handleStorageChange)
    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [])

  useEffect(() => {
    loadGroups()
  }, [])

  const loadGroups = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await api.get("/groups", {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.status === 200) {
        setGroups(response.data)
        fetchUserEmails(response.data)
      }
    } catch (error) {
      message.error("Hubo un error al cargar los grupos")
    }
  }

  const fetchUserEmails = async (groups) => {
    const userIds = new Set()
    groups.forEach((group) => group.users.forEach((userId) => userIds.add(userId)))

    try {
      const token = localStorage.getItem("token")
      const response = await api.get("/users", {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.status === 200) {
        console.log("Usuarios obtenidos del backend:", response.data)
        const userMap = {}
        response.data.forEach((user) => {
          if (userIds.has(user.id)) {
            userMap[user.id] = user.email
          }
        })
        console.log("Mapa de usuarios generado:", userMap)
        setUserEmails(userMap)
      }
    } catch (error) {
      message.error("Hubo un error al cargar los emails de los usuarios")
    }
  }

  const fetchAllUsers = async () => {
    // Added function to fetch all users
    try {
      const token = localStorage.getItem("token")
      const response = await api.get("/users", {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.status === 200) {
        console.log("Todos los usuarios:", response.data)
        setAllUsers(response.data)
      }
    } catch (error) {
      message.error("Hubo un error al cargar los usuarios")
    }
  }

  const handleCreateGroup = async () => {
    try {
      const token = localStorage.getItem("token")

      const response = await api.post(
        "/group",
        { groupName, users: groupUsers },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )

      if (response.status === 201) {
        message.success("Grupo creado correctamente")
        setIsGroupModalVisible(false)
        loadGroups()
      }
    } catch (error) {
      message.error("Hubo un error al crear el grupo")
    }
  }

  const handleCreateTask = async (values) => {
    try {
      const token = localStorage.getItem("token")
      console.log("Creating task with data:", {
        name: values.name,
        description: values.description,
        status: values.status,
        category: values.category,
        time: values.time,
        assignedUser: values.assignedUser,
      })

      const response = await api.post(
        `/group/${selectedGroupId}/task`,
        {
          name: values.name,
          description: values.description,
          status: values.status,
          category: values.category,
          time: values.time,
          assignedUser: values.assignedUser,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )

      if (response.status === 201) {
        message.success("Tarea creada correctamente")
        setIsTaskModalVisible(false)
        loadGroups()
      }
    } catch (error) {
      console.error("Error creating task:", error)
      message.error(`Hubo un error al crear la tarea: ${error.message}`)
    }
  }

  return (
    <Row gutter={16} style={{ marginBottom: "20px" }}>
      <Col span={24}>
        <Title level={4} style={{ textAlign: "center", color: "#1890ff" }}>
          Grupos
        </Title>
        {groups.length > 0 ? (
          <Row gutter={[16, 16]}>
            {groups.map((group) => (
              <Col span={8} key={group.id}>
                <Card
                  title={<Text style={{ color: "#000", fontWeight: "bold", fontSize: "18px" }}>{group.groupName}</Text>}
                  bordered={false}
                  style={{
                    backgroundColor: getRandomColor(),
                    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.3)",
                    borderRadius: "12px",
                    padding: "16px",
                    transition: "all 0.3s ease-in-out",
                    cursor: "pointer",
                    border: "1px solid #f0f0f0",
                  }}
                  hoverable
                >
                  <Text style={{ fontWeight: "bold", fontSize: "16px", color: "#000" }}>Creador:</Text>
                  <div
                    style={{
                      backgroundColor: userId === group.creatorId ? "green" : "black", // Resalta si el usuario es el creador
                      color: "#fff",
                      padding: "6px",
                      marginBottom: "6px",
                      borderRadius: "8px",
                      fontSize: "14px",
                    }}
                  >
                    {userEmails[group.creatorId] || "Cargando..."} {userId === group.creatorId && "(Tú)"}
                  </div>

                  <Text style={{ fontWeight: "bold", fontSize: "16px", color: "#000" }}>Usuarios:</Text>
                  {group.users.map((userId, index) => (
                    <div
                      key={userId}
                      style={{
                        backgroundColor: "black",
                        color: "#fff",
                        padding: "6px",
                        marginBottom: "6px",
                        borderRadius: "8px",
                        fontSize: "14px",
                      }}
                    >
                      {userEmails[userId] || "Cargando..."}
                    </div>
                  ))}

                  {userId === group.creatorId && (
                    <Button
                      type="primary"
                      style={{
                        marginTop: "10px",
                        backgroundColor: "green",
                        borderColor: "green",
                      }}
                      onClick={() => {
                        setSelectedGroupId(group.id)
                        setIsTaskModalVisible(true)
                        fetchAllUsers() 
                      }}
                    >
                      Crear tarea
                    </Button>
                  )}
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <Text>No perteneces a ningún grupo.</Text>
        )}
      </Col>

      <Button
        type="primary"
        style={{ marginTop: "20px" }}
        onClick={() => {
          setIsGroupModalVisible(true)
          fetchAllUsers() 
        }}
      >
        Crear Grupo
      </Button>

      <Modal
        title="Crear Grupo"
        visible={isGroupModalVisible}
        onCancel={() => setIsGroupModalVisible(false)}
        footer={null}
        width={700}
      >
        <Form onFinish={handleCreateGroup} layout="vertical">
          <Form.Item
            label="Nombre del Grupo"
            name="name"
            rules={[{ required: true, message: "Por favor ingresa el nombre" }]}
          >
            <Input onChange={(e) => setGroupName(e.target.value)} />
          </Form.Item>
          <Form.Item
            label="Agregar usuarios"
            name="users"
            rules={[{ required: true, message: "Por favor selecciona al menos un usuario" }]}
          >
            <Select
              mode="multiple"
              placeholder="Selecciona usuarios"
              style={{ width: "100%" }}
              onChange={(values) => setGroupUsers(values)}
            >
              {allUsers.map((user) => (
                <Option key={user.id} value={user.id}>
                  {user.email}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Crear Grupo
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Crear Nueva Tarea"
        visible={isTaskModalVisible}
        onCancel={() => setIsTaskModalVisible(false)}
        footer={null}
        width={700}
      >
        <Form initialValues={selectedTask || {}} onFinish={handleCreateTask} layout="vertical">
          <Form.Item
            label="Nombre de la tarea"
            name="name"
            rules={[{ required: true, message: "Por favor ingresa el nombre" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Descripción"
            name="description"
            rules={[{ required: true, message: "Por favor ingresa la descripción" }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item
            label="Estatus"
            name="status"
            rules={[{ required: true, message: "Por favor selecciona el estatus" }]}
          >
            <Select>
              <Option value="Pendiente">Pendiente</Option>
              <Option value="En Proceso">En Proceso</Option>
              <Option value="Completada">Completada</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Categoría"
            name="category"
            rules={[{ required: true, message: "Por favor selecciona la categoría" }]}
          >
            <Select>
              <Option value="Front End">Front End</Option>
              <Option value="Back End">Back End</Option>
              <Option value="Full Stack">Full Stack</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Fecha" name="time">
            <Input type="datetime-local" />
          </Form.Item>
          <Form.Item
            label="Asignar Usuario"
            name="assignedUser"
            rules={[{ required: true, message: "Por favor selecciona un usuario" }]}
          >
            <Select>
              {allUsers.map((user) => (
                <Option key={user.id} value={user.id}>
                  {user.email}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Crear Tarea
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Row>
  )
}

export default Groups

