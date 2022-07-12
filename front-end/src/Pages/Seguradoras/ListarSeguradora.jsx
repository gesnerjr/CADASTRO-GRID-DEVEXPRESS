import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../Autenticação/validacao";
import {
    DataTypeProvider, EditingState, SortingState,
    IntegratedSorting,
    IntegratedFiltering,
    FilteringState,
} from '@devexpress/dx-react-grid';
import {
    Grid,
    Table,
    TableHeaderRow,
    TableEditRow,
    TableFilterRow,
    TableColumnVisibility,

} from '@devexpress/dx-react-grid-material-ui';
import { deleteSeguradoraID, getSeguradora } from "../../Service/seguradoraService";
import { cnpj } from "cpf-cnpj-validator";
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { getAcessoUserMenu } from "../../Service/usuarioService";



// const TableComponent = ({ ...restProps }) => (
//     <Table.Table
//         {...restProps}
//     />
// );



const getRowId = row => row.id;
const ListarSeguradora = () => {
    const [rows, setRows] = useState([]);
    const navigate = useNavigate();
    const { logout, nomeUser } = useContext(AuthContext);
    const [validCNPJ] = useState(["SGRA_CNPJ"]);
    const [editSeg] = useState(["ALTERACAO"]);
    let token = localStorage.getItem("token");
    const [acessoGeral, setAcessoGeral] = useState(false);
    const [acessoDEL, setAcessoDEL] = useState(false);
    const [defaultHiddenColumnNames] = useState(['nova']);
    const [acessoADD, setAcessoADD] = useState(false);
    const [displayEDIT, setDisplayEDIT] = useState("none");
    const [displayDEL, setDisplayDEL] = useState("none");

    const listaSgra = "LIST_SGRA";
    const incluirSgra = "ADD_SGRA";
    const excluirSgra = "DEL_SGRA";
    const editarSgra = "EDIT_SGRA";


    useEffect(() => {
        const acessoMenuUser = async () => {
            let dados = { token, usuario: nomeUser() };
            await getAcessoUserMenu(dados)
                .then((res) => {
                    (res.data).forEach((ac) => {
                        if (process.env.REACT_APP_API_ACESSO_GERAL === ac) {
                            setDisplayEDIT("");
                            setDisplayDEL("");
                            setAcessoGeral(true);
                            listarSeguradoras();
                        } else if (listaSgra === ac) {
                            listarSeguradoras();
                        } else if (incluirSgra === ac) {
                            setAcessoADD(true);

                        } else if (editarSgra === ac) {
                            setDisplayEDIT("");
                        } else if (excluirSgra === ac) {
                            setDisplayDEL("");
                            setAcessoDEL(true);
                        }

                    })


                })
                .catch((err) => {
                    console.error(err);
                    window.alert("Erro ao Listar Seguradoras !!")
                })

        }


        acessoMenuUser();

        //eslint-disable-next-line  
    }, [logout, token]);

    const listarSeguradoras = async () => {
        let dados = { token };
        await getSeguradora(dados)
            .then((res) => {
                if (res.data === "erroLogin") {
                    alert("Sessão expirada, Favor efetuar um novo login !!");
                    logout();
                    window.location.reload();
                }
                else if (res.data === "semAcesso") {
                    alert("Usuário sem permissão !!!");
                    navigate("/home");

                } else if (res.data === "campoNulo") {
                    alert("Preencha todos os Campos obrigatorios!!!");
                }
                else if (res.data === "erroSalvar") {
                    alert("Erro a tentar salvar ou alterar!!!");
                }
                else {
                    (res.data).forEach((item, index) => (item.id = index));
                    return setRows(res.data);
                }
            })
            .catch((res) => {
                return console.error(res);
            })
    };

    const deletarSeguradora = (idSeg) => {
        if (acessoGeral || acessoDEL) {
            let dados = { idSeg, token, acessoGeral, acessoDEL };
            if (window.confirm("deseja excluir o item ?")) {
                deleteSeguradoraID(dados)
                    .then((res) => {
                        if (res.data === "erroLogin") {
                            window.alert("Sessão expirada, Favor efetuar um novo login !!");
                            logout();
                            window.location.reload();
                        }
                        else if (res.data === "semAcesso") {
                            window.alert("Usuário sem permissão !!!");

                        } else if (res.data === "campoNulo") {
                            window.alert("Preencha todos os Campos obrigatorios!!!");
                        }
                        else if (res.data === "erroSalvar") {
                            window.alert("Erro a tentar salvar ou alterar!!!");
                        }
                        else if (res.data === "sucesso") {
                            window.alert("Seguradora Excluída com Sucesso!!!");
                            listarSeguradoras();
                        }

                    })
                    .catch((res) => {
                        console.error(res);
                        window.alert("Erro ao tentar excluir seguradora");
                    })
            }
        } else {
            window.alert("Usuário sem permissão !!!");
        }

    };



    //GRID



    const BotaoAd = < AddCircleOutlinedIcon className="margemRight" titleAccess="Cadastrar novo" fontSize="large" style={{ color: "blue" }} type="button" onClick={() => navigate("/cadastroSeguradora/0")} />

    const columns =
        (acessoGeral || acessoADD ?

            [{ name: 'SGRA_CNPJ', title: `CNPJ` },
            { name: 'SGRA_RAZAO_SOCIAL', title: "RAZÃO SOCIAL" },
            { name: 'SGRA_CIDADE', title: "CIDADE" },
            {
                name: "ALTERACAO", title: BotaoAd,
                getCellValue: row => (row.ID_SEGURADORA)
            }]
            :
            [{ name: 'SGRA_CNPJ', title: `CNPJ` },
            { name: 'SGRA_RAZAO_SOCIAL', title: "RAZÃO SOCIAL" },
            { name: 'SGRA_CIDADE', title: "CIDADE" },
            {
                name: "ALTERACAO", title: "Cadastro",
                getCellValue: row => (row.ID_SEGURADORA)
            }]

        )


    const [editingStateColumns] = useState([
        { columnName: "ALTERACAO", editingEnabled: false, title: "olamn" },
        // {columnName : "PRDT_VALOR_LIQUIDO",editingEnabled: false},
        // {columnName : "PRDT_VALOR",align: 'center'},

    ])


    const EditSeguradorasAdm = ({ value }) => (
        <div>
            <ModeEditOutlineOutlinedIcon titleAccess="Alterar" style={{ color: "orange", display: displayEDIT }} className="margemRight" onClick={(e) => navigate(`/cadastroSeguradora/${value}`)} type="button" />
            <DeleteForeverOutlinedIcon titleAccess={"Excluir"} type="button" fontSize="medium" style={{ color: "red", display: displayDEL }} className="margemRight" onClick={(e) => deletarSeguradora(value)} />

            <VisibilityIcon style={{ color: "green", display: (displayEDIT === "none" ? "" : "none") }} titleAccess="Visualizar" className="margemRight" onClick={(e) => navigate(`/cadastroSeguradora/${value}`)} type="button" />

        </div>

    )




    const EditSeguradorasProv = props => (
        <DataTypeProvider
            formatterComponent={EditSeguradorasAdm}
            {...props}
        />
    )




    return (
        <div className="container-fluid">

            <h3 id='titulos'>Seguradoras 🚗 ​​</h3>

            <div className="card">
                <Grid
                    rows={rows}
                    columns={columns}
                    getRowId={getRowId}
                >
                    <FilteringState defaultFilters={[]} />
                    <IntegratedFiltering />

                    <SortingState
                        columnExtensions={editingStateColumns}
                    />
                    <IntegratedSorting
                    />
                    <EditingState
                        columnExtensions={editingStateColumns}
                    />
                    <EditSeguradorasProv
                        for={editSeg}
                    />
                    <ValidCnpjProv
                        for={validCNPJ}
                    />

                    <Table
                    //  tableComponent={TableComponent}
                    />
                    {!acessoGeral ? <TableColumnVisibility
                        defaultHiddenColumnNames={defaultHiddenColumnNames}

                    /> : ""
                    }

                    <TableHeaderRow
                        contentComponent={TableComponentTitle}
                        showSortingControls />
                    <TableEditRow />
                    <TableFilterRow />


                </Grid>
            </div>


        </div>

    )

}
const TableComponentTitle = ({ style, ...restProps }) => (
    <TableHeaderRow.Content
        {...restProps}
        style={{
            color: 'black',
            fontWeight: "bold",
            ...style,
        }}
    />
);
const ValidCnpj = ({ value }) => (
    cnpj.format(value)
)
const ValidCnpjProv = (props) => (
    <DataTypeProvider
        formatterComponent={ValidCnpj}
        {...props}

    />
)


export default ListarSeguradora;