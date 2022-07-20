import { Box, Button, TextField } from "@mui/material";
import { useContext, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../Autenticação/validacao";
import { deleteMarcaVeiculo, saveMarcaVeiculo } from "../../Service/marcaVeiculoService";


const CadastroMarcaVeiculo = () => {
    const { idMa } = useParams();
    const token = localStorage.getItem("token");
    const { logout, nomeUser } = useContext(AuthContext);
    const [acessoGeral, setAcessogeral] = useState(true);
    const [codigoMarca, setCodigoMarca] = useState(idMa);
    const [descricao, setDescricao] = useState('');
    const [posLogChat, setPosLogChat] = useState('');
    const [logo, setLogo] = useState();
    const [logoApont, setLogoApont] = useState();
    const [imagemChat, setImagemChat] = useState();
    const [imagemChatColor, setImagemChatColor] = useState();
    const navigate = useNavigate();
    const cadastrarMarcaVeiculo = () => {
        const dados = { descricao, posLogChat, logo, logoApont, imagemChat, imagemChatColor, idMa, acessoGeral, token }
        saveMarcaVeiculo(dados)
            .then((res) => {
                if (res.data === "erroLogin") {
                    alert("Sessão expirada, Favor efetuar um novo login !!");
                    logout();
                    window.location.reload();
                }
                else if (res.data === "semAcesso") {
                    alert("Usuário sem permissão !!!");

                } else if (res.data === "campoNulo") {
                    alert("Preencha todos os Campos obrigatorios!!!");
                }
                else if (res.data === "erroSalvar") {
                    alert("Erro a tentar salvar ou alterar!!!");
                }
                else if (res.data === "sucesso") {
                    alert("Marca veiculo cadastrada com sucesso.");
                }
                else if (res.data === "sucessoU") {
                    alert("Marca veiculo alterada com sucesso.");
                }
                else {
                    alert("Erro ao tentar cadastrar marca veiculo!!!")
                }





            }).catch((erro) => {
                window.alert("Erro ao tentar cadastrar");
                console.error(erro, "erro ao tentar cadastrar");
            })

    }
    
    return (
        <div className="container-fluid centralizar" >
            <h3 id="titulos">Cadastro Marca Veiculo</h3>
            <Box
                component="form"
                enctype="multipart/form-data"
              
                sx={{
                    '& .MuiTextField-root': { m: 1, width: '25ch' },
                }}
                noValidate
                autoComplete="off"
            >
                
                <TextField required label="Código Marca" disabled={true} id="" value={codigoMarca} type={"number"} /><br />
                <TextField required label="Descrição" error={descricao ? false : true} disabled={!acessoGeral} id="" value={descricao} onChange={(e) => setDescricao(e.target.value)} type={"text"} /><br />
                <TextField required label="Posição Logo Chat" error={posLogChat ? false : true} disabled={!acessoGeral} id="" value={posLogChat} onChange={(e) => setPosLogChat(e.target.value)} type={"number"} /><br />
                
                <TextField required  label="Imagem Logo" error={logo ? false : true} disabled={!acessoGeral} name="logo"  onChange={(e) => setLogo(e.target.files[0])} type={"file"} InputLabelProps={{
                    shrink: true,
                }} style={{ minWidth: '25em' }} /><br />
                <TextField required label="Imagem Logo Apontador" error={logoApont ? false : true} disabled={!acessoGeral} id="" value={logoApont} onChange={(e) => setLogoApont(e.target.value)} type={"file"} InputLabelProps={{
                    shrink: true,
                }} style={{ minWidth: '25em' }} /><br />
                <TextField required label="Imagem Chat" multiple error={imagemChat ? false : true} disabled={!acessoGeral} id="" onChange={(e) => setImagemChat(e.target.files)} type={"file"} InputLabelProps={{
                    shrink: true,
                }} style={{ minWidth: '25em' }} /><br />
                <TextField required label="Imagem Chat Colorido" error={imagemChatColor ? false : true} disabled={!acessoGeral} id="" value={imagemChatColor} onChange={(e) => setImagemChatColor(e.target.value)} type={"file"} InputLabelProps={{
                    shrink: true,
                }} style={{ minWidth: '25em' }} />

                <br />
                

            </Box>
            <button onClick={() => cadastrarMarcaVeiculo()} style={{ marginBottom: "1em", marginLeft: "0.5em" }} className="btn btn-outline-primary">SALVAR</button>
                <button style={{ marginBottom: "1em", marginLeft: "1em" }} onClick={(e) => navigate("/marcaVeiculo")} className="btn btn-outline-danger">VOLTAR</button>

        </div>
    )

}

export default CadastroMarcaVeiculo;
