<?php
header('Content-Type: application/json');

//Vars pra guardar
$num = $_POST['userID'];
$corIcone = $_POST['corIcone'];
$corFundo = $_POST['corFundo'];
$wall = $_POST['wall'];
$tipo = $_POST['tipo'];

//Pega o conteudo atual do json
$json = file_get_contents('info.json');

//Converte o json em vetor
$data = json_decode($json, true);

//Modifica a var data com as novas informações
$data[$num]["coricone"] = $corIcone;
$data[$num]["corfundo"] = $corFundo;
$data[$num]["wall"] = $wall;
$data[$num]["tipo"] = $tipo;

//Converte data em um novo json
$result = json_encode($data);

//Tenta escrever o novo json
if(!(file_put_contents('info.json', $result))){
    echo json_encode(array(success=>"false"));
}else{
    echo json_encode(array(success=>"true"));
}
?>