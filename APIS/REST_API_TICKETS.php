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
        case "TicketId":
            $ticketId = $_GET['Id'] ?? null;
        
            if ($ticketId) {
                // Obtener información del ticket
                $sqlTicket = "SELECT * FROM Ticket WHERE Id = $ticketId";
                $resultTicket = $conn->query($sqlTicket);
        
                if ($resultTicket->num_rows > 0) {
                    $ticket = $resultTicket->fetch_assoc();
        
                    // Verificar si el ticket tiene un registro en la tabla 'Abonos'
                    $sqlCheckAbonos = "SELECT COUNT(*) AS AbonosCount FROM Abonos WHERE IdTicket = $ticketId";
                    $resultAbonosCheck = $conn->query($sqlCheckAbonos);
                    $abonosCount = $resultAbonosCheck->fetch_assoc()['AbonosCount'];
        
                    if ($abonosCount == 0) {
                        // No hay registros en la tabla 'Abonos' para este ticket, entonces actualiza 'Total'
                        $sqlSum = "SELECT COALESCE(SUM(Precio), 0) AS TotalPrecio FROM DetalleTicket WHERE IdTicket = $ticketId";
                        $resultSum = $conn->query($sqlSum);
                        $totalPrice = $resultSum->fetch_assoc()['TotalPrecio'];
        
                        // Actualizar el campo 'Total' en la tabla 'Ticket' con la suma obtenida
                        $sqlUpdateTotal = "UPDATE Ticket SET Total = $totalPrice WHERE Id = $ticketId";
                        $conn->query($sqlUpdateTotal);
                    }
        
                    // Obtener detalles de DetalleTicket para este ticket
                    $sqlDetalleTicket = "SELECT * FROM DetalleTicket WHERE IdTicket = $ticketId";
                    $resultDetalleTicket = $conn->query($sqlDetalleTicket);
                    $detalleTickets = array();
                    while ($detalleRow = $resultDetalleTicket->fetch_assoc()) {
                        $detalleTickets[] = $detalleRow;
                    }
        
                    // Obtener detalles de Abonos para este ticket
                    $sqlAbonos = "SELECT * FROM Abonos WHERE IdTicket = $ticketId";
                    $resultAbonos = $conn->query($sqlAbonos);
                    $abonos = array();
                    while ($abonoRow = $resultAbonos->fetch_assoc()) {
                        $abonos[] = $abonoRow;
                    }
        
                    // Agregar detalles de DetalleTicket y Abonos al registro del ticket
                    $ticket["DetalleTicket"] = $detalleTickets;
                    $ticket["Abonos"] = $abonos;
        
                    echo json_encode($ticket);
                } else {
                    echo json_encode(array("message" => "No se encontró el ticket con el Id proporcionado"));
                }
            } else {
                echo json_encode(array("error" => "Falta el parámetro Id"));
            }
            break;
        case "View":
            $sql = "SELECT * FROM Ticket";
            $result = $conn->query($sql);

            if ($result->num_rows > 0) {
                $tickets = array();
                while($row = $result->fetch_assoc()) {
                    $ticketId = $row["Id"];

                    // Verificar si el ticket tiene un registro en la tabla 'Abonos'
                    $sqlCheckAbonos = "SELECT COUNT(*) AS AbonosCount FROM Abonos WHERE IdTicket = $ticketId";
                    $resultAbonosCheck = $conn->query($sqlCheckAbonos);
                    $abonosCount = $resultAbonosCheck->fetch_assoc()['AbonosCount'];

                    if ($abonosCount == 0) {
                        // No hay registros en la tabla 'Abonos' para este ticket, entonces actualiza 'Total'
                        $sqlSum = "SELECT COALESCE(SUM(Precio), 0) AS TotalPrecio FROM DetalleTicket WHERE IdTicket = $ticketId";
                        $resultSum = $conn->query($sqlSum);
                        $totalPrice = $resultSum->fetch_assoc()['TotalPrecio'];

                        // Actualizar el campo 'Total' en la tabla 'Ticket' con la suma obtenida
                        $sqlUpdateTotal = "UPDATE Ticket SET Total = $totalPrice WHERE Id = $ticketId";
                        $conn->query($sqlUpdateTotal);
                    }

                    // Obtener detalles de DetalleTicket para este ticket
                    $sqlDetalleTicket = "SELECT * FROM DetalleTicket WHERE IdTicket = $ticketId";
                    $resultDetalleTicket = $conn->query($sqlDetalleTicket);
                    $detalleTickets = array();
                    while ($detalleRow = $resultDetalleTicket->fetch_assoc()) {
                        $detalleTickets[] = $detalleRow;
                    }

                    // Obtener detalles de Abonos para este ticket
                    $sqlAbonos = "SELECT * FROM Abonos WHERE IdTicket = $ticketId";
                    $resultAbonos = $conn->query($sqlAbonos);
                    $abonos = array();
                    while ($abonoRow = $resultAbonos->fetch_assoc()) {
                        $abonos[] = $abonoRow;
                    }

                    // Resto de tu lógica...
                    // ...

                    // Agregar detalles de DetalleTicket y Abonos al registro del ticket
                    $row["DetalleTicket"] = $detalleTickets;
                    $row["Abonos"] = $abonos;

                    $tickets[] = $row;
                }
                echo json_encode($tickets);
            } else {
                echo json_encode(array("message" => "No se encontraron tickets"));
            }
            break;
        case "Add":
            $fecha = $_GET['Fecha'] ?? null;
            $idCliente = $_GET['IdCliente'] ?? null;
            $credito = $_GET['Credito'] ?? null;
        
            if ($fecha && $idCliente !== null && $credito !== null) {
                $formattedFecha = date('Y-m-d H:i:s', strtotime(str_replace('%20', ' ', $fecha))); // Formatear la fecha
        
                $sql = "INSERT INTO Ticket (Fecha, IdCliente,Total, Credito, Pagada) VALUES ('$formattedFecha', $idCliente,'0' , '$credito', 'No')";
        
                if ($conn->query($sql) === TRUE) {
                    // Obtener el Id generado durante la inserción
                    $lastId = $conn->insert_id;
                    
                    // Crear un array con el mensaje y el valor de Id
                    $response = array(
                        "message" => "Ticket agregado correctamente",
                        "id" => $lastId
                    );
        
                    // Enviar la respuesta como JSON
                    echo json_encode($response);
                } else {
                    echo json_encode(array("error" => "Error al agregar el ticket: " . $conn->error));
                }
            } else {
                echo json_encode(array("error" => "Faltan parámetros"));
            }
            break;
        case "Update":
            $id = $_GET['Id'] ?? null;
            $fecha = $_GET['Fecha'] ?? null;
            $idCliente = $_GET['IdCliente'] ?? null;
            $credito = $_GET['Credito'] ?? null;
            $pagada = $_GET['Pagada'] ?? null;
        
            if ($id && $fecha && $idCliente !== null && $credito !== null && $pagada !== null) {
                $formattedFecha = date('Y-m-d H:i:s', strtotime(str_replace('%20', ' ', $fecha))); // Formatear la fecha
        
                $sql = "UPDATE Tickets SET Fecha='$formattedFecha', IdCliente=$idCliente, Credito='$credito', Pagada='$pagada' WHERE Id=$id";
        
                if ($conn->query($sql) === TRUE) {
                    echo json_encode(array("message" => "Ticket actualizado correctamente"));
                } else {
                    echo json_encode(array("error" => "Error al actualizar el ticket: " . $conn->error));
                }
            } else {
                echo json_encode(array("error" => "Faltan parámetros"));
            }
            break;
        case "Delete":
            $id = $_GET['Id'] ?? null;

            if ($id) {
                $sql = "DELETE FROM Ticket WHERE Id=$id";

                if ($conn->query($sql) === TRUE) {
                    echo json_encode(array("message" => "Ticket Eliminado correctamente"));
                } else {
                    echo json_encode(array("error" => "Error al actualizar Ticket: " . $conn->error));
                }
            } else {
                echo json_encode(array("error" => "Faltan parámetros"));
            }
            break;
        default:
                echo json_encode(array("error" => "Comando no reconocido"));
            break;
        case "Reports":
            $fechaInicial = $_GET['FechaInicial'] ?? null;
            $fechaFinal = $_GET['FechaFinal'] ?? null;
            $idTienda = $_GET['IdTienda'] ?? null;
        
            if ($fechaInicial && $fechaFinal && $idTienda) {
                $formattedFechaInicial = date('Y-m-d', strtotime($fechaInicial));
                $formattedFechaFinal = date('Y-m-d', strtotime($fechaFinal));
        
                // Obtener todos los clientes de la tienda
                $sqlClientes = "SELECT * FROM Clientes WHERE IdTienda = $idTienda";
                $resultClientes = $conn->query($sqlClientes);
        
                if ($resultClientes->num_rows > 0) {
                    $tickets = array();
        
                    while ($cliente = $resultClientes->fetch_assoc()) {
                        $idCliente = $cliente["Id"];
        
                        // Obtener todos los Tickets del cliente dentro del rango de fechas
                        $sqlTickets = "
                            SELECT Ticket.*
                            FROM Ticket
                            WHERE IdCliente = $idCliente
                              AND DATE_FORMAT(Ticket.Fecha, '%Y-%m-%d') BETWEEN '$formattedFechaInicial' AND '$formattedFechaFinal'
                        ";
        
                        $resultTickets = $conn->query($sqlTickets);
        
                        while ($ticket = $resultTickets->fetch_assoc()) {
                            $ticketId = $ticket["Id"];
        
                            // Obtener detalles de DetalleTicket para este ticket
                            $sqlDetalleTicket = "SELECT * FROM DetalleTicket WHERE IdTicket = $ticketId";
                            $resultDetalleTicket = $conn->query($sqlDetalleTicket);
                            $detalleTickets = array();
        
                            while ($detalleRow = $resultDetalleTicket->fetch_assoc()) {
                                $detalleTickets[] = $detalleRow;
                            }
        
                            // Agregar detalles de DetalleTicket al registro del ticket
                            $ticket["DetalleTicket"] = $detalleTickets;
                            $tickets[] = $ticket;
                        }
                    }
        
                    echo json_encode($tickets);
                } else {
                    echo json_encode(array("message" => "No se encontraron clientes para la tienda proporcionada"));
                }
            } else {
                echo json_encode(array("error" => "Faltan parámetros"));
            }
            break;
    }
    $conn->close();
}
?>