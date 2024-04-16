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
        case "View":
            $sql = "SELECT * FROM DetalleTicket";
            $result = $conn->query($sql);
        
            if ($result->num_rows > 0) {
                $allTickets = array();
                $zeroCostTickets = array(); // Arreglo para los tickets con PrecioCosto igual a 0
        
                while ($row = $result->fetch_assoc()) {
                    // Agregar condición para verificar si el PrecioCosto es 0
                    if ($row['PrecioCosto'] == 0) {
                        // Obtener el valor correspondiente desde la tabla Productos
                        $productId = $row['IdProducto'];
                        $productSql = "SELECT PrecioCosto FROM Productos WHERE Id = $productId";
                        $productResult = $conn->query($productSql);
        
                        if ($productResult->num_rows > 0) {
                            $productRow = $productResult->fetch_assoc();
                            $newPrecioCosto = $productRow['PrecioCosto'];
        
                            // Actualizar el campo PrecioCosto en la tabla DetalleTicket
                            $updateSql = "UPDATE DetalleTicket SET PrecioCosto = $newPrecioCosto WHERE IdProducto = $productId";
                            $conn->query($updateSql);
        
                            // Agregar el ticket actualizado al arreglo de tickets con PrecioCosto igual a 0
                            $row['PrecioCosto'] = $newPrecioCosto;
                            $zeroCostTickets[] = $row;
                        }
                    }
        
                    // Agregar todos los tickets al arreglo general
                    $allTickets[] = $row;
                }
        
                // Mostrar todos los tickets al final, incluyendo los actualizados
                echo json_encode(array(
                    "allTickets" => $allTickets,
                    "zeroCostTickets" => $zeroCostTickets
                ));
            } else {
                echo json_encode(array("message" => "No se encontraron tickets"));
            }
            break;
        case "Add":
            $idProducto = $_GET['IdProducto'] ?? null;
            $idTicket = $_GET['IdTicket'] ?? null;
            $cantidad = $_GET['Cantidad'] ?? null;
            
            if ($idProducto && $idTicket && $cantidad) {
                $sql_product = "SELECT Nombre, PrecioVenta, Cantidad FROM Productos WHERE Id = $idProducto";
                $result_product = $conn->query($sql_product);
        
                if ($result_product && $result_product->num_rows > 0) {
                    $producto = $result_product->fetch_assoc();
                    $nombre = $producto['Nombre'];
                    $precioProducto = $producto['PrecioVenta'];
                    $cantidadDisponible = $producto['Cantidad'];
        
                    if ($cantidadDisponible == 0 || $cantidad > $cantidadDisponible) {
                        echo json_encode(array("error" => "No se puede agregar el registro. Cantidad no disponible o excede el stock."));
                    } else {
                        // Calcular Precio Total
                        $precioTotal = $cantidad * $precioProducto;
        
                        // Insertar en DetalleTicket
                        $sql_insert = "INSERT INTO DetalleTicket (IdProducto, IdTicket, Nombre, Cantidad, Precio, PrecioCosto) 
                                       VALUES ($idProducto, $idTicket, '$nombre', $cantidad, $precioTotal,0)";
                        if ($conn->query($sql_insert) === TRUE) {
                            // Actualizar la cantidad del producto en la tabla Productos
                            $nuevaCantidad = $cantidadDisponible - $cantidad;
                            $sql_update = "UPDATE Productos SET Cantidad = $nuevaCantidad WHERE Id = $idProducto";
                            $conn->query($sql_update);
        
                            echo json_encode(array("message" => "Nuevo registro de DetalleTicket agregado correctamente"));
                        } else {
                            echo json_encode(array("error" => "Error al agregar nuevo registro en DetalleTicket: " . $conn->error));
                        }
                    }
                } else {
                    echo json_encode(array("error" => "No se encontró el producto"));
                }
            } else {
                echo json_encode(array("error" => "Faltan parámetros"));
            }
            break;
        case "Update":
            $idProducto = $_GET['IdProducto'] ?? null;
            $idTicket = $_GET['IdTicket'] ?? null;
            $cantidad = $_GET['Cantidad'] ?? null;
        
            if ($idProducto && $idTicket && $cantidad) {
                $sql_product = "SELECT Nombre, PrecioVenta, Cantidad FROM Productos WHERE Id = $idProducto";
                $result_product = $conn->query($sql_product);
        
                if ($result_product && $result_product->num_rows > 0) {
                    $producto = $result_product->fetch_assoc();
                    $nombre = $producto['Nombre'];
                    $precioProducto = $producto['PrecioVenta'];
                    $cantidadDisponible = $producto['Cantidad'];
        
                    if ($cantidadDisponible == 0 || $cantidad > $cantidadDisponible) {
                        echo json_encode(array("error" => "No se puede actualizar el registro. Cantidad no disponible o excede el stock."));
                    } else {
                        // Calcular Precio Total
                        $precioTotal = $cantidad * $precioProducto;
        
                        // Actualizar en DetalleTicket
                        $sql_update = "UPDATE DetalleTicket 
                                       SET Nombre = '$nombre', Cantidad = $cantidad, Precio = $precioTotal 
                                       WHERE IdProducto = $idProducto AND IdTicket = $idTicket";
                        
                        if ($conn->query($sql_update) === TRUE) {
                            // Actualizar la cantidad del producto en la tabla Productos
                            $nuevaCantidad = $cantidadDisponible - $cantidad;
                            $sql_update_product = "UPDATE Productos SET Cantidad = $nuevaCantidad WHERE Id = $idProducto";
                            $conn->query($sql_update_product);
        
                            echo json_encode(array("message" => "Registro de DetalleTicket actualizado correctamente"));
                        } else {
                            echo json_encode(array("error" => "Error al actualizar el registro en DetalleTicket: " . $conn->error));
                        }
                    }
                } else {
                    echo json_encode(array("error" => "No se encontró el producto"));
                }
            } else {
                echo json_encode(array("error" => "Faltan parámetros"));
            }
            break;
        case "Delete":
            $id = $_GET['Id'] ?? null;

            if ($id) {
                $sql = "DELETE FROM DetalleTicket WHERE Id=$id";

                if ($conn->query($sql) === TRUE) {
                    echo json_encode(array("message" => "Informacaion Eliminada correctamente"));
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
    }
    
    // Sección independiente para eliminar registros en DetalleTicket con IdTicket que no existen en Ticket
    $sql_delete_invalid = "DELETE FROM DetalleTicket WHERE IdTicket NOT IN (SELECT Id FROM Ticket)";
    $conn->query($sql_delete_invalid);

    // Mensaje para mostrar cuántos registros han sido eliminados
    if ($conn->affected_rows > 0) {
        echo json_encode(array("message" => $conn->affected_rows . " registros de DetalleTicket eliminados."));
    } else {
    }
    
    $conn->close();
}
?>