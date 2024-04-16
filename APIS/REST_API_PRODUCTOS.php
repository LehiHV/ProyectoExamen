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
        case "ProductId":
            $tiendaId = $_GET['IdTienda'] ?? null;
        
            if ($tiendaId) {
                $sql = "SELECT * FROM Productos WHERE IdTienda = $tiendaId";
                $result = $conn->query($sql);
        
                if ($result->num_rows > 0) {
                    $clientes = array();
        
                    while ($cliente = $result->fetch_assoc()) {
                        $clientes[] = $cliente;
                    }
        
                    echo json_encode($clientes);
                } else {
                    echo json_encode(array("message" => "No se encontraron Productos para la tienda especificada"));
                }
            } else {
                echo json_encode(array("error" => "Falta el parámetro TiendaId"));
            }
            break;
        case "Add":
            $nombre = $_GET['Nombre'] ?? null;
            $descripcion = $_GET['Descripcion'] ?? null;
            $cantidad = $_GET['Cantidad'] ?? null;
            $preciocosto = $_GET['PrecioCosto'] ?? null;
            $precioventa = $_GET['PrecioVenta'] ?? null;
            $fotografia = $_GET['Fotografia'] ?? null;
            $idtienda = $_GET['IdTienda'] ?? null;
            
            if ($nombre && $descripcion && $cantidad && $preciocosto && $precioventa && $fotografia &&$idtienda){
                $sql = "INSERT INTO Productos (Nombre, Descripcion, Cantidad, PrecioCosto, PrecioVenta, Fotografia, IdTienda) VALUES ('$nombre', '$descripcion', '$cantidad', '$preciocosto', '$precioventa', '$fotografia','$idtienda')";
                if ($conn->query($sql) === TRUE) {
                    echo json_encode(array("message" => "Producto agregado correctamente"));
                }
                else {
                    echo json_encode(array("error" => "Faltan parámetros"));
                }
            }
            break;
        case "View":
            $sql = "SELECT * FROM Productos"; // Consulta solo los productos
            $result = $conn->query($sql);
            if ($result->num_rows > 0) {
                $productos = array();
                while ($row = $result->fetch_assoc()) {
                    $productos[] = $row; // Agregar cada producto a la lista de productos
                }
                echo json_encode($productos);
            } else {
                echo json_encode(array("message" => "No se encontraron productos"));
            }
            break;
        case "Update":
            $id = $_GET['Id'] ?? null;
            $nombre = $_GET['Nombre'] ?? null;
            $descripcion = $_GET['Descripcion'] ?? null;
            $cantidad = $_GET['Cantidad'] ?? null;
            $preciocosto = $_GET['PrecioCosto'] ?? null;
            $precioventa = $_GET['PrecioVenta'] ?? null;
            $fotografia = $_GET['Fotografia'] ?? null;

            if ($nombre && $descripcion && $cantidad && $preciocosto && $precioventa && $fotografia) {
                $sql = "UPDATE Productos SET Nombre='$nombre', Descripcion='$descripcion', Cantidad='$cantidad', PrecioCosto='$preciocosto', PrecioVenta='$precioventa', Fotografia='$fotografia' WHERE Id=$id";

                if ($conn->query($sql) === TRUE) {
                    echo json_encode(array("message" => "Producto actualizado correctamente"));
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
                $sql = "DELETE FROM Productos WHERE Id=$id";

                if ($conn->query($sql) === TRUE) {
                    echo json_encode(array("message" => "Producto Eliminado correctamente"));
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