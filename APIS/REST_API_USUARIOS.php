<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Methods, Authorization, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Conexión a la base de datos
    $servername = "localhost";
    $username = "id21484007_lehiadmin";
    $password = "Spider1302.";
    $dbname = "id21484007_basedatosaplicaciones";
    $conn = new mysqli($servername, $username, $password, $dbname);
    if ($conn->connect_error) {
        die("Conexión fallida: " . $conn->connect_error);
    }
    $comando = $_GET['comando'] ?? null;

    switch($comando){
        case "Add":
            $nombre = $_GET['Nombre'] ?? null;
            $contrasena = $_GET['Contrasena'] ?? null;
            $nombretienda = $_GET['Nombre_Tienda'] ?? null;
            $logo = $_GET['Logo'] ?? null;
            
            if ($nombre && $contrasena && $nombretienda && $logo){
                $sql = "INSERT INTO Usuarios (Nombre, Contrasena, Nombre_Tienda, Logo) VALUES ('$nombre', '$contrasena', '$nombretienda', '$logo')";
                if ($conn->query($sql) === TRUE) {
                    echo json_encode(array("message" => "Usuario agregado correctamente"));
                }
                else {
                    echo json_encode(array("error" => "Faltan parámetros"));
                }
            }
            break;
        case "View":
            $id = $_GET['Id'] ?? null;

            if ($id) {
                $sql = "SELECT * FROM Usuarios WHERE Id=$id";
                $result = $conn->query($sql);

                if ($result->num_rows > 0) {
                    $usuario = $result->fetch_assoc();

                    // Obtener clientes asociados a este usuario
                    $clientes_query = "SELECT * FROM Clientes WHERE IdTienda = $id";
                    $clientes_result = $conn->query($clientes_query);

                    if ($clientes_result->num_rows > 0) {
                        $clientes_asociados = array();

                        while ($cliente_row = $clientes_result->fetch_assoc()) {
                            $clientes_asociados[] = $cliente_row;
                        }

                        $usuario['Clientes'] = $clientes_asociados; // Agregar clientes asociados al usuario
                    } else {
                        $usuario['Clientes'] = array(); // Si no hay clientes asociados, devolver un array vacío
                    }

                    echo json_encode($usuario);
                } else {
                    echo json_encode(array("message" => "No se encontró el usuario con el ID proporcionado"));
                }
            } else {
                // Si no se proporciona un ID, devolver todos los usuarios con clientes asociados
                $sql = "SELECT * FROM Usuarios";
                $result = $conn->query($sql);

                if ($result->num_rows > 0) {
                    $usuarios = array();

                    while ($row = $result->fetch_assoc()) {
                        $usuario_id = $row['Id'];
                        $clientes_asociados = array();

                        // Obtener clientes asociados a este usuario
                        $clientes_query = "SELECT * FROM Clientes WHERE IdTienda = $usuario_id";
                        $clientes_result = $conn->query($clientes_query);

                        if ($clientes_result->num_rows > 0) {
                            while ($cliente_row = $clientes_result->fetch_assoc()) {
                                $clientes_asociados[] = $cliente_row;
                            }
                        }

                        $row['Clientes'] = $clientes_asociados; // Agregar clientes asociados al usuario
                        $usuarios[] = $row;
                    }

                    echo json_encode($usuarios);
                } else {
                    echo json_encode(array("message" => "No se encontraron usuarios"));
                }
            }
            break;
        case "Update":
            $id = $_GET['Id'] ?? null;
            $nombre = $_GET['Nombre'] ?? null;
            $contrasena = $_GET['Contrasena'] ?? null;
            $nombretienda = $_GET['Nombre_Tienda'] ?? null;
            $logo = $_GET['Logo'] ?? null;

            if ($id && $nombre && $contrasena && $nombretienda && $logo) {
                $sql = "UPDATE Usuarios SET Nombre='$nombre', Contrasena='$contrasena', Nombre_Tienda='$nombretienda', Logo='$logo' WHERE Id=$id";

                if ($conn->query($sql) === TRUE) {
                    echo json_encode(array("message" => "Usuario actualizado correctamente"));
                } else {
                    echo json_encode(array("error" => "Error al actualizar usuario: " . $conn->error));
                }
            } else {
                echo json_encode(array("error" => "Faltan parámetros"));
            }
            break;
        case "Delete":
            $id = $_GET['Id'] ?? null;

            if ($id) {
                $sql = "DELETE FROM Usuarios WHERE Id=$id";

                if ($conn->query($sql) === TRUE) {
                    echo json_encode(array("message" => "Usuario Eliminado correctamente"));
                } else {
                    echo json_encode(array("error" => "Error al actualizar usuario: " . $conn->error));
                }
            } else {
                echo json_encode(array("error" => "Faltan parámetros"));
            }
            break;
        case "Login":
            $usuario = $_GET['Nombre'] ?? null;
            $contrasena = $_GET['Contrasena'] ?? null;
        
            if ($usuario && $contrasena) {
                // Verificar si existe un registro con el usuario y contraseña proporcionados
                $sql = "SELECT * FROM Usuarios WHERE Nombre='$usuario' AND Contrasena='$contrasena'";
                $result = $conn->query($sql);
        
                if ($result->num_rows > 0) {
                    $usuarioEncontrado = $result->fetch_assoc();
        
                    // Ahora, obtenemos los clientes asociados al usuario
                    $idUsuario = $usuarioEncontrado['Id'];
                    $sqlClientes = "SELECT * FROM Clientes WHERE IdTienda='$idUsuario'";
                    $resultClientes = $conn->query($sqlClientes);
        
                    if ($resultClientes->num_rows > 0) {
                        // Si hay clientes asociados, los agregamos al arreglo
                        $clientes = array();
                        while ($cliente = $resultClientes->fetch_assoc()) {
                            $clientes[] = $cliente;
                        }
        
                        $usuarioEncontrado['Clientes'] = $clientes;
                    }
        
                    echo json_encode($usuarioEncontrado);
                } else {
                    echo json_encode(array("message" => "Usuario no encontrado"));
                }
            } else {
                echo json_encode(array("error" => "Faltan parámetros"));
            }
            break;


        default:
                echo json_encode(array("error" => "Comando no reconocido"));
            break;
    }

    $conn->close();
}
?>