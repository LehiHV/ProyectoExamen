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
            $fecha = $_GET['Fecha'] ?? null;
            $idticket = $_GET['IdTicket'] ?? null;
            $abono = $_GET['Abono'] ?? null;
        
            if ($fecha && $idticket !== null && $abono !== null) {
                $formattedFecha = date('Y-m-d H:i:s', strtotime(str_replace('%20', ' ', $fecha))); // Formatear la fecha
        
                $query = "SELECT Credito, Total, Pagada FROM Ticket WHERE Id = $idticket";
                $result = $conn->query($query);
                if ($result->num_rows > 0) {
                    $ticket = $result->fetch_assoc();
                    $total = $ticket['Total'];
                    if ($total == 0) {
                        echo("No puedes abonar a una cuenta en 0");
                    } else {
                        $credito = $ticket['Credito'];
                        $abonoNumerico = is_numeric($abono) ? (float) $abono : 0;
        
                        if (in_array(strtolower($credito), array('si', 'sí'))) {
                            if ($abonoNumerico == $total) {
                                $insertQuery = "INSERT INTO Abonos (Fecha, IdTicket, Abono) VALUES ('$formattedFecha', $idticket, '$abono')";
                                if ($conn->query($insertQuery) === TRUE) {
                                    $updateQuery = "UPDATE Ticket SET Pagada = 'Si', Total = 0 WHERE Id = $idticket";
                                    if ($conn->query($updateQuery) === TRUE) {
                                        echo json_encode(array("message" => "Abono registrado y ticket marcado como pagado correctamente."));
                                    } else {
                                        echo json_encode(array("error" => "Error al marcar el ticket como pagado: " . $conn->error));
                                    }
                                } else {
                                    echo json_encode(array("error" => "Error al registrar el abono: " . $conn->error));
                                }
                            } elseif ($abonoNumerico > $total) {
                                $cambio = $abonoNumerico - $total;
                                $insertQuery = "INSERT INTO Abonos (Fecha, IdTicket, Abono) VALUES ('$formattedFecha', $idticket, '$abono')";
                                if ($conn->query($insertQuery) === TRUE) {
                                    $updateQuery = "UPDATE Ticket SET Pagada = 'Si' WHERE Id = $idticket";
                                    if ($conn->query($updateQuery) === TRUE) {
                                        echo json_encode(array("message" => "Abono registrado y ticket marcado como pagado. Cambio: $cambio"));
                                    } else {
                                        echo json_encode(array("error" => "Error al marcar el ticket como pagado: " . $conn->error));
                                    }
                                } else {
                                    echo json_encode(array("error" => "Error al registrar el abono: " . $conn->error));
                                }
                            } elseif ($abonoNumerico < $total) {
                                $insertQuery = "INSERT INTO Abonos (Fecha, IdTicket, Abono) VALUES ('$formattedFecha', $idticket, '$abono')";
                                if ($conn->query($insertQuery) === TRUE) {
                                    $newTotal = $total - $abonoNumerico;
                                    $updateTotalQuery = "UPDATE Ticket SET Total = $newTotal WHERE Id = $idticket";
                                    if ($conn->query($updateTotalQuery) === TRUE) {
                                        echo json_encode(array("message" => "Abono registrado y total actualizado correctamente."));
                                    } else {
                                        echo json_encode(array("error" => "Error al actualizar el total del ticket: " . $conn->error));
                                    }
                                } else {
                                    echo json_encode(array("error" => "Error al registrar el abono: " . $conn->error));
                                }
                            }
                        } else {
                            echo json_encode(array("error" => "El campo de crédito no permite abonos."));
                        }
                    }
                } else {
                    echo json_encode(array("error" => "No se encontró el Ticket correspondiente."));
                }
            } else {
                echo json_encode(array("error" => "Faltan parámetros"));
            }
            break;
        case "View":
            $sql = "SELECT * FROM Abonos";
            $result = $conn->query($sql);
            
            if ($result->num_rows > 0) {
                $abonos = array();
                while ($row = $result->fetch_assoc()) {
                    $abonos[] = $row;
                }
                echo json_encode($abonos);
            } else {
                echo json_encode(array("message" => "No se encontraron abonos"));
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
                $sql = "DELETE FROM Abonos WHERE Id=$id";

                if ($conn->query($sql) === TRUE) {
                    echo json_encode(array("message" => "Abono Eliminado correctamente"));
                } else {
                    echo json_encode(array("error" => "Error al actualizar Abono: " . $conn->error));
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