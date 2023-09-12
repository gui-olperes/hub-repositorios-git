// Função para criar um novo repositório
function criarRepositorio() {
    var nomeRepositorio = prompt("Digite o nome do novo repositório:");
    if (nomeRepositorio) {
        eel.criar_repositorio(nomeRepositorio)(function(response) {
            alert(response);
            atualizarListaRepositorios();
        });
    }
}


// Função para fazer upload de um arquivo
function fazerUploadArquivo(nomeRepositorio) {
    var input = document.createElement("input");
    input.type = "file";
    input.onchange = function() {
        var file = input.files[0];
        if (file) {
            var commitMessage = prompt("Digite a mensagem do commit:");
            if (commitMessage === null) {
                return; // Cancelou o input da mensagem
            }

            var reader = new FileReader();
            reader.onload = function(event) {
                var fileData = event.target.result;

                eel.fazer_upload_arquivo(nomeRepositorio, file.name, commitMessage, Array.from(new Uint8Array(fileData)))(function(response) {
                    alert(response);
                    listarArquivos(nomeRepositorio);
                });
            };
            reader.readAsArrayBuffer(file);
        }
    };
    input.click();
}

// Função para excluir um repositório
function excluirRepositorio(nomeRepositorio) {
    if (confirm("Tem certeza que deseja excluir o repositório '" + nomeRepositorio + "'?")) {
        eel.excluir_repositorio(nomeRepositorio)(function(response) {
            alert(response);
            atualizarListaRepositorios();
        });
    }
}


// Inicializar a lista de repositórios ao carregar a página
window.onload = function() {
    atualizarListaRepositorios();
};

function criarCardRepositorio(nomeRepositorio) {
    return `<div class="col-md-6 mb-3">
                <div class="card" style="background-color: #2b3137;">
                    <div class="card-body">
                        <h5 class="card-title"><i class="fas fa-folder"></i> ${nomeRepositorio}</h5>
                        <button class="btn btn-primary" onclick="fazerUploadArquivo('${nomeRepositorio}')"><i class="fas fa-file-upload"></i> Adicionar Arquivo</button>
                        <button class="btn btn-danger" onclick="excluirRepositorio('${nomeRepositorio}')"><i class="fas fa-trash"></i> Excluir</button>
                        <button type="button" class="btn btn-info" data-toggle="modal" data-target="#arquivosModal" onclick="listarArquivos('${nomeRepositorio}')"><i class="fas fa-eye"></i> Visualizar Itens</button>
                    </div>
                </div>
            </div>`;
}


// Função para atualizar a lista de repositórios
function atualizarListaRepositorios() {
    eel.listar_repositorios()(function(repos) {
        var listaRepositorios = document.getElementById("listaRepositorios");
        listaRepositorios.innerHTML = ""; // Limpar o conteúdo antes de adicionar os novos cards

        for (var i = 0; i < repos.length; i++) {
            var cardHTML = criarCardRepositorio(repos[i]);
            listaRepositorios.innerHTML += cardHTML;
        }
    });
}

// Função para listar os arquivos de um repositório
function listarArquivos(nomeRepositorio) {
    eel.listar_arquivos(nomeRepositorio)(function(arquivos) {
        var modalListaArquivos = $("#modalListaArquivos");
        modalListaArquivos.empty();

        for (var i = 0; i < arquivos.length; i++) {
            var arquivoDiv = $("<div class='d-flex justify-content-between'></div><br>");
            arquivoDiv.html("<span>" + arquivos[i] + "</span><button class='btn btn-danger btn-sm' onclick=\"excluirArquivo('" + nomeRepositorio + "', '" + arquivos[i] + "')\"><i class='fas fa-trash'></i></button>");
            modalListaArquivos.append(arquivoDiv);
        }

        // Exibir o modal
        $("#arquivosModal").modal("show");
    });
}



// Função para excluir um arquivo de um repositório
async function excluirArquivo(nomeRepositorio, nomeArquivo) {
    if (confirm("Tem certeza que deseja excluir o arquivo '" + nomeArquivo + "'?")) {
        try {
            var response = await eel.excluir_arquivo(nomeRepositorio, nomeArquivo)();
            alert(response);
            listarArquivos(nomeRepositorio);
        } catch (error) {
            console.error("Erro ao excluir arquivo:", error);
        }
    }
}

// Inicializar a lista de repositórios ao carregar a página
window.onload = function() {
    atualizarListaRepositorios();
};