import api from "../../services/api"
import { useState, useEffect } from "react"
import { Row, Col, Typography, Card, message, Button, Input } from "antd"
import axios from "axios"
import Swal from "sweetalert2"

const { Title, Text } = Typography

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

const UserGroups = () => {
  const [groups, setGroups] = useState([])
  const [userEmails, setUserEmails] = useState({})
  const [newUserEmail, setNewUserEmail] = useState("")
  const userId = getUserIdFromToken()

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
        const userMap = {}
        response.data.forEach((user) => {
          if (userIds.has(user.id)) {
            userMap[user.id] = user.email
          }
        })
        setUserEmails(userMap)
      }
    } catch (error) {
      message.error("Hubo un error al cargar los emails de los usuarios")
    }
  }

  const grantAdmin = async (groupId, newCreatorId) => {
    // Mostrar confirmación con SweetAlert2
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: `¿Quieres transferir los permisos de administrador a ${userEmails[newCreatorId]}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, transferir",
      cancelButtonText: "Cancelar",
    })

    // Si el usuario confirma
    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem("token")
        await api.patch(
          `/groups/${groupId}`,
          { creatorId: newCreatorId },
          { headers: { Authorization: `Bearer ${token}` } },
        )

        // Mostrar alerta de éxito
        Swal.fire({
          title: "¡Transferido!",
          text: `${userEmails[newCreatorId]} ahora es el administrador del grupo`,
          icon: "success",
          timer: 2000,
          timerProgressBar: true,
        })

        loadGroups() // Recargar grupos para reflejar el cambio
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: "Error al otorgar permisos de creador",
          icon: "error",
        })
      }
    }
  }

  const addUserToGroup = async (groupId) => {
    try {
      const token = localStorage.getItem("token")
      await api.post(
        `/groups/${groupId}/add-user`,
        { email: newUserEmail },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      message.success("Usuario agregado al grupo")
      setNewUserEmail("")
      loadGroups()
    } catch (error) {
      message.error("Error al agregar usuario al grupo")
    }
  }

  return (
    <Row gutter={[16, 16]}>
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
                    cursor: "pointer",
                  }}
                  hoverable
                >
                  <Text style={{ fontWeight: "bold", fontSize: "16px", color: "#000" }}>Creador:</Text>
                  <div
                    style={{
                      backgroundColor: userId === group.creatorId ? "green" : "black",
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
                  {group.users.map((uId) => (
                    <div
                      key={uId}
                      style={{
                        backgroundColor: "black",
                        color: "#fff",
                        padding: "6px",
                        marginBottom: "6px",
                        borderRadius: "8px",
                        fontSize: "14px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      {userEmails[uId] || "Cargando..."}
                      {userId === group.creatorId && userId !== uId && (
                        <Button size="small" type="primary" onClick={() => grantAdmin(group.id, uId)}>
                          Dar Admin
                        </Button>
                      )}
                    </div>
                  ))}

                  {userId === group.creatorId && (
                    <div>
                      <Input
                        placeholder="Correo del usuario"
                        value={newUserEmail}
                        onChange={(e) => setNewUserEmail(e.target.value)}
                      />
                      <Button type="primary" onClick={() => addUserToGroup(group.id)}>
                        Agregar Usuario
                      </Button>
                    </div>
                  )}
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <Text>No perteneces a ningún grupo.</Text>
        )}
      </Col>
    </Row>
  )
}

export default UserGroups

