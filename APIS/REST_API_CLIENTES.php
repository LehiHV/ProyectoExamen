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
        case "ClientId":
            $tiendaId = $_GET['TiendaId'] ?? null;
        
            if ($tiendaId) {
                $sql = "SELECT * FROM Clientes WHERE IdTienda = $tiendaId";
                $result = $conn->query($sql);
        
                if ($result->num_rows > 0) {
                    $clientes = array();
        
                    while ($cliente = $result->fetch_assoc()) {
                        $clientes[] = $cliente;
                    }
        
                    echo json_encode($clientes);
                } else {
                    echo json_encode(array("message" => "No se encontraron clientes para la tienda especificada"));
                }
            } else {
                echo json_encode(array("error" => "Falta el parámetro TiendaId"));
            }
            break;
        case "Add":
            $nombre = $_GET['Nombre'] ?? null;
            $domicilio = $_GET['Domicilio'] ?? null;
            $correo = $_GET['Correo'] ?? null;
            $telefono = $_GET['Telefono'] ?? null;
            $fotografia = $_GET['Fotografia'] ?? null;
            $periodocobrar = $_GET['PeriodoCobrar'] ?? null;
            $diacobrar = $_GET['DiaCobrar'] ?? null;
            $horacobrar = $_GET['HoraCobrar'] ?? null;
            $idtienda = $_GET['IdTienda'] ?? null;
            if ($nombre && $domicilio && $correo && $telefono && $fotografia && $periodocobrar && $diacobrar && $horacobrar && $idtienda){
                $sql = "INSERT INTO Clientes (Nombre, Domicilio, Correo, Telefono, Fotografia, PeriodoCobrar, DiaCobrar, HoraCobrar, IdTienda) VALUES ('$nombre', '$domicilio', '$correo', '$telefono', '$fotografia', '$periodocobrar', '$diacobrar', '$horacobrar', '$idtienda')";
                if ($conn->query($sql) === TRUE) {
                    echo json_encode(array("message" => "Cliente agregado correctamente"));
                }
                else {
                    echo json_encode(array("error" => "Faltan parámetros"));
                }
            }
            break;
        case "View":
            $sql = "SELECT * FROM Clientes";
            $result = $conn->query($sql);
            if ($result->num_rows > 0) {
                $clientes = array();
                while ($cliente = $result->fetch_assoc()) {
                    $cliente_id = $cliente['Id'];
                    $tickets = array();
        
                    // Obtener tickets vinculados a este cliente
                    $tickets_query = "SELECT * FROM Ticket WHERE IdCliente = $cliente_id";
                    $tickets_result = $conn->query($tickets_query);
                    if ($tickets_result->num_rows > 0) {
                        while ($ticket = $tickets_result->fetch_assoc()) {
                            $tickets[] = $ticket;
                        }
                    }
        
                    $cliente['Tickets'] = $tickets; // Agregar tickets asociados al cliente
                    $clientes[] = $cliente;
                }
                echo json_encode($clientes);
            } else {
                echo json_encode(array("message" => "No se encontraron clientes"));
            }
            break;
        case "Update":
            $id = $_GET['Id'] ?? null;
            $nombre = $_GET['Nombre'] ?? null;
            $domicilio = $_GET['Domicilio'] ?? null;
            $correo = $_GET['Correo'] ?? null;
            $telefono = $_GET['Telefono'] ?? null;
            $fotografia = $_GET['Fotografia'] ?? null;
            $periodocobrar = $_GET['PeriodoCobrar'] ?? null;
            $diacobrar = $_GET['DiaCobrar'] ?? null;
            $horacobrar = $_GET['HoraCobrar'] ?? null;
            $idtienda = $_GET['IdTienda'] ?? null;

            if ($id && $nombre && $domicilio && $correo && $telefono && $fotografia && $periodocobrar && $diacobrar && $horacobrar && $idtienda) {
                $sql = "UPDATE Clientes SET Nombre='$nombre', Domicilio='$domicilio', Correo='$correo', Telefono='$telefono', Fotografia='$fotografia', PeriodoCobrar='$periodocobrar', DiaCobrar='$diacobrar', HoraCobrar='$horacobrar', idtienda='$idtienda' WHERE Id=$id";

                if ($conn->query($sql) === TRUE) {
                    echo json_encode(array("message" => "Cliente actualizado correctamente"));
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
                $sql = "DELETE FROM Clientes WHERE Id=$id";

                if ($conn->query($sql) === TRUE) {
                    echo json_encode(array("message" => "Cliente Eliminado correctamente"));
                } else {
                    echo json_encode(array("error" => "Error al actualizar usuario: " . $conn->error));
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